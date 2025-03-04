
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InstructionsProps {
  onContinue: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onContinue }) => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">تعليمات الاختبار</h2>
      <div className="text-right space-y-4">
        <p>ستستخدم مفاتيح الكمبيوتر "D" و"K" لتصنيف العناصر في مجموعات بأسرع ما يمكن. فيما يلي المجموعات الأربع والعناصر التي تنتمي إلى كل منها:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">تواصل طبيعي</h3>
          <p>وضوح الكلام، انسيابية الكلام، طلاقة التعبير، تواصل فعال، معبر، كلام مترابط، الاستماع الفعال</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">اضطراب تواصل</h3>
          <p>أفيزيا، أبراكسيا، ديسارثريا (عسر النطق)، تأخر لغوي، اضطراب صوت، تأتأة</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">صفات إيجابية</h3>
          <p>كفؤ/قادر، قوي، واثق، ذكي، منتبه، سريع، مرن، متعاون</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">صفات سلبية</h3>
          <p>محدود، ضعيف، سلبي، أخرق، مشتت، بطيء، متوتر، متردد</p>
        </div>
      </div>
      <Button onClick={onContinue}>متابعة</Button>
    </Card>
  );
};
