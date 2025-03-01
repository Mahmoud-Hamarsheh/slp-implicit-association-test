
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { IATInstructions } from "./iat/IATInstructions";
import { IATTrial } from "./iat/IATTrial";
import { calculateDScore } from "./iat/IATScoring";
import { IATProps, Trial, BLOCKS } from "./iat/IATTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";

export const IAT: React.FC<IATProps> = ({ onComplete, surveyData }) => {
  const { toast } = useToast();
  const [currentBlock, setCurrentBlock] = useState(1);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<{ block: number; responseTime: number; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isBlockStarted, setIsBlockStarted] = useState(false);
  const [showCategoryChangeAlert, setShowCategoryChangeAlert] = useState(false);

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
            correctKey: block === 5 ? "k" as const : "d" as const,
            block: block
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: block === 5 ? "d" as const : "k" as const,
            block: block
          }))
        ];
        break;
      case 3:
      case 6:
      case 7:
        if (block === 6 || block === 7) {
          newTrials = [
            ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
              stimulus: item,
              category: "communication_disorder",
              correctKey: "k" as const,
              block: block
            })),
            ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
              stimulus: item,
              category: "normal_communication",
              correctKey: "d" as const,
              block: block
            })),
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
        } else {
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
            })),
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
        }
        break;
    }
    return newTrials.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    setTrials(generateTrials(currentBlock));
    setCurrentTrial(0);
    setShowInstructions(true);
    setIsBlockStarted(false);
    
    // Show category change alert when moving from block 4 to block 5
    if (currentBlock === 5) {
      setShowCategoryChangeAlert(true);
    }
  }, [currentBlock, generateTrials]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isBlockStarted || showInstructions || !startTime || showFeedback || showCategoryChangeAlert) return;

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
  }, [currentTrial, trials, startTime, showFeedback, responses, currentBlock, onComplete, isBlockStarted, showInstructions, showCategoryChangeAlert]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!showFeedback && isBlockStarted && !showInstructions && !showCategoryChangeAlert) {
      setStartTime(Date.now());
    }
  }, [currentTrial, showFeedback, isBlockStarted, showInstructions, showCategoryChangeAlert]);

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
      // Filter responses based on IAT research criteria
      const validResponses = responses.filter(r => r.responseTime >= 0.3 && r.responseTime <= 10);
      
      // Check if more than 10% of trials are below threshold
      const tooFastResponsesPercentage = responses.filter(r => r.responseTime < 0.3).length / responses.length;
      const validData = tooFastResponsesPercentage <= 0.1;
      
      // Apply error penalty (+600ms) to incorrect responses
      const penalizedResponses = responses.map(r => ({
        ...r,
        responseTime: r.correct ? r.responseTime : r.responseTime + 0.6
      }));

      const { error } = await supabase
        .from('iat_results')
        .insert([
          {
            d_score: dScore,
            age: surveyData.age,
            years_experience: surveyData.yearsExperience,
            degree: surveyData.degree,
            gender: surveyData.gender,
            survey_responses: surveyData.biasAwarenessResponses,
            response_times: responses.map(r => r.responseTime),
            responses: penalizedResponses,
            valid_data: validData
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

  const handleStartBlock = () => {
    setShowInstructions(false);
    setIsBlockStarted(true);
    setStartTime(Date.now());
  };

  const handleCloseAlert = () => {
    setShowCategoryChangeAlert(false);
    setIsBlockStarted(true);
    setStartTime(Date.now());
  };

  if (!trials.length) return null;

  return (
    <Card className="w-full max-w-2xl p-8 mx-auto mt-8 animate-fadeIn">
      <div className="text-center space-y-6">
        {showInstructions ? (
          <IATInstructions 
            block={currentBlock} 
            onStart={handleStartBlock}
          />
        ) : (
          <IATTrial 
            trial={trials[currentTrial]} 
            showFeedback={showFeedback} 
            isCorrect={isCorrect} 
          />
        )}
      </div>
      
      <Dialog open={showCategoryChangeAlert} onOpenChange={setShowCategoryChangeAlert}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-xl">تنبيه هام</DialogTitle>
            <DialogDescription className="text-lg pt-4">
              انتبه! ستتغير أماكن التصنيفات في المرحلة القادمة.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleCloseAlert} className="mt-4 mx-auto">فهمت</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
