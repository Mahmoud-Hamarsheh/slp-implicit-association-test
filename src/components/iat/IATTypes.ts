
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
    "/lovable-uploads/9b147b57-aafb-4241-94ff-3a9c352503b0.png", // A+ student
    "/lovable-uploads/1fae69a3-a257-4e39-9d7e-92e71d89316b.png", // Graduate
    "/lovable-uploads/f12e4381-84c6-45f6-8cde-62d1721d3509.png", // Business person
    "/lovable-uploads/c0bdba02-284f-47d1-a891-9edbf0a2af61.png", // Friends group
    "/lovable-uploads/dfc82370-e222-4fd8-9fd4-702c4d7ec161.png", // Weight lifter
    "/lovable-uploads/ac17eeed-e0ea-41bf-ad17-438e10326d15.png", // Superhero
    "/lovable-uploads/55a0f431-595a-4b86-9aea-bd6807cdb268.png", // Thumbs up
    "/lovable-uploads/e012de25-8c46-4112-86d7-da7f81976105.png"  // Trophy winner
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
