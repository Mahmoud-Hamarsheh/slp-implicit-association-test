
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
    "/lovable-uploads/4d29ef76-64fb-4508-8d76-2b27461fd844.png", // crying person
    "/lovable-uploads/a3279a90-96f3-4e35-aff6-00a3f84b6355.png", // thumbs down
    "/lovable-uploads/7b1dc96e-d083-46e9-be18-1d7a21122d40.png", // sad person
    "/lovable-uploads/7f658006-b81a-4da1-ba18-fd5c3d2e88dd.png", // pointing boss
    "/lovable-uploads/b786a712-7b99-484d-8a15-f2f80241dd1c.png", // depressed walk
    "/lovable-uploads/21cd29b5-16be-4f4a-aacd-227f025d8bc5.png", // laughing at someone 
    "/lovable-uploads/1bb6964d-14fe-44eb-9523-14f5fc1b849d.png", // standing sad
    "/lovable-uploads/6e039dce-2910-41e0-855d-344386d44f90.png", // sad businessman
    "/lovable-uploads/7c56a99d-9adc-4e25-914f-d94fcfa7e36e.png", // self hugging
    "/lovable-uploads/d116176d-050d-4bd5-9e87-0a9ae257c677.png"  // person with bad grades
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
