
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface IATProps {
  onComplete: (result: number) => void;
}

interface Trial {
  stimulus: string;
  category: string;
  correctKey: "e" | "i";
}

const BLOCKS = {
  COMMUNICATION_DISORDER: ["Aphasia", "Stuttering", "Dysarthria", "Voice Disorder", "Apraxia", "Language Delay"],
  NORMAL_COMMUNICATION: ["Social", "Active", "Engaging", "Expressive", "Fluent", "Focused"],
  NEGATIVE_ATTRIBUTES: ["Incompetent", "Weak", "Insecure", "Inept", "Confused", "Slow", "Inflexible", "Uncooperative"],
  POSITIVE_ATTRIBUTES: ["Competent", "Strong", "Confident", "Intelligent", "Attentive", "Fast", "Flexible", "Cooperative"],
};

export const IAT: React.FC<IATProps> = ({ onComplete }) => {
  const [currentBlock, setCurrentBlock] = useState(1);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const generateTrials = useCallback((block: number) => {
    let newTrials: Trial[] = [];
    switch (block) {
      case 1:
        newTrials = [...BLOCKS.COMMUNICATION_DISORDER.map(item => ({
          stimulus: item,
          category: "communication_disorder",
          correctKey: "e"
        })), ...BLOCKS.NORMAL_COMMUNICATION.map(item => ({
          stimulus: item,
          category: "normal_communication",
          correctKey: "i"
        }))];
        break;
      // Add other cases for different blocks
    }
    return newTrials.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    setTrials(generateTrials(currentBlock));
    setCurrentTrial(0);
  }, [currentBlock, generateTrials]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!startTime || showFeedback) return;

    const responseTime = Date.now() - startTime;
    const currentStimulus = trials[currentTrial];

    if (e.key === "e" || e.key === "i") {
      const correct = e.key === currentStimulus.correctKey;
      setIsCorrect(correct);
      setShowFeedback(true);
      setResponses([...responses, responseTime]);

      setTimeout(() => {
        setShowFeedback(false);
        if (currentTrial + 1 >= trials.length) {
          // Block complete
          if (currentBlock < 7) {
            setCurrentBlock(currentBlock + 1);
          } else {
            // Test complete - calculate D-score
            onComplete(calculateDScore(responses));
          }
        } else {
          setCurrentTrial(currentTrial + 1);
        }
      }, 500);
    }
  }, [currentTrial, trials, startTime, showFeedback, responses, currentBlock, onComplete]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!showFeedback) {
      setStartTime(Date.now());
    }
  }, [currentTrial, showFeedback]);

  const calculateDScore = (responses: number[]) => {
    // Implement D-score calculation based on the provided formula
    return 0; // Placeholder
  };

  if (!trials.length) return null;

  return (
    <Card className="w-full max-w-2xl p-8 mx-auto mt-8 animate-fadeIn">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">Block {currentBlock} of 7</h2>
        <div className="text-4xl font-bold my-8">{trials[currentTrial]?.stimulus}</div>
        
        <div className="flex justify-between px-8 text-sm text-gray-600">
          <div>Press 'E' for {currentBlock <= 2 ? "Communication Disorder" : "Negative Attributes"}</div>
          <div>Press 'I' for {currentBlock <= 2 ? "Normal Communication" : "Positive Attributes"}</div>
        </div>

        {showFeedback && (
          <div className={`text-xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
        )}
      </div>
    </Card>
  );
};
