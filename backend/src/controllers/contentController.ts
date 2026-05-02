import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { Content } from "../models/Content";
import { User } from "../models/User";
import { contentSchema, editContentSchema } from "../utils/validationSchemas";
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "";
const PINECONE_HOST = process.env.PINECONE_HOST || "";

export const createContent = async (req: Request, res: Response) => {
  try {
    const validatedData = contentSchema.parse(req.body);
    const { link, title, type, description } = validatedData;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const createdContent = await Content.create({
      link: link || "",
      type: type || "document",
      title,
      description: description || "",
      userId: req.userId,
      tags: [],
    }) as any;

    // Send to Pinecone for ANY type that has a description
    if (description && description.trim() !== "") {
      try {
        const namespace = pc.index(PINECONE_INDEX_NAME, PINECONE_HOST).namespace(user.username);
        await namespace.upsertRecords([{
          _id: createdContent._id.toString(),
          text: `${title}. ${description}`,
          category: type,
        }]);
        console.log(`✅ Content upserted to Pinecone: ${user.username}`);
      } catch (pineconeError) {
        console.error("❌ Pinecone upsert failed:", pineconeError);
      }
    }

    res.status(201).json({
      message: "Content created successfully",
      contentId: createdContent._id,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      const firstError = error.errors[0];
      res.status(400).json({
        error: "Validation failed",
        message: firstError.message,
        field: firstError.path[0],
      });
      return;
    }
    console.error("Content creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContent = async (req: Request, res: Response) => {
  const userId = req.userId;
  const contentType = req.query.type as string;

  const filter: any = { userId: userId };
  if (contentType && contentType !== "home") {
    filter.type = contentType;
  }

  const content = await Content.find(filter).populate("userId", "username");
  res.json(content);
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const contentId = req.body.contentId;

    if (!contentId) {
      res.status(400).json({ error: "Content ID is required" });
      return;
    }

    const existingContent = await Content.findOne({
      _id: contentId,
      userId: req.userId,
    });

    if (!existingContent) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const deletedContent = await Content.deleteOne({
      _id: contentId,
      userId: req.userId,
    });

    if (deletedContent.deletedCount === 0) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }

    // Delete from Pinecone for ANY type (if it had a description it was indexed)
    if (existingContent.description && existingContent.description.trim() !== "") {
      try {
        const namespace = pc.index(PINECONE_INDEX_NAME, PINECONE_HOST).namespace(user.username);
        await namespace.deleteMany([contentId]);
        console.log(`✅ Deleted from Pinecone: ${contentId}`);
      } catch (pineconeError) {
        console.error("❌ Pinecone delete failed:", pineconeError);
      }
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error: any) {
    console.error("Delete content error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete content. Please try again.",
    });
  }
};

export const editContent = async (req: Request, res: Response) => {
  try {
    const validatedData = editContentSchema.parse(req.body);
    const { contentId, title, link, type, description } = validatedData;

    const existingContent = await Content.findOne({
      _id: contentId,
      userId: req.userId,
    });

    if (!existingContent) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      {
        title,
        link: link || "",
        type,
        description: description || "",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedContent) {
      res.status(500).json({ error: "Failed to update content" });
      return;
    }

    // Update in Pinecone for ANY type that has a description
    if (description && description.trim() !== "") {
      try {
        const namespace = pc.index(PINECONE_INDEX_NAME, PINECONE_HOST).namespace(user.username);
        await namespace.upsertRecords([{
          _id: contentId,          // ← fixed: was wrongly using createdContent._id
          text: `${title}. ${description}`,
          category: type,
        }]);
        console.log(`✅ Updated in Pinecone: ${contentId}`);
      } catch (pineconeError) {
        console.error("❌ Pinecone update failed:", pineconeError);
      }
    }

    res.status(200).json({ message: "Content updated successfully" });
  } catch (error: any) {
    if (error.name === "ZodError") {
      const firstError = error.errors[0];
      res.status(400).json({
        error: "Validation failed",
        message: firstError.message,
        field: firstError.path[0],
      });
      return;
    }
    console.error("Edit content error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};