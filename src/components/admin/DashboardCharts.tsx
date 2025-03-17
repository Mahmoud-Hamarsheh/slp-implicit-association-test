
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DegreeDistributionChart } from "./DegreeDistributionChart";
import { BiasDistributionChart } from "./BiasDistributionChart";
import { DScoreBarChart } from "./DScoreBarChart";
import { GenderDistributionChart } from "./GenderDistributionChart";
import { SurveyDistributionChart } from "./SurveyDistributionChart";
import { AgeDistributionChart } from "./AgeDistributionChart";
import { ExperienceDistributionChart } from "./ExperienceDistributionChart";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardChartsProps {
  degreeData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  biasData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  dScoreData: Array<{
    id: string;
    value: number;
    color: string;
  }>;
  genderData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  surveyData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ageData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  experienceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const DashboardCharts = ({ 
  degreeData, 
  biasData, 
  dScoreData,
  genderData,
  surveyData,
  ageData,
  experienceData
}: DashboardChartsProps) => {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">توزيع الدرجة العلمية</CardTitle>
          </CardHeader>
          <CardContent>
            <DegreeDistributionChart data={degreeData} />
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">توزيع التحيز</CardTitle>
          </CardHeader>
          <CardContent>
            <BiasDistributionChart data={biasData} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">توزيع الجنس</CardTitle>
          </CardHeader>
          <CardContent>
            <GenderDistributionChart data={genderData} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">توزيع نتائج الاستبيان</CardTitle>
          </CardHeader>
          <CardContent>
            <SurveyDistributionChart data={surveyData} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">توزيع الفئات العمرية</CardTitle>
          </CardHeader>
          <CardContent>
            <AgeDistributionChart data={ageData} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">توزيع سنوات الخبرة</CardTitle>
          </CardHeader>
          <CardContent>
            <ExperienceDistributionChart data={experienceData} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-white shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold">D-Score توزيع نتائج</CardTitle>
        </CardHeader>
        <CardContent>
          <DScoreBarChart data={dScoreData} />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
