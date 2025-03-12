
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
          <p>وضوح الكلام، انسيابية الكلام، طلاقة التعبير، تواصل فعال، مُعبّر، كلام مترابط، الاستماع الفعال</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">اضطراب تواصل</h3>
          <p>أفيزيا، أبراكسيا، ديسارثريا (عسر النطق)، تأخر لغوي، اضطراب صوت، تأتأة</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">صفات إيجابية</h3>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <img src="/lovable-uploads/3d280a97-f40f-42c4-8095-644ba45df460.png" alt="Positive attribute 1" className="h-8 w-8" />
            <img src="/lovable-uploads/4ec5761a-9111-4ed1-87e2-cfd914be2cac.png" alt="Positive attribute 2" className="h-8 w-8" />
            <img src="/lovable-uploads/0614e6dd-0a9e-4360-9278-dbba71cc546b.png" alt="Light bulb idea" className="h-8 w-8" />
            <img src="/lovable-uploads/2e29f911-0a75-4712-8eea-e2e98db244cb.png" alt="Strong person" className="h-8 w-8" />
            <img src="/lovable-uploads/80d66870-170b-4907-b25b-fa6a9181c7c9.png" alt="Additional positive" className="h-8 w-8" />
          </div>
          <p className="mt-2">كفؤ/قادر، قوي، واثق، ذكي، منتبه، سريع، مرن، متعاون</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">صفات سلبية</h3>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <img src="/lovable-uploads/c5746857-ee51-4e54-b918-f49f50369faf.png" alt="Sad face" className="h-8 w-8" />
            <img src="/lovable-uploads/901566ad-77e2-4163-aa28-528697bcf20d.png" alt="Timer clock" className="h-8 w-8" />
            <img src="/lovable-uploads/0ad74854-9e13-4400-b348-cf97697cadc7.png" alt="Additional negative 1" className="h-8 w-8" />
            <img src="/lovable-uploads/2df0738b-33e7-4fbe-9bd5-785fbb2f81dc.png" alt="Additional negative 2" className="h-8 w-8" />
          </div>
          <p className="mt-2">محدود، ضعيف، سلبي، أخرق، مشتت، بطيء، متوتر، متردد</p>
        </div>
      </div>
      <Button onClick={onContinue}>متابعة</Button>
    </Card>
  );
};
