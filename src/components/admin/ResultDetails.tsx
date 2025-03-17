
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
      <div className="rounded-md border overflow-hidden">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>D-Score</TableHead>
              <TableHead>الفئة العمرية</TableHead>
              <TableHead>سنوات الخبرة</TableHead>
              <TableHead>المؤهل التعليمي</TableHead>
              <TableHead>الجنس</TableHead>
              <TableHead>نموذج الاختبار</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-mono text-xs">
                  {result.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
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
                <TableCell>{getAgeRange(result.age)}</TableCell>
                <TableCell>{getExperienceRange(result.years_experience)}</TableCell>
                <TableCell>
                  {degreeMapping[result.degree] || result.degree}
                </TableCell>
                <TableCell>
                  {result.gender === 1 ? "ذكر" : 
                   result.gender === 2 ? "أنثى" : 
                   "غير محدد"}
                </TableCell>
                <TableCell>
                  {result.test_model || "غير محدد"}
                </TableCell>
                <TableCell className="text-gray-500">
                  {format(new Date(result.created_at), "yyyy-MM-dd")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
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
