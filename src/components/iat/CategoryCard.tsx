
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
  showPositiveImages,
  showNegativeImages,
}) => {
  // Positive images paths
  const positiveImages = [
    "/lovable-uploads/e0f17a2e-ca2c-4d1e-9dff-f0da63a01bdd.png", // Combined image with all icons
  ];

  // Negative images paths
  const negativeImages = [
    "/lovable-uploads/e0f17a2e-ca2c-4d1e-9dff-f0da63a01bdd.png", // Combined image with all icons
  ];

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
      <div className="text-xl md:text-2xl font-bold mb-3 bg-green-50 p-2 rounded-md">{keyLetter}</div>
      <div className="text-green-600 whitespace-pre-line font-medium mb-3">{categoryLabel}</div>
      
      {/* Render positive images if showPositiveImages is true */}
      {showPositiveImages && categoryLabel.includes("إيجابي") && (
        <div className="mt-2">
          <h3 className="font-bold text-lg mb-2">إيجابي</h3>
          <div className="relative w-full h-32 md:h-40">
            <img 
              src={positiveImages[0]} 
              alt="صور إيجابية" 
              className="object-contain w-full h-full"
              style={{ 
                objectPosition: "100% 0", // Focus on the right side (positive images)
                clipPath: "inset(0 0 0 50%)" // Crop to show only right half
              }}
            />
          </div>
        </div>
      )}
      
      {/* Render negative images if showNegativeImages is true */}
      {showNegativeImages && categoryLabel.includes("سلبي") && (
        <div className="mt-2">
          <h3 className="font-bold text-lg mb-2">سلبي</h3>
          <div className="relative w-full h-32 md:h-40">
            <img 
              src={negativeImages[0]} 
              alt="صور سلبية" 
              className="object-contain w-full h-full"
              style={{ 
                objectPosition: "0% 0", // Focus on the left side (negative images)
                clipPath: "inset(0 50% 0 0)" // Crop to show only left half
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
