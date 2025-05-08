
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
  const [apiError, setApiError] = useState<string | null>(null);
  
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
    setApiError(null); // Reset any previous API errors
    
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
      
      // Set API error message
      setApiError("We're experiencing connection issues with our AI service. Please try again in a moment.");
      
      // Fallback response if API fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment or refresh the page if the issue persists. 🙂",
        sender: 'skillher',
        timestamp: new Date(),
        emotion: 'empathetic'
      };
      
      addMessage(fallbackResponse);
      
      // Show toast with error message
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to our AI service. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clear chat
  const handleClearChat = () => {
    clearHistory();
    setShowSelector(true);
    setInterest(null);
    setApiError(null);
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
    });
  };
  
  // Handle back to selector button
  const handleBackToSelector = () => {
    setShowSelector(true);
    setInterest(null);
    setApiError(null);
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

  // Style based on emotion - updated with enhanced purple/lilac scheme
  const getMessageStyle = (emotion?: string) => {
    switch (emotion) {
      case 'empathetic':
        return 'bg-purple-100 border-purple-300 text-gray-800';
      case 'inspiring':
        return 'bg-anita-purple/20 border-anita-purple text-gray-800';
      case 'cheerful':
        return 'bg-anita-lavender/30 border-anita-lavender text-gray-800';
      case 'assertive':
        return 'bg-purple-200 border-purple-400 text-gray-800';
      default:
        return 'bg-white/90 border-purple-100 text-gray-800';
    }
  };

  // Show interest selector if no messages or interest not selected yet
  if (showSelector) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-anita-lavender/30 overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-anita-lavender/20 bg-anita-purple/10">
          <div className="flex items-center">
            <MessageCircle size={18} className="text-anita-purple mr-2" />
            <span className="font-medium text-anita-purple">Chat with Skillher Coach</span>
          </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center p-4">
          <InterestSelector onSelect={handleInterestSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-anita-lavender/30 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-anita-lavender/20 bg-anita-purple/10">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackToSelector}
            className="text-anita-purple hover:bg-anita-lavender/20 hover:text-anita-purple"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <MessageCircle size={18} className="text-anita-purple mr-1" />
          <span className="font-medium text-anita-purple">Chat with Skillher Coach</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearChat}
          className="text-anita-purple hover:bg-anita-lavender/20 hover:text-red-500"
        >
          <Trash2 size={16} className="mr-1" />
          Clear Chat
        </Button>
      </div>
      
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 bg-anita-cream/30">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[75%] p-3 rounded-lg border shadow-sm ${
                    message.sender === 'user' 
                      ? 'bg-anita-purple/20 border-anita-purple/30 text-gray-800' 
                      : getMessageStyle(message.emotion)
                  }`}
                >
                  <p className="text-sm md:text-base whitespace-pre-line leading-relaxed break-words">
                    {message.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {apiError}
                <p className="mt-1 text-xs">
                  Please try again or refresh the page if this issue persists.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-anita-lavender/20 p-4 bg-white">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border-anita-lavender/30 focus-visible:ring-anita-purple"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !input.trim()} 
            className="bg-anita-purple hover:bg-anita-purple/90 text-white"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
        
        {/* Show prompt suggestions with updated styling */}
        {interest && (
          <div className="mt-4">
            <p className="text-sm font-medium text-anita-purple mb-2">Suggested questions:</p>
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
