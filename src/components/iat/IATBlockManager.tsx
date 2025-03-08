
import React from "react";
import { IATInstructions } from "./IATInstructions";
import { IATTrialRunner } from "./IATTrialRunner";
import { IATProps } from "./IATTypes";
import { BlockChangeAlert } from "./BlockChangeAlert";
import { useIATTest } from "./hooks/useIATTest";

interface IATBlockManagerProps {
  onComplete: (result: number) => void;
  surveyData: IATProps["surveyData"];
  toast: (props: { 
    title: string; 
    description: string; 
    variant?: "default" | "destructive" 
  }) => void;
}

export const IATBlockManager: React.FC<IATBlockManagerProps> = ({ 
  onComplete, 
  surveyData,
  toast 
}) => {
  const { 
    currentBlock,
    trials,
    currentTrial,
    responses,
    showInstructions,
    isBlockStarted,
    showCategoryChangeAlert,
    setShowCategoryChangeAlert,
    handleTrialComplete,
    handleStartBlock,
    handleCloseAlert
  } = useIATTest((result) => {
    // When test is complete, just pass the result to parent component
    // No saving to database here
    onComplete(result);
  });

  if (!trials.length) return null;

  return (
    <div className="text-center space-y-6">
      {showInstructions ? (
        <IATInstructions 
          block={currentBlock} 
          onStart={handleStartBlock}
        />
      ) : (
        <IATTrialRunner 
          trial={trials[currentTrial]} 
          isBlockStarted={isBlockStarted}
          onTrialComplete={handleTrialComplete}
        />
      )}
      
      <BlockChangeAlert
        open={showCategoryChangeAlert}
        onOpenChange={setShowCategoryChangeAlert}
        onClose={handleCloseAlert}
      />
    </div>
  );
};
