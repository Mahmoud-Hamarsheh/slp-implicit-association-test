
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
          <h1 className="text-3xl font-bold mb-4">IAT Test for Implicit Bias in Communication Disorders</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore and understand potential implicit biases related to communication disorders
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => navigate("/iat")} variant="default" className="bg-primary text-white">
              Start IAT Test
            </Button>
            <Button onClick={() => navigate("/admin")} variant="outline">
              Admin Dashboard
            </Button>
          </div>
          
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-xl">What would you like to do?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Card className="flex-1 cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/iat")}>
                <CardHeader>
                  <CardTitle className="text-center">Take the IAT Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Complete the Implicit Association Test to measure your implicit biases
                  </p>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-center">Bias Awareness Survey</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Complete the survey below to assess your explicit biases
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
        <BiasAwarenessSurvey onComplete={handleSurveyComplete} />
      </div>
    </div>
  );
};

export default Index;
