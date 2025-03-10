
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SurveyResponses {
  implicitBiasAwareness: number[];
  positiveAttitudes: number[];
  negativeAttitudes: number[];
  normalCommunication: string[];
  communicationDisorders: string[];
}

interface IATResult {
  id: string;
  created_at: string;
  d_score: number;
  age: number;
  years_experience: number;
  degree: string;
  survey_responses: SurveyResponses;
}

const Admin = () => {
  const [results, setResults] = useState<IATResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchResults();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('iat_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse the JSON survey_responses field
      const parsedData = data?.map(item => ({
        ...item,
        survey_responses: typeof item.survey_responses === 'string' 
          ? JSON.parse(item.survey_responses)
          : item.survey_responses
      })) as IATResult[];
      
      setResults(parsedData || []);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب النتائج",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">لوحة تحكم نتائج IAT</h1>
          <Button onClick={handleLogout} variant="outline">تسجيل الخروج</Button>
        </div>

        {loading ? (
          <Card className="p-6">
            <p className="text-center">جاري تحميل النتائج...</p>
          </Card>
        ) : results.length === 0 ? (
          <Card className="p-6">
            <p className="text-center">لا توجد نتائج حتى الآن</p>
          </Card>
        ) : (
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
                      <p><strong>الدرجة العلمية:</strong> {result.degree}</p>
                      <p><strong>تاريخ الاختبار:</strong> {new Date(result.created_at).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div>
                      <p><strong>الوعي بالتحيز الضمني:</strong> {result.survey_responses?.implicitBiasAwareness?.join(', ')}</p>
                      <p><strong>المواقف الإيجابية:</strong> {result.survey_responses?.positiveAttitudes?.join(', ')}</p>
                      <p><strong>المواقف السلبية:</strong> {result.survey_responses?.negativeAttitudes?.join(', ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
