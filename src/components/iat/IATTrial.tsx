
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
          left: "",
          right: ""
        };
      case 3:
      case 4:
        return {
          left: "تواصل طبيعي\nأو\n",
          right: "اضطراب تواصل\nأو\n"
        };
      case 5:
        return {
          left: "",
          right: ""
        };
      case 6:
      case 7:
        return {
          left: "تواصل طبيعي\nأو\n",
          right: "اضطراب تواصل\nأو\n"
        };
      default:
        return {
          left: "",
          right: ""
        };
    }
  };

  // Determine if block displays positive/negative attributes
  const hasPositiveAttributesLeft = (trial.block === 2) || (trial.block === 3) || (trial.block === 4);
  const hasPositiveAttributesRight = (trial.block === 5) || (trial.block === 6) || (trial.block === 7);
  const hasNegativeAttributesLeft = (trial.block === 5) || (trial.block === 6) || (trial.block === 7);
  const hasNegativeAttributesRight = (trial.block === 2) || (trial.block === 3) || (trial.block === 4);

  const categories = getTrialCategories(trial);

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-8 bg-white">
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="text-center flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">K</div>
          {categories.left && <div className="whitespace-pre-line text-xl text-green-600 mb-2">{categories.left}</div>}
          {hasPositiveAttributesLeft && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <img src="/lovable-uploads/9b147b57-aafb-4241-94ff-3a9c352503b0.png" alt="A+ student" className="h-8 w-8" />
              <img src="/lovable-uploads/1fae69a3-a257-4e39-9d7e-92e71d89316b.png" alt="Graduate" className="h-8 w-8" />
              <img src="/lovable-uploads/f12e4381-84c6-45f6-8cde-62d1721d3509.png" alt="Business person" className="h-8 w-8" />
              <img src="/lovable-uploads/c0bdba02-284f-47d1-a891-9edbf0a2af61.png" alt="Friends group" className="h-8 w-8" />
              <img src="/lovable-uploads/dfc82370-e222-4fd8-9fd4-702c4d7ec161.png" alt="Weight lifter" className="h-8 w-8" />
            </div>
          )}
          {hasNegativeAttributesLeft && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <img src="/lovable-uploads/30bf4690-6613-4357-8236-b485afbf6cf9.png" alt="Frustrated person" className="h-8 w-8" />
              <img src="/lovable-uploads/3d4fef15-cf7d-40d1-8a29-7d4cfbde6b31.png" alt="Sad person" className="h-8 w-8" />
              <img src="/lovable-uploads/ebd1f283-efcd-4a89-8d86-c7c08dbb8edc.png" alt="Tired worker" className="h-8 w-8" />
              <img src="/lovable-uploads/9ff773ad-fd12-4ff4-acd5-6817aeb3a60d.png" alt="Bullying" className="h-8 w-8" />
              <img src="/lovable-uploads/93575d6b-370c-40dc-aae0-0709a7f52560.png" alt="Pointing blame" className="h-8 w-8" />
            </div>
          )}
          <div className="text-lg">اضغط "K"</div>
        </div>
        <div className="text-center flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">D</div>
          {categories.right && <div className="whitespace-pre-line text-xl text-green-600 mb-2">{categories.right}</div>}
          {hasPositiveAttributesRight && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <img src="/lovable-uploads/9b147b57-aafb-4241-94ff-3a9c352503b0.png" alt="A+ student" className="h-8 w-8" />
              <img src="/lovable-uploads/1fae69a3-a257-4e39-9d7e-92e71d89316b.png" alt="Graduate" className="h-8 w-8" />
              <img src="/lovable-uploads/f12e4381-84c6-45f6-8cde-62d1721d3509.png" alt="Business person" className="h-8 w-8" />
              <img src="/lovable-uploads/c0bdba02-284f-47d1-a891-9edbf0a2af61.png" alt="Friends group" className="h-8 w-8" />
              <img src="/lovable-uploads/dfc82370-e222-4fd8-9fd4-702c4d7ec161.png" alt="Weight lifter" className="h-8 w-8" />
            </div>
          )}
          {hasNegativeAttributesRight && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <img src="/lovable-uploads/30bf4690-6613-4357-8236-b485afbf6cf9.png" alt="Frustrated person" className="h-8 w-8" />
              <img src="/lovable-uploads/3d4fef15-cf7d-40d1-8a29-7d4cfbde6b31.png" alt="Sad person" className="h-8 w-8" />
              <img src="/lovable-uploads/ebd1f283-efcd-4a89-8d86-c7c08dbb8edc.png" alt="Tired worker" className="h-8 w-8" />
              <img src="/lovable-uploads/9ff773ad-fd12-4ff4-acd5-6817aeb3a60d.png" alt="Bullying" className="h-8 w-8" />
              <img src="/lovable-uploads/93575d6b-370c-40dc-aae0-0709a7f52560.png" alt="Pointing blame" className="h-8 w-8" />
            </div>
          )}
          <div className="text-lg">اضغط "D"</div>
        </div>
      </div>

      <div className="text-center space-y-8">
        {trial.isImage ? (
          <div className="flex justify-center">
            <img src={trial.stimulus} alt="Attribute" className="h-24 w-24" />
          </div>
        ) : (
          <div className="text-4xl font-bold">{trial.stimulus}</div>
        )}
        {showFeedback && !isCorrect && (
          <div className="text-red-500 text-6xl font-bold">X</div>
        )}
      </div>
    </div>
  );
};
