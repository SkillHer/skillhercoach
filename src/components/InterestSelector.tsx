
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, ArrowRight, MoreHorizontal } from "lucide-react";

interface InterestSelectorProps {
  onSelect: (interest: 'career' | 'health' | 'other') => void;
}

const InterestSelector = ({ onSelect }: InterestSelectorProps) => {
  const [selectedInterest, setSelectedInterest] = React.useState<'career' | 'health' | 'other' | null>(null);

  // Handle selection of interest
  const handleInterestSelect = (interest: 'career' | 'health' | 'other') => {
    console.log("Setting selected interest to:", interest);
    setSelectedInterest(interest);
  };

  // Handle continue button click - call the onSelect prop with the chosen interest
  const handleContinue = () => {
    console.log("Continue button clicked, selected interest:", selectedInterest);
    if (selectedInterest) {
      onSelect(selectedInterest);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-clara-lavender/20 shadow-sm w-full max-w-md mx-auto">
      <h2 className="text-lg font-medium text-center mb-6">
        What area would you like to focus on today?
      </h2>
      
      <RadioGroup 
        className="flex flex-col gap-4"
        value={selectedInterest || ""}
        onValueChange={(value) => handleInterestSelect(value as 'career' | 'health' | 'other')}
      >
        <div className="flex items-start space-x-3 bg-purple-50 p-3 rounded-md cursor-pointer hover:bg-purple-100 transition-colors"
             onClick={() => handleInterestSelect('career')}>
          <RadioGroupItem value="career" id="career" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={18} className="text-clara-lavender" />
              <Label htmlFor="career" className="font-medium cursor-pointer">Career Development</Label>
            </div>
            <p className="text-sm text-gray-500">
              Get guidance on career growth, leadership, work-life balance, and overcoming workplace challenges.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-purple-50 p-3 rounded-md cursor-pointer hover:bg-purple-100 transition-colors"
             onClick={() => handleInterestSelect('health')}>
          <RadioGroupItem value="health" id="health" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={18} className="text-clara-lavender" />
              <Label htmlFor="health" className="font-medium cursor-pointer">Health & Wellness</Label>
            </div>
            <p className="text-sm text-gray-500">
              Explore topics like self-care, mental health, fitness, nutrition, and hormonal health.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 bg-purple-50 p-3 rounded-md cursor-pointer hover:bg-purple-100 transition-colors"
             onClick={() => handleInterestSelect('other')}>
          <RadioGroupItem value="other" id="other" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MoreHorizontal size={18} className="text-clara-lavender" />
              <Label htmlFor="other" className="font-medium cursor-pointer">Others/Not Mentioned</Label>
            </div>
            <p className="text-sm text-gray-500">
              Discuss any other topics or concerns that don't fall into the categories above.
            </p>
          </div>
        </div>
      </RadioGroup>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-clara-lavender hover:bg-clara-lavender/90 transition-all py-6 text-white text-lg flex items-center justify-center"
          onClick={handleContinue}
          disabled={!selectedInterest}
        >
          <span>Continue</span>
          <ArrowRight className="ml-2" />
        </Button>
        
        {/* Visual indicator when no interest is selected */}
        {!selectedInterest && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Please select an interest above to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default InterestSelector;
