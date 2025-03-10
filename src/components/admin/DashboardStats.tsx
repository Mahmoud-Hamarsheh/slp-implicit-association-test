
import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  totalParticipants: number;
  avgDScore: number;
  maxDScore: number;
  minDScore: number;
}

export const DashboardStats = ({ 
  totalParticipants, 
  avgDScore, 
  maxDScore, 
  minDScore 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="إجمالي المشاركين" 
        value={totalParticipants.toString()} 
        valueColor="text-primary"
        iconColor="bg-primary/10"
        icon="👥"
      />
      <StatCard 
        title="متوسط نتيجة D-Score" 
        value={avgDScore.toFixed(2)} 
        valueColor={avgDScore < -0.35 ? "text-red-500" : "text-gray-600"}
        subtext={avgDScore < -0.35 ? "تحيز متوسط" : "تحيز خفيف أو محايد"}
        iconColor="bg-blue-100"
        icon="📊"
      />
      <StatCard 
        title="أعلى نتيجة" 
        value={maxDScore.toFixed(2)} 
        valueColor="text-green-600"
        iconColor="bg-green-100"
        icon="⬆️"
      />
      <StatCard 
        title="أقل نتيجة" 
        value={minDScore.toFixed(2)} 
        valueColor="text-red-600"
        iconColor="bg-red-100"
        icon="⬇️"
      />
    </div>
  );
};
