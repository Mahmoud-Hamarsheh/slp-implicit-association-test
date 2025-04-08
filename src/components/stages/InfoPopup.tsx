import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, GraduationCap, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface InfoPopupProps {
  onContinue: () => void;
  initialStep?: "specialist" | "info";
  onSpecialistSelect?: (type: string) => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ 
  onContinue, 
  initialStep = "specialist", 
  onSpecialistSelect 
}) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(initialStep === "info");
  const [currentStep, setCurrentStep] = useState<"specialist" | "info">(initialStep);

  const handleSelection = (value: string) => {
    setSelection(value);
    if (onSpecialistSelect) {
      onSpecialistSelect(value);
    }
  };

  const handleProceed = () => {
    if (!selection) {
      return; // Don't proceed without selection
    }
    
    if (initialStep === "specialist") {
      // If we started with the specialist question, we can just continue
      onContinue();
    } else {
      // Otherwise show the info step
      setShowInfo(true);
      setCurrentStep("info");
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <Card className="p-8 text-center space-y-6 fixed inset-0 flex flex-col items-center justify-center max-w-xl mx-auto my-auto bg-white/90 backdrop-blur-sm shadow-lg z-50 animate-fadeIn">
      {currentStep === "specialist" && !showInfo ? (
        <>
          <div className="flex items-center justify-center gap-2 text-primary">
            <GraduationCap className="w-8 h-8" />
            <h2 className="text-2xl font-bold">هل أنت أخصائي، مُعالج، أو طالب نطق ولغة؟</h2>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => handleSelection("yes")} 
              className={selection === "yes" ? "ring-2 ring-primary" : ""}>
              نعم
            </Button>
            <Button variant="outline" onClick={() => handleSelection("no")}
              className={selection === "no" ? "ring-2 ring-primary" : ""}>
              لا
            </Button>
          </div>
          
          <Button 
            onClick={handleProceed} 
            className="mt-4 px-8"
            disabled={!selection}
          >
            متابعة
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center gap-2 text-primary">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">معلومات مهمة</h2>
          </div>
          
          <div className="text-lg">
            <p className="mb-4">سيتم جمع البيانات في هذا الاختبار بشكل مجهول للمساعدة في فهم التحيزات الضمنية.</p>
            <p className="mb-4">الرجاء الإجابة بصدق على جميع الأسئلة للحصول على نتائج دقيقة.</p>
            <p>نشكرك على مشاركتك في هذه الدراسة المهمة.</p>
          </div>
          
          <Button onClick={handleContinue} className="mt-4 px-8">
            متابعة
          </Button>
        </>
      )}
    </Card>
  );
};
