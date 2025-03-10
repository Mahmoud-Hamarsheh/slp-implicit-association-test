
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface IATResult {
  id: string;
  created_at: string;
  d_score: number;
  age: number;
  years_experience: number;
  degree: string;
  survey_responses: any;
  survey_score?: number;
}

interface ResultDetailsProps {
  results: IATResult[];
  degreeMapping: { [key: string]: string };
}

export const ResultDetails = ({ results, degreeMapping }: ResultDetailsProps) => {
  return (
    <div className="grid gap-6">
      {results.map((result) => (
        <Card key={result.id} className="animate-fadeIn">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex justify-between items-center flex-wrap">
              <span>نتيجة IAT: <span className={`${result.d_score < -0.35 ? 'text-red-500' : 'text-gray-600'}`}>
                {result.d_score.toFixed(2)}
              </span></span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(result.created_at), "d MMMM yyyy", { locale: ar })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <strong>العمر:</strong> 
                  <span>{result.age}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <strong>سنوات الخبرة:</strong> 
                  <span>{result.years_experience}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <strong>الدرجة العلمية:</strong> 
                  <span>{degreeMapping[result.degree] || result.degree}</span>
                </div>
              </div>
              <div className="space-y-2">
                {result.survey_score !== undefined && (
                  <div className="flex justify-between border-b pb-1">
                    <strong>درجة الوعي بالتحيز:</strong> 
                    <span>{result.survey_score.toFixed(2)}</span>
                  </div>
                )}
                {result.survey_responses && Object.entries(result.survey_responses).length > 0 && (
                  <div className="flex justify-between border-b pb-1">
                    <strong>عدد الإجابات على الاستبيان:</strong> 
                    <span>{Object.entries(result.survey_responses).length}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
