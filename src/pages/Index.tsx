
import { useState, useEffect } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import BiasAwarenessSurvey, { SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

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

// Settings constants 
const SETTINGS_TABLE = "app_settings";
const TEST_ENABLED_KEY = "test_enabled";

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
  | "not-eligible"
  | "test-disabled";

const Index = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [testResponses, setTestResponses] = useState<any[]>([]);
  const [hasTakenIATBefore, setHasTakenIATBefore] = useState(false);
  const [testModel, setTestModel] = useState<"A" | "B">(Math.random() < 0.5 ? "A" : "B");
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [testEnabled, setTestEnabled] = useState(true);
  const { toast } = useToast();

  // Assign test model on component mount and check if test is enabled
  useEffect(() => {
    // Randomly assign test model (50% chance for each)
    const model = Math.random() < 0.5 ? "A" : "B";
    setTestModel(model);
    console.log(`Assigned test model: ${model}`);
    
    // Check if test is enabled
    checkTestAvailability();
  }, []);

  // Function to check if the test is available
  const checkTestAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from(SETTINGS_TABLE)
        .select("*")
        .eq("key", TEST_ENABLED_KEY)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No setting found, assume enabled by default
          setTestEnabled(true);
        } else {
          console.error("Error checking test availability:", error);
          // If there's an error, assume the test is enabled to prevent blocking users
          setTestEnabled(true);
        }
      } else {
        // Parse boolean value from the JSON data
        const enabled = data.value === true || data.value === "true" || data.value === 1;
        setTestEnabled(enabled);
        
        // If test is disabled and user is not on welcome stage, show test disabled message
        if (!enabled && stage !== "welcome") {
          setStage("test-disabled");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // If there's an error, assume the test is enabled to prevent blocking users
      setTestEnabled(true);
    }
  };

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

        {stage === "test-disabled" && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h2 className="text-2xl font-bold">الاختبار غير متاح حاليًا</h2>
            <p className="text-lg">
              نأسف لإزعاجك، لكن الاختبار غير متاح حاليًا. يرجى المحاولة مرة أخرى في وقت لاحق.
            </p>
            <p className="text-sm text-muted-foreground">
              إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بمسؤول النظام.
            </p>
          </Card>
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
