
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
