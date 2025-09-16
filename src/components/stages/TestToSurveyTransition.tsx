import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";

interface TestToSurveyTransitionProps {
  open: boolean;
  onContinue: () => void;
}

export const TestToSurveyTransition: React.FC<TestToSurveyTransitionProps> = ({ 
  open, 
  onContinue 
}) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-xl">المرحلة التالية</DialogTitle>
          <DialogDescription className="text-lg pt-4">
            الآن سوف تنتقلون إلى استبانة لقياس الاتجاهات الصريحة اتجاه الأفراد من ذوي اضطرابات التواصل
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onContinue} className="mt-4 mx-auto">متابعة</Button>
      </DialogContent>
    </Dialog>
  );
};