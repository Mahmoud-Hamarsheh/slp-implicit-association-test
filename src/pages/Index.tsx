
import { useState } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import { BiasAwarenessSurvey, SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { useToast } from "@/hooks/use-toast";

// Import refactored stage components
import { Welcome } from "@/components/stages/Welcome";
import { Consent } from "@/components/stages/Consent";
import { IATExperience } from "@/components/stages/IATExperience";
import { IATWelcome } from "@/components/stages/IATWelcome";
import { Instructions } from "@/components/stages/Instructions";
import { TestStage } from "@/components/stages/TestStage";
import { Complete } from "@/components/stages/Complete";

type Stage = 
  | "welcome" 
  | "consent" 
  | "iat-experience" 
  | "survey" 
  | "iat-welcome" 
  | "instructions" 
  | "test" 
  | "bias-awareness" 
  | "complete";

const Index = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [hasTakenIATBefore, setHasTakenIATBefore] = useState(false);
  const { toast } = useToast();

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStage("iat-welcome");
  };

  const handleIATComplete = (result: number) => {
    setTestResult(result);
    setStage("bias-awareness");
  };

  const handleBiasAwarenessComplete = (data: SurveyResponses) => {
    setBiasAwarenessData(data);
    setStage("complete");
    
    // Show toast for successful completion
    toast({
      title: "تم الانتهاء من الاستبيان",
      description: "شكراً لإكمال جميع مراحل الدراسة"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {stage === "welcome" && (
          <Welcome onContinue={() => setStage("consent")} />
        )}

        {stage === "consent" && (
          <Consent onAgree={() => setStage("iat-experience")} />
        )}

        {stage === "iat-experience" && (
          <IATExperience 
            onSelectYes={() => {
              setHasTakenIATBefore(true);
              setStage("survey");
            }} 
            onSelectNo={() => {
              setHasTakenIATBefore(false);
              setStage("survey");
            }} 
          />
        )}

        {stage === "survey" && <Survey onComplete={handleSurveyComplete} />}

        {stage === "iat-welcome" && surveyData && (
          <IATWelcome onStart={() => setStage("instructions")} />
        )}

        {stage === "instructions" && surveyData && (
          <Instructions onContinue={() => setStage("test")} />
        )}

        {stage === "test" && surveyData && (
          <TestStage
            onComplete={handleIATComplete}
            surveyData={surveyData}
            hasTakenIATBefore={hasTakenIATBefore}
            biasAwarenessData={biasAwarenessData}
          />
        )}

        {stage === "bias-awareness" && (
          <BiasAwarenessSurvey onComplete={handleBiasAwarenessComplete} />
        )}

        {stage === "complete" && (
          <Complete testResult={testResult} biasAwarenessData={biasAwarenessData} />
        )}
      </div>
    </div>
  );
};

export default Index;
