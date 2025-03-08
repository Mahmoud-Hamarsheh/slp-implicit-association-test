
import React from "react";
import { IAT } from "@/components/IAT";
import { SurveyData } from "@/components/Survey";
import { SurveyResponses } from "@/components/BiasAwarenessSurvey";

interface TestStageProps {
  onComplete: (result: number) => void;
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
  
  // Ensure surveyData is properly formatted for IAT component
  const formattedSurveyData = {
    ...surveyData,
    hasTakenIATBefore,
    biasAwarenessResponses: biasAwarenessData || {}
  };

  return (
    <IAT 
      onComplete={onComplete}
      surveyData={formattedSurveyData}
    />
  );
};
