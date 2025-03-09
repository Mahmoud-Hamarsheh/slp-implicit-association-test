
// Utility functions for IAT results

// D-score interpretation ranges
export const interpretDScore = (dScore: number): string => {
  if (dScore > 0.65) return "تحيز قوي (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > 0.35) return "تحيز متوسط (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > 0.15) return "تحيز خفيف (اضطرابات التواصل مع السمات السلبية)";
  if (dScore > -0.15) return "لا تحيز أو تحيز محايد";
  if (dScore > -0.35) return "تحيز خفيف (اضطرابات التواصل مع السمات الإيجابية)";
  if (dScore > -0.65) return "تحيز متوسط (اضطرابات التواصل مع السمات الإيجابية)";
  return "تحيز قوي (اضطرابات التواصل مع السمات الإيجابية)";
};

// Get color based on D-score
export const getDScoreColor = (dScore: number): string => {
  if (dScore > 0.35) return "#ef4444"; // Strong/moderate positive bias (red)
  if (dScore > 0.15) return "#f97316"; // Slight positive bias (orange)
  if (dScore >= -0.15) return "#a3a3a3"; // Neutral (gray)
  if (dScore >= -0.35) return "#22c55e"; // Slight negative bias (light green)
  return "#16a34a"; // Strong/moderate negative bias (green)
};

export const getDegreeLabel = (degree: string): string => {
  switch (degree) {
    case "1": return "طالب";
    case "2": return "بكالوريوس";
    case "3": return "ماجستير";
    case "4": return "دكتوراه";
    default: return degree;
  }
};
