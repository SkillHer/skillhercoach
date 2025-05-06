
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { useChatHistory } from '../hooks/useChatHistory';
import { generateAIResponse, formatMessagesForOpenRouter, OpenRouterMessage } from '../services/openRouterService';
import { useToast } from "@/hooks/use-toast";

// Define the message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'clara';
  timestamp: Date;
  emotion?: 'neutral' | 'empathetic' | 'inspiring' | 'cheerful' | 'assertive';
}

interface ChatInterfaceProps {
  user: { id: string; name: string };
}

const ChatInterface = ({ user }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messages, addMessage, clearHistory } = useChatHistory(user.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: `Hello ${user.name}! 👋 I'm Clara, your personal coach for wellness and career growth. How can I support you today? ✨`,
        sender: 'clara',
        timestamp: new Date(),
        emotion: 'cheerful'
      };
      addMessage(initialMessage);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsSubmitting(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInput('');
    
    try {
      // Format previous messages for OpenRouter
      const previousMessages = formatMessagesForOpenRouter(messages);
      
      // Get AI response from OpenRouter
      const responseText = await generateAIResponse(input.trim(), user.name, previousMessages);
      const emotion = detectEmotion(input.trim());
      
      const claraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'clara',
        timestamp: new Date(),
        emotion: emotion
      };
      
      addMessage(claraResponse);
    } catch (error) {
      console.error("Error in AI response:", error);
      
      // Fallback response if API fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Let's try again in a moment! 🙂",
        sender: 'clara',
        timestamp: new Date(),
        emotion: 'empathetic'
      };
      
      addMessage(fallbackResponse);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearChat = () => {
    // Show confirmation before clearing
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      clearHistory();
      toast({
        title: "Chat cleared",
        description: "Your chat history has been cleared.",
      });
    }
  };
  
  // Simple emotion detection (placeholder for more sophisticated analysis)
  const detectEmotion = (userInput: string): 'neutral' | 'empathetic' | 'inspiring' | 'cheerful' | 'assertive' => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('sad') || userInputLower.includes('depressed') || userInputLower.includes('anxious') || userInputLower.includes('stress')) {
      return 'empathetic';
    } else if (userInputLower.includes('goal') || userInputLower.includes('dream') || userInputLower.includes('aspire')) {
      return 'inspiring';
    } else if (userInputLower.includes('happy') || userInputLower.includes('excited') || userInputLower.includes('glad')) {
      return 'cheerful';
    } else if (userInputLower.includes('frustrated') || userInputLower.includes('angry') || userInputLower.includes('unfair')) {
      return 'assertive';
    } else {
      return 'neutral';
    }
  };

  // Style based on emotion
  const getMessageStyle = (emotion?: string) => {
    switch (emotion) {
      case 'empathetic':
        return 'bg-purple-100 border-clara-lavender';
      case 'inspiring':
        return 'bg-blue-50 border-blue-300';
      case 'cheerful':
        return 'bg-yellow-50 border-clara-gold';
      case 'assertive':
        return 'bg-orange-50 border-orange-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-clara-lavender/10 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex items-center">
          <MessageCircle size={18} className="text-clara-lavender mr-2" />
          <span className="font-medium">Chat with Clara</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearChat}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 size={16} className="mr-1" />
          Clear Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg border ${
                  message.sender === 'user' 
                    ? 'bg-clara-lavender/10 border-clara-lavender/20' 
                    : getMessageStyle(message.emotion)
                }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-clara-lavender/50"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !input.trim()} 
            className="bg-clara-lavender hover:bg-clara-lavender/90"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
