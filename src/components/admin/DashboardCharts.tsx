
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DegreeDistributionChart } from "./DegreeDistributionChart";
import { BiasDistributionChart } from "./BiasDistributionChart";
import { DScoreBarChart } from "./DScoreBarChart";

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
}

export const DashboardCharts = ({ degreeData, biasData, dScoreData }: DashboardChartsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الدرجة العلمية</CardTitle>
          </CardHeader>
          <CardContent>
            <DegreeDistributionChart data={degreeData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>توزيع التحيز</CardTitle>
          </CardHeader>
          <CardContent>
            <BiasDistributionChart data={biasData} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>D-Score توزيع نتائج</CardTitle>
        </CardHeader>
        <CardContent>
          <DScoreBarChart data={dScoreData} />
        </CardContent>
      </Card>
    </>
  );
};
