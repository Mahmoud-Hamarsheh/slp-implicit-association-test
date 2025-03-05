
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
    try {
      // Only keep response times for correct responses
      const correctResponseTimes = responses
        .filter(r => r.correct)
        .map(r => Number(r.responseTime.toFixed(3)));
      
      // Check if more than 10% of trials are below threshold
      const tooFastResponsesPercentage = responses.filter(r => r.responseTime < 0.3).length / responses.length;
      const validData = tooFastResponsesPercentage <= 0.1;

      // Get gender as numerical value (should already be formatted from Survey component)
      const gender = typeof surveyData.gender === 'string' 
        ? (surveyData.gender === 'male' ? 1 : 2)
        : surveyData.gender;

      // Ensure all data is properly formatted
      const formattedData = {
        d_score: dScore,
        // Use the pre-formatted values from the survey component
        age: Number(surveyData.age) || 1, // Default to 1 if missing
        years_experience: Number(surveyData.yearsExperience) || 1, // Default to 1 if missing
        degree: surveyData.degree || "1", // Default to "1" if missing
        gender: gender, // Already should be 1 or 2
        survey_responses: surveyData.biasAwarenessResponses || {},
        survey_score: surveyData.biasAwarenessResponses?.biasScore 
          ? parseFloat(surveyData.biasAwarenessResponses.biasScore)
          : null,
        response_times: correctResponseTimes,
        responses: responses
      };

      // Log what we're going to save
      console.log("Saving IAT results with data:", formattedData);

      if (surveyData.hasTakenIATBefore) {
        console.log("User has taken IAT before, not saving to database");
        toast({
          title: "اكتمل الاختبار",
          description: "بما أنك قمت بالاختبار مسبقًا، لن يتم حفظ نتائجك في قاعدة البيانات.",
        });
        onComplete(dScore);
      } else {
        const { error } = await supabase
          .from('iat_results')
          .insert([formattedData]);

        if (error) {
          console.error('Supabase error:', error);
          toast({
            title: "خطأ في حفظ النتائج",
            description: "حدث خطأ أثناء حفظ النتائج: " + error.message,
            variant: "destructive",
          });
        } else {
          console.log("Results saved successfully");
          toast({
            title: "تم حفظ النتائج بنجاح",
            description: "تم تسجيل إجاباتك في قاعدة البيانات",
          });
        }
        onComplete(dScore);
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "خطأ في حفظ النتائج",
        description: "حدث خطأ أثناء حفظ النتائج، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      // Still proceed to next step despite error
      onComplete(0);
    }
  };

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
        const dScore = calculateDScore([...responses, response]);
        console.log(`Final D-score: ${dScore !== null ? dScore.toFixed(3) : 'invalid'}`);
        
        if (dScore !== null) {
          saveResults(dScore);
        } else {
          toast({
            title: "نتائج غير صالحة",
            description: "لم تكن ا��تجاباتك ضمن معايير الصلاحية للاختبار",
            variant: "destructive",
          });
          // Even with invalid data, we proceed to the next step
          onComplete(0);
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
