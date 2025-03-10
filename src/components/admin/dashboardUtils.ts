
import { format } from "date-fns";

interface IATResult {
  id: string;
  created_at: string;
  d_score: number;
  age: number;
  years_experience: number;
  degree: string;
  survey_responses: any;
  survey_score?: number;
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

  // Define consistent colors for degrees
  const degreeColors: { [key: string]: string } = {
    "طالب": "#4EA8DE",
    "بكالوريوس": "#56CFE1",
    "ماجستير": "#5E60CE",
    "دكتوراه": "#7400B8"
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
    "محايد": 0
  };

  results.forEach(result => {
    const dScore = result.d_score;
    // Updated categorization based on the correct D-score ranges
    if (dScore > 0.65) {
      biasCategories["تحيز قوي (سلبي)"]++;
    } else if (dScore > 0.35) {
      biasCategories["تحيز متوسط (سلبي)"]++;
    } else if (dScore > 0.15) {
      biasCategories["تحيز خفيف (سلبي)"]++;
    } else {
      biasCategories["محايد"]++; // Both neutral zone and slight positive bias
    }
  });

  // Define better distinct colors
  const biasColors = {
    "تحيز قوي (سلبي)": "#ef476f",
    "تحيز متوسط (سلبي)": "#ffd166",
    "تحيز خفيف (سلبي)": "#06d6a0",
    "محايد": "#118ab2"
  };

  return Object.entries(biasCategories).map(([name, value]) => ({
    name,
    value,
    color: biasColors[name as keyof typeof biasColors]
  }));
};

export const prepareDScoreData = (results: IATResult[]) => {
  return results.slice(0, 20).map(result => ({
    id: result.id.substring(0, 8),
    value: result.d_score,
    // Updated color logic based on the correct D-score ranges
    color: result.d_score > 0.65 ? "#ef476f" : 
           result.d_score > 0.35 ? "#ffd166" : 
           result.d_score > 0.15 ? "#06d6a0" : 
           "#118ab2"
  }));
};

export const exportToCsv = (results: IATResult[], onSuccess: () => void, onError: (error: any) => void) => {
  try {
    // Convert data to CSV format
    const headers = ["ID", "D-Score", "Age", "Experience Years", "Degree", "Created At"];
    const csvRows = [headers.join(",")];
    
    results.forEach(result => {
      const row = [
        result.id,
        result.d_score.toString(),
        result.age.toString(),
        result.years_experience.toString(),
        degreeMapping[result.degree] || result.degree,
        format(new Date(result.created_at), "yyyy-MM-dd")
      ];
      csvRows.push(row.join(","));
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
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
