
import React from "react";
import type { Trial } from "./IATTypes";

interface IATTrialProps {
  trial: Trial;
  showFeedback: boolean;
  isCorrect: boolean;
}

export const IATTrial: React.FC<IATTrialProps> = ({ trial, showFeedback, isCorrect }) => {
  // Get simplified categories based on the trial's category
  const getTrialCategories = () => {
    const isPositiveNegativeOnly = trial.block === 2 || trial.block === 5;
    
    if (isPositiveNegativeOnly) {
      // For blocks that only show positive/negative
      return {
        left: trial.block === 2 ? "إيجابي" : "سلبي",
        right: trial.block === 2 ? "سلبي" : "إيجابي"
      };
    } else if (trial.block >= 3) {
      // For combined blocks
      const isPosNegReversed = trial.block >= 5;
      
      if (!isPosNegReversed) {
        return {
          left: "تواصل طبيعي\nأو\nإيجابي",
          right: "اضطراب تواصل\nأو\nسلبي"
        };
      } else {
        return {
          left: "تواصل طبيعي\nأو\nسلبي",
          right: "اضطراب تواصل\nأو\nإيجابي"
        };
      }
    } else {
      // Block 1 - simple categories
      return {
        left: "تواصل طبيعي",
        right: "اضطراب تواصل"
      };
    }
  };

  // Sample attributes to show under each category
  const positiveAttributes = ["إيجابي", "ممتاز", "نجاح"];
  const negativeAttributes = ["سلبي", "حزين", "ضعيف"];

  const categories = getTrialCategories();
  const isBlock2 = trial.block === 2;
  const isBlock5 = trial.block === 5;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white shadow-md">
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
        {/* Left Category */}
        <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold mb-3 bg-green-50 p-2 rounded-full w-14 h-14 flex items-center justify-center">
            K
          </div>
          <div className="text-green-600 text-xl font-medium mb-4">
            {categories.left}
          </div>
          
          {/* Show attributes for positive/negative categories */}
          {((isBlock2 && categories.left === "إيجابي") || (isBlock5 && categories.left === "سلبي")) && (
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              {(isBlock2 ? positiveAttributes : negativeAttributes).map((attr, idx) => (
                <div key={idx} className="bg-white p-2 rounded-md shadow-sm">
                  <span className="text-sm font-medium">{attr}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-blue-600 bg-blue-50 py-1 px-3 rounded-full font-medium mt-auto">
            اضغط "K"
          </div>
        </div>
        
        {/* Right Category */}
        <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold mb-3 bg-green-50 p-2 rounded-full w-14 h-14 flex items-center justify-center">
            D
          </div>
          <div className="text-green-600 text-xl font-medium mb-4">
            {categories.right}
          </div>
          
          {/* Show attributes for positive/negative categories */}
          {((isBlock2 && categories.right === "سلبي") || (isBlock5 && categories.right === "إيجابي")) && (
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              {(isBlock2 ? negativeAttributes : positiveAttributes).map((attr, idx) => (
                <div key={idx} className="bg-white p-2 rounded-md shadow-sm">
                  <span className="text-sm font-medium">{attr}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-blue-600 bg-blue-50 py-1 px-3 rounded-full font-medium mt-auto">
            اضغط "D"
          </div>
        </div>
      </div>

      {/* Stimulus Area */}
      <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
        <div className="text-3xl md:text-4xl font-bold p-4 bg-white rounded-lg shadow-sm">
          {trial.stimulus}
        </div>
        
        {showFeedback && !isCorrect && (
          <div className="text-red-500 text-4xl md:text-6xl font-bold mt-4">X</div>
        )}
      </div>
    </div>
  );
};
