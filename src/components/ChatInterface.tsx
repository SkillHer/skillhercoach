
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Trash2, ArrowLeft } from "lucide-react";
import { useChatHistory } from '../hooks/useChatHistory';
import { generateAIResponse, formatMessagesForOpenRouter } from '../services/openRouterService';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import InterestSelector from './InterestSelector';
import SuggestedPrompts from './SuggestedPrompts';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'skillher';
  timestamp: Date;
  emotion?: 'neutral' | 'empathetic' | 'inspiring' | 'cheerful' | 'assertive';
}

interface ChatInterfaceProps {
  user: { id: string; name: string; profile: Record<string, any> };
  initialPrompt?: string;
  selectedInterest?: 'career' | 'health' | 'other';
}

const ChatInterface = ({ user, initialPrompt, selectedInterest }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messages, addMessage, clearHistory } = useChatHistory(user.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [interest, setInterest] = useState<'career' | 'health' | 'other' | null>(selectedInterest || null);
  const [showSelector, setShowSelector] = useState(messages.length === 0 && !selectedInterest);
  const isMobile = useIsMobile();
  
  console.log("Current state - messages:", messages.length, "showSelector:", showSelector, "interest:", interest, "selectedInterest:", selectedInterest);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Process initialPrompt and selectedInterest if provided
  useEffect(() => {
    if (selectedInterest && messages.length === 0) {
      console.log("Using selected interest:", selectedInterest);
      handleInterestSelect(selectedInterest);
    }
  }, [selectedInterest, messages.length]);

  // Process initialPrompt if provided
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      console.log("Processing initial prompt:", initialPrompt);
      setInput(initialPrompt);
    }
  }, [initialPrompt, messages.length]);
  
  // Handle interest selection
  const handleInterestSelect = (selectedInterest: 'career' | 'health' | 'other') => {
    console.log("Interest selected in ChatInterface:", selectedInterest);
    setInterest(selectedInterest);
    setShowSelector(false);
    
    // Add initial greeting based on selected interest
    let greetingText = '';
    
    if (selectedInterest === 'career') {
      greetingText = `Hello ${user.name}! 👋 I'm your Skillher Coach, focused on women's career development. Whether you're looking to advance in your current role, negotiate a salary, or improve your work-life balance, I'm here to help! How can I support your career goals today? ✨`;
    } else if (selectedInterest === 'health') {
      greetingText = `Hello ${user.name}! 👋 I'm your Skillher Coach, focused on women's health. I can help with topics like stress management, fitness, nutrition, or hormonal health. What aspect of your wellbeing would you like to focus on today? ✨`;
    } else {
      greetingText = `Hello ${user.name}! 👋 I'm your Skillher Coach. I'm here to support you with whatever's on your mind today. Feel free to ask about any topic you'd like to discuss, and we can explore it together! ✨`;
    }
      
    // Ensure we have a valid timestamp
    const timestamp = new Date();
    
    const initialMessage: Message = {
      id: timestamp.getTime().toString(),
      text: greetingText,
      sender: 'skillher',
      timestamp: timestamp,
      emotion: 'cheerful'
    };
    
    console.log("Adding initial message:", initialMessage);
    addMessage(initialMessage);
    
    // If there's an initialPrompt, submit it after a short delay
    if (initialPrompt) {
      setTimeout(() => {
        setInput(initialPrompt);
        handleSubmit(new Event('submit') as unknown as React.FormEvent);
      }, 1000);
    }
  };
  
  // Handle selecting a suggested prompt
  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

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
      
      // Enhanced system prompt based on selected interest
      let interestContext = "";
      if (interest === 'career') {
        interestContext = "focused on women's career development, leadership skills, workplace challenges, and professional growth";
      } else if (interest === 'health') {
        interestContext = "focused on women's health, wellness, fitness, nutrition, and hormonal balance";
      } else {
        interestContext = "focused on providing personalized guidance and support for women across various aspects of their personal and professional lives";
      }
      
      // Get AI response from OpenRouter with the enhanced context
      const responseText = await generateAIResponse(
        input.trim(), 
        user.name, 
        previousMessages,
        interestContext
      );
      
      const emotion = detectEmotion(input.trim());
      
      const skillherResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'skillher',
        timestamp: new Date(),
        emotion: emotion
      };
      
      addMessage(skillherResponse);
    } catch (error) {
      console.error("Error in AI response:", error);
      
      // Fallback response if API fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Let's try again in a moment! 🙂",
        sender: 'skillher',
        timestamp: new Date(),
        emotion: 'empathetic'
      };
      
      addMessage(fallbackResponse);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clear chat
  const handleClearChat = () => {
    clearHistory();
    setShowSelector(true);
    setInterest(null);
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
    });
  };
  
  // Handle back to selector button
  const handleBackToSelector = () => {
    setShowSelector(true);
    setInterest(null);
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
        return 'bg-purple-100 border-skillher-lavender';
      case 'inspiring':
        return 'bg-blue-50 border-blue-300';
      case 'cheerful':
        return 'bg-yellow-50 border-skillher-gold';
      case 'assertive':
        return 'bg-orange-50 border-orange-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Debug messages on render
  useEffect(() => {
    console.log("ChatInterface rendering - showSelector:", showSelector, "messages length:", messages.length, "interest:", interest);
  }, [showSelector, messages.length, interest]);

  // Show interest selector if no messages or interest not selected yet
  if (showSelector) {
    console.log("Showing interest selector");
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-skillher-lavender/10 overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <div className="flex items-center">
            <MessageCircle size={18} className="text-skillher-lavender mr-2" />
            <span className="font-medium">Chat with Skillher Coach</span>
          </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center p-4">
          <InterestSelector onSelect={handleInterestSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-skillher-lavender/10 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackToSelector}
            className="text-gray-500 hover:text-skillher-lavender"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <MessageCircle size={18} className="text-skillher-lavender mr-2" />
          <span className="font-medium">Chat with Skillher Coach</span>
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
      
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg border ${
                    message.sender === 'user' 
                      ? 'bg-skillher-lavender/10 border-skillher-lavender/20' 
                      : getMessageStyle(message.emotion)
                  }`}
                >
                  <p className="text-sm md:text-base whitespace-pre-line">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !input.trim()} 
            className="bg-skillher-lavender hover:bg-skillher-lavender/90"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
        
        {/* Show prompt suggestions for both mobile and desktop */}
        {interest && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex overflow-x-auto pb-2 gap-2">
              <SuggestedPrompts 
                interest={interest}
                onSelectPrompt={handleSelectPrompt}
                variant="mobile"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInterface;
