
import React, { useState } from "react";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { IATProps } from "./iat/IATTypes";
import { IATBlockManager } from "./iat/IATBlockManager";

export const IAT: React.FC<IATProps> = ({ onComplete, surveyData }) => {
  const { toast } = useToast();
  const [testResult, setTestResult] = useState<number | null>(null);
  
  const handleTestComplete = (result: number) => {
    setTestResult(result);
    onComplete(result);
  };

  return (
    <Card className="w-full max-w-2xl p-8 mx-auto mt-8 animate-fadeIn">
      <IATBlockManager 
        onComplete={handleTestComplete} 
        surveyData={surveyData}
        toast={toast}
      />
    </Card>
  );
};
