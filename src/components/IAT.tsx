import React, { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { IATInstructions } from "./iat/IATInstructions";
import { IATTrial } from "./iat/IATTrial";
import { calculateDScore } from "./iat/IATScoring";
import { IATProps, Trial, BLOCKS } from "./iat/IATTypes";

export const IAT: React.FC<IATProps> = ({ onComplete, surveyData }) => {
  const { toast } = useToast();
  const [currentBlock, setCurrentBlock] = useState(1);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<{ block: number; responseTime: number; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [testOrder] = useState<"standard" | "reversed">(
    Math.random() < 0.5 ? "standard" : "reversed"
  );

  const generateTrials = useCallback((block: number): Trial[] => {
    let newTrials: Trial[] = [];
    switch (block) {
      case 1:
      case 4:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: "d" as const,
            block: block
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: "k" as const,
            block: block
          }))
        ];
        break;
      case 2:
      case 5:
        newTrials = [
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: "d" as const,
            block: block
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: "k" as const,
            block: block
          }))
        ];
        break;
      case 3:
      case 6:
      case 7:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: block === 7 ? "k" as const : "d" as const,
            block: block
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: block === 7 ? "d" as const : "k" as const,
            block: block
          })),
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: block === 7 ? "k" as const : "d" as const,
            block: block
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: block === 7 ? "d" as const : "k" as const,
            block: block
          }))
        ];
        break;
    }
    return newTrials.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    setTrials(generateTrials(currentBlock));
    setCurrentTrial(0);
  }, [currentBlock, generateTrials]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isTestStarted || !startTime || showFeedback) return;

    const responseTime = (Date.now() - startTime) / 1000;
    const currentStimulus = trials[currentTrial];

    if (e.key.toLowerCase() === "d" || e.key.toLowerCase() === "k") {
      const correct = e.key.toLowerCase() === currentStimulus.correctKey;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      const newResponse = {
        block: currentBlock,
        responseTime,
        correct
      };
      
      setResponses(prev => [...prev, newResponse]);

      setTimeout(() => {
        setShowFeedback(false);
        if (correct) {
          if (currentTrial + 1 >= trials.length) {
            if (currentBlock < 7) {
              setCurrentBlock(currentBlock + 1);
            } else {
              const dScore = calculateDScore(responses);
              saveResults(dScore);
              onComplete(dScore);
            }
          } else {
            setCurrentTrial(currentTrial + 1);
          }
        }
      }, 500);
    }
  }, [currentTrial, trials, startTime, showFeedback, responses, currentBlock, onComplete, isTestStarted]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!showFeedback && isTestStarted) {
      setStartTime(Date.now());
    }
  }, [currentTrial, showFeedback, isTestStarted]);

  const saveResults = async (dScore: number) => {
    if (surveyData.hasTakenIATBefore) {
      toast({
        title: "اكتمل الاختبار",
        description: "بما أنك قمت بالاختبار مسبقاً، لن يتم حفظ نتائجك في قاعدة البيانات.",
      });
      onComplete(dScore);
      return;
    }

    try {
      const { error } = await supabase
        .from('iat_results')
        .insert([
          {
            d_score: dScore,
            age: surveyData.age,
            years_experience: surveyData.yearsExperience,
            degree: surveyData.degree,
            survey_responses: surveyData.biasAwarenessResponses,
            response_times: responses.map(r => r.responseTime),
            responses: responses
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "تم حفظ النتائج بنجاح",
        description: "تم تسجيل إجاباتك في قاعدة البيانات",
      });
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "خطأ في حفظ النتائج",
        description: "حدث خطأ أثناء حفظ النتائج، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
    onComplete(dScore);
  };

  const startTest = () => {
    setIsTestStarted(true);
    setStartTime(Date.now());
  };

  if (!trials.length) return null;

  return (
    <Card className="w-full max-w-2xl p-8 mx-auto mt-8 animate-fadeIn">
      <div className="text-center space-y-6">
        <IATInstructions block={currentBlock} />
        
        {!isTestStarted ? (
          <div className="space-y-4">
            <p className="text-lg">اضغط الزر أدناه لبدء الاختبار</p>
            <Button onClick={startTest}>ابدأ</Button>
          </div>
        ) : (
          <IATTrial 
            trial={trials[currentTrial]} 
            showFeedback={showFeedback} 
            isCorrect={isCorrect} 
          />
        )}
      </div>
    </Card>
  );
};
