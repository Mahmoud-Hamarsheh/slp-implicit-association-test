
import React from "react";
import { IATProps } from "./IATTypes";
import { useIATTest } from "./hooks/useIATTest";
import { BlockManagerView } from "./block/BlockManagerView";

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
    handleCloseAlert,
    testModel: assignedTestModel
  } = useIATTest((result, allResponses, model) => {
    // When test is complete, pass the result, all responses, and test model to parent component
    onComplete(result, allResponses, model);
  }, testModel);

  return (
    <BlockManagerView
      currentBlock={currentBlock}
      trials={trials}
      currentTrial={currentTrial}
      showInstructions={showInstructions}
      isBlockStarted={isBlockStarted}
      showCategoryChangeAlert={showCategoryChangeAlert}
      setShowCategoryChangeAlert={setShowCategoryChangeAlert}
      handleTrialComplete={handleTrialComplete}
      handleStartBlock={handleStartBlock}
      handleCloseAlert={handleCloseAlert}
      testModel={testModel}
    />
  );
};
