
import React from "react";
import { IATInstructions } from "./IATInstructions";
import { IATTrialRunner } from "./IATTrialRunner";
import { IATProps } from "./IATTypes";
import { BlockChangeAlert } from "./BlockChangeAlert";
import { useIATTest } from "./hooks/useIATTest";

interface IATBlockManagerProps {
  onComplete: (result: number, allResponses: any[], testModel: "A" | "B") => void;
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
  // If no testModel is assigned, randomly assign one
  const testModel = surveyData.testModel || (Math.random() < 0.5 ? "A" : "B");
  console.log(`Using test model: ${testModel}`);
  
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
  } = useIATTest((result, allResponses, model) => {
    // When test is complete, pass the result, all responses, and test model to parent component
    onComplete(result, allResponses, model);
  }, testModel);

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
