
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from "recharts";

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

  // Custom label renderer to show name + percentage
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={dataWithPercent[index].color}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  // Custom legend that matches the design
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
            <span style={{ color: entry.color }}>
              {entry.value}
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
            labelLine={true}
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
              `${value} (${Math.round((value / total) * 100)}%)`, 
              'عدد المشاركين'
            ]} 
          />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
