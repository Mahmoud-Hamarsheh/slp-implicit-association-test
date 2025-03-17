
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IATResult {
  id: string;
  created_at: string;
  d_score: number;
  age: number;
  years_experience: number;
  degree: string;
  gender?: number | null;
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

// Helper function to get survey interpretation based on survey score
const getSurveyInterpretation = (score?: number): string => {
  if (!score) return "غير متوفر";
  if (score <= 2.5) return "منخفض";
  if (score <= 3.5) return "متوسط";
  return "مرتفع";
};

// Helper function to get gender description
const getGenderDescription = (gender?: number | null): string => {
  if (gender === 1) return "ذكر";
  if (gender === 2) return "أنثى";
  return "غير محدد";
};

export const ResultDetails = ({ results, degreeMapping }: ResultDetailsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">النتائج التفصيلية</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right font-bold">ID</TableHead>
                  <TableHead className="text-right font-bold">الجنس</TableHead>
                  <TableHead className="text-right font-bold">العمر</TableHead>
                  <TableHead className="text-right font-bold">سنوات الخبرة</TableHead>
                  <TableHead className="text-right font-bold">الدرجة العلمية</TableHead>
                  <TableHead className="text-right font-bold">D-Score</TableHead>
                  <TableHead className="text-right font-bold">تفسير IAT</TableHead>
                  <TableHead className="text-right font-bold">نتيجة الاستبيان</TableHead>
                  <TableHead className="text-right font-bold">تفسير الاستبيان</TableHead>
                  <TableHead className="text-right font-bold">تاريخ الاختبار</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="whitespace-nowrap">{result.id.substring(0, 8)}</TableCell>
                    <TableCell>{getGenderDescription(result.gender)}</TableCell>
                    <TableCell>{result.age}</TableCell>
                    <TableCell>{result.years_experience}</TableCell>
                    <TableCell>{degreeMapping[result.degree] || result.degree}</TableCell>
                    <TableCell className={`
                      ${result.d_score > 0.65 ? 'text-red-500' : 
                        result.d_score > 0.35 ? 'text-orange-500' :
                        result.d_score > 0.15 ? 'text-yellow-600' :
                        'text-blue-500'
                      }
                    `}>{result.d_score.toFixed(2)}</TableCell>
                    <TableCell>{getBiasDescription(result.d_score)}</TableCell>
                    <TableCell>{result.survey_score !== undefined ? result.survey_score.toFixed(2) : 'غير متوفر'}</TableCell>
                    <TableCell>{getSurveyInterpretation(result.survey_score)}</TableCell>
                    <TableCell dir="ltr">{format(new Date(result.created_at), "yyyy/MM/dd")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <h3 className="text-lg font-bold mt-8 mb-4">البطاقات التفصيلية</h3>
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
                    <div className="md:text-left mt-2 md:mt-0">
                      <p className="font-medium">نتيجة الاستبيان: {result.survey_score !== undefined ? result.survey_score.toFixed(2) : 'غير متوفر'}</p>
                      <p className="text-sm text-gray-600">
                        التفسير: {getSurveyInterpretation(result.survey_score)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <strong>ID:</strong> 
                        <span>{result.id.substring(0, 8)}</span>
                      </p>
                      <p className="flex justify-between">
                        <strong>الجنس:</strong> 
                        <span>{getGenderDescription(result.gender)}</span>
                      </p>
                      <p className="flex justify-between">
                        <strong>العمر:</strong> 
                        <span>{result.age}</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <strong>سنوات الخبرة:</strong> 
                        <span>{result.years_experience}</span>
                      </p>
                      <p className="flex justify-between">
                        <strong>الدرجة العلمية:</strong> 
                        <span>{degreeMapping[result.degree] || result.degree}</span>
                      </p>
                      <p className="flex justify-between">
                        <strong>تاريخ الاختبار:</strong> 
                        <span dir="ltr">{format(new Date(result.created_at), "yyyy/MM/dd")}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
