
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { getIATResultInterpretation } from "@/components/iat/IATScoring";

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
  const resultInterpretation = testResult !== null 
    ? getIATResultInterpretation(testResult) 
    : "لم يتم إكمال الاختبار";

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">شكراً لمشاركتك</CardTitle>
        <CardDescription>تم الانتهاء من جميع مراحل الدراسة</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">نتيجة اختبار IAT الخاص بك</h3>
          {testResult !== null ? (
            <div className="space-y-4">
              <p>نموذج الاختبار: {testModel}</p>
              <p>الدرجة: {testResult.toFixed(2)}</p>
              <p>التفسير: {resultInterpretation}</p>
            </div>
          ) : (
            <p>لم يتم تسجيل أي نتيجة</p>
          )}
        </div>

        <Separator />

        {biasAwarenessData && biasAwarenessData.biasScore && (
          <div>
            <h3 className="text-xl font-semibold mb-2">نتيجة استبيان الوعي بالتحيز</h3>
            <p>درجة الوعي بالتحيز: {biasAwarenessData.biasScore}</p>
          </div>
        )}

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
