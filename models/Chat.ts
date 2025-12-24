import mongoose, { Schema, Document } from "mongoose";


const MessageSchema = new Schema({
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false }); 


export interface IChat extends Document {
  userId: string; // If you add login later (or use a session ID)
  title: string;  // e.g., "Investment Advice 2025"
  messages: Array<{ role: string, content: string, timestamp: Date }>;
  createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true, index: true }, // Index for fast lookup
  title: { type: String, default: "New Chat" },
  messages: [MessageSchema], // Embed the array of messages here
  createdAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);