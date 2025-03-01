
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";

interface BlockChangeAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const BlockChangeAlert: React.FC<BlockChangeAlertProps> = ({ 
  open, 
  onOpenChange, 
  onClose 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-xl">تنبيه هام</DialogTitle>
          <DialogDescription className="text-lg pt-4">
            انتبه! ستتغير أماكن التصنيفات في المرحلة القادمة.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="mt-4 mx-auto">فهمت</Button>
      </DialogContent>
    </Dialog>
  );
};
