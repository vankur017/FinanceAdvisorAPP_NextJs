import { useState, useEffect } from "react";

const useDebouncedChatInput=(query: string, delay=300)=>{

    const [suggestion, setSuggestion] = useState([])

    useEffect(()=>{
        if(query.length<3 || !query){
            setSuggestion([]);
            return
        }   
    },[query])

    useEffect(()=>{
        const timer = setTimeout(async()=>{
        try{
            const data = await fetch(`/api/suggestions?q=${encodeURIComponent(debouncedValue)}`);
            const json = await data.json();

            setSuggestion(json);
        }catch(err){
            console.error("chat input error:", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            throw new Error(errorMessage);
        }
      
    }, delay)
    return ()=>clearTimeout(timer)
    },[query, delay])
    

    return suggestion
}

export default useDebouncedChatInput;