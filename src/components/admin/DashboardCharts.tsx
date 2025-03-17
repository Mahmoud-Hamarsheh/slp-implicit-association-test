
import React from "react";
import { DegreeDistributionChart } from "./DegreeDistributionChart";
import { BiasDistributionChart } from "./BiasDistributionChart";
import { DScoreBarChart } from "./DScoreBarChart";
import { GenderDistributionChart } from "./GenderDistributionChart";
import { SurveyDistributionChart } from "./SurveyDistributionChart";
import { AgeDistributionChart } from "./AgeDistributionChart";
import { ExperienceDistributionChart } from "./ExperienceDistributionChart";
import { TestModelChart } from "./TestModelChart";

interface DashboardChartsProps {
  degreeData: {
    name: string;
    value: number;
    color: string;
  }[];
  biasData: {
    name: string;
    value: number;
    color: string;
  }[];
  dScoreData: {
    id: string;
    value: number;
    color: string;
  }[];
  genderData: {
    name: string;
    value: number;
    color: string;
  }[];
  surveyData: {
    name: string;
    value: number;
    color: string;
  }[];
  ageData: {
    name: string;
    value: number;
    color: string;
  }[];
  experienceData: {
    name: string;
    value: number;
    color: string;
  }[];
  testModelData: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  degreeData,
  biasData,
  dScoreData,
  genderData,
  surveyData,
  ageData,
  experienceData,
  testModelData
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DegreeDistributionChart data={degreeData} />
        <BiasDistributionChart data={biasData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <GenderDistributionChart data={genderData} />
        <TestModelChart data={testModelData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AgeDistributionChart data={ageData} />
        <SurveyDistributionChart data={surveyData} />
        <ExperienceDistributionChart data={experienceData} />
      </div>
      
      <div className="w-full">
        <DScoreBarChart data={dScoreData} />
      </div>
    </div>
  );
};
