export const runtime = "edge";

import { NextResponse } from "next/server";
import { LLM } from "@/app/utils/llm";
import { PROVIDERS } from "@/app/utils/enum";

const STREAM_TIMEOUT = 60_000; // 60 seconds

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const llm = new LLM(PROVIDERS.OpenRouter);
    const llmStream = await llm.llmService(messages);

    const reader = llmStream.getReader();
    const encoder = new TextEncoder();

    let timeoutId: ReturnType<typeof setTimeout>;

    const stream = new ReadableStream({
      start(controller) {
        // ⏱️ Auto-close after 30 seconds
        timeoutId = setTimeout(() => {
          controller.enqueue(
            encoder.encode("\n[Connection closed: timeout]\n")
          );
          controller.close();
        }, STREAM_TIMEOUT);

        // 🔁 Close when client aborts (new message sent)
        req.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          controller.close();
        });

        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              clearTimeout(timeoutId); // reset timeout on data
              timeoutId = setTimeout(() => {
                controller.close();
              }, STREAM_TIMEOUT);

              controller.enqueue(value);
            }
          } catch (err) {
            controller.error(err);
          } finally {
            clearTimeout(timeoutId);
            controller.close();
          }
        })();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
