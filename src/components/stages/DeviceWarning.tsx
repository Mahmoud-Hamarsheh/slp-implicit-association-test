
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
      <p className="text-lg">
        هذا الاختبار يتم فقط من خلال كمبيوتر / لابتوب ولا يعمل على الهاتف أو الآيباد
      </p>
      <Button onClick={onContinue}>فهمت</Button>
    </Card>
  );
};
