
import React, { useState, useEffect, useCallback } from "react";
import { IATTrial } from "./IATTrial";
import { Trial, Response } from "./IATTypes";

interface IATTrialRunnerProps {
  trial: Trial;
  isBlockStarted: boolean;
  onTrialComplete: (response: Response) => void;
}

export const IATTrialRunner: React.FC<IATTrialRunnerProps> = ({ 
  trial, 
  isBlockStarted,
  onTrialComplete 
}) => {
  const [startTime, setStartTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Set start time when trial begins
  useEffect(() => {
    if (isBlockStarted && !showFeedback) {
      setStartTime(Date.now());
    }
  }, [trial, showFeedback, isBlockStarted]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isBlockStarted || !startTime || showFeedback) return;

    const responseTime = (Date.now() - startTime) / 1000;

    if (e.key.toLowerCase() === "d" || e.key.toLowerCase() === "k") {
      const correct = e.key.toLowerCase() === trial.correctKey;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      const newResponse = {
        block: trial.block,
        responseTime,
        correct
      };
      
      setTimeout(() => {
        setShowFeedback(false);
        if (correct) {
          onTrialComplete(newResponse);
        }
      }, 500);
    }
  }, [trial, startTime, showFeedback, isBlockStarted, onTrialComplete]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <IATTrial 
      trial={trial} 
      showFeedback={showFeedback} 
      isCorrect={isCorrect} 
    />
  );
};
