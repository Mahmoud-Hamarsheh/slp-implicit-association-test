
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card key={result.id}>
          <CardHeader>
            <CardTitle className="text-xl">
              نتيجة IAT: {result.d_score.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>العمر:</strong> {result.age}</p>
                <p><strong>سنوات الخبرة:</strong> {result.years_experience}</p>
                <p><strong>الدرجة العلمية:</strong> {degreeMapping[result.degree] || result.degree}</p>
                <p><strong>تاريخ الاختبار:</strong> {new Date(result.created_at).toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                {result.survey_score && (
                  <p><strong>درجة الوعي بالتحيز:</strong> {result.survey_score.toFixed(2)}</p>
                )}
                {result.survey_responses && Object.entries(result.survey_responses).length > 0 && (
                  <p><strong>عدد الإجابات على الاستبيان:</strong> {Object.entries(result.survey_responses).length}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
