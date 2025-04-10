
import React, { useState, useEffect, useCallback } from "react";
import { IATTrial } from "./IATTrial";
import { Trial, Response } from "./IATTypes";
import { useIsMobile, useIsTouchDevice } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  const isTouchDevice = isMobile || isTouch;

  // Set start time when trial begins
  useEffect(() => {
    if (isBlockStarted && !showFeedback) {
      setStartTime(Date.now());
      console.log("Trial started: ", trial.stimulus);
    }
  }, [trial, showFeedback, isBlockStarted]);

  const processResponse = useCallback((key: string) => {
    if (!isBlockStarted || !startTime || showFeedback) return;

    const responseTime = (Date.now() - startTime) / 1000;
    console.log(`Response received: ${key}, for stimulus: ${trial.stimulus}`);

    const correct = key.toLowerCase() === trial.correctKey;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    const newResponse = {
      block: trial.block,
      responseTime,
      correct
    };
    
    // Only move to the next trial if the answer is correct
    if (correct) {
      setTimeout(() => {
        setShowFeedback(false);
        onTrialComplete(newResponse);
      }, 500); // Correct answers proceed after 500ms
    } else {
      // For incorrect answers, just show feedback and reset to try again
      setTimeout(() => {
        setShowFeedback(false);
        // Reset the start time so they can try again
        setStartTime(Date.now());
      }, 1000); // Give slightly more time (1000ms) to see error feedback
    }
  }, [trial, startTime, showFeedback, isBlockStarted, onTrialComplete]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isTouchDevice) return; // Skip key handling on touch devices
    
    if (e.key.toLowerCase() === "d" || e.key.toLowerCase() === "k") {
      processResponse(e.key.toLowerCase());
    }
  }, [processResponse, isTouchDevice]);

  const handleTouchLeft = useCallback(() => {
    if (!isTouchDevice) return;
    processResponse("k"); // Left side corresponds to K key
  }, [processResponse, isTouchDevice]);

  const handleTouchRight = useCallback(() => {
    if (!isTouchDevice) return;
    processResponse("d"); // Right side corresponds to D key
  }, [processResponse, isTouchDevice]);

  useEffect(() => {
    if (!isTouchDevice) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [handleKeyPress, isTouchDevice]);

  return (
    <IATTrial 
      trial={trial} 
      showFeedback={showFeedback} 
      isCorrect={isCorrect}
      onTouchLeft={handleTouchLeft}
      onTouchRight={handleTouchRight}
    />
  );
};
