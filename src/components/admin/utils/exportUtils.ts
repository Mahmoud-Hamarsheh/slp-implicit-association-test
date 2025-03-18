
import { format } from "date-fns";
import { IATResult, degreeMapping } from "../types/iatResults";
import { getAgeRange, getExperienceRange, getIATInterpretation, getSurveyInterpretation } from "./helpers";

export const exportToCsv = (results: IATResult[], onSuccess: () => void, onError: (error: any) => void) => {
  try {
    // Base headers for demographic and IAT data
    const baseHeaders = [
      "ID", 
      "Age", 
      "Gender", 
      "Degree", 
      "Experience", 
      "IAT score", 
      "IAT Score interpretation", 
      "Survey score", 
      "Survey interpretation"
    ];
    
    // Get the maximum number of survey questions present in any result
    let surveyQuestions: Set<string> = new Set();
    results.forEach(result => {
      if (result.survey_responses) {
        try {
          const responses = typeof result.survey_responses === 'string' 
            ? JSON.parse(result.survey_responses) 
            : result.survey_responses;
            
          Object.keys(responses).forEach(key => {
            if (key.startsWith('q') && !isNaN(parseInt(key.substring(1)))) {
              surveyQuestions.add(key.toUpperCase());
            }
          });
        } catch (e) {
          console.error("Error parsing survey responses:", e);
        }
      }
    });
    
    // Sort the survey question keys numerically (Q1, Q2, Q3, etc.)
    const sortedQuestions = Array.from(surveyQuestions).sort((a, b) => {
      const numA = parseInt(a.substring(1));
      const numB = parseInt(b.substring(1));
      return numA - numB;
    });
    
    // Add Test Model to headers
    const headers = [...baseHeaders, ...sortedQuestions, "Test Model"];
    const csvRows = [headers.join(",")];
    
    results.forEach(result => {
      const gender = result.gender === 1 ? "ذكر" : result.gender === 2 ? "أنثى" : "غير محدد";
      const ageRange = getAgeRange(result.age);
      const experienceRange = getExperienceRange(result.years_experience);
      const interpretationText = getIATInterpretation(result.d_score);
      const surveyInterpretation = getSurveyInterpretation(result.survey_score);
      
      // Base row data
      const baseRow = [
        result.id,
        ageRange,
        gender,
        degreeMapping[result.degree] || result.degree,
        experienceRange,
        result.d_score.toFixed(2),
        interpretationText,
        result.survey_score?.toFixed(1) || "",
        surveyInterpretation
      ];
      
      // Parse and add survey question responses
      let surveyResponses: any = {};
      if (result.survey_responses) {
        try {
          surveyResponses = typeof result.survey_responses === 'string' 
            ? JSON.parse(result.survey_responses) 
            : result.survey_responses;
        } catch (e) {
          console.error("Error parsing survey responses for result:", result.id);
        }
      }
      
      // Add survey responses to the row
      const questionResponses = sortedQuestions.map(question => {
        const qKey = question.toLowerCase();
        return surveyResponses[qKey] || "";
      });
      
      // Add Test Model
      const row = [...baseRow, ...questionResponses, result.test_model || "غير محدد"];
      csvRows.push(row.join(","));
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "iat_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onSuccess();
  } catch (error) {
    console.error("Error exporting data:", error);
    onError(error);
  }
};
