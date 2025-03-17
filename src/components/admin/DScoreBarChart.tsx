
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend
} from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DScoreDataPoint {
  id: string;
  value: number;
  color: string;
}

interface DScoreBarChartProps {
  data: DScoreDataPoint[];
}

export const DScoreBarChart = ({ data }: DScoreBarChartProps) => {
  if (!data || data.length === 0) {
    return <div>لا توجد بيانات كافية</div>;
  }

  // Prepare data for chart configuration
  const config = data.reduce((acc, item) => {
    acc[item.id] = { color: item.color };
    return acc;
  }, {} as Record<string, { color: string }>);

  return (
    <Card className="h-[350px] p-4">
      <h3 className="text-md font-semibold mb-2">توزيع D-Score</h3>
      <ChartContainer className="h-[300px] w-full" config={config}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="id" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            domain={[-0.6, 1.2]} 
            ticks={[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]} 
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'D-Score', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12 }
            }}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value) => [(value as number).toFixed(2), "D-Score"]}
                labelFormatter={(id) => `ID: ${id}`}
              />
            }
          />
          <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
          <Bar dataKey="value" name="D-Score" fill="#8884d8" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <Legend />
        </BarChart>
      </ChartContainer>
    </Card>
  );
};
