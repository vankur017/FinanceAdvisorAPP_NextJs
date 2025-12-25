
💹 Finance Advisor AI

This is a professional-grade Next.js application designed to provide high-authority financial advisory and real-time market analysis. Unlike standard chatbots, this system adopts the persona of a senior financial strategist with 20+ years of institutional experience.
🌟 Project Overview

This platform leverages the Next.js 15 App Router to provide a seamless, unified experience for financial data processing and AI streaming.
Key Features

    Senior Expert Persona: Provides confident, data-driven analysis without typical "AI assistant" disclaimers.

    Real-Time Streaming: Implements ReadableStream API for instantaneous "typing" effects.

    Intelligent Suggestions: A debounced MongoDB-backed search bar for quick financial topic discovery.

    Unified Backend: API routes handle LLM logic and Database interactions on a single port (4000).

    Resilient UI: Built with Tailwind CSS, featuring a dark-themed, institutional-grade interface.

🏗️ Technical Stack
Category	Technology
Framework	Next.js 15 (App Router)
Runtime	Bun
Styling	Tailwind CSS
Database	MongoDB (Mongoose Singleton)
AI Models	OpenRouter (Multi-model rotation) / Google Gemini
Icons	Lucide-React


Getting Started
1. Prerequisites

Ensure you have Bun installed (recommended for performance).
2. Environment Setup

Create a .env.local file in the root directory:
Code snippet

OPENROUTER_API_KEY=your_api_key
MONGODB_URI=your_mongodb_connection_string

3. Installation
Bash

bun install

4. Run Development Server
Bash

bun dev -p 4000

Open http://localhost:4000 to access the advisor.
📂 Project Structure

    app/api/chat/route.ts: The core streaming engine. Handles the bridge between the UI and the LLM.

    app/utils/useChatStream.ts: Custom React hook managing the complex state of AI chunks and AbortControllers.

    app/utils/llm.ts: The logic layer for prompt engineering and model selection.

    app/components/: Modular UI components (ChatInput, ChatMessage, Suggestions).

🛠️ Key Functionalities
The Streaming Hook (useChatStream)

Our implementation uses an AbortController to allow users to interrupt the "Senior Advisor" mid-sentence, saving API costs and providing better UX.
Data-Driven UI

The UI distinguishes between user and assistant roles using a conditional logic switch, ensuring the Advisor’s responses are framed with professional Emerald-themed branding while User messages remain distinct.
