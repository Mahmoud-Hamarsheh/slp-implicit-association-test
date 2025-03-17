
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  subtext?: string;
  valueColor?: string;
  icon?: string;
  iconColor?: string;
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  description,
  subtext, 
  valueColor = "text-primary",
  icon,
  iconColor = "bg-primary/10",
  className
}: StatCardProps) => {
  return (
    <Card className={`h-full ${className || ""}`}>
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
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
