import React from 'react'

type message = { role: string; content: string };

interface ChatMessageProps {
  content: string; 
  role: string;
 
}

const ChatMessage = ({role, content }: ChatMessageProps) => {
    const isUser = role === "user";

  return (
    <div className='flex mx-40 my-10 flex-row gap-2'>
        <div className=''>
            <span className='bg-yellow-500 border justify-center rounded-full flex items-center  w-8 h-8'>
                {
                    isUser? "U": "AI"
                }
                
            </span>
        </div>
        <div className='border bg-gray-700 border-blue-400 px-4  max-w-[80%] rounded-3xl p-3'>
            <span className=''>
                chatafkmlsafksd;flkas;lkfasd;lfas;dlg;lkafg;lkfa;glkfa;lkgfd;lg;laff;lasdkf;lksaf;lkasdf;lkasdfkadslkf
                dasdasjldjasklfjklsadlkjfsdakjfasdklajlsfdgjkdfvjkdsffvjkdfjkvsdfjknvjksdfvjksdfvjksdfjvksdfjvsdfjkvsdfjkvdfj
            </span>
        </div>
    </div>
  )
}

export default ChatMessage