
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InstructionsProps {
  onContinue: () => void;
  testModel?: "A" | "B";
}

export const Instructions: React.FC<InstructionsProps> = ({ onContinue, testModel = "A" }) => {
  // Determine if this is model A or B
  console.log(`Showing instructions for test model: ${testModel}`);

  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">تعليمات الاختبار</h2>
      <div className="text-right space-y-4">
        <p>ستستخدم مفاتيح الكمبيوتر "D" و"K" لتصنيف العناصر في مجموعات بأسرع ما يمكن. فيما يلي المجموعات الأربع والعناصر التي تنتمي إلى كل منها:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">تواصل طبيعي</h3>
          <p>وضوح الكلام، انسيابية الكلام، طلاقة التعبير، تواصل فعال، مُعبّر، كلام مترابط، الاستماع الفعال</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">اضطراب تواصل</h3>
          <p>أفيزيا، أبراكسيا، ديسارثريا (عسر النطق)، تأخر لغوي، اضطراب صوت، تأتأة</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">إيجابي</h3>
          <p>المشاعر والصور الإيجابية، نجاح، سعادة، تفوق، إنجاز، صداقة</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">سلبي</h3>
          <p>المشاعر والصور السلبية، حزن، إحباط، فشل، تعب، توتر</p>
        </div>
      </div>
      <div className="text-right text-sm bg-blue-50 p-4 rounded-lg">
        <p className="font-semibold">ملاحظة مهمة: </p>
        <p>خلال الاختبار، سيتم تبديل تصنيف المجموعات بين المفاتيح D و K.</p>
        <p>في المرحلة الأولى، سيتم استخدام D لـ "اضطراب تواصل" و K لـ "تواصل طبيعي".</p>
        <p>في مراحل لاحقة، قد يتغير التصنيف وتظهر لك تعليمات جديدة.</p>
        {testModel === "B" && (
          <p className="font-semibold text-blue-700 mt-2">
            في هذا الاختبار، ستبدأ بتصنيف "سلبي" و "إيجابي" بعد المرحلة الأولى.
          </p>
        )}
      </div>
      <Button onClick={onContinue}>متابعة</Button>
    </Card>
  );
};
