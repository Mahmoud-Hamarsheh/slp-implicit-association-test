
import type { SurveyResponses } from "../BiasAwarenessSurvey";

export interface IATProps {
  onComplete: (result: number) => void;
  surveyData: { 
    age: number; 
    yearsExperience: number; 
    degree: string;
    biasAwarenessResponses: SurveyResponses;
    hasTakenIATBefore?: boolean;
  };
}

export interface Trial {
  stimulus: string;
  category: string;
  correctKey: "e" | "i";
  responseTime?: number;
  correct?: boolean;
  block: number;
}

export interface Response {
  block: number;
  responseTime: number;
  correct: boolean;
}

export const BLOCKS = {
  COMMUNICATION_DISORDER: ["أفيزيا", "تأتأة", "ديسارثريا", "اضطراب صوت", "أبراكسيا", "تأخر لغوي"],
  NORMAL_COMMUNICATION: ["اجتماعي", "نشط", "متفاعل", "معبر", "طليق", "مركز"],
  NEGATIVE_ATTRIBUTES: ["محدود", "ضعيف", "سلبي", "أخرق", "مشتت", "بطيء", "متردد", "متوتر"],
  POSITIVE_ATTRIBUTES: ["كفو/قادر", "قوي", "واثق", "ذكي", "منتبه", "سريع", "مرن", "متعاون"]
};
