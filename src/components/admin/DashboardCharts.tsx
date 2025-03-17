
import React from "react";
import { DegreeDistributionChart } from "./DegreeDistributionChart";
import { BiasDistributionChart } from "./BiasDistributionChart";
import { DScoreBarChart } from "./DScoreBarChart";
import { GenderDistributionChart } from "./GenderDistributionChart";
import { SurveyDistributionChart } from "./SurveyDistributionChart";
import { AgeDistributionChart } from "./AgeDistributionChart";
import { ExperienceDistributionChart } from "./ExperienceDistributionChart";

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
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  degreeData,
  biasData,
  dScoreData,
  genderData,
  surveyData,
  ageData,
  experienceData
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DegreeDistributionChart data={degreeData} />
        <BiasDistributionChart data={biasData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GenderDistributionChart data={genderData} />
        <SurveyDistributionChart data={surveyData} />
        <AgeDistributionChart data={ageData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExperienceDistributionChart data={experienceData} />
        <DScoreBarChart data={dScoreData} />
      </div>
    </div>
  );
};
