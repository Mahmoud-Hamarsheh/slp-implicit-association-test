
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
          left: "اضطراب تواصل",
          right: "تواصل طبيعي"
        };
      case 2:
        return {
          left: "صفات سلبية",
          right: "صفات إيجابية"
        };
      case 3:
      case 4:
        return {
          left: "اضطراب تواصل أو صفة سلبية",
          right: "تواصل طبيعي أو صفة إيجابية"
        };
      case 5:
        return {
          left: "صفات إيجابية",
          right: "صفات سلبية"
        };
      case 6:
      case 7:
        return {
          left: "اضطراب تواصل أو صفة ايجابية",
          right: "تواصل طبيعي أو صفة سلبية"
        };
      default:
        return {
          left: "",
          right: ""
        };
    }
  };

  const categories = getTrialCategories(trial);

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-8 bg-white">
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">D</div>
          <div className="text-lg text-green-600">{categories.left}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">K</div>
          <div className="text-lg text-green-600">{categories.right}</div>
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
