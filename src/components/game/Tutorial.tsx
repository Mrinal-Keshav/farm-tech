import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, Play, Target, DollarSign, Droplets, Sprout, Scissors } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to FarmSphere! 🌱",
      content: "Learn how to manage your virtual farm and grow crops successfully.",
      icon: <Play className="h-6 w-6" />
    },
    {
      title: "Select and Plant Crops",
      content: "Click on any empty plot to select it, then choose a crop to plant. Each crop costs $500 and has different growth requirements.",
      icon: <Sprout className="h-6 w-6" />
    },
    {
      title: "Manage Your Crops",
      content: "Use irrigation ($80) to add water and fertilization ($120) to improve soil health. Keep crops healthy for better yields!",
      icon: <Droplets className="h-6 w-6" />
    },
    {
      title: "Harvest Your Crops",
      content: "When crops are ready (shown with golden border), click harvest to collect them. Better health = more crops!",
      icon: <Scissors className="h-6 w-6" />
    },
    {
      title: "Trade in the Market",
      content: "Sell your harvested crops in the market for profit. Prices fluctuate based on market conditions.",
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: "Complete Missions",
      content: "Take on farming challenges to earn extra money and unlock achievements.",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Advance Time",
      content: "Press SPACE or click 'Next Day' to advance time. Crops grow over multiple days with different stages.",
      icon: <ArrowRight className="h-6 w-6" />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {steps[currentStep].content}
          </p>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              size="sm"
            >
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={onClose} size="sm">
                Start Farming!
              </Button>
            ) : (
              <Button onClick={nextStep} size="sm">
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;

