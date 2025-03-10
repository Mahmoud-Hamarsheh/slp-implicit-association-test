import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

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

  // Custom label renderer that shows name and percentage based on position
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
    const RADIAN = Math.PI / 180;
    // Position the labels further away from the pie
    const radius = outerRadius * 1.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Determine quadrant and adjust text
    const quadrant = Math.floor((-midAngle % 360) / 90) + 1;
    let displayName = name;
    
    // Keep only the main text and percentage for display
    // For labels on right side (quadrants 1 and 4)
    if (x > cx) {
      if (name.includes("تحيز قوي")) {
        displayName = `تحيز قوي (سلبي) (${percent}%)`;
      } else if (name.includes("تحيز متوسط")) {
        displayName = `تحيز متوسط (سلبي) (${percent}%)`;
      } else if (name.includes("تحيز خفيف")) {
        displayName = `تحيز خفيف (سلبي) (${percent}%)`;
      } else {
        displayName = `محايد (${percent}%)`;
      }
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
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value) => (
              <span style={{ 
                color: dataWithPercent.find(item => item.name === value)?.color, 
                fontSize: 14,
                fontWeight: 500
              }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
