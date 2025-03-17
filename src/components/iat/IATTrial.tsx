
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
  ];

  const negativeImages = [
    "/lovable-uploads/4d29ef76-64fb-4508-8d76-2b27461fd844.png", // crying person
    "/lovable-uploads/a3279a90-96f3-4e35-aff6-00a3f84b6355.png", // thumbs down
  ];

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
          {categories.showLeftImages && (
            <div className="flex justify-center gap-2 mb-2">
              {categories.leftImageType === "positive" && 
                positiveImages.map((src, index) => (
                  <img key={`left-pos-${index}`} src={src} alt="إيجابي" className="w-8 h-8 object-contain" />
                ))
              }
              {categories.leftImageType === "negative" && 
                negativeImages.map((src, index) => (
                  <img key={`left-neg-${index}`} src={src} alt="سلبي" className="w-8 h-8 object-contain" />
                ))
              }
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
          {categories.showRightImages && (
            <div className="flex justify-center gap-2 mb-2">
              {categories.rightImageType === "positive" && 
                positiveImages.map((src, index) => (
                  <img key={`right-pos-${index}`} src={src} alt="إيجابي" className="w-8 h-8 object-contain" />
                ))
              }
              {categories.rightImageType === "negative" && 
                negativeImages.map((src, index) => (
                  <img key={`right-neg-${index}`} src={src} alt="سلبي" className="w-8 h-8 object-contain" />
                ))
              }
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

