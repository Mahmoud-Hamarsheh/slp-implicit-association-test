
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DegreeCount {
  name: string;
  value: number;
  color: string;
}

interface DegreeDistributionChartProps {
  data: DegreeCount[];
}

export const DegreeDistributionChart = ({ data }: DegreeDistributionChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => {
              // Don't show the label if the percentage is too small
              return percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : '';
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} (${((value / data.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(0)}%)`, 'عدد المشاركين']} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
