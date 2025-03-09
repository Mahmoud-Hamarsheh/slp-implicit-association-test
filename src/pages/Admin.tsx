
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw } from "lucide-react";
import { IATResult, DashboardStats } from "@/types/iat-types";
import { calculateStats } from "@/utils/stats-calculator";
import { useDataExport } from "@/utils/export-data";
import Dashboard from "@/components/admin/Dashboard";
import DetailedResults from "@/components/admin/DetailedResults";

const Admin = () => {
  const [results, setResults] = useState<IATResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalParticipants: 0,
    averageDScore: 0,
    degreeDistribution: [],
    biasDistribution: []
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleExportData } = useDataExport();

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
      setStats(calculateStats(parsedData || []));
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
          <div className="flex gap-2">
            <Button onClick={fetchResults} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              تحديث
            </Button>
            <Button onClick={() => handleExportData(results)} variant="outline" size="sm">
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
              <Dashboard stats={stats} results={results} />
            </TabsContent>
            
            <TabsContent value="results">
              <DetailedResults results={results} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;
