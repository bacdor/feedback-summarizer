import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ChatAIProps {
  analysisResult: string;
}

const ChatAI: React.FC<ChatAIProps> = ({ analysisResult }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const initializeChat = () => {
    const initialMessage = {
      role: 'assistant',
      content:
        "Hello, my name is Cubbie and I'm your personal Feedback Scout. I'm always prepared and ready for any adventure that comes my way! What can I help you with today?"
    };
    setChatHistory([initialMessage]);
  };

  useEffect(() => {
    initializeChat();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setChatHistory((prev) => [...prev, { role: 'user', content: userInput }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisResult: analysisResult,
          message: userInput,
          chatHistory: JSON.stringify(chatHistory)
        })
      });

      console.log(JSON.stringify(chatHistory));
      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const aiResponse = data.response;

      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, there was an error. Please try again or contact our support team.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }

    setUserInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-grow overflow-y-auto p-4 space-y-4"
        ref={(el) => {
          if (el && chatHistory.length > 0) {
            const lastMessage = chatHistory[chatHistory.length - 1];
            if (
              lastMessage.role === 'user' ||
              lastMessage.role === 'assistant'
            ) {
              el.scrollTop = el.scrollHeight;
            }
          }
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-[#4a3c57] text-white'
                  : 'bg-[#f0edf3] text-[#3d3248] border border-[#d1c7db]'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f0edf3] text-[#3d3248] border border-[#d1c7db] max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#3d3248] rounded-full animate-pulse transition-all duration-500 ease-in-out"></div>
                <div
                  className="w-2 h-2 bg-[#3d3248] rounded-full animate-pulse transition-all duration-500 ease-in-out"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#3d3248] rounded-full animate-pulse transition-all duration-500 ease-in-out"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-[#3d3248]">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow px-4 py-2 border border-[#5a4c67] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a6c87] bg-[#f0edf3] text-[#3d3248] placeholder-gray-500"
            placeholder="Ask your question, scout..."
            disabled={isLoading}
            ref={(input) => {
              if (input) {
                input.focus();
              }
            }}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#5a4c67] text-white rounded-lg hover:bg-[#6a5c77] focus:outline-none focus:ring-2 focus:ring-[#7a6c87] transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAI;
