import { Request, Response } from "express";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../models/User";
import { querySchema } from "../utils/validationSchemas";

// Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fix: Using URL components as strings, let's extract them to prevent confusion
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "";
const PINECONE_HOST = process.env.PINECONE_HOST || "";

export const handleQuery = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod
    const validatedData = querySchema.parse(req.body);
    const { query } = validatedData;

    // Get user to extract username for namespace
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Search in Pinecone - Using extracted variables instead of inline
    const namespace = pc.index(PINECONE_INDEX_NAME, PINECONE_HOST).namespace(user.username);

    let searchResults;
    try {
      // First, get the total number of documents in the user's namespace
      const statsResponse = await namespace.describeIndexStats();
      const totalDocuments = statsResponse.namespaces?.[user.username]?.recordCount || 0;

      // Dynamic topK calculation based on industry standards
      const calculateTopK = (totalDocs: number): number => {
        if (totalDocs === 0) return 1;
        if (totalDocs <= 10) return Math.min(3, totalDocs); // For very small collections
        if (totalDocs <= 50) return Math.min(5, Math.ceil(totalDocs * 0.3)); // 30% for small collections
        if (totalDocs <= 200) return Math.min(10, Math.ceil(totalDocs * 0.1)); // 10% for medium collections
        if (totalDocs <= 1000) return Math.min(15, Math.ceil(totalDocs * 0.05)); // 5% for large collections
        return Math.min(20, Math.ceil(totalDocs * 0.02)); // 2% for very large collections, max 20
      };

      const dynamicTopK = calculateTopK(totalDocuments);

      const searchResponse = await namespace.searchRecords({
        query: {
          topK: dynamicTopK,
          inputs: { text: query },
        },
        fields: ["text", "category"],
      });

      searchResults = searchResponse.result.hits;

      // If no results found in Pinecone
      if (!searchResults || searchResults.length === 0) {
        res.status(404).json({
          error: "No relevant content found",
          message: "No matching documents found for your query. Please try a different search term.",
        });
        return;
      }
    } catch (pineconeError) {
      console.error("❌ Pinecone search operation failed:", pineconeError);
      res.status(500).json({
        error: "Search failed",
        message: "Unable to search your content at the moment. Please try again later.",
      });
      return;
    }

    // Create context from search results
    const context = searchResults.map((hit) => (hit.fields as any).text).join("\n\n");

    // Generate response using Gemini AI
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are an intelligent assistant helping users understand and extract insights from their personal digital memory collection. Your role is to provide helpful, accurate, and contextual responses based on their saved content.

INSTRUCTIONS:
- Analyze the provided context from the user's saved documents
- Answer the query using primarily the context provided, supplemented with your knowledge when helpful
- Provide comprehensive yet concise responses (100-150 words)
- Use a conversational, helpful tone
- Format responses in clear, readable paragraphs without headings or bullet points
- Avoid markdown formatting, asterisks, or bold text
- If context is limited or missing, acknowledge this and provide general knowledge while being transparent about the source

CONTEXT FROM USER'S MEMORY:
${context}

USER QUERY: ${query}

Please provide a thoughtful response that helps the user understand the topic based on their saved content and relevant knowledge.`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      res.status(200).json({
        message: "Query processed successfully",
        response: aiResponse,
        query: query,
        sourceCount: searchResults.length,
      });
    } catch (geminiError) {
      console.error("❌ Gemini AI operation failed:", geminiError);
      res.status(500).json({
        error: "AI processing failed",
        message: "Unable to process your query with AI at the moment. Please try again later.",
      });
      return;
    }
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      const firstError = error.errors[0];
      res.status(400).json({
        error: "Validation failed",
        message: firstError.message,
        field: firstError.path[0],
      });
      return;
    }

    console.error("Query handling error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
