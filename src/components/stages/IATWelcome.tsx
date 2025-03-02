
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IATWelcomeProps {
  onStart: () => void;
}

export const IATWelcome: React.FC<IATWelcomeProps> = ({ onStart }) => {
  return (
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
      <Button onClick={onStart}>ابدأ الاختبار</Button>
    </Card>
  );
};
