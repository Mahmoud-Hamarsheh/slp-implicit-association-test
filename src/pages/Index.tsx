
import { useState } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import { BiasAwarenessSurvey, SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { IAT } from "@/components/IAT";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stage, setStage] = useState<"welcome" | "survey" | "biasAwareness" | "instructions" | "test" | "complete">("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStage("biasAwareness");
  };

  const handleBiasAwarenessComplete = (data: SurveyResponses) => {
    setBiasAwarenessData(data);
    setStage("instructions");
  };

  const handleTestComplete = (result: number) => {
    setTestResult(result);
    setStage("complete");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {stage === "welcome" && (
          <Card className="p-8 text-center animate-slideIn">
            <h1 className="text-3xl font-bold mb-6">مرحباً بك في دراسة IAT للمعالجين</h1>
            <p className="mb-6 text-gray-600">
              تهدف هذه الدراسة إلى فهم الارتباطات الضمنية في ممارسة معالجة النطق واللغة.
            </p>
            <Button onClick={() => setStage("survey")}>ابدأ الدراسة</Button>
          </Card>
        )}

        {stage === "survey" && <Survey onComplete={handleSurveyComplete} />}

        {stage === "biasAwareness" && <BiasAwarenessSurvey onComplete={handleBiasAwarenessComplete} />}

        {stage === "instructions" && (
          <Card className="p-8 text-center animate-slideIn">
            <h2 className="text-2xl font-bold mb-6">تعليمات الاختبار</h2>
            <p className="mb-6 text-gray-600">
              سيتم عرض كلمات عليك وسيُطلب منك تصنيفها باستخدام مفتاحي 'E' و 'I'.
              يتكون الاختبار من 7 مقاطع، تشمل مقاطع للتدريب ومقاطع للاختبار.
              استجب بأسرع ما يمكن مع الحفاظ على الدقة.
            </p>
            <Button onClick={() => setStage("test")}>ابدأ الاختبار</Button>
          </Card>
        )}

        {stage === "test" && surveyData && biasAwarenessData && (
          <IAT 
            onComplete={handleTestComplete} 
            surveyData={{
              ...surveyData,
              biasAwarenessResponses: biasAwarenessData
            }} 
          />
        )}

        {stage === "complete" && (
          <Card className="p-8 text-center animate-slideIn">
            <h2 className="text-2xl font-bold mb-6">اكتمل الاختبار</h2>
            <p className="mb-6 text-gray-600">
              شكراً لمشاركتك في هذه الدراسة. تم تسجيل نتائجك.
            </p>
            <div className="text-xl font-semibold mb-4">
              النتيجة: {testResult?.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">
              النتيجة الإيجابية تشير إلى ارتباط أقوى بين اضطرابات التواصل والصفات السلبية،
              بينما تشير النتيجة السلبية إلى ارتباط أقوى بين اضطرابات التواصل والصفات الإيجابية.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
