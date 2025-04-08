
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface InfoPopupProps {
  onContinue: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ onContinue }) => {
  return (
    <Card className="p-8 text-center space-y-6 fixed inset-0 flex flex-col items-center justify-center max-w-xl mx-auto my-auto bg-white/90 backdrop-blur-sm shadow-lg z-50 animate-fadeIn">
      <div className="flex items-center justify-center gap-2 text-primary">
        <AlertCircle className="w-8 h-8" />
        <h2 className="text-2xl font-bold">معلومات مهمة</h2>
      </div>
      
      <div className="text-lg">
        <p className="mb-4">سيتم جمع البيانات في هذا الاختبار بشكل مجهول للمساعدة في فهم التحيزات الضمنية.</p>
        <p className="mb-4">الرجاء الإجابة بصدق على جميع الأسئلة للحصول على نتائج دقيقة.</p>
        <p>نشكرك على مشاركتك في هذه الدراسة المهمة.</p>
      </div>
      
      <Button onClick={onContinue} className="mt-4 px-8">
        متابعة
      </Button>
    </Card>
  );
};
