
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IATResult } from "@/types/iat-types";
import { getDScoreColor, interpretDScore, getDegreeLabel } from "@/utils/iat-utils";

interface DetailedResultsProps {
  results: IATResult[];
}

const DetailedResults = ({ results }: DetailedResultsProps) => {
  return (
    <div className="grid gap-6">
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              <span>نتيجة IAT: <span style={{ color: getDScoreColor(result.d_score) }}>{result.d_score.toFixed(2)}</span></span>
              <span className="text-sm text-muted-foreground">{interpretDScore(result.d_score)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>العمر:</strong> {result.age}</p>
                <p><strong>سنوات الخبرة:</strong> {result.years_experience}</p>
                <p><strong>الدرجة العلمية:</strong> {getDegreeLabel(result.degree)}</p>
                <p><strong>تاريخ الاختبار:</strong> {new Date(result.created_at).toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                {result.survey_score !== undefined && (
                  <p><strong>نتيجة الاستبيان:</strong> {result.survey_score}</p>
                )}
                {result.survey_responses?.implicitBiasAwareness && (
                  <p><strong>الوعي بالتحيز الضمني:</strong> {result.survey_responses?.implicitBiasAwareness?.join(', ')}</p>
                )}
                {result.survey_responses?.positiveAttitudes && (
                  <p><strong>المواقف الإيجابية:</strong> {result.survey_responses?.positiveAttitudes?.join(', ')}</p>
                )}
                {result.survey_responses?.negativeAttitudes && (
                  <p><strong>المواقف السلبية:</strong> {result.survey_responses?.negativeAttitudes?.join(', ')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DetailedResults;
