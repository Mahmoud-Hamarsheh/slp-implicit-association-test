
import React from "react";
import type { Trial } from "./IATTypes";

interface IATTrialProps {
  trial: Trial;
  showFeedback: boolean;
  isCorrect: boolean;
}

export const IATTrial: React.FC<IATTrialProps> = ({ trial, showFeedback, isCorrect }) => {
  return (
    <div className="space-y-6">
      <div className="text-4xl font-bold my-8">{trial.stimulus}</div>
      {showFeedback && (
        <div className={`text-xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
          {isCorrect ? "صحيح!" : "خطأ"}
        </div>
      )}
    </div>
  );
};
