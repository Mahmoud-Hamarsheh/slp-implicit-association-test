
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { IAT } from "@/components/IAT";

const IATPage = () => {
  const navigate = useNavigate();

  const handleTestComplete = (result: number, allResponses: any[]) => {
    console.log("Test completed with score:", result);
    console.log("All responses:", allResponses);
    // Handle completion logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            اختبار الترابط الضمني (IAT) في علوم واضطرابات التواصل
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            استكشاف وفهم التحيزات الضمنية المحتملة المتعلقة باضطرابات التواصل
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => navigate("/survey")} variant="outline">
              الانتقال إلى الاستبيان
            </Button>
          </div>
        </div>
        
        <IAT 
          onComplete={handleTestComplete} 
          surveyData={{
            age: 0,
            yearsExperience: 0,
            degree: "",
            gender: "male",
            biasAwarenessResponses: {
              implicitBiasAwareness: [],
              positiveAttitudes: [],
              negativeAttitudes: [],
              normalCommunication: [],
              communicationDisorders: []
            }
          }} 
        />
      </div>
    </div>
  );
};

export default IATPage;
