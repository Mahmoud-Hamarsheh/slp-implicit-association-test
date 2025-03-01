
import { useState } from "react";
import { Survey, SurveyData } from "@/components/Survey";
import { BiasAwarenessSurvey, SurveyResponses } from "@/components/BiasAwarenessSurvey";
import { IAT } from "@/components/IAT";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Stage = 
  | "welcome" 
  | "consent" 
  | "iat-experience" 
  | "survey" 
  | "iat-welcome" 
  | "instructions" 
  | "test" 
  | "bias-awareness" 
  | "complete";

const Index = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [biasAwarenessData, setBiasAwarenessData] = useState<SurveyResponses | null>(null);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [hasTakenIATBefore, setHasTakenIATBefore] = useState(false);
  const { toast } = useToast();

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStage("iat-welcome");
  };

  const handleIATComplete = (result: number) => {
    setTestResult(result);
    setStage("bias-awareness");
  };

  const handleBiasAwarenessComplete = (data: SurveyResponses) => {
    setBiasAwarenessData(data);
    setStage("complete");
    
    // Show toast for successful completion
    toast({
      title: "تم الانتهاء من الاستبيان",
      description: "شكراً لإكمال جميع مراحل الدراسة"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {stage === "welcome" && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h1 className="text-3xl font-bold">مرحباً بكم</h1>
            <div className="text-right space-y-4">
              <p>
                شكراً لمشاركتكم في هذه الدراسة البحثية التي تهدف إلى فهم الارتباطات الضمنية في ممارسة معالجة النطق واللغة.
              </p>
              <p>
                في هذه الدراسة، ستخضعون أولاً لاختبار الترابط الضمني (IAT)، حيث سيُطلب منك تصنيف الكلمات في مجموعات بأسرع ما يمكن تليه استبانة حول معتقداتك وارائك تجاه الأفراد ذوي اضطرابات التواصل، إلى جانب بعض الأسئلة الديموغرافية القياسية.
              </p>
              <p>
                من المتوقع أن تستغرق هذه الدراسة حوالي 10 دقائق لإكمالها.
              </p>
              <p>
                يرجى العلم بأن هذا الاختبار يتم في بيئة هادئة وخالية من المشتتات لضمان نتائج دقيقة. لا توجد إجابات صحيحة أو خاطئة، ونشجعكم على التفاعل مع الاختبار بعفوية.
              </p>
              <p>
                جميع بياناتكم ستُعامل بسرية تامة ولن تُستخدم إلا لأغراض البحث العلمي.
              </p>
            </div>
            <Button onClick={() => setStage("consent")}>متابعة</Button>
          </Card>
        )}

        {stage === "consent" && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h2 className="text-2xl font-bold">الموافقة على المشاركة في الدراسة البحثية</h2>
            <div className="text-right space-y-4">
              <p>شكراً لمشاركتك في هذه الدراسة. قبل البدء، نود إبلاغك ببعض المعلومات المهمة:</p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>مشاركتك اختيارية، ويمكنك الانسحاب في أي وقت دون أي تأثير على مكانتك المهنية أو الأكاديمية.</li>
                <li>جميع البيانات التي يتم جمعها ستكون سرية تماماً ولن تُستخدم إلا لأغراض البحث العلمي.</li>
                <li>ستتضمن الدراسة اختبار الترابط الضمني (IAT) لقياس التحيزات غير الواعية، يليه استبيان لقياس الاتجاهات الصريحة.</li>
                <li>لا توجد إجابات صحيحة أو خاطئة، ونشجعك على التفاعل مع الاختبار بعفوية.</li>
              </ul>
              <p className="text-lg font-semibold mt-4 bg-gray-50 p-4 rounded-lg">
                بالضغط على "أوافق"، فإنك تؤكد/تؤكدين أنك قرأت وفهمت تفاصيل هذه الدراسة وتوافق/توافقين طوعًا على المشاركة.
              </p>
            </div>
            <Button onClick={() => setStage("iat-experience")}>أوافق</Button>
          </Card>
        )}

        {stage === "iat-experience" && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h2 className="text-2xl font-bold">هل سبق لك أن خضعت لاختبار الترابط الضمني (IAT) من قبل؟</h2>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => {
                setHasTakenIATBefore(true);
                setStage("survey");
              }}>نعم</Button>
              <Button onClick={() => {
                setHasTakenIATBefore(false);
                setStage("survey");
              }}>لا</Button>
            </div>
          </Card>
        )}

        {stage === "survey" && <Survey onComplete={handleSurveyComplete} />}

        {stage === "iat-welcome" && surveyData && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h2 className="text-2xl font-bold">مرحباً بك في اختبار الترابط الضمني (IAT)</h2>
            <div className="text-right space-y-4">
              <p>شكراً لمشاركتك في هذه الدراسة! ستبدأ الآن باختبار الترابط الضمني (IAT)، حيث سيُطلب منك تصنيف الكلمات في مجموعات بأسرع ما يمكن.</p>
              <p>يرجى الانتباه إلى ما يلي قبل البدء:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>لا توجد إجابات صحيحة أو خاطئة، فقط استجب بسرعة وبعفوية قدر الإمكان.</li>
                <li>الاختبار يتطلب تركيزاً كاملاً، لذا احرص على التواجد في مكان هادئ وخالٍ من المشتتات.</li>
                <li>بعد الانتهاء، ستنتقل إلى استبيان يقيس الاتجاهات الصريحة.</li>
              </ul>
            </div>
            <Button onClick={() => setStage("instructions")}>ابدأ الاختبار</Button>
          </Card>
        )}

        {stage === "instructions" && surveyData && (
          <Card className="p-8 text-center space-y-6 animate-slideIn">
            <h2 className="text-2xl font-bold">تعليمات الاختبار</h2>
            <div className="text-right space-y-4">
              <p>ستستخدم مفاتيح الكمبيوتر "D" و"K" لتصنيف العناصر في مجموعات بأسرع ما يمكن. فيما يلي المجموعات الأربع والعناصر التي تنتمي إلى كل منها:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">اضطراب تواصل</h3>
                <p>أفيزيا، أبراكسيا، ديسارثريا (عسر النطق)، تأخر لغوي، اضطراب صوت، تأتأة</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">تواصل طبيعي</h3>
                <p>وضوح الكلام، انسيابية الكلام، طلاقة التعبير، تواصل فعال، معبر، كلام مترابط</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">صفات سلبية</h3>
                <p>محدود، ضعيف، سلبي، أخرق، مشتت، بطيء، متوتر، متردد</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">صفات إيجابية</h3>
                <p>كفؤ/قادر، قوي، واثق، ذكي، منتبه، سريع، مرن، متعاون</p>
              </div>
            </div>
            <Button onClick={() => setStage("test")}>متابعة</Button>
          </Card>
        )}

        {stage === "test" && surveyData && (
          <IAT 
            onComplete={handleIATComplete}
            surveyData={{
              ...surveyData,
              hasTakenIATBefore,
              biasAwarenessResponses: biasAwarenessData || {} as SurveyResponses
            }}
          />
        )}

        {stage === "bias-awareness" && (
          <BiasAwarenessSurvey onComplete={handleBiasAwarenessComplete} />
        )}

        {stage === "complete" && (
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
        )}
      </div>
    </div>
  );
};

export default Index;
