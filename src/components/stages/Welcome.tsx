
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onContinue: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onContinue }) => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h1 className="text-3xl font-bold">مرحباً بكم</h1>
      <div className="text-right space-y-4">
        <p>
          شكراً لمشاركتكم في هذه الدراسة البحثية التي تهدف إلى فهم الارتباطات الضمنية في ممارسة معالجة النطق واللغة.
        </p>
        <p>
          في هذه الدراسة، ستخضعون أولاً لاختبار الترابط الضمني (IAT) في علوم واضطرابات التواصل، يليه استبانة حول معتقداتك تجاه الأفراد ذوي اضطرابات التواصل، إلى جانب بعض الأسئلة الديموغرافية القياسية.
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
      <Button onClick={onContinue}>متابعة</Button>
    </Card>
  );
};
