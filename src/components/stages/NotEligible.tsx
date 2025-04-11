
import React from "react";
import { Card } from "@/components/ui/card";

export const NotEligible: React.FC = () => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">شكراً لاهتمامك</h2>
      <p className="text-lg">
        هذه الدراسة مخصصة لأخصائيي ومعالجي وطلاب النطق واللغة.
      </p>
      <p>جاري التوجيه...</p>
    </Card>
  );
};
