
import React from "react";
import type { Trial } from "./IATTypes";

interface IATTrialProps {
  trial: Trial;
  showFeedback: boolean;
  isCorrect: boolean;
}

export const IATTrial: React.FC<IATTrialProps> = ({ trial, showFeedback, isCorrect }) => {
  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-8 bg-white">
      <div className="grid grid-cols-2 text-center mb-12 text-green-600 font-semibold">
        <div className="border-r border-gray-200 p-4">
          <div className="text-sm mb-2">اضغط (D) للـ</div>
          <div className="text-lg">{trial.correctKey === "d" ? trial.category : "الفئة الأخرى"}</div>
        </div>
        <div className="p-4">
          <div className="text-sm mb-2">اضغط (K) للـ</div>
          <div className="text-lg">{trial.correctKey === "k" ? trial.category : "الفئة الأخرى"}</div>
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
