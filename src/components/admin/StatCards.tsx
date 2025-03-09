
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDScoreColor, interpretDScore } from "@/utils/iat-utils";
import { DashboardStats, IATResult } from "@/types/iat-types";

interface StatCardsProps {
  stats: DashboardStats;
  results: IATResult[];
}

const StatCards = ({ stats, results }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المشاركين</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalParticipants}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">متوسط نتيجة D-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold" style={{ color: getDScoreColor(stats.averageDScore) }}>
            {stats.averageDScore.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">{interpretDScore(stats.averageDScore)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">أعلى نتيجة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold" style={{ color: getDScoreColor(Math.max(...results.map(r => r.d_score))) }}>
            {Math.max(...results.map(r => r.d_score)).toFixed(2)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">أقل نتيجة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold" style={{ color: getDScoreColor(Math.min(...results.map(r => r.d_score))) }}>
            {Math.min(...results.map(r => r.d_score)).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
