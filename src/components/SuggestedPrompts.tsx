
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface SuggestedPromptsProps {
  interest: 'career' | 'health' | 'other';
  onSelectPrompt: (prompt: string) => void;
  variant?: 'default' | 'mobile';
}

const SuggestedPrompts = ({ interest, onSelectPrompt, variant = 'default' }: SuggestedPromptsProps) => {
  const careerPrompts = [
    "How can I negotiate a salary increase?",
    "What strategies can help me achieve work-life balance?",
    "I'm feeling stuck in my career. How can I find new opportunities?",
    "How can I deal with imposter syndrome at work?",
    "What leadership skills should I develop to advance my career?"
  ];

  const healthPrompts = [
    "What are some stress management techniques I can practice daily?",
    "How can I improve my sleep quality?",
    "What simple exercises can I incorporate into my busy schedule?",
    "How can I maintain hormonal balance naturally?",
    "What nutritional needs should women prioritize?"
  ];

  const otherPrompts = [
    "How can I improve my confidence and self-esteem?",
    "What are some effective personal development strategies?",
    "How can I build better relationships?",
    "What are some ways to overcome challenges in my life?",
    "How can I set and achieve my goals effectively?"
  ];

  // Select appropriate prompts based on the interest
  let prompts = careerPrompts;
  if (interest === 'health') {
    prompts = healthPrompts;
  } else if (interest === 'other') {
    prompts = otherPrompts;
  }

  // For mobile variant, show horizontal scrolling buttons
  if (variant === 'mobile') {
    return (
      <>
        {prompts.map((prompt, index) => (
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
        {prompts.map((prompt, index) => (
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
