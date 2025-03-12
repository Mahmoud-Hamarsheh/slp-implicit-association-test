
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

  // إعادة تعيين startTime عندما يتغير trial أو عندما تبدأ المرحلة
  useEffect(() => {
    if (isBlockStarted && !showFeedback) {
      setStartTime(Date.now());
      console.log("Trial started, waiting for keypress...");
    }
  }, [trial, isBlockStarted, showFeedback]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    console.log(`Key pressed: ${e.key}, isBlockStarted: ${isBlockStarted}, startTime: ${startTime}, showFeedback: ${showFeedback}`);
    
    if (!isBlockStarted || startTime === 0 || showFeedback) return;

    const responseTime = (Date.now() - startTime) / 1000;
    console.log(`Response time: ${responseTime.toFixed(3)}s`);

    if (e.key.toLowerCase() === "d" || e.key.toLowerCase() === "k") {
      const correct = e.key.toLowerCase() === trial.correctKey;
      console.log(`Response: ${e.key}, Correct: ${correct}`);
      
      setIsCorrect(correct);
      setShowFeedback(true);
      
      const newResponse = {
        block: trial.block,
        responseTime,
        correct
      };
      
      setTimeout(() => {
        setShowFeedback(false);
        onTrialComplete(newResponse);
      }, 500);
    }
  }, [trial, startTime, showFeedback, isBlockStarted, onTrialComplete]);

  useEffect(() => {
    console.log(`Adding keydown event listener for trial: ${trial.stimulus}`);
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      console.log("Removing keydown event listener");
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <IATTrial 
      trial={trial} 
      showFeedback={showFeedback} 
      isCorrect={isCorrect} 
    />
  );
};
