
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
          <div className="grid grid-cols-4 gap-2">
            <img src="/lovable-uploads/93db19c2-e0dd-4eec-9507-f221369b92fd.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/7a2f734e-6115-40d0-8760-146aed3c8705.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/4e6f71c4-8642-4827-b966-276882db5ca7.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/6577b267-eeb2-42c1-807c-37c297534211.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/128c5b59-d835-4d35-8db4-91c49e5691a3.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/aad98393-d035-4993-9df4-70d20ca8d869.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/5642c084-8273-4481-99c0-4b8061323a7d.png" alt="صورة إيجابية" className="w-full h-auto" />
            <img src="/lovable-uploads/dfb07bb4-398a-4ad2-806b-2eb95159e5a0.png" alt="صورة إيجابية" className="w-full h-auto" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">سلبي</h3>
          <div className="grid grid-cols-4 gap-2">
            <img src="/lovable-uploads/e7596747-4942-41b8-86df-ded740cb89ee.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/950c3cfe-d7a2-4f4e-8575-ab8c2640814e.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/8a23e268-03e8-446d-abd7-0a1035a44a01.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/2786740d-6a92-4082-bb07-40b2b80e8dc1.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/d6ffd2ec-e26c-47f6-90b1-65d7b42ea6e3.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/9997e9f9-63be-46d4-867a-6ad6d32ca19f.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/e286e917-cb3a-4273-a2fc-8cee3bccd009.png" alt="صورة سلبية" className="w-full h-auto" />
            <img src="/lovable-uploads/1e9f90e6-74bc-4791-a954-4ce9b884a26f.png" alt="صورة سلبية" className="w-full h-auto" />
          </div>
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
