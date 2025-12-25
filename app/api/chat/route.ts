import { NextResponse } from 'next/server';
import { LLM } from '@/app/utils/llm';
import { PROVIDERS } from '@/app/utils/enum';

export async function POST(req: Request) {
  try {
    // 1. Get the message from the request body
    const { messages } = await req.json();
    console.log("Received message:", messages);
    if (!messages) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 2. Initialize your LLM service 
    // You can choose PROVIDERS.OpenRouter or PROVIDERS.Gemini here
    const llm = new LLM(PROVIDERS.OpenRouter);

    // 3. Get the stream from your service
    const stream = await llm.llmService(messages);

    // 4. Return the stream directly
    // Next.js understands ReadableStream and will stream it to the client
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}