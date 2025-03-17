
import { useState, useEffect } from "react";
import { TabNavigation } from "./TabNavigation";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { ResultDetails } from "./ResultDetails";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  prepareStats, 
  prepareDegreeData, 
  prepareBiasData, 
  prepareDScoreData, 
  prepareGenderData,
  prepareSurveyData,
  prepareAgeData,
  prepareExperienceData,
  exportToCsv,
  prepareTestModelData
} from "./dashboardUtils";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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

      // Sort results by creation date (newest first)
      const sortedResults = data || [];
      sortedResults.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setResults(sortedResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب النتائج من قاعدة البيانات.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    setExporting(true);
    exportToCsv(
      results,
      () => {
        toast({
          title: "تم التصدير بنجاح",
          description: "تم تصدير بيانات النتائج بنجاح إلى ملف CSV.",
        });
        setExporting(false);
      },
      (error) => {
        console.error("Error exporting data:", error);
        toast({
          title: "خطأ في التصدير",
          description: "حدث خطأ أثناء محاولة تصدير البيانات.",
          variant: "destructive"
        });
        setExporting(false);
      }
    );
  };

  // Prepare data for visualization
  const stats = prepareStats(results);
  const degreeData = prepareDegreeData(results);
  const biasData = prepareBiasData(results);
  const dScoreData = prepareDScoreData(results);
  const genderData = prepareGenderData(results);
  const surveyData = prepareSurveyData(results);
  const ageData = prepareAgeData(results);
  const experienceData = prepareExperienceData(results);
  const testModelData = prepareTestModelData(results);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting || results.length === 0}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          تصدير البيانات (CSV)
        </Button>
      </div>

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalResults={results.length}
      />

      {activeTab === "dashboard" && (
        <>
          <DashboardStats
            totalParticipants={stats.totalParticipants}
            avgDScore={stats.avgDScore}
            maxDScore={stats.maxDScore}
            minDScore={stats.minDScore}
            testModelData={testModelData}
          />
          
          <DashboardCharts
            degreeData={degreeData}
            biasData={biasData}
            dScoreData={dScoreData}
            genderData={genderData}
            surveyData={surveyData}
            ageData={ageData}
            experienceData={experienceData}
            testModelData={testModelData}
          />
        </>
      )}

      {activeTab === "results" && (
        <ResultDetails results={results} />
      )}
    </div>
  );
};

export { Dashboard };
