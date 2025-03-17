
import React from "react";
import { CategoryCardProps } from "./types/CategoryCardProps";
import { BLOCKS } from "./IATTypes";

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  keyLetter, 
  categoryLabel, 
  keyLabel,
  showPositiveImages = false,
  showNegativeImages = false
}) => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">{keyLetter}</div>
      {categoryLabel && (
        <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
          {categoryLabel}
        </div>
      )}
      
      {showPositiveImages && (
        <div className="flex flex-wrap justify-center gap-2 my-2">
          {BLOCKS.POSITIVE_ATTRIBUTES.slice(0, 2).map((img, index) => (
            <img 
              key={`positive-${index}`} 
              src={img} 
              alt="Positive attribute" 
              className="h-8 w-8 md:h-10 md:w-10 object-cover" 
            />
          ))}
        </div>
      )}
      
      {showNegativeImages && (
        <div className="flex flex-wrap justify-center gap-2 my-2">
          {BLOCKS.NEGATIVE_ATTRIBUTES.slice(0, 2).map((img, index) => (
            <img 
              key={`negative-${index}`} 
              src={img} 
              alt="Negative attribute" 
              className="h-8 w-8 md:h-10 md:w-10 object-cover" 
            />
          ))}
        </div>
      )}
      
      <div className="text-sm md:text-lg">{keyLabel}</div>
    </div>
  );
};
