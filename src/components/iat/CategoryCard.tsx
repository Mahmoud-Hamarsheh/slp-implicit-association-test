
import React from "react";
import { positiveAttributes, negativeAttributes } from "./utils/instructionsContent";

interface CategoryCardProps {
  keyLabel: string;
  categoryLabel: string;
  keyLetter: "K" | "D";
  showPositiveImages?: boolean;
  showNegativeImages?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  keyLabel,
  categoryLabel,
  keyLetter,
  showPositiveImages,
  showNegativeImages,
}) => {
  // Determine which attributes to show based on the category label
  const shouldShowPositive = showPositiveImages && categoryLabel.includes("إيجابي");
  const shouldShowNegative = showNegativeImages && categoryLabel.includes("سلبي");

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
      <div className="text-xl md:text-2xl font-bold mb-3 bg-green-50 p-2 rounded-md">{keyLetter}</div>
      <div className="text-green-600 whitespace-pre-line font-medium mb-3">{categoryLabel}</div>
      
      {/* Show positive attributes as text */}
      {shouldShowPositive && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {positiveAttributes.slice(0, 4).map((text, index) => (
            <div key={`pos-${index}`} className="bg-gray-50 p-2 rounded-md">
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Show negative attributes as text */}
      {shouldShowNegative && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {negativeAttributes.slice(0, 4).map((text, index) => (
            <div key={`neg-${index}`} className="bg-gray-50 p-2 rounded-md">
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      )}
      
      <p className="mt-2 bg-blue-50 py-1 px-2 rounded-full text-blue-600 font-medium inline-block">
        اضغط "{keyLetter}"
      </p>
    </div>
  );
};
