
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./StatCard";
import { TabNavigation } from "./TabNavigation";
import { DegreeDistributionChart } from "./DegreeDistributionChart";
import { BiasDistributionChart } from "./BiasDistributionChart";
import { DScoreBarChart } from "./DScoreBarChart";
import { RefreshCw, Download } from "lucide-react";

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

export const Dashboard = () => {
  const [results, setResults] = useState<IATResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
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

  const handleRefresh = () => {
    fetchResults();
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث البيانات بنجاح",
    });
  };

  const exportData = () => {
    try {
      // Convert data to CSV format
      const headers = ["ID", "D-Score", "Age", "Experience Years", "Degree", "Created At"];
      const csvRows = [headers.join(",")];
      
      results.forEach(result => {
        const row = [
          result.id,
          result.d_score.toString(),
          result.age.toString(),
          result.years_experience.toString(),
          result.degree,
          new Date(result.created_at).toLocaleDateString('ar-SA')
        ];
        csvRows.push(row.join(","));
      });
      
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "iat_results.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم تصدير البيانات",
        description: "تم تصدير البيانات بنجاح",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "خطأ في تصدير البيانات",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  // Compute statistics
  const totalParticipants = results.length;
  const dScores = results.map(r => r.d_score).filter(score => !isNaN(score));
  const avgDScore = dScores.length > 0 
    ? dScores.reduce((sum, score) => sum + score, 0) / dScores.length 
    : 0;
  const maxDScore = dScores.length > 0 ? Math.max(...dScores) : 0;
  const minDScore = dScores.length > 0 ? Math.min(...dScores) : 0;

  // Prepare degree distribution data
  const degreeMapping: { [key: string]: string } = {
    "1": "طالب",
    "2": "بكالوريوس",
    "3": "ماجستير",
    "4": "دكتوراه"
  };

  const degreeCount: { [key: string]: number } = {};
  results.forEach(result => {
    const degree = degreeMapping[result.degree] || result.degree;
    degreeCount[degree] = (degreeCount[degree] || 0) + 1;
  });

  const degreeData = Object.entries(degreeCount).map(([name, value]) => ({
    name,
    value,
    color: name === "بكالوريوس" ? "#4cc9f0" : name === "ماجستير" ? "#3a86ff" : "#0077b6"
  }));

  // Prepare bias distribution data
  const biasCategories: { [key: string]: number } = {
    "تحيز قوي (سلبي)": 0,
    "تحيز متوسط (سلبي)": 0,
    "تحيز خفيف (سلبي)": 0,
    "محايد": 0
  };

  results.forEach(result => {
    const dScore = result.d_score;
    if (dScore < -0.65) {
      biasCategories["تحيز قوي (سلبي)"]++;
    } else if (dScore < -0.35) {
      biasCategories["تحيز متوسط (سلبي)"]++;
    } else if (dScore < -0.15) {
      biasCategories["تحيز خفيف (سلبي)"]++;
    } else {
      biasCategories["محايد"]++;
    }
  });

  const biasData = Object.entries(biasCategories).map(([name, value]) => ({
    name,
    value,
    color: name === "تحيز قوي (سلبي)" ? "#3a86ff" : 
           name === "تحيز متوسط (سلبي)" ? "#4cc9f0" : 
           name === "تحيز خفيف (سلبي)" ? "#ffd166" : 
           "#ff7b25"
  }));

  // Prepare D-Score distribution data
  const dScoreData = results.slice(0, 20).map(result => ({
    id: result.id.substring(0, 8),
    value: result.d_score,
    color: result.d_score < 0 ? "#adb5bd" : 
           result.d_score < 0.3 ? "#ff9e00" : 
           result.d_score < 0.6 ? "#ff5d73" : 
           "#ff4d6d"
  }));

  const tabs = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "details", label: "النتائج التفصيلية" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportData}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            تصدير البيانات
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            تحديث
          </Button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="إجمالي المشاركين" 
              value={totalParticipants} 
            />
            <StatCard 
              title="متوسط نتيجة D-Score" 
              value={avgDScore.toFixed(2)} 
              valueColor="text-red-500"
              subtext="تحيز متوسط مع السلوكيات التواصل مع السليمة"
            />
            <StatCard 
              title="أعلى نتيجة" 
              value={maxDScore.toFixed(2)} 
              valueColor="text-red-600"
            />
            <StatCard 
              title="أقل نتيجة" 
              value={minDScore.toFixed(2)} 
              valueColor="text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الدرجة العلمية</CardTitle>
              </CardHeader>
              <CardContent>
                <DegreeDistributionChart data={degreeData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>توزيع التحيز</CardTitle>
              </CardHeader>
              <CardContent>
                <BiasDistributionChart data={biasData} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>D-Score توزيع نتائج</CardTitle>
            </CardHeader>
            <CardContent>
              <DScoreBarChart data={dScoreData} />
            </CardContent>
          </Card>
        </>
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
      )}
    </div>
  );
};
