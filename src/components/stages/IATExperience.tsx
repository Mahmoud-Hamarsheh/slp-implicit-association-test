
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IATExperienceProps {
  onSelectYes: () => void;
  onSelectNo: () => void;
}

export const IATExperience: React.FC<IATExperienceProps> = ({ onSelectYes, onSelectNo }) => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">هل سبق لك أن خضعت لاختبار الترابط الضمني (IAT) من قبل؟</h2>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onSelectYes}>نعم</Button>
        <Button onClick={onSelectNo}>لا</Button>
      </div>
    </Card>
  );
};
