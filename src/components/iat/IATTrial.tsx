
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
          left: "تواصل طبيعي",
          right: "اضطراب تواصل"
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

  const categories = getTrialCategories(trial);

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-8 bg-white">
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="text-center flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">K</div>
          <div className="whitespace-pre-line text-xl text-green-600 mb-2">{categories.left}</div>
          <div className="text-lg">اضغط "K"</div>
        </div>
        <div className="text-center flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">D</div>
          <div className="whitespace-pre-line text-xl text-green-600 mb-2">{categories.right}</div>
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
