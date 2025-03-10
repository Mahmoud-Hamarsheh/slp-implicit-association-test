
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            IAT Test for Implicit Bias in Communication Disorders
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore and understand potential implicit biases related to communication disorders
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => navigate("/")} variant="outline">
              Go to Survey
            </Button>
            <Button onClick={() => navigate("/admin")} variant="outline">
              Admin Dashboard
            </Button>
          </div>
        </div>
        
        <IAT onComplete={handleTestComplete} surveyData={{}} />
      </div>
    </div>
  );
};

export default IATPage;
