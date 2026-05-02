import { Router } from "express";
import { signup, signin, getUserProfile } from "../controllers/authController";
import { userMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Auth routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user/profile", userMiddleware, getUserProfile);

export default router;
