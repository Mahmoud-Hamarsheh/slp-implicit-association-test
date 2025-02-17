
import { useState } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import { IAT } from "@/components/IAT";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stage, setStage] = useState<"welcome" | "survey" | "instructions" | "test" | "complete">("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStage("instructions");
  };

  const handleTestComplete = (result: number) => {
    setTestResult(result);
    setStage("complete");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6">
      <div className="max-w-4xl mx-auto">
        {stage === "welcome" && (
          <Card className="p-8 text-center animate-slideIn">
            <h1 className="text-3xl font-bold mb-6">Welcome to the SLP IAT Study</h1>
            <p className="mb-6 text-gray-600">
              This study aims to understand implicit associations in Speech-Language Pathology practice.
            </p>
            <Button onClick={() => setStage("survey")}>Begin Study</Button>
          </Card>
        )}

        {stage === "survey" && <Survey onComplete={handleSurveyComplete} />}

        {stage === "instructions" && (
          <Card className="p-8 text-center animate-slideIn">
            <h2 className="text-2xl font-bold mb-6">Test Instructions</h2>
            <p className="mb-6 text-gray-600">
              You will be shown words and asked to categorize them using the 'E' and 'I' keys.
              The test consists of 7 blocks, including practice and test blocks.
              Respond as quickly as possible while maintaining accuracy.
            </p>
            <Button onClick={() => setStage("test")}>Start Test</Button>
          </Card>
        )}

        {stage === "test" && surveyData && (
          <IAT onComplete={handleTestComplete} surveyData={surveyData} />
        )}

        {stage === "complete" && (
          <Card className="p-8 text-center animate-slideIn">
            <h2 className="text-2xl font-bold mb-6">Test Complete</h2>
            <p className="mb-6 text-gray-600">
              Thank you for participating in this study. Your results have been recorded.
            </p>
            <div className="text-xl font-semibold mb-4">
              D-Score: {testResult?.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">
              A positive D-score indicates a stronger association between communication disorders and negative attributes,
              while a negative score indicates a stronger association between communication disorders and positive attributes.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
