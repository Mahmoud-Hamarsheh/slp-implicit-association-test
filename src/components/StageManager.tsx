import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile, useIsTouchDevice } from "@/hooks/use-mobile";

// Services
import { checkTestAvailability } from "@/services/testAvailabilityService";
import { saveIATResults } from "@/components/iat/services/IATResultsService";

// Stage Components
import { Welcome } from "@/components/stages/Welcome";
import { Consent } from "@/components/stages/Consent";
import { SpecialistQuestion } from "@/components/stages/SpecialistQuestion";
import { NotEligible } from "@/components/stages/NotEligible";

import { DeviceRestriction } from "@/components/stages/DeviceRestriction";
import { IATExperience } from "@/components/stages/IATExperience";
import { Survey, SurveyData } from "@/components/Survey";
import { IATWelcome } from "@/components/stages/IATWelcome";
import { Instructions } from "@/components/stages/Instructions";
import { TestStage } from "@/components/stages/TestStage";
import BiasAwarenessSurvey, { SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { Complete } from "@/components/stages/Complete";
import { TestDisabled } from "@/components/stages/TestDisabled";

export type Stage = 
  | "welcome" 
  | "consent" 
  | "specialist-question"
  
  | "device-restriction"
  | "iat-experience" 
  | "survey" 
  | "iat-welcome" 
  | "instructions" 
  | "test" 
  | "bias-awareness" 
  | "complete"
  | "not-eligible"
  | "test-disabled";

export const StageManager: React.FC = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [testResponses, setTestResponses] = useState<any[]>([]);
  const [hasTakenIATBefore, setHasTakenIATBefore] = useState(false);
  const [testModel, setTestModel] = useState<"A" | "B">(Math.random() < 0.5 ? "A" : "B");
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [testEnabled, setTestEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Device detection hooks
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();

  // Check for mobile/tablet devices and redirect to device restriction
  useEffect(() => {
    if (isMobile || isTouch) {
      setStage("device-restriction");
    }
  }, [isMobile, isTouch]);

  // Assign test model on component mount and check if test is enabled
  useEffect(() => {
    // Randomly assign test model (50% chance for each)
    const model = Math.random() < 0.5 ? "A" : "B";
    setTestModel(model);
    console.log(`Assigned test model: ${model}`);
    
    // Check if test is enabled
    checkTestAvailability().then(enabled => {
      setTestEnabled(enabled);
      
      // If test is disabled and user is not on welcome stage, show test disabled message
      if (!enabled && stage !== "welcome") {
        setStage("test-disabled");
      }
    });
  }, []);

  const handleSurveyComplete = (data: SurveyData) => {
    // Add the test model to survey data
    const enrichedData = {
      ...data,
      testModel,
      isSpecialist
    };
    setSurveyData(enrichedData);
    
    // Check if test is enabled before proceeding
    if (!testEnabled) {
      setStage("test-disabled");
    } else {
      setStage("iat-welcome");
    }
  };

  const handleIATComplete = (result: number, responses: any[]) => {
    setTestResult(result);
    setTestResponses(responses);
    // Just store the result and responses, don't save to database yet
    setStage("bias-awareness");
  };

  const handleBiasAwarenessComplete = async (data: SurveyResponses) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("Bias awareness survey completed with data:", data);
      setBiasAwarenessData(data);
      
      // Save all data to the database at the end of the flow
      // Only save data if the user is a specialist
        console.log("=== STAGE MANAGER: BIAS AWARENESS COMPLETE ===");
        console.log("About to save data. Conditions:", { 
          hasSurveyData: !!surveyData, 
          hasTestResult: testResult !== null, 
          isSpecialist,
          willSave: !isSpecialist,
          testResult,
          hasTakenIATBefore
        });
        
        if (!isSpecialist) {
          console.log("✅ Will attempt to save data (user is NOT a specialist)");
        } else {
          console.log("❌ Will NOT save data (user IS a specialist)");
        }
      
      if (surveyData && testResult !== null && !isSpecialist) {
        // Combine all data together - only save for NON-specialists
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
        console.log("Calling saveIATResults with:", { 
          testResult, 
          responseCount: testResponses.length,
          isSpecialistInData: completeData.isSpecialist 
        });
        await saveIATResults(testResult, testResponses, completeData, toast);
      }
      
      // In all cases, move to complete stage
      setStage("complete");
      toast({
        title: "تم الانتهاء من الاستبيان",
        description: "شكراً لإكمال جميع مراحل الدراسة"
      });
    } catch (error) {
      console.error("Error processing bias awareness results:", error);
      toast({
        title: "خطأ في معالجة النتائج",
        description: "حدث خطأ أثناء معالجة النتائج، ولكن يمكنك المتابعة",
        variant: "destructive"
      });
      // Still move to complete stage in case of error
      setStage("complete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpecialistQuestion = (isSpecialist: boolean) => {
    setIsSpecialist(isSpecialist);
    if (isSpecialist) {
      setStage("iat-experience");
    } else {
      // If not a specialist, show a message and don't record data
      setStage("not-eligible");
      setTimeout(() => {
        // After showing the message for 3 seconds, redirect to survey anyway
        // but mark as non-specialist so no data is saved
        setStage("iat-experience");
      }, 3000);
    }
  };

  return (
    <>
      {stage === "welcome" && (
        <Welcome onContinue={() => {
          // Check if test is enabled before allowing the user to proceed
          if (!testEnabled) {
            setStage("test-disabled");
          } else {
            setStage("consent");
          }
        }} />
      )}

      {stage === "consent" && (
        <Consent onAgree={() => setStage("specialist-question")} />
      )}

      {stage === "test-disabled" && <TestDisabled />}

      {stage === "device-restriction" && <DeviceRestriction />}

      {stage === "specialist-question" && (
        <SpecialistQuestion 
          onSelectYes={() => handleSpecialistQuestion(true)}
          onSelectNo={() => handleSpecialistQuestion(false)}
        />
      )}

      {stage === "not-eligible" && <NotEligible />}


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
    </>
  );
};
