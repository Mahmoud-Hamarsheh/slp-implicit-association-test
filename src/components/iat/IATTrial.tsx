
import React from "react";
import type { Trial } from "./IATTypes";

interface IATTrialProps {
  trial: Trial;
  showFeedback: boolean;
  isCorrect: boolean;
}

export const IATTrial: React.FC<IATTrialProps> = ({ trial, showFeedback, isCorrect }) => {
  const getTrialCategories = (trial: Trial) => {
    // Use the effective block (which accounts for test model) to determine categories
    const effectiveBlock = trial.effectiveBlock || trial.block;

    switch (effectiveBlock) {
      case 1:
        return {
          left: "تواصل طبيعي",
          right: "اضطراب تواصل",
          showLeftAttributes: false,
          showRightAttributes: false,
          leftAttributeType: "",
          rightAttributeType: ""
        };
      case 2:
        return {
          left: "إيجابي",
          right: "سلبي",
          showLeftAttributes: true,
          showRightAttributes: true,
          leftAttributeType: "positive",
          rightAttributeType: "negative"
        };
      case 3:
      case 4:
        return {
          left: "تواصل طبيعي\nأو\nإيجابي",
          right: "اضطراب تواصل\nأو\nسلبي",
          showLeftAttributes: true,
          showRightAttributes: true,
          leftAttributeType: "positive",
          rightAttributeType: "negative"
        };
      case 5:
        return {
          left: "سلبي",
          right: "إيجابي",
          showLeftAttributes: true,
          showRightAttributes: true,
          leftAttributeType: "negative",
          rightAttributeType: "positive"
        };
      case 6:
      case 7:
        return {
          left: "تواصل طبيعي\nأو\nسلبي",
          right: "اضطراب تواصل\nأو\nإيجابي",
          showLeftAttributes: true,
          showRightAttributes: true,
          leftAttributeType: "negative",
          rightAttributeType: "positive"
        };
      default:
        return {
          left: "",
          right: "",
          showLeftAttributes: false,
          showRightAttributes: false,
          leftAttributeType: "",
          rightAttributeType: ""
        };
    }
  };

  // Sample text for each category
  const positiveAttributes = [
    "إيجابي", 
    "ممتاز", 
    "نجاح"
  ];

  const negativeAttributes = [
    "حزين", 
    "سلبي", 
    "ضعيف"
  ];

  const categories = getTrialCategories(trial);

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-4 md:p-8 bg-white shadow-md">
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
        <div className="text-center flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="text-3xl md:text-4xl font-bold mb-3 bg-green-50 p-2 rounded-full w-14 h-14 flex items-center justify-center">K</div>
          {categories.left && (
            <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-3 font-medium">
              {categories.left}
            </div>
          )}
          {categories.showLeftAttributes && (
            <div className="grid grid-cols-2 gap-2 mb-3 w-full">
              {categories.leftAttributeType === "positive" && 
                positiveAttributes.map((text, index) => (
                  <div key={`left-pos-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))
              }
              {categories.leftAttributeType === "negative" && 
                negativeAttributes.map((text, index) => (
                  <div key={`left-neg-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))
              }
            </div>
          )}
          <div className="text-sm md:text-lg bg-blue-50 py-1 px-3 rounded-full text-blue-600 font-medium">اضغط "K"</div>
        </div>
        
        <div className="text-center flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="text-3xl md:text-4xl font-bold mb-3 bg-green-50 p-2 rounded-full w-14 h-14 flex items-center justify-center">D</div>
          {categories.right && (
            <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-3 font-medium">
              {categories.right}
            </div>
          )}
          {categories.showRightAttributes && (
            <div className="grid grid-cols-2 gap-2 mb-3 w-full">
              {categories.rightAttributeType === "positive" && 
                positiveAttributes.map((text, index) => (
                  <div key={`right-pos-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))
              }
              {categories.rightAttributeType === "negative" && 
                negativeAttributes.map((text, index) => (
                  <div key={`right-neg-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))
              }
            </div>
          )}
          <div className="text-sm md:text-lg bg-blue-50 py-1 px-3 rounded-full text-blue-600 font-medium">اضغط "D"</div>
        </div>
      </div>

      <div className="text-center space-y-4 md:space-y-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        {/* استبدلنا الصورة بعرض نصي للمحفز */}
        <div className="text-2xl md:text-4xl font-bold p-4 bg-white rounded-lg shadow-sm">{trial.stimulus}</div>
        {showFeedback && !isCorrect && (
          <div className="text-red-500 text-4xl md:text-6xl font-bold">X</div>
        )}
      </div>
    </div>
  );
};
