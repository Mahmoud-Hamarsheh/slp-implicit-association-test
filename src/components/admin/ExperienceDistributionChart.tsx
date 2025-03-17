
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ExperienceChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const ExperienceDistributionChart = ({ data }: ExperienceChartProps) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ChartContainer config={{}} className="aspect-square md:aspect-[4/3] w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Pie>
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value: number, name: string) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3">
        <ul className="flex flex-wrap justify-center gap-4">
          {data.map((entry, index) => (
            <li key={index} className="flex items-center">
              <span 
                className="w-3 h-3 inline-block mr-1 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span>{entry.name} ({entry.value})</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartContainer>
  );
};
