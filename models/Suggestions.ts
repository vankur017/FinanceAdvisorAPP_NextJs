import mongoose, { Schema, Document } from "mongoose";

export interface ISuggestion extends Document {
  text: string;
  category: string;
  popularity: number; // Useful for sorting top suggestions later
}

const SuggestionSchema = new Schema<ISuggestion>({
  text: { type: String, required: true, unique: true }, // unique prevents duplicates
  category: { type: String, default: "General" },
  popularity: { type: Number, default: 0 }
});

// Index for fast text search
SuggestionSchema.index({ text: 'text' }); 

export const Suggestion = mongoose.model<ISuggestion>("Suggestion", SuggestionSchema);