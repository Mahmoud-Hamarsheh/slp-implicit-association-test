
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
    "/lovable-uploads/30bf4690-6613-4357-8236-b485afbf6cf9.png",
    "/lovable-uploads/3d4fef15-cf7d-40d1-8a29-7d4cfbde6b31.png",
    "/lovable-uploads/ebd1f283-efcd-4a89-8d86-c7c08dbb8edc.png",
    "/lovable-uploads/9ff773ad-fd12-4ff4-acd5-6817aeb3a60d.png",
    "/lovable-uploads/93575d6b-370c-40dc-aae0-0709a7f52560.png",
    "/lovable-uploads/a0fcd957-3f2e-4e39-877d-4b966025da02.png", 
    "/lovable-uploads/2dcdf403-f786-42e2-a082-d5fec49e0c3b.png",
    "/lovable-uploads/2d46afb5-2cde-4105-bf61-cd9fa437456c.png"
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
