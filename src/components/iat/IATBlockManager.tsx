
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

      // Ensure all demographic data is formatted as integers
      let formattedGender = 1; // Default to male (1)
      if (typeof surveyData.gender === 'number') {
        formattedGender = surveyData.gender;
      } else if (typeof surveyData.gender === 'string') {
        formattedGender = surveyData.gender === 'female' ? 2 : 1;
      }

      // Ensure all data is properly formatted with appropriate defaults
      const formattedData = {
        d_score: dScore || 0, // Ensure we never save null or undefined
        // Format all demographic data as integers
        age: Number(surveyData.age) || 1, // Default to 1 if missing
        years_experience: Number(surveyData.yearsExperience) || 1, // Default to 1 if missing
        degree: typeof surveyData.degree === 'string' ? surveyData.degree : "1", // Default to "1" if missing
        gender: formattedGender, // Should be 1 or 2
        survey_responses: surveyData.biasAwarenessResponses || {},
        survey_score: surveyData.biasAwarenessResponses?.biasScore 
          ? parseFloat(surveyData.biasAwarenessResponses.biasScore)
          : null,
        response_times: correctResponseTimes,
        responses: responses,
        valid_data: validData
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
          
          // We still complete the test even if saving fails
          // This ensures users can always proceed with the study
          onComplete(dScore);
        } else {
          console.log("Results saved successfully");
          toast({
            title: "تم حفظ النتائج بنجاح",
            description: "تم تسجيل إجاباتك في قاعدة البيانات",
          });
          onComplete(dScore);
        }
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "خطأ في حفظ النتائج",
        description: "حدث خطأ أثناء حفظ النتائج، ولكن يمكنك المتابعة مع الدراسة",
        variant: "destructive",
      });
      // Still proceed to next step despite error
      onComplete(dScore);
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
        // Always get a valid D-score (never null)
        const dScore = calculateDScore([...responses, response]) || 0;
        console.log(`Final D-score: ${dScore.toFixed(3)}`);
        
        // Always save results, even if D-score is 0
        saveResults(dScore);
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
