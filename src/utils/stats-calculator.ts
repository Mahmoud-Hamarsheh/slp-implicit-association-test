
import { IATResult, DashboardStats } from "@/types/iat-types";
import { getDegreeLabel } from "./iat-utils";

export const calculateStats = (data: IATResult[]): DashboardStats => {
  if (!data.length) return {
    totalParticipants: 0,
    averageDScore: 0,
    degreeDistribution: [],
    biasDistribution: []
  };
  
  // Total participants
  const totalParticipants = data.length;
  
  // Average D-score
  const averageDScore = data.reduce((sum, item) => sum + item.d_score, 0) / totalParticipants;
  
  // Degree distribution
  const degreeMap: Record<string, number> = {};
  data.forEach(item => {
    const degreeLabel = getDegreeLabel(item.degree);
    degreeMap[degreeLabel] = (degreeMap[degreeLabel] || 0) + 1;
  });
  
  const degreeDistribution = Object.entries(degreeMap).map(([name, value]) => ({ name, value }));
  
  // Bias distribution
  const biasCategories: Record<string, number> = {
    "تحيز قوي (سلبي)": 0,
    "تحيز متوسط (سلبي)": 0,
    "تحيز خفيف (سلبي)": 0,
    "محايد": 0,
    "تحيز خفيف (إيجابي)": 0,
    "تحيز متوسط (إيجابي)": 0,
    "تحيز قوي (إيجابي)": 0
  };
  
  data.forEach(item => {
    if (item.d_score > 0.65) biasCategories["تحيز قوي (سلبي)"]++;
    else if (item.d_score > 0.35) biasCategories["تحيز متوسط (سلبي)"]++;
    else if (item.d_score > 0.15) biasCategories["تحيز خفيف (سلبي)"]++;
    else if (item.d_score >= -0.15) biasCategories["محايد"]++;
    else if (item.d_score >= -0.35) biasCategories["تحيز خفيف (إيجابي)"]++;
    else if (item.d_score >= -0.65) biasCategories["تحيز متوسط (إيجابي)"]++;
    else biasCategories["تحيز قوي (إيجابي)"]++;
  });
  
  const biasDistribution = Object.entries(biasCategories)
    .filter(([_, value]) => value > 0) // Only include categories with values
    .map(([name, value]) => ({ name, value }));
  
  return {
    totalParticipants,
    averageDScore,
    degreeDistribution,
    biasDistribution
  };
};
