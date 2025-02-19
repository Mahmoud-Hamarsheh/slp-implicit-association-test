import { useState } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import { BiasAwarenessSurvey, SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { IAT } from "@/components/IAT";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [stage, setStage] = useState<"welcome" | "survey" | "biasAwareness" | "instructions" | "test" | "complete">("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [showIATDialog, setShowIATDialog] = useState(false);
  const [hasTakenIATBefore, setHasTakenIATBefore] = useState(false);
  const { toast } = useToast();

  const handleSurveyComplete = async (data: SurveyData) => {
    setSurveyData(data);
    setShowIATDialog(true);
  };

  const handleIATResponse = async (hasTakenIAT: boolean) => {
    setShowIATDialog(false);
    setHasTakenIATBefore(hasTakenIAT);
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
              استجب بأسرع ما يمكن مع الحفاظ على الدقة.
            </p>
            <div className="mb-6 border rounded-lg p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">التصنيفات</th>
                    <th className="border p-2">العناصر</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">صفات إيجابية</td>
                    <td className="border p-2">كفؤ/قادر، قوي، واثق، ذكي، منتبه، سريع، مرن، متعاون</td>
                  </tr>
                  <tr>
                    <td className="border p-2">صفات سلبية</td>
                    <td className="border p-2">محدود، ضعيف، سلبي، أخرق، مشتت، بطيء، متوتر، متردد</td>
                  </tr>
                  <tr>
                    <td className="border p-2">تواصل طبيعي</td>
                    <td className="border p-2">وضوح الكلام، انسيابية الكلام، طلاقة التعبير، تواصل فعال، تواصل، معبر، كلام مترابط، الاستماع الفعال</td>
                  </tr>
                  <tr>
                    <td className="border p-2">اضطراب تواصل</td>
                    <td className="border p-2">أفيزيا، أبراكسيا، ديسارثريا (عسر النطق)، تأخر لغوي، اضطراب صوت، تأتأة</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button onClick={() => setStage("test")}>ابدأ الاختبار</Button>
          </Card>
        )}

        {stage === "test" && surveyData && biasAwarenessData && (
          <IAT 
            onComplete={handleTestComplete} 
            surveyData={{
              ...surveyData,
              biasAwarenessResponses: biasAwarenessData,
              hasTakenIATBefore
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
              النتيجة الإيجابية تشير إلى ارتباط أقوى بين اضطرابات التواصل والصفات السلبية，
              بينما تشير النتيجة السلبية إلى ارتباط أقوى بين اضطرابات التواصل والصفات الإيجابية.
            </p>
          </Card>
        )}

        <Dialog open={showIATDialog} onOpenChange={setShowIATDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>هل سبق لك إجراء اختبار IAT من قبل؟</DialogTitle>
              <DialogDescription>
                من المهم معرفة ما إذا كنت قد قمت بإجراء هذا الاختبار مسبقاً.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleIATResponse(true)}>
                نعم، قمت به من قبل
              </Button>
              <Button onClick={() => handleIATResponse(false)}>
                لا، هذه أول مرة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
