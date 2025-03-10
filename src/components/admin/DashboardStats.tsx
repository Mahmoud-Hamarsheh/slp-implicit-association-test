
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="إجمالي المشاركين" 
        value={totalParticipants} 
      />
      <StatCard 
        title="متوسط نتيجة D-Score" 
        value={avgDScore.toFixed(2)} 
        valueColor="text-red-500"
        subtext="تحيز متوسط مع السلوكيات التواصل مع السليمة"
      />
      <StatCard 
        title="أعلى نتيجة" 
        value={maxDScore.toFixed(2)} 
        valueColor="text-red-600"
      />
      <StatCard 
        title="أقل نتيجة" 
        value={minDScore.toFixed(2)} 
        valueColor="text-gray-500"
      />
    </div>
  );
};
