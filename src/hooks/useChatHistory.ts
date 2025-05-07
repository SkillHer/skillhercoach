
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'skillher';
  timestamp: Date;
  emotion?: 'neutral' | 'empathetic' | 'inspiring' | 'cheerful' | 'assertive';
}

export const useChatHistory = (userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`skillherCoach_chat_${userId}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading chat history:', e);
        localStorage.removeItem(`skillherCoach_chat_${userId}`);
      }
    }
  }, [userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`skillherCoach_chat_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  // Add a new message to the history
  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Clear chat history
  const clearHistory = () => {
    localStorage.removeItem(`skillherCoach_chat_${userId}`);
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    clearHistory
  };
};
