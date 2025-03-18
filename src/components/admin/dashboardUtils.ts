
import { format } from "date-fns";

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
  test_model?: string;
}

export const degreeMapping: { [key: string]: string } = {
  "1": "طالب",
  "2": "بكالوريوس",
  "3": "ماجستير",
  "4": "دكتوراه"
};

export const prepareStats = (results: IATResult[]) => {
  const totalParticipants = results.length;
  const dScores = results.map(r => r.d_score).filter(score => !isNaN(score));
  const avgDScore = dScores.length > 0 
    ? dScores.reduce((sum, score) => sum + score, 0) / dScores.length 
    : 0;
  const maxDScore = dScores.length > 0 ? Math.max(...dScores) : 0;
  const minDScore = dScores.length > 0 ? Math.min(...dScores) : 0;

  return { totalParticipants, avgDScore, maxDScore, minDScore };
};

export const prepareDegreeData = (results: IATResult[]) => {
  const degreeCount: { [key: string]: number } = {};
  results.forEach(result => {
    const degree = degreeMapping[result.degree] || result.degree;
    degreeCount[degree] = (degreeCount[degree] || 0) + 1;
  });

  const degreeColors: { [key: string]: string } = {
    "طالب": "#1E88E5",
    "بكالوريوس": "#FF7043",
    "ماجستير": "#26C6DA",
    "دكتوراه": "#FFC107"
  };

  return Object.entries(degreeCount).map(([name, value]) => ({
    name,
    value,
    color: degreeColors[name] || "#0077b6"
  }));
};

export const prepareBiasData = (results: IATResult[]) => {
  const biasCategories: { [key: string]: number } = {
    "تحيز قوي (سلبي)": 0,
    "تحيز متوسط (سلبي)": 0,
    "تحيز خفيف (سلبي)": 0,
    "محايد": 0,
    "تحيز خفيف (إيجابي)": 0
  };

  results.forEach(result => {
    const dScore = result.d_score;
    if (dScore > 0.65) {
      biasCategories["تحيز قوي (سلبي)"]++;
    } else if (dScore > 0.35) {
      biasCategories["تحيز متوسط (سلبي)"]++;
    } else if (dScore > 0.15) {
      biasCategories["تحيز خفيف (سلبي)"]++;
    } else if (dScore > -0.15) {
      biasCategories["محايد"]++;
    } else {
      biasCategories["تحيز خفيف (إيجابي)"]++;
    }
  });

  const biasColors = {
    "تحيز قوي (سلبي)": "#1E88E5",
    "تحيز متوسط (سلبي)": "#26C6DA",
    "تحيز خفيف (سلبي)": "#FFC107",
    "محايد": "#FF7043",
    "تحيز خفيف (إيجابي)": "#8E24AA"
  };

  return Object.entries(biasCategories)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: biasColors[name as keyof typeof biasColors]
    }));
};

export const prepareDScoreData = (results: IATResult[]) => {
  return results.slice(0, 20).map(result => ({
    id: result.id.substring(0, 8),
    value: result.d_score,
    color: result.d_score > 0.65 ? "#ef476f" : 
           result.d_score > 0.35 ? "#ffa15f" :
           result.d_score > 0.15 ? "#ffd166" : 
           result.d_score > -0.15 ? "#06d6a0" : 
           "#118ab2"
  }));
};

export const prepareGenderData = (results: IATResult[]) => {
  const genderCount = {
    "ذكر": 0,
    "أنثى": 0,
    "غير محدد": 0
  };
  
  results.forEach(result => {
    if (result.gender === 1) {
      genderCount["ذكر"]++;
    } else if (result.gender === 2) {
      genderCount["أنثى"]++;
    } else {
      genderCount["غير محدد"]++;
    }
  });

  const genderColors = {
    "ذكر": "#1E88E5",
    "أنثى": "#FF7043",
    "غير محدد": "#26C6DA"
  };

  return Object.entries(genderCount)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: genderColors[name as keyof typeof genderColors]
    }));
};

export const prepareSurveyData = (results: IATResult[]) => {
  const surveyCategories = {
    "مرتفع": 0,
    "متوسط": 0,
    "منخفض": 0,
    "غير متوفر": 0
  };
  
  results.forEach(result => {
    const score = result.survey_score;
    if (!score) {
      surveyCategories["غير متوفر"]++;
    } else if (score > 3.5) {
      surveyCategories["مرتفع"]++;
    } else if (score > 2.5) {
      surveyCategories["متوسط"]++;
    } else {
      surveyCategories["منخفض"]++;
    }
  });

  const surveyColors = {
    "مرتفع": "#8E24AA",
    "متوسط": "#FFC107",
    "منخفض": "#26C6DA",
    "غير متوفر": "#BDBDBD"
  };

  return Object.entries(surveyCategories)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: surveyColors[name as keyof typeof surveyColors]
    }));
};

export const prepareAgeData = (results: IATResult[]) => {
  const ageRanges = {
    "20-30": 0,
    "31-40": 0,
    "41-50": 0,
    "51+": 0,
    "غير محدد": 0
  };
  
  results.forEach(result => {
    switch(result.age) {
      case 1: ageRanges["20-30"]++; break;
      case 2: ageRanges["31-40"]++; break;
      case 3: ageRanges["41-50"]++; break;
      case 4: ageRanges["51+"]++; break;
      default: ageRanges["غير محدد"]++;
    }
  });

  const ageColors = {
    "20-30": "#1E88E5",
    "31-40": "#FF7043",
    "41-50": "#FFC107",
    "51+": "#8E24AA",
    "غير محدد": "#BDBDBD"
  };

  return Object.entries(ageRanges)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: ageColors[name as keyof typeof ageColors]
    }));
};

export const prepareExperienceData = (results: IATResult[]) => {
  const expRanges = {
    "لا يوجد خبرة": 0,
    "1-2": 0,
    "2-4": 0,
    "5-10": 0,
    "10+": 0,
    "غير محدد": 0
  };
  
  results.forEach(result => {
    switch(result.years_experience) {
      case 0: expRanges["لا يوجد خبرة"]++; break;
      case 1: expRanges["1-2"]++; break;
      case 2: expRanges["2-4"]++; break;
      case 3: expRanges["5-10"]++; break;
      case 4: expRanges["10+"]++; break;
      default: expRanges["غير محدد"]++;
    }
  });

  const expColors = {
    "لا يوجد خبرة": "#BDBDBD",
    "1-2": "#26C6DA",
    "2-4": "#FFC107",
    "5-10": "#FF7043",
    "10+": "#8E24AA",
    "غير محدد": "#9E9E9E"
  };

  return Object.entries(expRanges)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: expColors[name as keyof typeof expColors]
    }));
};

export const prepareTestModelData = (results: IATResult[]) => {
  const models = {
    A: 0,
    B: 0,
    Unknown: 0
  };

  results.forEach(result => {
    if (result.test_model === 'A') {
      models.A++;
    } else if (result.test_model === 'B') {
      models.B++;
    } else {
      models.Unknown++;
    }
  });

  return [
    { name: 'نموذج A', value: models.A, color: '#4CAF50' },
    { name: 'نموذج B', value: models.B, color: '#2196F3' },
    { name: 'غير معروف', value: models.Unknown, color: '#9E9E9E' }
  ].filter(item => item.value > 0);
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

// Helper functions for the export
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

const getIATInterpretation = (dScore: number): string => {
  if (dScore > 0.65) return "تحيز قوي (سلبي)";
  if (dScore > 0.35) return "تحيز متوسط (سلبي)";
  if (dScore > 0.15) return "تحيز خفيف (سلبي)";
  if (dScore > -0.15) return "محايد";
  if (dScore > -0.35) return "تحيز خفيف (إيجابي)";
  if (dScore > -0.65) return "تحيز متوسط (إيجابي)";
  return "تحيز قوي (إيجابي)";
};

const getSurveyInterpretation = (score?: number): string => {
  if (!score) return "غير متوفر";
  if (score > 3.5) return "مرتفع";
  if (score > 2.5) return "متوسط";
  return "منخفض";
};
