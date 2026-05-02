import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const linkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
});

export const Link = model("Link", linkSchema);
