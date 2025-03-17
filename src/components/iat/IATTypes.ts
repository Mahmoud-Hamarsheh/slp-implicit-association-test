
import { SurveyResponses } from "../BiasAwarenessSurvey";

export interface IATProps {
  onComplete: (result: number, responses: any[]) => void;
  surveyData: { 
    age: number; 
    yearsExperience: number; 
    degree: string;
    gender: "male" | "female" | number;
    biasAwarenessResponses: SurveyResponses;
    hasTakenIATBefore?: boolean;
    testModel?: "A" | "B";
  };
}

export interface Trial {
  stimulus: string;
  category: string;
  correctKey: "d" | "k";
  responseTime?: number;
  correct?: boolean;
  block: number; // The original block number
  effectiveBlock?: number; // The effective block based on test model
  isImage?: boolean;
}

export interface Response {
  block: number;
  responseTime: number;
  correct: boolean;
}

export const BLOCKS = {
  COMMUNICATION_DISORDER: ["أفيزيا", "أبراكسيا", "ديسارثريا (عسر النطق)", "تأخر لغوي", "اضطراب صوت", "تأتأة"],
  NORMAL_COMMUNICATION: ["وضوح الكلام", "انسيابية الكلام", "طلاقة التعبير", "تواصل فعال", "مُعبّر", "كلام مترابط", "الاستماع الفعال"],
  POSITIVE_ATTRIBUTES: [
    "إيجابي",
    "ممتاز",
    "نجاح",
    "متميز",
    "قوي",
    "محترف",
    "متعلم",
    "متفوق"
  ],
  NEGATIVE_ATTRIBUTES: [
    "حزين",
    "سلبي",
    "ضعيف",
    "فاشل",
    "غاضب",
    "محبط",
    "مرتبك",
    "متعثر",
    "مهزوم",
    "ضعيف التحصيل"
  ]
};

// Determine the correct key based on test model and block
export const getCorrectKeyForBlock = (block: number, category: string, testModel: "A" | "B" = "A"): "d" | "k" => {
  // NOTE: block here should be the effective block, NOT the original block number
  
  switch (block) {
    case 1:
      // Block 1: K = normal, D = disorder
      return category === "communication_disorder" ? "d" : "k";
      
    case 2:
      // Block 2: K = positive, D = negative
      return category === "negative" ? "d" : "k";
      
    case 3:
    case 4:
      // Blocks 3, 4: K = normal/positive, D = disorder/negative
      return (category === "communication_disorder" || category === "negative") ? "d" : "k";
      
    case 5:
      // Block 5: K = negative, D = positive (reversed)
      return category === "positive" ? "d" : "k";
      
    case 6:
    case 7:
      // Blocks 6, 7: K = normal/negative, D = disorder/positive (also reversed)
      return (category === "communication_disorder" || category === "positive") ? "d" : "k";
      
    default:
      return "k";
  }
};
