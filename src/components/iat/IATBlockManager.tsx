
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { IATInstructions } from "./IATInstructions";
import { IATTrialRunner } from "./IATTrialRunner";
import { calculateDScore } from "./IATScoring";
import { IATProps, Trial, Response } from "./IATTypes";
import { BlockChangeAlert } from "./BlockChangeAlert";
import { TrialGenerator } from "./TrialGenerator";

interface IATBlockManagerProps {
  onComplete: (result: number) => void;
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
      // Only keep response times for correct responses
      const correctResponseTimes = responses
        .filter(r => r.correct)
        .map(r => Number(r.responseTime.toFixed(3)));
      
      // Check if more than 10% of trials are below threshold
      const tooFastResponsesPercentage = responses.filter(r => r.responseTime < 0.3).length / responses.length;
      const validData = tooFastResponsesPercentage <= 0.1;

      // Ensure dScore is in seconds (no conversion needed as it's already in seconds)
      const dScoreInSeconds = dScore;

      // Parse survey data to ensure it's in the correct format
      const surveyDataFormatted = {
        age: Number(surveyData.age) || 0,
        yearsExperience: Number(surveyData.yearsExperience) || 0,
        degree: String(surveyData.degree) || "",
        gender: surveyData.gender || "female",
        biasAwarenessResponses: surveyData.biasAwarenessResponses || {}
      };

      // Extract survey score if available
      const surveyScore = surveyData.biasAwarenessResponses?.biasScore 
        ? parseFloat(surveyData.biasAwarenessResponses.biasScore)
        : null;

      // Log what we're about to save to help with debugging
      console.log("Saving IAT results:", {
        d_score: dScoreInSeconds,
        age: surveyDataFormatted.age,
        years_experience: surveyDataFormatted.yearsExperience,
        degree: surveyDataFormatted.degree,
        gender: surveyDataFormatted.gender,
        survey_score: surveyScore,
        response_times: correctResponseTimes,
        valid_data: validData
      });

      const { error } = await supabase
        .from('iat_results')
        .insert([
          {
            d_score: dScoreInSeconds,
            age: surveyDataFormatted.age,
            years_experience: surveyDataFormatted.yearsExperience,
            degree: surveyDataFormatted.degree,
            gender: surveyDataFormatted.gender,
            survey_responses: surveyDataFormatted.biasAwarenessResponses,
            survey_score: surveyScore,
            response_times: correctResponseTimes,
            responses: responses
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
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
    } finally {
      // Call onComplete regardless of whether saving succeeded
      onComplete(dScore);
    }
  };

  const handleTrialComplete = (response: Response) => {
    // Add response to the list
    setResponses(prev => [...prev, response]);

    // Move to next trial or block
    if (currentTrial + 1 >= trials.length) {
      if (currentBlock < 7) {
        setCurrentBlock(currentBlock + 1);
      } else {
        const dScore = calculateDScore(responses);
        if (dScore !== null) {
          saveResults(dScore);
        } else {
          toast({
            title: "نتائج غير صالحة",
            description: "لم تكن استجاباتك ضمن معايير الصلاحية للاختبار",
            variant: "destructive",
          });
          onComplete(0); // Default to neutral score for invalid data
        }
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

  if (!trials.length) return null;

  return (
    <div className="text-center space-y-6">
      {showInstructions ? (
        <IATInstructions 
          block={currentBlock} 
          onStart={handleStartBlock}
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
