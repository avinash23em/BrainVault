import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(30, "Password must be at most 30 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
});

export const signinSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const contentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  link: z.string().url("Link must be a valid URL").optional().or(z.literal("")),
  type: z.enum(["youtube", "twitter", "pinterest", "linkedin", "document", "link", "instagram"]),
  description: z.string().max(1000, "Description must be at most 1000 characters").optional(),
});

export const shareSchema = z.object({
  share: z.boolean(),
});

export const querySchema = z.object({
  query: z.string().min(1, "Query is required").max(500, "Query must be at most 500 characters"),
});

export const editContentSchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  link: z.string().url("Invalid URL format").optional().or(z.literal("")),
  type: z.enum(["youtube", "twitter", "pinterest", "linkedin", "document", "link", "instagram"]),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});
