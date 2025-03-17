
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TabNavigation } from "./TabNavigation";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { ResultDetails } from "./ResultDetails";
import { 
  degreeMapping, 
  prepareStats, 
  prepareDegreeData, 
  prepareBiasData, 
  prepareDScoreData,
  prepareGenderData,
  prepareSurveyData,
  prepareAgeData,
  prepareExperienceData,
  exportToCsv
} from "./dashboardUtils";
import { RefreshCw, Download } from "lucide-react";

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

  const handleExportData = () => {
    exportToCsv(
      results,
      () => {
        toast({
          title: "تم تصدير البيانات",
          description: "تم تصدير البيانات بنجاح",
        });
      },
      (error) => {
        toast({
          title: "خطأ في تصدير البيانات",
          description: "حدث خطأ أثناء تصدير البيانات",
          variant: "destructive",
        });
      }
    );
  };

  // Prepare data for dashboard
  const stats = prepareStats(results);
  const degreeData = prepareDegreeData(results);
  const biasData = prepareBiasData(results);
  const dScoreData = prepareDScoreData(results);
  const genderData = prepareGenderData(results);
  const surveyData = prepareSurveyData(results);
  const ageData = prepareAgeData(results);
  const experienceData = prepareExperienceData(results);

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
            onClick={handleExportData}
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
          <DashboardStats {...stats} />
          <DashboardCharts 
            degreeData={degreeData}
            biasData={biasData}
            dScoreData={dScoreData}
            genderData={genderData}
            surveyData={surveyData}
            ageData={ageData}
            experienceData={experienceData}
          />
        </>
      ) : (
        <ResultDetails 
          results={results}
          degreeMapping={degreeMapping}
        />
      )}
    </div>
  );
};
