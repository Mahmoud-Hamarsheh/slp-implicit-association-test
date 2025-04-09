
import { useState, useEffect } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import BiasAwarenessSurvey, { SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { useToast } from "@/hooks/use-toast";

// Import refactored stage components
import { Welcome } from "@/components/stages/Welcome";
import { Consent } from "@/components/stages/Consent";
import { IATExperience } from "@/components/stages/IATExperience";
import { IATWelcome } from "@/components/stages/IATWelcome";
import { Instructions } from "@/components/stages/Instructions";
import { TestStage } from "@/components/stages/TestStage";
import { Complete } from "@/components/stages/Complete";
import { SpecialistQuestion } from "@/components/stages/SpecialistQuestion";
import { DeviceWarning } from "@/components/stages/DeviceWarning";
import { saveIATResults } from "@/components/iat/services/IATResultsService";

type Stage = 
  | "welcome" 
  | "consent" 
  | "specialist-question"
  | "device-warning"
  | "iat-experience" 
  | "survey" 
  | "iat-welcome" 
  | "instructions" 
  | "test" 
  | "bias-awareness" 
  | "complete"
  | "not-eligible";

const Index = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [testResponses, setTestResponses] = useState<any[]>([]);
  const [hasTakenIATBefore, setHasTakenIATBefore] = useState(false);
  const [testModel, setTestModel] = useState<"A" | "B">(Math.random() < 0.5 ? "A" : "B");
  const [isSpecialist, setIsSpecialist] = useState(false);
  const { toast } = useToast();

  // Assign test model on component mount
  useEffect(() => {
    // Randomly assign test model (50% chance for each)
    const model = Math.random() < 0.5 ? "A" : "B";
    setTestModel(model);
    console.log(`Assigned test model: ${model}`);
  }, []);

  const handleSurveyComplete = (data: SurveyData) => {
    // Add the test model to survey data
    const enrichedData = {
      ...data,
      testModel,
      isSpecialist
    };
    setSurveyData(enrichedData);
    setStage("iat-welcome");
  };

  const handleIATComplete = (result: number, responses: any[]) => {
    setTestResult(result);
    setTestResponses(responses);
    // Just store the result and responses, don't save to database yet
    setStage("bias-awareness");
  };

  const handleBiasAwarenessComplete = (data: SurveyResponses) => {
    console.log("Bias awareness survey completed with data:", data);
    setBiasAwarenessData(data);
    
    // Save all data to the database at the end of the flow
    // Only save data if the user is a specialist
    if (surveyData && testResult !== null && isSpecialist) {
      // Combine all data together
      const completeData = {
        ...surveyData,
        biasAwarenessResponses: data,
        hasTakenIATBefore,
        testModel,
        isSpecialist
      };
      
      // Extract response times from responses for the database
      const responseTimes = testResponses.map(response => response.responseTime);
      
      // Save everything to the database
      saveIATResults(testResult, testResponses, completeData, toast)
        .then(() => {
          setStage("complete");
          // Show toast for successful completion
          toast({
            title: "تم الانتهاء من الاستبيان",
            description: "شكراً لإكمال جميع مراحل الدراسة"
          });
        });
    } else {
      // In case there's missing data or user is not a specialist,
      // still move to complete stage but don't save to database
      setStage("complete");
      toast({
        title: "تم الانتهاء من الاستبيان",
        description: "شكراً لإكمال جميع مراحل الدراسة"
      });
    }
  };

  const handleSpecialistQuestion = (isSpecialist: boolean) => {
    setIsSpecialist(isSpecialist);
    if (isSpecialist) {
      setStage("device-warning");
    } else {
      // If not a specialist, show a message and don't record data
      setStage("not-eligible");
      setTimeout(() => {
        // After showing the message for 3 seconds, redirect to survey anyway
        // but mark as non-specialist so no data is saved
        setStage("device-warning");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {stage === "welcome" && (
          <Welcome onContinue={() => setStage("consent")} />
        )}

        {stage === "consent" && (
          <Consent onAgree={() => setStage("specialist-question")} />
        )}

        {stage === "specialist-question" && (
          <SpecialistQuestion 
            onSelectYes={() => handleSpecialistQuestion(true)}
            onSelectNo={() => handleSpecialistQuestion(false)}
          />
        )}

        {stage === "not-eligible" && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h2 className="text-2xl font-bold">شكراً لاهتمامك</h2>
            <p className="text-lg">
              هذه الدراسة مخصصة لأخصائيي ومعالجي وطلاب النطق واللغة.
            </p>
            <p>جاري التوجيه...</p>
          </Card>
        )}

        {stage === "device-warning" && (
          <DeviceWarning onContinue={() => setStage("iat-experience")} />
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
          <Complete 
            testResult={testResult} 
            biasAwarenessData={biasAwarenessData} 
            testModel={testModel} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
