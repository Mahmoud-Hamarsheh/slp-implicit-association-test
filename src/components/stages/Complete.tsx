
import React from "react";
import { Card } from "@/components/ui/card";
import { SurveyResponses } from "@/components/BiasAwarenessSurvey";

interface CompleteProps {
  testResult: number | null;
  biasAwarenessData: SurveyResponses | null;
}

export const Complete: React.FC<CompleteProps> = ({ testResult, biasAwarenessData }) => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">شكراً لك على إتمام الدراسة!</h2>
      <p>
        نحن نقدر وقتك وجهودك في المشاركة في هذه الدراسة البحثية. لقد كانت مساهمتك قيمة جداً في مساعدتنا على فهم الارتباطات الضمنية والصريحة في مجال النطق واللغة.
      </p>
      {testResult !== null && (
        <div>
          <div className="text-xl font-semibold mb-4">
            نتيجة اختبار IAT: {testResult.toFixed(2)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-right">
            <p className="font-bold mb-2">تفسير النتائج:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>أقل من -0.15: تحيز ضعيف تجاه تواصل طبيعي</li>
              <li>بين -0.15 و 0.15: لا يوجد تحيز</li>
              <li>بين 0.15 و 0.35: تحيز ضعيف تجاه اضطرابات التواصل</li>
              <li>بين 0.35 و 0.65: تحيز متوسط تجاه اضطرابات التواصل</li>
              <li>أكبر من 0.65: تحيز قوي تجاه اضطرابات التواصل</li>
            </ul>
          </div>
        </div>
      )}
      {biasAwarenessData?.biasLevel && (
        <div className="bg-gray-50 p-4 rounded-lg text-right mt-4">
          <p className="font-bold mb-2">مستوى التحيز الصريح: {biasAwarenessData.biasLevel}</p>
          <p>متوسط درجات الاستبيان: {parseFloat(biasAwarenessData.biasScore).toFixed(2)}</p>
        </div>
      )}
    </Card>
  );
};
