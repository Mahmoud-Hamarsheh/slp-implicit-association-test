
import React from "react";

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
}) => {
  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
      <div className="text-xl md:text-2xl font-bold mb-3 bg-green-50 p-2 rounded-md">{keyLetter}</div>
      <div className="text-green-600 whitespace-pre-line font-medium mb-3">{categoryLabel}</div>
      
      <p className="mt-2 bg-blue-50 py-1 px-2 rounded-full text-blue-600 font-medium inline-block">
        اضغط "{keyLetter}"
      </p>
    </div>
  );
};
