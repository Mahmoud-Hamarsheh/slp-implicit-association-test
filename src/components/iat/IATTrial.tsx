
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
          left: "إيجابي",
          right: "سلبي"
        };
      case 3:
      case 4:
        return {
          left: "تواصل طبيعي\nأو\nإيجابي",
          right: "اضطراب تواصل\nأو\nسلبي"
        };
      case 5:
        return {
          left: "سلبي",
          right: "إيجابي"
        };
      case 6:
      case 7:
        return {
          left: "تواصل طبيعي\nأو\nسلبي",
          right: "اضطراب تواصل\nأو\nإيجابي"
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
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-4 md:p-8 bg-white">
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
        <div className="text-center flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">K</div>
          {categories.left && (
            <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
              {categories.left}
            </div>
          )}
          <div className="text-sm md:text-lg">اضغط "K"</div>
        </div>
        <div className="text-center flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">D</div>
          {categories.right && (
            <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
              {categories.right}
            </div>
          )}
          <div className="text-sm md:text-lg">اضغط "D"</div>
        </div>
      </div>

      <div className="text-center space-y-4 md:space-y-8">
        {trial.isImage ? (
          <div className="flex justify-center">
            <img src={trial.stimulus} alt="Attribute" className="h-16 w-16 md:h-24 md:w-24" />
          </div>
        ) : (
          <div className="text-2xl md:text-4xl font-bold">{trial.stimulus}</div>
        )}
        {showFeedback && !isCorrect && (
          <div className="text-red-500 text-4xl md:text-6xl font-bold">X</div>
        )}
      </div>
    </div>
  );
};
