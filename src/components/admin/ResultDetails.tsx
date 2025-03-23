
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { degreeMapping } from "./dashboardUtils";
import { getAgeRange, getExperienceRange, getIATInterpretation } from "./utils/helpers";

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
                      result.d_score >= -0.15 ? "bg-green-100 text-green-800" :
                      result.d_score >= -0.35 ? "bg-blue-100 text-blue-800" :
                      result.d_score >= -0.65 ? "bg-indigo-100 text-indigo-800" :
                      "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {result.d_score.toFixed(3)} ({getIATInterpretation(result.d_score)})
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
