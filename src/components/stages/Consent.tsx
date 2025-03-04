
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConsentProps {
  onAgree: () => void;
}

export const Consent: React.FC<ConsentProps> = ({ onAgree }) => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">الموافقة على المشاركة في الدراسة البحثية</h2>
      <div className="text-right space-y-4">
        <p>شكراً لمشاركتك في هذه الدراسة. قبل البدء، نود إبلاغك ببعض المعلومات المهمة:</p>
        <ul className="list-disc list-inside space-y-2 mr-4">
          <li>مشاركتك اختيارية، ويمكنك الانسحاب في أي وقت دون أي تأثير على مكانتك المهنية أو الأكاديمية.</li>
          <li>جميع البيانات التي يتم جمعها ستكون سرية تماماً ولن تُستخدم إلا لأغراض البحث العلمي.</li>
          <li>ستتضمن الدراسة اختبار الترابط الضمني (IAT) في علوم واضطرابات التواصل، يليه استبانة حول معتقداتك تجاه الأفراد ذوي اضطرابات التواصل.</li>
          <li>لا توجد إجابات صحيحة أو خاطئة، ونشجعك على التفاعل مع الاختبار بعفوية.</li>
        </ul>
        <p className="text-lg font-semibold mt-4 bg-gray-50 p-4 rounded-lg">
          بالضغط على "أوافق"، فإنك تؤكد/تؤكدين أنك قرأت وفهمت تفاصيل هذه الدراسة وتوافق/توافقين طوعًا على المشاركة.
        </p>
      </div>
      <Button onClick={onAgree}>أوافق</Button>
    </Card>
  );
};
