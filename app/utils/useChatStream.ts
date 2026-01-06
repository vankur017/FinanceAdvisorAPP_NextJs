"use client";

import { useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const useChatStream = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [isLoading, setLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (text: string) => {
    // 🔁 Abort previous stream
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: text }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiResponse = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        aiResponse += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: aiResponse,
          };
          return updated;
        });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Stream aborted");
        return;
      }

      console.error("Stream Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Unable to fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
  };

  return {
    messages,
    sendMessage,
    stopGeneration,
    isLoading,
  };
};

export default useChatStream;
