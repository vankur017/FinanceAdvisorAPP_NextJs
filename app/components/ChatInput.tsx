

import React, { useState, useEffect, useRef } from 'react';
import { Send, Square, Search } from 'lucide-react';
import useDebouncedChatInput from '../utils/useDebouncedChatInput';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onStop, isGenerating, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useDebouncedChatInput(input);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault();
    
   
    if (isGenerating) {
        onStop();
        return;
    }

    if (!input.trim() || disabled) return;
    
    onSend(input);
    setInput('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    onSend(text);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-t border-gray-700 bg-gray-800 p-4 sticky bottom-0">
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto relative flex items-center"
      >
 
        {showSuggestions && suggestions.length > 0 && !isGenerating && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl overflow-hidden z-50">
            <ul>
              {suggestions.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-5 py-3 text-gray-200 hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-700 last:border-0"
                >
                  <Search size={14} className="text-gray-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

      
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={isGenerating ? "Senior Advisor is typing..." : "Ask about market trends..."} 
          readOnly={isGenerating} 
          className={`w-full bg-gray-700 text-white placeholder-gray-400 rounded-full py-3 pl-5 pr-12 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all z-10 
            ${isGenerating ? "opacity-70 cursor-wait" : ""}`}
        />
        
        <button
          type="submit"
          disabled={!isGenerating && !input.trim()}
          className={`absolute right-2 p-2 rounded-full text-white transition-colors z-20 ${
             isGenerating 
               ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" 
               : "bg-blue-600 hover:bg-blue-700"              
          }`}
        >
          {isGenerating ? <Square size={18} fill="currentColor" /> : <Send size={18} />}
        </button>
      </form>
      <div className="text-center mt-2">
        <span className="text-xs text-gray-400">AI can make mistakes. Check important info.</span>
      </div>
    </div>
  );
}