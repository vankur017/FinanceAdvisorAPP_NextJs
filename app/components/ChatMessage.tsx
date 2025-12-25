import React from 'react'

type message = { role: string; content: string };

interface ChatMessageProps {
  content: string; 
  role: string;
 
}

const ChatMessage = ({role, content }: ChatMessageProps) => {
    const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
          ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
          <span className="text-white text-xs font-bold">{isUser ? 'U' : 'AI'}</span>
        </div>

        
        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden
          ${isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-sm'}`}>
          
          
          {isUser ? (
            <p>{content}</p>
          ) : (
           
            <div className="prose prose-sm max-w-none prose-invert text-gray-100">
              <span>{content}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage