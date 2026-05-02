import { Router } from "express";
import { toggleShare, getShareStatus, getSharedBrain } from "../controllers/brainController";
import { userMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Share management routes (protected)
router.post("/share", userMiddleware, toggleShare);
router.get("/share", userMiddleware, getShareStatus);

// Public shared brain route (no auth required)
router.get("/:hash", getSharedBrain);

export default router;
