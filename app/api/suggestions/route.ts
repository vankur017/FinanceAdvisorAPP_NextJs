import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/db';
import { Suggestion } from '@/models/Suggestions';
import { log } from 'console';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || "";

  if (q.length < 2) return NextResponse.json([]);

  await connectDB();
  console.log("Connected to DB for suggestions");
  const matches = await Suggestion.find({
    text: { $regex: q, $options: "i" }
  }).limit(5).select('text -_id');

  return NextResponse.json(matches.map(m => m.text));
}