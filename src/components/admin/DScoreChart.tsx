
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IATResult } from "@/types/iat-types";
import { getDScoreColor } from "@/utils/iat-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";

interface DScoreChartProps {
  results: IATResult[];
}

const DScoreChart = ({ results }: DScoreChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>توزيع نتائج D-Score</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={results.map(r => ({
              id: r.id.substring(0, 8),
              d_score: r.d_score,
              color: getDScoreColor(r.d_score)
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" angle={-45} textAnchor="end" height={80} />
            <YAxis label={{ value: 'D-Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [value, 'D-Score']} />
            <Bar dataKey="d_score" name="D-Score">
              {results.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getDScoreColor(results[index].d_score)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DScoreChart;
