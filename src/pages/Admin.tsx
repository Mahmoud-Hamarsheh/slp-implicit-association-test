
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, Filter, RefreshCw } from "lucide-react";

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
  survey_score?: number;
}

// D-score interpretation ranges
const interpretDScore = (dScore: number): string => {
  if (dScore > 0.65) return "تحيز قوي (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > 0.35) return "تحيز متوسط (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > 0.15) return "تحيز خفيف (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > -0.15) return "لا تحيز أو تحيز محايد";
  if (dScore > -0.35) return "تحيز خفيف (اضطرابات التواصل مع السمات الإيجابية)";
  if (dScore > -0.65) return "تحيز متوسط (اضطرابات التواصل مع السمات الإيجابية)";
  return "تحيز قوي (اضطرابات التواصل مع السمات الإيجابية)";
};

// Get color based on D-score
const getDScoreColor = (dScore: number): string => {
  if (dScore > 0.35) return "#ef4444"; // Strong/moderate positive bias (red)
  if (dScore > 0.15) return "#f97316"; // Slight positive bias (orange)
  if (dScore >= -0.15) return "#a3a3a3"; // Neutral (gray)
  if (dScore >= -0.35) return "#22c55e"; // Slight negative bias (light green)
  return "#16a34a"; // Strong/moderate negative bias (green)
};

const Admin = () => {
  const [results, setResults] = useState<IATResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    averageDScore: 0,
    degreeDistribution: [] as { name: string; value: number }[],
    biasDistribution: [] as { name: string; value: number }[]
  });
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
      calculateStats(parsedData || []);
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

  const calculateStats = (data: IATResult[]) => {
    if (!data.length) return;
    
    // Total participants
    const totalParticipants = data.length;
    
    // Average D-score
    const averageDScore = data.reduce((sum, item) => sum + item.d_score, 0) / totalParticipants;
    
    // Degree distribution
    const degreeMap: Record<string, number> = {};
    data.forEach(item => {
      const degreeLabel = getDegreeLabel(item.degree);
      degreeMap[degreeLabel] = (degreeMap[degreeLabel] || 0) + 1;
    });
    
    const degreeDistribution = Object.entries(degreeMap).map(([name, value]) => ({ name, value }));
    
    // Bias distribution
    const biasCategories: Record<string, number> = {
      "تحيز قوي (سلبي)": 0,
      "تحيز متوسط (سلبي)": 0,
      "تحيز خفيف (سلبي)": 0,
      "محايد": 0,
      "تحيز خفيف (إيجابي)": 0,
      "تحيز متوسط (إيجابي)": 0,
      "تحيز قوي (إيجابي)": 0
    };
    
    data.forEach(item => {
      if (item.d_score > 0.65) biasCategories["تحيز قوي (سلبي)"]++;
      else if (item.d_score > 0.35) biasCategories["تحيز متوسط (سلبي)"]++;
      else if (item.d_score > 0.15) biasCategories["تحيز خفيف (سلبي)"]++;
      else if (item.d_score >= -0.15) biasCategories["محايد"]++;
      else if (item.d_score >= -0.35) biasCategories["تحيز خفيف (إيجابي)"]++;
      else if (item.d_score >= -0.65) biasCategories["تحيز متوسط (إيجابي)"]++;
      else biasCategories["تحيز قوي (إيجابي)"]++;
    });
    
    const biasDistribution = Object.entries(biasCategories)
      .filter(([_, value]) => value > 0) // Only include categories with values
      .map(([name, value]) => ({ name, value }));
    
    setStats({
      totalParticipants,
      averageDScore,
      degreeDistribution,
      biasDistribution
    });
  };

  const getDegreeLabel = (degree: string): string => {
    switch (degree) {
      case "1": return "طالب";
      case "2": return "بكالوريوس";
      case "3": return "ماجستير";
      case "4": return "دكتوراه";
      default: return degree;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleExportData = () => {
    try {
      // Format the data for export
      const exportData = results.map(result => ({
        d_score: result.d_score,
        bias_interpretation: interpretDScore(result.d_score),
        age: result.age,
        years_experience: result.years_experience,
        degree: getDegreeLabel(result.degree),
        date: new Date(result.created_at).toLocaleDateString('ar-SA'),
        ...(result.survey_score !== undefined ? { survey_score: result.survey_score } : {})
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(obj => Object.values(obj).join(','));
      const csv = [headers, ...rows].join('\n');

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `iat_results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "تم تصدير البيانات بنجاح",
        description: "تم حفظ ملف CSV مع جميع النتائج",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تصدير البيانات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">لوحة تحكم نتائج IAT</h1>
          <div className="flex gap-2">
            <Button onClick={fetchResults} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              تحديث
            </Button>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              تصدير البيانات
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              تسجيل الخروج
            </Button>
          </div>
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
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
              <TabsTrigger value="results">النتائج التفصيلية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع الدرجة العلمية</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.degreeDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {stats.degreeDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} مشارك`, 'العدد']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع التحيز</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.biasDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {stats.biasDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} مشارك`, 'العدد']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>توزيع نتائج D-Score</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={results.map(r => ({
                        id: r.id.substring(0, 8),
                        d_score: r.d_score,
                        color: getDScoreColor(r.d_score)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="id" angle={-45} textAnchor="end" height={80} />
                      <YAxis label={{ value: 'D-Score', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [value, 'D-Score']} />
                      <Bar dataKey="d_score" name="D-Score">
                        {results.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getDScoreColor(results[index].d_score)} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results">
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;
