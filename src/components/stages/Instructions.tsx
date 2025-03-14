
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
          <h3 className="font-bold mb-2">إيجابي</h3>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <img src="/lovable-uploads/9b147b57-aafb-4241-94ff-3a9c352503b0.png" alt="A+ student" className="h-8 w-8" />
            <img src="/lovable-uploads/1fae69a3-a257-4e39-9d7e-92e71d89316b.png" alt="Graduate" className="h-8 w-8" />
            <img src="/lovable-uploads/f12e4381-84c6-45f6-8cde-62d1721d3509.png" alt="Business person" className="h-8 w-8" />
            <img src="/lovable-uploads/c0bdba02-284f-47d1-a891-9edbf0a2af61.png" alt="Friends group" className="h-8 w-8" />
            <img src="/lovable-uploads/dfc82370-e222-4fd8-9fd4-702c4d7ec161.png" alt="Weight lifter" className="h-8 w-8" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">سلبي</h3>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <img src="/lovable-uploads/30bf4690-6613-4357-8236-b485afbf6cf9.png" alt="Frustrated person" className="h-8 w-8" />
            <img src="/lovable-uploads/3d4fef15-cf7d-40d1-8a29-7d4cfbde6b31.png" alt="Sad person" className="h-8 w-8" />
            <img src="/lovable-uploads/ebd1f283-efcd-4a89-8d86-c7c08dbb8edc.png" alt="Tired worker" className="h-8 w-8" />
            <img src="/lovable-uploads/9ff773ad-fd12-4ff4-acd5-6817aeb3a60d.png" alt="Bullying" className="h-8 w-8" />
            <img src="/lovable-uploads/93575d6b-370c-40dc-aae0-0709a7f52560.png" alt="Pointing blame" className="h-8 w-8" />
          </div>
        </div>
      </div>
      <Button onClick={onContinue}>متابعة</Button>
    </Card>
  );
};
