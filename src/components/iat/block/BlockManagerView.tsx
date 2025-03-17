
import React from "react";
import { IATInstructions } from "../IATInstructions";
import { IATTrialRunner } from "../IATTrialRunner";
import { BlockChangeAlert } from "../BlockChangeAlert";
import { Trial } from "../IATTypes";

interface BlockManagerViewProps {
  currentBlock: number;
  trials: Trial[];
  currentTrial: number;
  showInstructions: boolean;
  isBlockStarted: boolean;
  showCategoryChangeAlert: boolean;
  setShowCategoryChangeAlert: (show: boolean) => void;
  handleTrialComplete: (response: any) => void;
  handleStartBlock: () => void;
  handleCloseAlert: () => void;
  testModel: "A" | "B";
}

export const BlockManagerView: React.FC<BlockManagerViewProps> = ({
  currentBlock,
  trials,
  currentTrial,
  showInstructions,
  isBlockStarted,
  showCategoryChangeAlert,
  setShowCategoryChangeAlert,
  handleTrialComplete,
  handleStartBlock,
  handleCloseAlert,
  testModel
}) => {
  if (!trials.length) return null;

  return (
    <div className="text-center space-y-6">
      {showInstructions ? (
        <IATInstructions 
          block={currentBlock} 
          onStart={handleStartBlock}
          testModel={testModel}
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
