
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
  };
}

export interface Trial {
  stimulus: string;
  category: string;
  correctKey: "d" | "k";
  responseTime?: number;
  correct?: boolean;
  block: number;
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
    "/lovable-uploads/3d280a97-f40f-42c4-8095-644ba45df460.png",
    "/lovable-uploads/4ec5761a-9111-4ed1-87e2-cfd914be2cac.png",
    "/lovable-uploads/0614e6dd-0a9e-4360-9278-dbba71cc546b.png",
    "/lovable-uploads/2e29f911-0a75-4712-8eea-e2e98db244cb.png",
    "/lovable-uploads/80d66870-170b-4907-b25b-fa6a9181c7c9.png"
  ],
  NEGATIVE_ATTRIBUTES: [
    "/lovable-uploads/c5746857-ee51-4e54-b918-f49f50369faf.png",
    "/lovable-uploads/901566ad-77e2-4163-aa28-528697bcf20d.png",
    "/lovable-uploads/0ad74854-9e13-4400-b348-cf97697cadc7.png",
    "/lovable-uploads/2df0738b-33e7-4fbe-9bd5-785fbb2f81dc.png"
  ]
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
