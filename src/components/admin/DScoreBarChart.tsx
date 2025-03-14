
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
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
            left: 40,
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
          <Tooltip 
            formatter={(value: number) => [value.toFixed(2), "D-Score"]}
            labelFormatter={(id) => `ID: ${id}`}
          />
          <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
          <Bar dataKey="value" name="D-Score قيمة" fill="#8884d8" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
