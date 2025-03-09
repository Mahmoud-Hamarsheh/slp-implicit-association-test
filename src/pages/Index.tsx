
import React from "react";
import { useNavigate } from "react-router-dom";
import BiasAwarenessSurvey from "@/components/BiasAwarenessSurvey";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">IAT Test for Implicit Bias in Communication Disorders</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore and understand potential implicit biases related to communication disorders
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/admin")} variant="outline">
              Admin Dashboard
            </Button>
          </div>
        </div>
        <BiasAwarenessSurvey />
      </div>
    </div>
  );
};

export default Index;
