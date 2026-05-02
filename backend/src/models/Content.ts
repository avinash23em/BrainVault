import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const contentTypes = ["image", "video", "audio", "article"];

const contentSchema = new Schema({
  // type: { type: String, enum: contentTypes, required: true },
  type: { type: String },
  title: { type: String, required: true },
  link: { type: String },
  description: { type: String, default: "" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // validate: async function (value: any) {
    //   const user = await User.findById(value);
    //   if (!user) {
    //     throw new Error("User not found");
    //   }
    // },
  },
});

export const Content = model("Content", contentSchema);
