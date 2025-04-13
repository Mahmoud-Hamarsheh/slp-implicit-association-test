
import React, { useEffect, useState } from "react";
import { IATInstructions } from "./IATInstructions";
import { IATTrialRunner } from "./IATTrialRunner";
import { IATProps } from "./IATTypes";
import { BlockChangeAlert } from "./BlockChangeAlert";
import { useIATTest } from "./hooks/useIATTest";
import { checkTestAvailability } from "@/services/testAvailabilityService";
import { Card } from "@/components/ui/card";

interface IATBlockManagerProps {
  onComplete: (result: number, allResponses: any[], testModel: "A" | "B") => void;
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
  const [testEnabled, setTestEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  // If no testModel is assigned, randomly assign one
  const testModel = surveyData.testModel || (Math.random() < 0.5 ? "A" : "B");
  console.log(`Using test model: ${testModel}`);
  
  const { 
    currentBlock,
    trials,
    currentTrial,
    responses,
    showInstructions,
    isBlockStarted,
    showCategoryChangeAlert,
    setShowCategoryChangeAlert,
    handleTrialComplete,
    handleStartBlock,
    handleCloseAlert,
    testModel: assignedTestModel
  } = useIATTest((result, allResponses, model) => {
    // When test is complete, pass the result, all responses, and test model to parent component
    onComplete(result, allResponses, model);
  }, testModel);

  // Check if test is enabled on component mount
  useEffect(() => {
    checkTestAvailability().then(enabled => {
      setTestEnabled(enabled);
      setLoading(false);
    }).catch(error => {
      console.error("Error checking test availability:", error);
      setTestEnabled(true); // Default to enabled
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (testEnabled === false) {
    return (
      <Card className="p-6 text-center space-y-4">
        <h3 className="text-xl font-bold">الاختبار غير متاح حاليًا</h3>
        <p>
          نأسف لإزعاجك، لكن هذا الاختبار غير متاح حاليًا. يرجى المحاولة مرة أخرى لاحقًا.
        </p>
      </Card>
    );
  }

  if (!trials.length) return null;

  return (
    <div className="text-center space-y-6">
      {showInstructions ? (
        <IATInstructions 
          block={currentBlock} 
          onStart={handleStartBlock}
          testModel={testModel}
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
