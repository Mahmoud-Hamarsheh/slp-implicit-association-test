import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile, useIsTouchDevice } from "@/hooks/use-mobile";

// Services
import { checkTestAvailability } from "@/services/testAvailabilityService";
import { saveIATResults } from "@/components/iat/services/IATResultsService";

// Stage Components
import { Welcome } from "@/components/stages/Welcome";
import { Consent } from "@/components/stages/Consent";
import { NotEligible } from "@/components/stages/NotEligible";
import { DeviceRestriction } from "@/components/stages/DeviceRestriction";
import { Survey, SurveyData } from "@/components/Survey";
import { IATWelcome } from "@/components/stages/IATWelcome";
import { Instructions } from "@/components/stages/Instructions";
import { TestStage } from "@/components/stages/TestStage";
import BiasAwarenessSurvey, { SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { Complete } from "@/components/stages/Complete";
import { TestDisabled } from "@/components/stages/TestDisabled";
import { TestToSurveyTransition } from "@/components/stages/TestToSurveyTransition";

export type Stage = 
  | "welcome" 
  | "consent" 
  | "device-restriction"
  | "survey" 
  | "iat-welcome" 
  | "instructions" 
  | "test" 
  | "test-to-survey-transition"
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
      testModel
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
    setStage("test-to-survey-transition");
  };

  const handleBiasAwarenessComplete = async (data: SurveyResponses) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("Bias awareness survey completed with data:", data);
      setBiasAwarenessData(data);
      
      // Save all data to the database at the end of the flow
      console.log("=== STAGE MANAGER: BIAS AWARENESS COMPLETE ===");
      console.log("About to save data. Conditions:", { 
        hasSurveyData: !!surveyData, 
        hasTestResult: testResult !== null, 
        testResult,
        hasTakenIATBefore
      });
      
      if (surveyData && testResult !== null) {
        // Combine all data together
        const completeData = {
          ...surveyData,
          biasAwarenessResponses: data,
          hasTakenIATBefore,
          testModel
        };
        
        // Extract response times from responses for the database
        const responseTimes = testResponses.map(response => response.responseTime);
        
        // Save everything to the database
        console.log("Calling saveIATResults with:", { 
          testResult, 
          responseCount: testResponses.length
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
        <Consent onAgree={() => setStage("survey")} />
      )}

      {stage === "test-disabled" && <TestDisabled />}

      {stage === "device-restriction" && <DeviceRestriction />}

      {stage === "not-eligible" && <NotEligible />}

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

      {stage === "test-to-survey-transition" && (
        <TestToSurveyTransition
          open={true}
          onContinue={() => setStage("bias-awareness")}
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
