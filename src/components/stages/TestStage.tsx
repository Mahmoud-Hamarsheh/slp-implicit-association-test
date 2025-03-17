
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
  console.log("Test model in TestStage:", surveyData.testModel || "Not assigned");
  
  // Ensure surveyData is properly formatted for IAT component
  const formattedSurveyData = {
    ...surveyData,
    hasTakenIATBefore,
    biasAwarenessResponses: biasAwarenessData || {}
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
