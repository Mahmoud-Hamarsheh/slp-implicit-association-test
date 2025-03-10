
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

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

// Helper function to get bias description based on d-score
const getBiasDescription = (dScore: number): string => {
  if (dScore > 0.65) return "تحيز قوي (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > 0.35) return "تحيز متوسط (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > 0.15) return "تحيز خفيف (اضطرابات التواصل مع السمات السلبية)";
  if (dScore < -0.15) return "لا يوجد تحيز أو تحيز محايد";
  return "محايد";
};

export const ResultDetails = ({ results, degreeMapping }: ResultDetailsProps) => {
  return (
    <div className="grid gap-6">
      {results.map((result) => (
        <Card key={result.id} className="animate-fadeIn overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Left side - colored status bar */}
              <div 
                className={`w-full md:w-1 h-2 md:h-auto ${
                  result.d_score > 0.65 ? 'bg-red-500' : 
                  result.d_score > 0.35 ? 'bg-orange-400' :
                  result.d_score > 0.15 ? 'bg-yellow-400' :
                  'bg-blue-500'
                }`}
              />
              
              <div className="p-6 flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold flex items-center">
                      <span className={`
                        ${result.d_score > 0.65 ? 'text-red-500' : 
                          result.d_score > 0.35 ? 'text-orange-500' :
                          result.d_score > 0.15 ? 'text-yellow-600' :
                          'text-blue-500'
                        }
                      `}>
                        نتيجة IAT: {result.d_score.toFixed(2)}
                      </span>
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {getBiasDescription(result.d_score)}
                    </p>
                  </div>
                  {result.survey_score !== undefined && (
                    <div className="md:text-left mt-2 md:mt-0">
                      <p className="font-medium">نتيجة الاستبيان: {result.survey_score.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <strong>العمر:</strong> 
                      <span>{result.age}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong>سنوات الخبرة:</strong> 
                      <span>{result.years_experience}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong>الدرجة العلمية:</strong> 
                      <span>{degreeMapping[result.degree] || result.degree}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <strong>تاريخ الاختبار:</strong> 
                      <span dir="ltr">{format(new Date(result.created_at), "yyyy/MM/dd")}</span>
                    </p>
                    {result.survey_responses && Object.entries(result.survey_responses).length > 0 && (
                      <p className="flex justify-between">
                        <strong>عدد إجابات الاستبيان:</strong> 
                        <span>{Object.entries(result.survey_responses).length}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
