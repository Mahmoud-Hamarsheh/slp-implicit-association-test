
import React from "react";
import { Card } from "@/components/ui/card";

export const TestDisabled: React.FC = () => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn">
      <h2 className="text-2xl font-bold">الاختبار غير متاح حاليًا</h2>
      <p className="text-lg">
        نأسف لإزعاجك، لكن الاختبار غير متاح حاليًا. يرجى المحاولة مرة أخرى في وقت لاحق.
      </p>
      <p className="text-sm text-muted-foreground">
        إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بمسؤول النظام.
      </p>
    </Card>
  );
};
