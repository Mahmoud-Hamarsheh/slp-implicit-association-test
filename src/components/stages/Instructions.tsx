
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

  // Images for positive attributes
  const positiveImages = [
    "/lovable-uploads/4ee1dd40-8b8f-434f-8e90-709c1f2a4812.png", // Thumbs up
    "/lovable-uploads/b6c9ca5e-a51f-4bd7-98e4-689a021c4de1.png", // Friends group
    "/lovable-uploads/013b45f6-a99e-48fe-98fc-74537c635a43.png", // Trophy winner
    "/lovable-uploads/4e511310-63b0-4dc6-97c6-08f559b7f288.png", // Superhero
    "/lovable-uploads/17922e80-7727-4e77-ba76-efcb82e55f31.png", // Weight lifter
    "/lovable-uploads/1777ddc4-3ab8-4cee-b00d-a535001407fb.png", // Business person
    "/lovable-uploads/8b94a936-48f9-47fb-ab67-f328191b15be.png", // Graduate
    "/lovable-uploads/d0f34a2b-987a-44aa-b114-924258deff18.png"  // A+ student
  ];

  // Images for negative attributes
  const negativeImages = [
    "/lovable-uploads/4d29ef76-64fb-4508-8d76-2b27461fd844.png", // crying person
    "/lovable-uploads/a3279a90-96f3-4e35-aff6-00a3f84b6355.png", // thumbs down
    "/lovable-uploads/7b1dc96e-d083-46e9-be18-1d7a21122d40.png", // sad person
    "/lovable-uploads/7f658006-b81a-4da1-ba18-fd5c3d2e88dd.png", // pointing boss
    "/lovable-uploads/b786a712-7b99-484d-8a15-f2f80241dd1c.png", // depressed walk
    "/lovable-uploads/21cd29b5-16be-4f4a-aacd-227f025d8bc5.png", // laughing at someone 
    "/lovable-uploads/1bb6964d-14fe-44eb-9523-14f5fc1b849d.png", // standing sad
    "/lovable-uploads/6e039dce-2910-41e0-855d-344386d44f90.png", // sad businessman
    "/lovable-uploads/7c56a99d-9adc-4e25-914f-d94fcfa7e36e.png", // self hugging
    "/lovable-uploads/d116176d-050d-4bd5-9e87-0a9ae257c677.png"  // person with bad grades
  ];

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
        
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="font-bold mb-4 text-lg">إيجابي</h3>
          <div className="grid grid-cols-4 gap-3">
            {positiveImages.map((src, index) => (
              <div key={`pos-${index}`} className="flex flex-col items-center justify-center p-1 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                <img src={src} alt="إيجابي" className="w-14 h-14 object-contain" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="font-bold mb-4 text-lg">سلبي</h3>
          <div className="grid grid-cols-4 gap-3">
            {negativeImages.map((src, index) => (
              <div key={`neg-${index}`} className="flex flex-col items-center justify-center p-1 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                <img src={src} alt="سلبي" className="w-14 h-14 object-contain" />
              </div>
            ))}
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
