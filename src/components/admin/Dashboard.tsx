
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
import { Download, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
    
    // Set up auto-refresh to show new data as it comes in
    const interval = setInterval(() => {
      fetchResults();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      console.log("=== FETCHING IAT RESULTS ===");
      
      // Check current auth session
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session ? "exists" : "null");
      console.log("User ID:", session?.user?.id || "none");
      
      // Check admin flag from localStorage
      const isAdmin = localStorage.getItem("isAdmin");
      console.log("Admin flag in localStorage:", isAdmin);
      
      if (isAdmin === "true") {
        console.log("Using localStorage admin bypass for data access");
      }
      
      const { data, error } = await supabase
        .from('iat_results')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("Query result:", { 
        dataCount: data?.length || 0, 
        error: error ? error.message : null,
        errorCode: error?.code || null 
      });
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      // Sort results by creation date (newest first)
      const sortedResults = data || [];
      sortedResults.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      console.log("Sorted results count:", sortedResults.length);
      setResults(sortedResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب النتائج من قاعدة البيانات: " + (error?.message || "خطأ غير معروف"),
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
      <div className="flex justify-between items-center">
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
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchResults}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث البيانات
          </Button>
          <span className="text-sm text-gray-500">
            آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
          </span>
        </div>
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
