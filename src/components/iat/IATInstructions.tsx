
import React from "react";
import { Button } from "../ui/button";
import { CategoryCard } from "./CategoryCard";
import { RemindersSection } from "./RemindersSection";
import { IATInstructionsProps } from "./types/instructionTypes";
import { getInstructionsForBlock, arabicNumerals } from "./utils/instructionsContent";

export const IATInstructions: React.FC<IATInstructionsProps> = ({ 
  block, 
  onStart,
  testModel = "A"
}) => {
  // Get the effective block number based on test model (for content display)
  const effectiveBlock = testModel === "B" && block >= 2 && block <= 7 
    ? block <= 4 ? block + 3 : block - 3 
    : block;
  
  // For display purposes, we always show the sequential block number (1-7)
  // regardless of the test model or effective block
  const displayBlockNumber = block;
  
  console.log(`Block ${block}, effective block ${effectiveBlock} for model ${testModel}, displaying as block ${displayBlockNumber}`);

  // Get instructions based on the effective block (which content to show)
  const instructions = getInstructionsForBlock(effectiveBlock);
  
  // Replace the number in the title with the sequential block number (display block)
  // This ensures we always show 1-7 in order regardless of the test model
  const displayTitle = `${arabicNumerals[displayBlockNumber-1]} من اصل ٧`;

  return (
    <div className="p-4 md:p-6 text-center space-y-4 max-w-3xl mx-auto animate-slideUpFade">
      <h2 className="text-xl md:text-2xl font-bold">{displayTitle}</h2>
      
      {instructions.description && (
        <div className="bg-amber-50 border border-amber-200 p-3 md:p-4 rounded-lg">
          <p className="text-amber-800 whitespace-pre-line">{instructions.description}</p>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4 md:mb-6 shadow-sm">
        <h3 className="text-lg md:text-xl font-bold mb-4">التصنيفات:</h3>
        <div className="grid grid-cols-2 gap-6">
          <CategoryCard 
            keyLetter="K"
            categoryLabel={instructions.leftKey}
            keyLabel="K"
            showPositiveImages={instructions.showPositiveAttributes}
            showNegativeImages={instructions.showNegativeAttributes}
          />
          
          <CategoryCard 
            keyLetter="D"
            categoryLabel={instructions.rightKey}
            keyLabel="D"
            showPositiveImages={instructions.showPositiveAttributes}
            showNegativeImages={instructions.showNegativeAttributes}
          />
        </div>
      </div>

      {instructions.reminder && (
        <RemindersSection reminders={instructions.reminder} />
      )}

      <Button onClick={onStart} size="lg">بدء المرحلة</Button>
    </div>
  );
};
