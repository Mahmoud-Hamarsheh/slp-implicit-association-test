
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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

  // Calculate total for percentages
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  // Prepare data for chart configuration
  const config = data.reduce((acc, item) => {
    acc[item.name] = { color: item.color, label: item.name };
    return acc;
  }, {} as Record<string, { color: string; label: string }>);

  // Create a legend component
  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center mt-4 gap-3">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              style={{ backgroundColor: entry.color }} 
              className="w-3 h-3 rounded-full mr-1"
            />
            <span className="text-xs">
              {entry.name}: {((entry.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-72 p-4">
      <h3 className="text-md font-semibold mb-2">توزيع الفئات العمرية</h3>
      <ChartContainer className="h-44 w-full" config={config}>
        <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value) => [`${value} (${((value as number / total) * 100).toFixed(1)}%)`, 'العدد']}
              />
            }
          />
        </PieChart>
      </ChartContainer>
      {renderLegend()}
    </Card>
  );
};
