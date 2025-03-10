
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  valueColor?: string;
  icon?: string;
  iconColor?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  subtext, 
  valueColor = "text-primary",
  icon,
  iconColor = "bg-primary/10"
}: StatCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {icon && (
            <div className={`${iconColor} p-2 rounded-full w-10 h-10 flex items-center justify-center`}>
              <span className="text-lg">{icon}</span>
            </div>
          )}
          <div>
            <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
