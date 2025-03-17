
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { degreeMapping } from "./dashboardUtils";

interface ResultDetailsProps {
  results: any[];
}

export const ResultDetails: React.FC<ResultDetailsProps> = ({ results }) => {
  const [page, setPage] = useState(1);
  const resultsPerPage = 10;
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const paginatedResults = results.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const getAgeRange = (ageValue: number): string => {
    switch (ageValue) {
      case 1: return "20-30";
      case 2: return "31-40";
      case 3: return "41-50";
      case 4: return "51+";
      default: return "غير محدد";
    }
  };

  const getExperienceRange = (expValue: number): string => {
    switch (expValue) {
      case 0: return "لا يوجد خبرة";
      case 1: return "1-2 سنوات";
      case 2: return "2-4 سنوات";
      case 3: return "5-10 سنوات";
      case 4: return "10+ سنوات";
      default: return "غير محدد";
    }
  };

  const getBiasCategory = (dScore: number): string => {
    if (dScore > 0.65) return "تحيز قوي (سلبي)";
    if (dScore > 0.35) return "تحيز متوسط (سلبي)";
    if (dScore > 0.15) return "تحيز خفيف (سلبي)";
    if (dScore > -0.15) return "محايد";
    return "تحيز خفيف (إيجابي)";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">ID</TableHead>
              <TableHead className="text-right">D-Score</TableHead>
              <TableHead className="text-right">الفئة العمرية</TableHead>
              <TableHead className="text-right">سنوات الخبرة</TableHead>
              <TableHead className="text-right">المؤهل التعليمي</TableHead>
              <TableHead className="text-right">الجنس</TableHead>
              <TableHead className="text-right">نموذج الاختبار</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-mono text-xs text-right">
                  {result.id.substring(0, 8)}...
                </TableCell>
                <TableCell className="text-right">
                  <span 
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      result.d_score > 0.65 ? "bg-red-100 text-red-800" :
                      result.d_score > 0.35 ? "bg-orange-100 text-orange-800" :
                      result.d_score > 0.15 ? "bg-yellow-100 text-yellow-800" :
                      result.d_score > -0.15 ? "bg-green-100 text-green-800" :
                      "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {result.d_score.toFixed(3)} ({getBiasCategory(result.d_score)})
                  </span>
                </TableCell>
                <TableCell className="text-right">{getAgeRange(result.age)}</TableCell>
                <TableCell className="text-right">{getExperienceRange(result.years_experience)}</TableCell>
                <TableCell className="text-right">
                  {degreeMapping[result.degree] || result.degree}
                </TableCell>
                <TableCell className="text-right">
                  {result.gender === 1 ? "ذكر" : 
                   result.gender === 2 ? "أنثى" : 
                   "غير محدد"}
                </TableCell>
                <TableCell className="text-right">
                  {result.test_model || "غير محدد"}
                </TableCell>
                <TableCell className="text-right text-gray-500">
                  {format(new Date(result.created_at), "yyyy-MM-dd")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            السابق
          </Button>
          <div className="flex items-center px-2">
            صفحة {page} من {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
};
