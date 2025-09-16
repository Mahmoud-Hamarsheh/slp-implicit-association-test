
import { IATResult } from "../types/iatResults";

// English mappings for export
const degreeMapping: { [key: string]: string } = {
  "1": "Student",
  "2": "Bachelor's",
  "3": "Master's", 
  "4": "PhD"
};

const getAgeRangeEnglish = (ageValue: number): string => {
  switch (ageValue) {
    case 1: return "20-30";
    case 2: return "31-40";
    case 3: return "41-50";
    case 4: return "51+";
    default: return "Not specified";
  }
};

const getExperienceRangeEnglish = (expValue: number): string => {
  switch (expValue) {
    case 0: return "No experience";
    case 1: return "1-2 years";
    case 2: return "2-4 years";
    case 3: return "5-10 years";
    case 4: return "10+ years";
    default: return "Not specified";
  }
};

const getIATInterpretationEnglish = (dScore: number): string => {
  if (dScore > 0.65) return "Strong bias (negative)";
  if (dScore > 0.35) return "Moderate bias (negative)";
  if (dScore > 0.15) return "Slight bias (negative)";
  if (dScore >= -0.15) return "Neutral";
  if (dScore >= -0.35) return "Slight bias (positive)";
  if (dScore >= -0.65) return "Moderate bias (positive)";
  return "Strong bias (positive)";
};

const getSurveyInterpretationEnglish = (score?: number): string => {
  if (!score) return "Not available";
  if (score > 3.5) return "High";
  if (score > 2.5) return "Medium";
  return "Low";
};

// Map Arabic responses to numerical values
const responseValueMap = {
  'أوافق بشدة': 5,
  'أوافق': 4,
  'محايد': 3,
  'لا أوافق': 2,
  'لا أوافق بشدة': 1
};

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
      const gender = result.gender === 1 ? "Male" : result.gender === 2 ? "Female" : "Not specified";
      const ageRange = getAgeRangeEnglish(result.age);
      const experienceRange = getExperienceRangeEnglish(result.years_experience);
      const interpretationText = getIATInterpretationEnglish(result.d_score);
      const surveyInterpretation = getSurveyInterpretationEnglish(result.survey_score);
      
      // Base row data
      const baseRow = [
        `"${result.id}"`,
        `"${ageRange}"`,
        `"${gender}"`,
        `"${degreeMapping[result.degree] || result.degree}"`,
        `"${experienceRange}"`,
        `"${result.d_score.toFixed(2)}"`,
        `"${interpretationText}"`,
        `"${result.survey_score?.toFixed(1) || ''}"`,
        `"${surveyInterpretation}"`
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
      
      // Add survey responses to the row - convert text values to numerical weights
      const questionResponses = sortedQuestions.map(question => {
        const qKey = question.toLowerCase();
        const responseText = surveyResponses[qKey] || '';
        // Convert the Arabic text response to its numerical weight (1-5)
        const responseValue = responseValueMap[responseText] || '';
        return `"${responseValue}"`;
      });
      
      // Add Test Model
      const row = [...baseRow, ...questionResponses, `"${result.test_model || 'Not specified'}"`];
      csvRows.push(row.join(","));
    });
    
    // Create Blob with BOM (Byte Order Mark) for proper UTF-8 encoding
    const BOM = '\uFEFF'; // UTF-8 BOM character
    const csvString = BOM + csvRows.join("\n");
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
