
import { degreeMapping } from "../types/iatResults";

export const getAgeRange = (ageValue: number): string => {
  switch (ageValue) {
    case 1: return "20-30";
    case 2: return "31-40";
    case 3: return "41-50";
    case 4: return "51+";
    default: return "غير محدد";
  }
};

export const getExperienceRange = (expValue: number): string => {
  switch (expValue) {
    case 0: return "لا يوجد خبرة";
    case 1: return "1-2 سنوات";
    case 2: return "2-4 سنوات";
    case 3: return "5-10 سنوات";
    case 4: return "10+ سنوات";
    default: return "غير محدد";
  }
};

export const getIATInterpretation = (dScore: number): string => {
  if (dScore > 0.65) return "تحيز قوي (سلبي)";
  if (dScore > 0.35) return "تحيز متوسط (سلبي)";
  if (dScore > 0.15) return "تحيز خفيف (سلبي)";
  if (dScore >= -0.15) return "محايد";
  if (dScore >= -0.35) return "تحيز خفيف (إيجابي)";
  if (dScore >= -0.65) return "تحيز متوسط (إيجابي)";
  return "تحيز قوي (إيجابي)";
};

export const getSurveyInterpretation = (score?: number): string => {
  if (!score) return "غير متوفر";
  if (score > 3.5) return "مرتفع";
  if (score > 2.5) return "متوسط";
  return "منخفض";
};
