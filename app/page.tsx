"use client"

import App from "next/app";
import Image from "next/image";
import ChatMessage from "./components/ChatMessage";
import useChatStream from "./utils/useChatStream";
import { log } from "console";
import ChatInput from "./components/ChatInput";

type message = { role: string; content: string };

interface YourComponentProps {
  message: message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
}

const Home: React.FC<YourComponentProps> = () => {

  const {messages, isLoading, sendMessage} = useChatStream()
  console.log(messages);
  

  return (
    <div className="flex w-full flex-col h-screen bg-gray-900 text-gray-100">
       <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
          <div className="max-w-3xl  flex items-center gap-2">
            <span className="font-bold text-xl text-white">Finance AI</span>
          </div>
        </header>
      
        <main className="flex-1 overflow-y-auto p-4">
            {
              messages.map((msg, idx)=>(
                <ChatMessage key={idx} role={msg?.role} content={msg?.content}/>
              ))
            }
        </main>
       
          <div className="w-full">
            <div className="max-w-3xl mx-auto rounded-2xl my-5">
              <ChatInput onSend={sendMessage} onStop={() => {}} isGenerating={isLoading} />
            </div>
          </div>

    </div>
  );
}

export default Home;