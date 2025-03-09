
import { IATResult } from "@/types/iat-types";
import { interpretDScore, getDegreeLabel } from "./iat-utils";
import { useToast } from "@/hooks/use-toast";

export const useDataExport = () => {
  const { toast } = useToast();

  const handleExportData = (results: IATResult[]) => {
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

  return { handleExportData };
};
