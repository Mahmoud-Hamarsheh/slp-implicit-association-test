
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyResponses } from "@/components/BiasAwarenessSurvey";

interface CompleteProps {
  testResult: number | null;
  biasAwarenessData: SurveyResponses | null;
  testModel?: "A" | "B";
}

export const Complete: React.FC<CompleteProps> = ({ 
  testResult, 
  biasAwarenessData,
  testModel = "A"
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">شكراً لمشاركتك</CardTitle>
        <CardDescription>تم الانتهاء من جميع مراحل الدراسة</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">ملاحظة</h3>
          <p>
            هذه النتائج هي لأغراض البحث فقط ولا ينبغي استخدامها للتشخيص. شكراً لمساهمتك في هذه الدراسة.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
