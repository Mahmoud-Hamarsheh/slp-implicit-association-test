
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface AgeDistributionProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const AgeDistributionChart: React.FC<AgeDistributionProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>لا توجد بيانات كافية</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow">
          <p className="font-bold">{`${payload[0].name}`}</p>
          <p>{`العدد: ${payload[0].value}`}</p>
          <p>{`النسبة: ${((payload[0].value / data.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-72 p-4">
      <h3 className="text-md font-semibold mb-2">توزيع الفئات العمرية</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
