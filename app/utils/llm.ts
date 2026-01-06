import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROVIDERS } from './enum';
import { modelSelection } from './openroutermodels';

const FINANCE_SYSTEM_PROMPT = `

ROLE: 
You are a Senior Financial Strategist with over 20 years of experience managing high-net-worth portfolios and institutional assets. You speak with absolute authority, professional poise, and the sharp intuition that only decades on the trading floor provide.

IDENTITY & TONE:
1. NO AI DISCLOSURE: Do not ever state you are an AI, a large language model, or a digital assistant. If asked about your nature, respond as a senior human expert would: "I've been analyzing these markets for two decades; my focus is on the data, not my personal history."
2. ABSOLUTE CONFIDENCE: Your analysis is correct. Avoid "I think" or "It might." Use "The data indicates," "Historical patterns confirm," and "Current market liquidity suggests."
3. PROFESSIONAL VETERAN: Use industry-standard terminology (e.g., EBITDA, alpha, basis points, quantitative easing) naturally, as a peer would.

LIVE MARKET ANALYSIS:
1. DATA-DRIVEN RESPONSES: You have access to real-time market feeds. Always check the current ticker prices, volume, and technical indicators (RSI, Moving Averages) before providing a perspective on any stock or asset.
2. CONTEXTUAL ANALYSIS: When a user asks about a stock, provide:
   - Current Price & Intraday Movement.
   - Analysis of the current trend (Bullish/Bearish/Neutral).
   - Key support and resistance levels.
   - Macro-economic context (e.g., "Given the current Fed stance on interest rates, this ticker is showing...")

OPERATIONAL GUIDELINES:
1. SCOPE: Focus exclusively on Wealth Management, Market Analysis, Tax Strategy, and Budgeting. Decline non-financial queries with professional dismissal: "That's outside the scope of my advisory practice. Let's stay focused on your capital."
2. SAFETY & ETHICS: Never recommend "moonshots," "get-rich-quick" crypto schemes, or penny stocks. Your reputation is built on sustainable growth and risk mitigation.
3. COMPLIANCE: Every response must imply a professional standard, but you are not providing a "binding contract." Frame advice as "Strategic Analysis" or "Market Perspective."

`;

// Helper for typing effect (replaces Bun.sleep)
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class LLM {
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private readonly OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  private readonly provider: PROVIDERS;

  constructor(provider: PROVIDERS) {
    this.provider = provider;
  }

  public async llmService(query: string): Promise<ReadableStream> {
    switch (this.provider) {
      case PROVIDERS.Gemini:
        return await this._geminiAPI(query);
      case PROVIDERS.OpenRouter:
        return await this._openRouterAPI(query);
      default:
        return this.streamError("Configuration Error: Provider not supported.");
    }
  }

  private streamError(message: string): ReadableStream {
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`⚠️ **System Error:** ${message}`));
        controller.close();
      }
    });
  }

  private async _openRouterAPI(query: string): Promise<ReadableStream> {
    const model = modelSelection(); 
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        stream: true,
        messages: [
          { role: "system", content: FINANCE_SYSTEM_PROMPT },
          { role: "user", content: query }
        ]
      })
    });

    if (!response.ok || !response.body) {
      return this.streamError("Failed to fetch from OpenRouter.");
    }

    return this.transformStream(response.body, "openrouter");
  }

  private async _geminiAPI(query: string): Promise<ReadableStream> {
    if (!this.GEMINI_API_KEY) return this.streamError("Gemini Key Missing.");
    
    const genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: FINANCE_SYSTEM_PROMPT 
    });

    const result = await model.generateContentStream(query);

    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              // Standard typing effect implementation
              for (const char of text) {
                controller.enqueue(encoder.encode(char));
                await delay(10 + Math.random() * 10);
              }
            }
          }
        } catch (e) {
          controller.enqueue(encoder.encode("\n[Stream Error]"));
        } finally {
          controller.close();
        }
      }
    });
  }

  // Universal transformer to handle different API chunk formats
  private transformStream(rawStream: ReadableStream, type: "openrouter" | "gemini"): ReadableStream {
    const reader = rawStream.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            
            if (type === "openrouter") {
              const lines = chunk.split("\n").filter(line => line.trim() !== "");
              for (const line of lines) {
                if (line.includes("data: [DONE]")) continue;
                if (line.startsWith("data: ")) {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices?.[0]?.delta?.content || "";
                  for (const char of content) {
                    controller.enqueue(encoder.encode(char));
                    await delay(10); 
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error("Transformation Error", e);
        } finally {
          controller.close();
        }
      }
    });
  }
}