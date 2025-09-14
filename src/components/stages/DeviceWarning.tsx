
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Laptop } from "lucide-react";

interface DeviceWarningProps {
  onContinue: () => void;
}

export const DeviceWarning: React.FC<DeviceWarningProps> = ({ onContinue }) => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <div className="flex justify-center">
        <AlertTriangle size={48} className="text-yellow-500" />
      </div>
      <h2 className="text-2xl font-bold">تنبيه</h2>
      
      <div className="space-y-4">
        <div className="flex justify-center items-center gap-3">
          <Laptop className="text-blue-500" size={24} />
          <p className="text-lg">
            أنت تستخدم جهاز كمبيوتر أو لابتوب
          </p>
        </div>
        <p>
          يمكنك استخدام مفتاحي "K" و"D" للإجابة على الاختبار.
        </p>
        <p className="text-sm text-blue-600">
          ملاحظة: تأكد من أنك تستخدم لوحة مفاتيح للاستجابة السريعة والدقيقة.
        </p>
      </div>
      
      <Button onClick={onContinue}>متابعة</Button>
    </Card>
  );
};
