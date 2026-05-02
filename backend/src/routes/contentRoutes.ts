import { Router } from "express";
import { createContent, getContent, deleteContent, editContent } from "../controllers/contentController";
import { userMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Content routes
router.post("/", userMiddleware, createContent);
router.get("/", userMiddleware, getContent);
router.put("/", userMiddleware, editContent);
router.delete("/", userMiddleware, deleteContent);

export default router;
