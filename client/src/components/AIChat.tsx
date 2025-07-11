import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIChatProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}

export default function AIChat({ showChat, setShowChat }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your finance assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending request to AI endpoint...');
      const response = await api.post('/ai/chat', {
        messages: [...messages, userMessage].map(({ role, content }) => ({
          role,
          content,
        })),
      });

      console.log('AI Response:', response.data);
      
      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data.message },
        ]);
      } else {
        throw new Error(response.data.message || 'Failed to process AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to get response from AI'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-full">
      <div className="p-3 sm:p-4 bg-indigo-600 text-white flex justify-between items-center">
        <h2 className="text-base sm:text-lg font-semibold">Finance Assistant</h2>
        <button 
          onClick={() => setShowChat(false)}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close chat"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[90%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex-shrink-0 mr-2">
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                ) : (
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-2 sm:p-3 max-w-[90%] sm:max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-indigo-600" />
                <span className="text-sm sm:text-base">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      <form onSubmit={handleSubmit} className="p-2 sm:p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
