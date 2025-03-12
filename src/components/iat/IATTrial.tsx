
import React from "react";
import type { Trial } from "./IATTypes";

interface IATTrialProps {
  trial: Trial;
  showFeedback: boolean;
  isCorrect: boolean;
}

export const IATTrial: React.FC<IATTrialProps> = ({ trial, showFeedback, isCorrect }) => {
  const getTrialCategories = (trial: Trial) => {
    switch (trial.block) {
      case 1:
        return {
          left: "تواصل طبيعي",
          right: "اضطراب تواصل"
        };
      case 2:
        return {
          left: "صفات إيجابية",
          right: "صفات سلبية"
        };
      case 3:
      case 4:
        return {
          left: "تواصل طبيعي\nأو\nصفات إيجابية",
          right: "اضطراب تواصل\nأو\nصفات سلبية"
        };
      case 5:
        return {
          left: "صفات سلبية",
          right: "صفات إيجابية"
        };
      case 6:
      case 7:
        return {
          left: "تواصل طبيعي\nأو\nصفات سلبية",
          right: "اضطراب تواصل\nأو\nصفات إيجابية"
        };
      default:
        return {
          left: "",
          right: ""
        };
    }
  };

  // Determine if category includes positive/negative attributes
  const hasPositiveAttributes = (category: string) => category.includes("صفات إيجابية");
  const hasNegativeAttributes = (category: string) => category.includes("صفات سلبية");

  const categories = getTrialCategories(trial);

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-8 bg-white">
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="text-center flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">K</div>
          <div className="whitespace-pre-line text-xl text-green-600 mb-2">{categories.left}</div>
          {hasPositiveAttributes(categories.left) && (
            <div className="flex gap-4 justify-center mb-2">
              <img src="/lovable-uploads/0614e6dd-0a9e-4360-9278-dbba71cc546b.png" alt="Light bulb idea" className="h-10 w-10" />
              <img src="/lovable-uploads/2e29f911-0a75-4712-8eea-e2e98db244cb.png" alt="Strong person" className="h-10 w-10" />
            </div>
          )}
          {hasNegativeAttributes(categories.left) && (
            <div className="flex gap-4 justify-center mb-2">
              <img src="/lovable-uploads/c5746857-ee51-4e54-b918-f49f50369faf.png" alt="Sad face" className="h-10 w-10" />
              <img src="/lovable-uploads/901566ad-77e2-4163-aa28-528697bcf20d.png" alt="Timer clock" className="h-10 w-10" />
            </div>
          )}
          <div className="text-lg">اضغط "K"</div>
        </div>
        <div className="text-center flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">D</div>
          <div className="whitespace-pre-line text-xl text-green-600 mb-2">{categories.right}</div>
          {hasPositiveAttributes(categories.right) && (
            <div className="flex gap-4 justify-center mb-2">
              <img src="/lovable-uploads/0614e6dd-0a9e-4360-9278-dbba71cc546b.png" alt="Light bulb idea" className="h-10 w-10" />
              <img src="/lovable-uploads/2e29f911-0a75-4712-8eea-e2e98db244cb.png" alt="Strong person" className="h-10 w-10" />
            </div>
          )}
          {hasNegativeAttributes(categories.right) && (
            <div className="flex gap-4 justify-center mb-2">
              <img src="/lovable-uploads/c5746857-ee51-4e54-b918-f49f50369faf.png" alt="Sad face" className="h-10 w-10" />
              <img src="/lovable-uploads/901566ad-77e2-4163-aa28-528697bcf20d.png" alt="Timer clock" className="h-10 w-10" />
            </div>
          )}
          <div className="text-lg">اضغط "D"</div>
        </div>
      </div>

      <div className="text-center space-y-8">
        <div className="text-4xl font-bold">{trial.stimulus}</div>
        {showFeedback && !isCorrect && (
          <div className="text-red-500 text-6xl font-bold">X</div>
        )}
      </div>
    </div>
  );
};
