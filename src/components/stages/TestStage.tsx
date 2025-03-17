
import React from "react";
import { IAT } from "@/components/IAT";
import { SurveyData } from "@/components/Survey";
import { SurveyResponses } from "@/components/BiasAwarenessSurvey";

interface TestStageProps {
  onComplete: (result: number, responses: any[]) => void;
  surveyData: SurveyData;
  hasTakenIATBefore: boolean;
  biasAwarenessData: SurveyResponses | null;
}

export const TestStage: React.FC<TestStageProps> = ({ 
  onComplete, 
  surveyData, 
  hasTakenIATBefore,
  biasAwarenessData
}) => {
  console.log("Bias awareness data in TestStage:", biasAwarenessData);
  
  // Randomly assign test model A or B if not already assigned
  const testModel: "A" | "B" = surveyData.testModel || (Math.random() < 0.5 ? "A" : "B");
  console.log("Test model in TestStage:", testModel);
  
  // Ensure surveyData is properly formatted for IAT component
  const formattedSurveyData = {
    ...surveyData,
    hasTakenIATBefore,
    biasAwarenessResponses: biasAwarenessData || {},
    testModel
  };

  const handleIATComplete = (result: number, responses: any[]) => {
    onComplete(result, responses);
  };

  return (
    <IAT 
      onComplete={handleIATComplete}
      surveyData={formattedSurveyData}
    />
  );
};
