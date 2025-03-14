
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BiasCategory {
  name: string;
  value: number;
  color: string;
  percent?: number;
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

  // Custom label renderer to show only percentage
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="#fff"
        textAnchor="middle" 
        dominantBaseline="central"
        className="font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  // Custom legend that only shows name and percentage
  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1" 
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.value} ({dataWithPercent[index].percent}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="45%"
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
          <Tooltip 
            formatter={(value: number) => [
              `${Math.round((value / total) * 100)}%`, 
              'النسبة'
            ]} 
          />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
