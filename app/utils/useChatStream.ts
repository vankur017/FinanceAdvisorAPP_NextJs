"use client"
import { use, useState } from "react";
import { POST } from "../api/chat/route";



 const useChatStream = () => {

    const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
        {role:"assistant", content: "Hello! How can I assist you today?"}
    ]);
    const [isLoading, setLoading] = useState(false);

    const sendMessage = async(text: string)=>{

        try{
            const data = await fetch("http://localhost:4000/api/chat",{
                method: "POST",
                headers:{"Content-type" : "application/json"},
                body: JSON.stringify({messages:text})

            });

            
            const reader = data?.body?.getReader();
            const decoder = new TextDecoder();
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
            console.error("Stream Error:", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            throw new Error(errorMessage);
        }
    }

    return {
        messages,
        sendMessage,
        // stopGeneration,
        isLoading
        
    }
}

export default useChatStream