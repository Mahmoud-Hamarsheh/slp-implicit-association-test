
import React from "react";
import { useNavigate } from "react-router-dom";
import BiasAwarenessSurvey from "@/components/BiasAwarenessSurvey";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const handleSurveyComplete = () => {
    // Handle survey completion if needed
    console.log("Survey completed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Bias Awareness Survey</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore and understand your explicit biases related to communication disorders
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => navigate("/")} variant="default" className="bg-primary text-white">
              Back to IAT Test
            </Button>
            <Button onClick={() => navigate("/admin")} variant="outline">
              Admin Dashboard
            </Button>
          </div>
        </div>
        <BiasAwarenessSurvey onComplete={handleSurveyComplete} />
      </div>
    </div>
  );
};

export default Index;
