
import React from "react";
import { StatCard } from "./StatCard";
import { TestModelChart } from "./TestModelChart";

interface DashboardStatsProps {
  totalParticipants: number;
  avgDScore: number;
  maxDScore: number;
  minDScore: number;
  testModelData: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalParticipants,
  avgDScore,
  maxDScore,
  minDScore,
  testModelData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="عدد المشاركين"
          value={totalParticipants.toString()}
          description="إجمالي المشاركين في الدراسة"
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatCard
          title="متوسط D-Score"
          value={avgDScore.toFixed(3)}
          description="متوسط مقياس التحيز الضمني"
          className="bg-gradient-to-br from-amber-50 to-amber-100"
        />
        <StatCard
          title="أعلى D-Score"
          value={maxDScore.toFixed(3)}
          description="أعلى قيمة تحيز ضمني مسجلة"
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatCard
          title="أدنى D-Score"
          value={minDScore.toFixed(3)}
          description="أدنى قيمة تحيز ضمني مسجلة"
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
      </div>
      <div className="lg:col-span-1">
        <TestModelChart data={testModelData} />
      </div>
    </div>
  );
};
