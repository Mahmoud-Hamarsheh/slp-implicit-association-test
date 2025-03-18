
import { useState, useEffect } from "react";
import { Trial, Response } from "../IATTypes";
import { TrialGenerator } from "../TrialGenerator";
import { calculateDScore } from "../IATScoring";

export const useIATTest = (onComplete: (result: number, allResponses: Response[], model: "A" | "B") => void, testModel: "A" | "B" = "A") => {
  const [currentBlock, setCurrentBlock] = useState(1);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isBlockStarted, setIsBlockStarted] = useState(false);
  const [showCategoryChangeAlert, setShowCategoryChangeAlert] = useState(false);

  // Generate trials for the current block
  useEffect(() => {
    const generatedTrials = TrialGenerator.generateTrialsForBlock(currentBlock, testModel);
    const expectedTrials = currentBlock === 4 || currentBlock === 7 ? 40 : 20;
    console.log(`Generated ${generatedTrials.length}/${expectedTrials} trials for block ${currentBlock} (Model ${testModel})`);
    
    setTrials(generatedTrials);
    setCurrentTrial(0);
    setShowInstructions(true);
    setIsBlockStarted(false);
    
    // Show category change alert at the appropriate sequential block 
    // Regardless of test model, we show the alert when switching 
    // to blocks that require category changes
    if (currentBlock === 5) {
      setShowCategoryChangeAlert(true);
    }
  }, [currentBlock, testModel]);

  const handleTrialComplete = (response: Response) => {
    // Add response to the list
    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);
    console.log(`Completed trial ${currentTrial + 1}/${trials.length} in block ${response.block}, correct: ${response.correct}, time: ${response.responseTime.toFixed(3)}s`);

    // Move to next trial or block regardless of correctness
    if (currentTrial + 1 >= trials.length) {
      if (currentBlock < 7) {
        console.log(`Completed block ${currentBlock}, moving to block ${currentBlock + 1}`);
        setCurrentBlock(currentBlock + 1);
      } else {
        console.log("All blocks completed, calculating D-score");
        // Always get a valid D-score (never null)
        const dScore = calculateDScore(updatedResponses) || 0;
        console.log(`Final D-score: ${dScore.toFixed(3)}`);
        
        // Send the score, all responses, and test model to the parent component
        onComplete(dScore, updatedResponses, testModel);
      }
    } else {
      setCurrentTrial(currentTrial + 1);
    }
  };

  const handleStartBlock = () => {
    setShowInstructions(false);
    setIsBlockStarted(true);
  };

  const handleCloseAlert = () => {
    setShowCategoryChangeAlert(false);
    setIsBlockStarted(true);
  };

  return {
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
    testModel
  };
};
