import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import contentRoutes from "./routes/contentRoutes";
import brainRoutes from "./routes/brainRoutes";
import queryRoutes from "./routes/queryRoutes";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure CORS
const allowedOrigins = ["https://BrainVault-five.vercel.app", "http://localhost:5000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "AI Memory Backend is running!", status: "healthy" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/query", queryRoutes);
app.use("/api/v1/brain", brainRoutes);

app.use("/api", (req, res, next) => {
  if (req.path === "/" || req.path === "") {
    return next();
  }
  res.status(404).json({ error: "API endpoint not found" });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  });
});

// Initialize database connection and start server
const startServer = async () => {
  try {
    await connectDatabase();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
