
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
          showLeftImages: false,
          showRightImages: false,
          leftImageType: "",
          rightImageType: ""
        };
      case 2:
        return {
          left: "إيجابي",
          right: "سلبي",
          showLeftImages: true,
          showRightImages: true,
          leftImageType: "positive",
          rightImageType: "negative"
        };
      case 3:
      case 4:
        return {
          left: "تواصل طبيعي\nأو\nإيجابي",
          right: "اضطراب تواصل\nأو\nسلبي",
          showLeftImages: true,
          showRightImages: true,
          leftImageType: "positive",
          rightImageType: "negative"
        };
      case 5:
        return {
          left: "سلبي",
          right: "إيجابي",
          showLeftImages: true,
          showRightImages: true,
          leftImageType: "negative",
          rightImageType: "positive"
        };
      case 6:
      case 7:
        return {
          left: "تواصل طبيعي\nأو\nسلبي",
          right: "اضطراب تواصل\nأو\nإيجابي",
          showLeftImages: true,
          showRightImages: true,
          leftImageType: "negative",
          rightImageType: "positive"
        };
      default:
        return {
          left: "",
          right: "",
          showLeftImages: false,
          showRightImages: false,
          leftImageType: "",
          rightImageType: ""
        };
    }
  };

  // Sample images for each category
  const positiveImages = [
    "/lovable-uploads/4ee1dd40-8b8f-434f-8e90-709c1f2a4812.png", // Thumbs up
    "/lovable-uploads/013b45f6-a99e-48fe-98fc-74537c635a43.png", // Trophy
    "/lovable-uploads/4e511310-63b0-4dc6-97c6-08f559b7f288.png", // Superhero
  ];

  const negativeImages = [
    "/lovable-uploads/4d29ef76-64fb-4508-8d76-2b27461fd844.png", // crying person
    "/lovable-uploads/a3279a90-96f3-4e35-aff6-00a3f84b6355.png", // thumbs down
    "/lovable-uploads/7b1dc96e-d083-46e9-be18-1d7a21122d40.png", // sad person
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
          {categories.showLeftImages && (
            <div className="grid grid-cols-2 gap-2 mb-3 w-full">
              {categories.leftImageType === "positive" && 
                positiveImages.map((src, index) => (
                  <div key={`left-pos-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <img src={src} alt="إيجابي" className="w-12 h-12 object-contain mx-auto" />
                  </div>
                ))
              }
              {categories.leftImageType === "negative" && 
                negativeImages.map((src, index) => (
                  <div key={`left-neg-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <img src={src} alt="سلبي" className="w-12 h-12 object-contain mx-auto" />
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
          {categories.showRightImages && (
            <div className="grid grid-cols-2 gap-2 mb-3 w-full">
              {categories.rightImageType === "positive" && 
                positiveImages.map((src, index) => (
                  <div key={`right-pos-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <img src={src} alt="إيجابي" className="w-12 h-12 object-contain mx-auto" />
                  </div>
                ))
              }
              {categories.rightImageType === "negative" && 
                negativeImages.map((src, index) => (
                  <div key={`right-neg-${index}`} className="bg-white p-2 rounded-md shadow-sm">
                    <img src={src} alt="سلبي" className="w-12 h-12 object-contain mx-auto" />
                  </div>
                ))
              }
            </div>
          )}
          <div className="text-sm md:text-lg bg-blue-50 py-1 px-3 rounded-full text-blue-600 font-medium">اضغط "D"</div>
        </div>
      </div>

      <div className="text-center space-y-4 md:space-y-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        {trial.isImage ? (
          <div className="flex justify-center">
            <img src={trial.stimulus} alt="Attribute" className="h-24 w-24 md:h-32 md:w-32 p-2 bg-white rounded-lg shadow-sm" />
          </div>
        ) : (
          <div className="text-2xl md:text-4xl font-bold p-4 bg-white rounded-lg shadow-sm">{trial.stimulus}</div>
        )}
        {showFeedback && !isCorrect && (
          <div className="text-red-500 text-4xl md:text-6xl font-bold">X</div>
        )}
      </div>
    </div>
  );
};
