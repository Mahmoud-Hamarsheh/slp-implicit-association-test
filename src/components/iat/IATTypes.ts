
import { SurveyResponses } from "../BiasAwarenessSurvey";

export interface IATProps {
  onComplete: (result: number) => void;
  surveyData: { 
    age: number; 
    yearsExperience: number; 
    degree: string;
    gender: "male" | "female";
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
    case 3:
    case 4:
      // Blocks 1, 3, 4
      if (category === "communication_disorder" || category === "negative") {
        return "d";
      } else {
        return "k";
      }
    case 2:
      // Block 2 - negative on left, positive on right
      if (category === "negative") {
        return "d";
      } else {
        return "k";
      }
    case 5:
      // Block 5 - normal on right, disorder on left (swapped from block 1)
      if (category === "normal_communication") {
        return "k";
      } else {
        return "d";
      }
    case 6:
    case 7:
      // Blocks 6, 7 - normal/negative on right, disorder/positive on left
      if (category === "normal_communication" || category === "negative") {
        return "k";
      } else {
        return "d";
      }
    default:
      return "d";
  }
};
