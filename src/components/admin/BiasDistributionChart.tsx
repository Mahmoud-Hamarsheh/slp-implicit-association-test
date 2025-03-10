
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from "recharts";
import { Tooltip as UITooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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

  // State to track which segments to show labels for
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width when resized
  useState(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Only show labels on larger screens
  const showLabels = windowWidth >= 768;

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
    // Don't show labels on small screens
    if (!showLabels) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    let displayName = name;
    
    // Format the display text
    if (name.includes("تحيز قوي")) {
      displayName = `تحيز قوي (سلبي) (${percent}%)`;
    } else if (name.includes("تحيز متوسط")) {
      displayName = `تحيز متوسط (سلبي) (${percent}%)`;
    } else if (name.includes("تحيز خفيف")) {
      displayName = `تحيز خفيف (سلبي) (${percent}%)`;
    } else {
      displayName = `محايد (${percent}%)`;
    }

    return (
      <text
        x={x}
        y={y}
        fill={name.includes("محايد") ? "#FF7043" : "#1E88E5"} 
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {displayName}
      </text>
    );
  };

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
            label={renderCustomizedLabel}
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
