
import { SurveyResponses } from "../BiasAwarenessSurvey";

export interface IATProps {
  onComplete: (result: number) => void;
  surveyData: { 
    age: number; 
    yearsExperience: number; 
    degree: string;
    gender: "male" | "female" | number;
    biasAwarenessResponses: SurveyResponses;
    hasTakenIATBefore?: boolean;
  };
}

export interface Trial {
  stimulus: string;
  category: string;
  correctKey: "d" | "k";
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
  COMMUNICATION_DISORDER: ["أفيزيا", "أبراكسيا", "ديسارثريا (عسر النطق)", "تأخر لغوي", "اضطراب صوت", "تأتأة"],
  NORMAL_COMMUNICATION: ["وضوح الكلام", "انسيابية الكلام", "طلاقة التعبير", "تواصل فعال", "معبر", "كلام مترابط", "الاستماع الفعال"],
  NEGATIVE_ATTRIBUTES: ["محدود", "ضعيف", "سلبي", "أخرق", "مشتت", "بطيء", "متوتر", "متردد"],
  POSITIVE_ATTRIBUTES: ["كفؤ/قادر", "قوي", "واثق", "ذكي", "منتبه", "سريع", "مرن", "متعاون"]
};

export const getCorrectKeyForBlock = (block: number, category: string): "d" | "k" => {
  switch (block) {
    case 1:
      // Block 1: K = normal, D = disorder
      if (category === "communication_disorder") {
        return "d";
      } else {
        return "k";
      }
    case 2:
      // Block 2: K = positive, D = negative
      if (category === "negative") {
        return "d";
      } else {
        return "k";
      }
    case 3:
    case 4:
      // Blocks 3, 4: K = normal/positive, D = disorder/negative
      if (category === "communication_disorder" || category === "negative") {
        return "d";
      } else {
        return "k";
      }
    case 5:
      // Block 5: K = negative, D = positive
      if (category === "positive") {
        return "d";
      } else {
        return "k";
      }
    case 6:
    case 7:
      // Blocks 6, 7: K = normal/negative, D = disorder/positive
      if (category === "communication_disorder" || category === "positive") {
        return "d";
      } else {
        return "k";
      }
    default:
      return "k";
  }
};
