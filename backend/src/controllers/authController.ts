import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signupSchema, signinSchema } from "../utils/validationSchemas";

const SALT_ROUNDS = 12;

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod
    const validatedData = signupSchema.parse(req.body);
    const { username, password } = validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user with hashed password
    await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      username: username,
    });
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

    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod
    const validatedData = signinSchema.parse(req.body);
    const { username, password } = validatedData;

    // Find user by username
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      token,
      message: "Signin successful",
      username: existingUser.username,
    });
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

    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add new function to get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId).select("username");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      username: user.username,
      userId: user._id,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
