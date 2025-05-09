
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface SuggestedPromptsProps {
  interest: 'career' | 'health' | 'business' | 'other';
  onSelectPrompt: (prompt: string) => void;
  variant?: 'default' | 'mobile';
}

const SuggestedPrompts = ({ interest, onSelectPrompt, variant = 'default' }: SuggestedPromptsProps) => {
  const [randomizedPrompts, setRandomizedPrompts] = useState<string[]>([]);
  
  // All available prompts by category
  const allCareerPrompts = [
    "How can I negotiate a salary increase?",
    "What strategies can help me achieve work-life balance?",
    "I'm feeling stuck in my career. How can I find new opportunities?",
    "How can I deal with imposter syndrome at work?",
    "What leadership skills should I develop to advance my career?",
    "How do I prepare for a job interview effectively?",
    "What should I include in my resume to stand out?",
    "How can I navigate workplace politics professionally?",
    "What's the best way to ask for feedback from my manager?",
    "How can I develop my personal brand in my industry?",
    "How can I transition to a new career field?",
    "What are effective networking strategies for professionals?",
    "How do I know when it's time to leave my current job?",
    "Tips for developing executive presence in meetings?",
    "How can I become more confident in public speaking?",
    "What are the best ways to manage up effectively?",
    "How can I improve my time management at work?",
    "Tips for negotiating flexible work arrangements?",
    "How can I recover from a career setback or failure?",
    "What skills will be most valuable in the future job market?"
  ];

  const allBusinessPrompts = [
    "How do I write an effective business plan?",
    "What are the key steps to start my own business?",
    "How can I secure funding for my startup?",
    "What marketing strategies work best for small businesses?",
    "How do I build a strong brand identity?",
    "What legal considerations should I be aware of when starting a business?",
    "How can I effectively manage cash flow in my business?",
    "What's the best way to price my products or services?",
    "How do I identify my target market and reach them?",
    "What are effective customer acquisition strategies?",
    "How can I scale my business operations efficiently?",
    "What should I consider when hiring my first employees?",
    "How do I create passive income streams in my business?",
    "What are the best digital marketing strategies for new businesses?",
    "How can I leverage social media to grow my business?",
    "What are effective ways to handle business competition?",
    "How can I improve my business's online presence?",
    "What financial metrics should I monitor in my business?",
    "How do I create effective partnerships or strategic alliances?",
    "What are the most common mistakes new entrepreneurs make?"
  ];

  const allHealthPrompts = [
    "What are some stress management techniques I can practice daily?",
    "How can I improve my sleep quality?",
    "What simple exercises can I incorporate into my busy schedule?",
    "How can I maintain hormonal balance naturally?",
    "What nutritional needs should women prioritize?",
    "How can I build a sustainable meditation practice?",
    "What are effective ways to manage menstrual symptoms?",
    "How can I increase my energy levels naturally?",
    "What foods support women's hormonal health?",
    "How can I improve my mental health through daily habits?",
    "What should I know about perimenopause and managing symptoms?",
    "How can I prevent burnout when I'm always busy?",
    "What are the benefits of strength training for women?",
    "How can I support my gut health through diet?",
    "What should I know about managing my thyroid health?",
    "How can I maintain bone density as I age?",
    "What are effective ways to reduce inflammation in my body?",
    "How can I support my immune system naturally?",
    "What are the signs of vitamin deficiencies I should watch for?",
    "How can I establish a sustainable self-care routine?"
  ];

  const allOtherPrompts = [
    "How can I improve my confidence and self-esteem?",
    "What are some effective personal development strategies?",
    "How can I build better relationships?",
    "What are some ways to overcome challenges in my life?",
    "How can I set and achieve my goals effectively?",
    "How can I develop better communication skills?",
    "What practices can help me find more joy in everyday life?",
    "How can I manage my finances more effectively?",
    "What are strategies for building healthy boundaries?",
    "How can I cultivate more gratitude in my daily life?",
    "Tips for becoming more assertive in difficult conversations?",
    "How can I improve my decision-making skills?",
    "What are ways to develop emotional intelligence?",
    "How can I overcome perfectionism and embrace progress?",
    "What strategies help with reducing social anxiety?",
    "How can I create more meaningful connections with others?",
    "What are effective ways to manage disagreements in relationships?",
    "How can I develop a growth mindset?",
    "What habits can help me become more organized?",
    "How can I find my purpose and passion in life?"
  ];

  // Randomly select N prompts from an array
  const getRandomPrompts = (promptsArray: string[], count: number = 10): string[] => {
    // Create a copy of the array to avoid modifying the original
    const shuffled = [...promptsArray].sort(() => 0.5 - Math.random());
    // Return the first N elements
    return shuffled.slice(0, count);
  };

  // Randomize prompts on component mount and when interest changes
  useEffect(() => {
    let selectedPrompts: string[] = [];
    
    if (interest === 'career') {
      selectedPrompts = getRandomPrompts(allCareerPrompts);
    } else if (interest === 'health') {
      selectedPrompts = getRandomPrompts(allHealthPrompts);
    } else if (interest === 'business') {
      selectedPrompts = getRandomPrompts(allBusinessPrompts);
    } else {
      selectedPrompts = getRandomPrompts(allOtherPrompts);
    }
    
    setRandomizedPrompts(selectedPrompts);
  }, [interest]); // Re-randomize when interest changes

  // For mobile variant, show horizontal scrolling buttons
  if (variant === 'mobile') {
    return (
      <>
        {randomizedPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-anita-purple/20 hover:bg-anita-lavender/20 flex-shrink-0"
            onClick={() => onSelectPrompt(prompt)}
          >
            <MessageCircle size={14} className="mr-2 text-anita-purple shrink-0" />
            <span className="truncate">{prompt}</span>
          </Button>
        ))}
      </>
    );
  }

  // Default desktop variant with vertical layout
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">Suggested topics:</h3>
      <div className="grid grid-cols-1 gap-2">
        {randomizedPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-2 border-anita-purple/20 hover:bg-anita-lavender/20"
            onClick={() => onSelectPrompt(prompt)}
          >
            <MessageCircle size={14} className="mr-2 text-anita-purple shrink-0" />
            <span className="truncate">{prompt}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
