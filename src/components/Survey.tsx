
import React from "react";
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
    // Convert age ranges to numerical values for database
    switch (age) {
      case "20-30": return 1;
      case "31-40": return 2;
      case "41-50": return 3;
      case "51+": return 4;
      default: return 1;
    }
  };

  const formatExperience = (years: string): number => {
    // Convert experience ranges to numerical values for database
    switch (years) {
      case "لا يوجد خبرة/طالب": return 0;
      case "1-2": return 1;
      case "2-4": return 2;
      case "5-10": return 3;
      case "10+": return 4;
      default: return 0;
    }
  };

  const formatDegree = (degree: string): string => {
    // Convert degree to numerical values for database
    switch (degree) {
      case "طالب": return "1";
      case "بكالوريوس": return "2";
      case "ماجستير": return "3";
      case "دكتوراه": return "4";
      default: return "1";
    }
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
          <TabsTrigger value="demographics">البيانات الديموغرافية</TabsTrigger>
        </TabsList>
        <TabsContent value="demographics">
          <Demographics onComplete={handleComplete} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
