"use client"
import App from "next/app";
import Image from "next/image";
import ChatMessage from "./components/ChatMessage";
import useChatStream from "./utils/useChatStream";

import ChatInput from "./components/ChatInput";
import { useEffect, useRef } from "react";

type message = { role: string; content: string };

interface YourComponentProps {
  message: message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  stopGeneration: () => void;
}

const Home: React.FC<YourComponentProps> = () => {

  const {messages, isLoading, sendMessage, stopGeneration} = useChatStream()
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(messages);
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
     <div>
      <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      
        <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <span className="font-bold text-xl text-white">Finance AI</span>
          </div>
        </header>
    
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-0">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>
        
       
        <ChatInput 
          onSend={sendMessage} 
          onStop={stopGeneration}
          isGenerating={isLoading}  
          disabled={isLoading}     
        />
      </div>
    </div>
  );
}

export default Home;