
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

interface DScoreDataPoint {
  id: string;
  value: number;
  color: string;
}

interface DScoreBarChartProps {
  data: DScoreDataPoint[];
}

export const DScoreBarChart = ({ data }: DScoreBarChartProps) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
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
            domain={[-0.3, 0.9]} 
            ticks={[-0.3, 0, 0.3, 0.6, 0.9]} 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(2), "D-Score"]}
            labelFormatter={(id) => `ID: ${id}`}
          />
          <Legend />
          <Bar dataKey="value" name="D-Score قيمة" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
