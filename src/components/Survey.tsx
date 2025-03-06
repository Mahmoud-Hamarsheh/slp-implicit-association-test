
import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Demographics } from "./survey/Demographics";
import { DemographicData } from "./survey/types";

export interface SurveyProps {
  onComplete: (data: SurveyData) => void;
}

export interface SurveyData {
  age: number;
  yearsExperience: number;
  degree: string;
  gender: "male" | "female" | number;  // Updated to allow number values
}

export const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const formatAge = (age: string): number => {
    const parsedAge = parseInt(age, 10);
    return isNaN(parsedAge) ? 18 : parsedAge;
  };

  const formatExperience = (years: string): number => {
    const parsedYears = parseInt(years, 10);
    return isNaN(parsedYears) ? 0 : parsedYears;
  };

  const formatDegree = (degree: string): string => {
    return degree || "N/A";
  };

  const handleComplete = (data: DemographicData) => {
    const formattedData = {
      age: formatAge(data.age),
      yearsExperience: formatExperience(data.yearsExperience),
      degree: formatDegree(data.degree),
      gender: data.gender === "male" ? 1 : 2  // Store gender as 1 (male) or 2 (female)
    };
    onComplete(formattedData as SurveyData);
  };

  return (
    <Card className="w-full max-w-3xl p-8 mx-auto mt-8 animate-fadeIn">
      <Tabs defaultValue="demographics" className="w-full">
        <TabsList>
          <TabsTrigger value="demographics">معلومات أساسية</TabsTrigger>
        </TabsList>
        <TabsContent value="demographics">
          <Demographics onComplete={handleComplete} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
