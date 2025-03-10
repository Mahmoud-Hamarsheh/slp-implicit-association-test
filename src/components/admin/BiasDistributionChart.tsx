
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from "recharts";
import { useState } from "react";

interface BiasCategory {
  name: string;
  value: number;
  color: string;
}

interface BiasDistributionChartProps {
  data: BiasCategory[];
}

export const BiasDistributionChart = ({ data }: BiasDistributionChartProps) => {
  // Calculate percentages for each category
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = data.map(item => ({
    ...item,
    percent: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-bold" style={{ color: data.color }}>{data.name}</p>
          <p>{data.percent}%</p>
        </div>
      );
    }
    return null;
  };

  // Simplified content for Legend to only show colors
  const renderLegendContent = (value: string, entry: any) => {
    const { color } = entry;
    
    let displayName = value;
    if (value.includes("تحيز قوي")) {
      displayName = "تحيز قوي (سلبي)";
    } else if (value.includes("تحيز متوسط")) {
      displayName = "تحيز متوسط (سلبي)";
    } else if (value.includes("تحيز خفيف")) {
      displayName = "تحيز خفيف (سلبي)";
    } else {
      displayName = "محايد";
    }
    
    return (
      <span style={{ color, marginRight: 10 }}>
        {displayName} ({entry.payload.percent}%)
      </span>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={false}
            startAngle={90}
            endAngle={-270}
          >
            {dataWithPercent.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={renderLegendContent}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
