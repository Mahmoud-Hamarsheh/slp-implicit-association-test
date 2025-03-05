
import { useState, useEffect } from "react";
import { Trial, Response } from "../IATTypes";
import { TrialGenerator } from "../TrialGenerator";
import { calculateDScore } from "../IATScoring";

export const useIATTest = (onComplete: (result: number) => void) => {
  const [currentBlock, setCurrentBlock] = useState(1);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isBlockStarted, setIsBlockStarted] = useState(false);
  const [showCategoryChangeAlert, setShowCategoryChangeAlert] = useState(false);

  // Generate trials for the current block
  useEffect(() => {
    setTrials(TrialGenerator.generateTrialsForBlock(currentBlock));
    setCurrentTrial(0);
    setShowInstructions(true);
    setIsBlockStarted(false);
    
    // Show category change alert when moving from block 4 to block 5
    if (currentBlock === 5) {
      setShowCategoryChangeAlert(true);
    }
  }, [currentBlock]);

  const handleTrialComplete = (response: Response) => {
    // Add response to the list
    setResponses(prev => [...prev, response]);
    console.log(`Completed trial in block ${response.block}, correct: ${response.correct}, time: ${response.responseTime.toFixed(3)}s`);

    // Move to next trial or block
    if (currentTrial + 1 >= trials.length) {
      if (currentBlock < 7) {
        console.log(`Completed block ${currentBlock}, moving to block ${currentBlock + 1}`);
        setCurrentBlock(currentBlock + 1);
      } else {
        console.log("All blocks completed, calculating D-score");
        // Always get a valid D-score (never null)
        const dScore = calculateDScore([...responses, response]) || 0;
        console.log(`Final D-score: ${dScore.toFixed(3)}`);
        
        // Send the score to the parent component
        onComplete(dScore);
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
    handleCloseAlert
  };
};
