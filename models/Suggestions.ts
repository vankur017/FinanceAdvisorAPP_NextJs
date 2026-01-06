import mongoose, { Schema, Document } from "mongoose";

export interface ISuggestion extends Document {
  text: string;
  category: string;
  popularity: number;
}

const SuggestionSchema = new Schema<ISuggestion>(
  {
    text: { type: String, required: true, unique: true },
    category: { type: String, default: "General" },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
SuggestionSchema.index({ text: "text" });

// ✅ FIX: Reuse model if already compiled
export const Suggestion =
  mongoose.models.Suggestion ||
  mongoose.model<ISuggestion>("Suggestion", SuggestionSchema);
