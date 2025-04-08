
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoPopup } from "./InfoPopup";

interface IATExperienceProps {
  onSelectYes: () => void;
  onSelectNo: () => void;
}

export const IATExperience: React.FC<IATExperienceProps> = ({ onSelectYes, onSelectNo }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedYes, setSelectedYes] = useState(false);

  const handleYesClick = () => {
    setSelectedYes(true);
    setShowPopup(true);
  };

  const handleNoClick = () => {
    setSelectedYes(false);
    setShowPopup(true);
  };

  const handlePopupContinue = () => {
    if (selectedYes) {
      onSelectYes();
    } else {
      onSelectNo();
    }
  };

  return (
    <>
      <Card className="p-8 text-center space-y-6 animate-slideIn">
        <h2 className="text-2xl font-bold">هل سبق لك أن خضعت لاختبار الترابط الضمني (IAT) من قبل؟</h2>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleYesClick}>نعم</Button>
          <Button onClick={handleNoClick}>لا</Button>
        </div>
      </Card>

      {showPopup && <InfoPopup onContinue={handlePopupContinue} />}
    </>
  );
};
