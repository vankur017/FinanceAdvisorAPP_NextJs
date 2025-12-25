"use client"
import { use, useRef, useState } from "react";
import { POST } from "../api/chat/route";
import { set } from "mongoose";



 const useChatStream = () => {

    const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
        {role:"assistant", content: "Hello! How can I assist you today?"}
    ]);
    const [isLoading, setLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const sendMessage = async(text: string)=>{
        setMessages((prev)=>[...prev, {role:"user", content:text}])
        setLoading(true);

        abortControllerRef.current = new AbortController();

        try{
            const data = await fetch("/api/chat",{
                method: "POST",
                headers:{"Content-type" : "application/json"},
                body: JSON.stringify({messages:text}),
                signal: abortControllerRef.current.signal, 

            });

            if(!data.body){
                setMessages((prev)=>[...prev, {role:"assistant", content: ""}]);
                throw new Error("No response from server");
            }
            
            const reader = data?.body?.getReader();
            const decoder = new TextDecoder();

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
            let aiResponse = "";
            if (!reader) {
                throw new Error("No response body to read from stream.");
            }
            while (true) {
                const { done, value } = await reader.read();
                if(done) break;

                const chunk = decoder.decode(value, {stream: true});
                aiResponse+=chunk;

                setMessages((prev)=>{
                    const newMsg = [...prev];
                    newMsg[newMsg.length -1] = {role:"assistant", content: aiResponse}

                    return newMsg
                })

            }

        }
        catch(err){
            const errorMessage = err instanceof Error ? err.message : String(err);
            if(errorMessage === 'AbortError'){
                console.log("Fetch aborted");
            }
            else{
                console.error("Stream Error:", errorMessage);
                setMessages((prev) => [...prev, { role: 'assistant', content: "Error: Could not fetch response." }]);
            }
        }
            
          finally{
            setLoading(false);
        }
    }
     const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

    return {
        messages,
        sendMessage,
        stopGeneration,
        isLoading
        
    }
}

export default useChatStream