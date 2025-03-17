
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
            <img src="/lovable-uploads/8a47854e-fe67-4831-a098-ebd5973ed639.png" alt="أصدقاء" className="w-full h-auto" />
            <img src="/lovable-uploads/05dbeaf2-bc74-4db9-bdb2-34921bdf7b31.png" alt="فائز" className="w-full h-auto" />
            <img src="/lovable-uploads/b7de89a7-c720-4480-99b3-7a4fb7e70f64.png" alt="بطل خارق" className="w-full h-auto" />
            <img src="/lovable-uploads/6ca5e5cf-4887-4d67-92a2-738ad470cc41.png" alt="رافع أثقال" className="w-full h-auto" />
            <img src="/lovable-uploads/b45e5c2a-1e8a-48f1-803b-28b8c49d4068.png" alt="خطيب" className="w-full h-auto" />
            <img src="/lovable-uploads/0b136d3f-4ac0-472c-be0e-3a1ee8f4fa90.png" alt="خريج" className="w-full h-auto" />
            <img src="/lovable-uploads/08733774-dd5e-4316-9487-ca9d5aec6372.png" alt="طالب ممتاز" className="w-full h-auto" />
            <img src="/lovable-uploads/d88a7ff5-0f1f-4f73-860e-3e98a15bfeb4.png" alt="إعجاب" className="w-full h-auto" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">سلبي</h3>
          <div className="grid grid-cols-4 gap-2">
            <img src="/lovable-uploads/2f6811c4-0e58-4acf-bc68-41e7cbc48ae8.png" alt="حزين" className="w-full h-auto" />
            <img src="/lovable-uploads/c70cbd4d-41da-4e96-87d7-5a2698796a22.png" alt="يبكي" className="w-full h-auto" />
            <img src="/lovable-uploads/9aa7f63a-8dc0-4cf1-9f46-e073b5df3351.png" alt="عدم إعجاب" className="w-full h-auto" />
            <img src="/lovable-uploads/61bce018-0659-4e25-a62e-482ac9431bea.png" alt="توبيخ" className="w-full h-auto" />
            <img src="/lovable-uploads/d85123c5-8ad8-4090-a227-83cb01455cfa.png" alt="سخرية" className="w-full h-auto" />
            <img src="/lovable-uploads/9145440d-aa95-4e47-a356-16b1358feaad.png" alt="إحباط" className="w-full h-auto" />
            <img src="/lovable-uploads/0d2ca8df-7f42-4445-8cf6-5f3f99dedd11.png" alt="حزن" className="w-full h-auto" />
            <img src="/lovable-uploads/0428db45-113f-4c13-b982-bf221809feac.png" alt="عزلة" className="w-full h-auto" />
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
