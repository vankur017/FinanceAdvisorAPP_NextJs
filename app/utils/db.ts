import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // 👈 REQUIRED for Bun

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");
};
