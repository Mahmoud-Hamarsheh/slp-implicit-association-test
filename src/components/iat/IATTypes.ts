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
    "/lovable-uploads/945065f2-66e4-47c9-83cf-d30d843f2880.png", // Trophy winner
    "/lovable-uploads/832847ee-de90-45c6-9cf1-e6d83d774cff.png", // Superhero
    "/lovable-uploads/d44a6ddc-8a05-44d0-97ac-2d59134c11b3.png", // Weight lifter
    "/lovable-uploads/b5753873-d6c1-4491-8965-4f8a34bce71c.png", // Business person at podium
    "/lovable-uploads/19ccbedc-8914-489f-8189-677f2f3d5287.png", // Graduate
    "/lovable-uploads/58c8ba40-c526-4de9-915a-234eca14af40.png", // A+ student
    "/lovable-uploads/4b8acb79-67cc-45a6-91ec-1c64c0df9646.png", // Thumbs up
    "/lovable-uploads/2f6d9505-8ede-45ec-8b81-a31baef68a7c.png", // Friends group
  ],
  NEGATIVE_ATTRIBUTES: [
    "/lovable-uploads/51401776-854b-4100-9139-2aa61e28e3de.png", // Sad person
    "/lovable-uploads/beb504c8-8742-46aa-93d0-d0a04e515ee2.png", // Crying person
    "/lovable-uploads/e7aa332a-efe4-47ad-b3fa-203e82a1dd89.png", // Thumbs down
    "/lovable-uploads/13d3a1dc-cb31-4b1a-b77c-d7f18f424645.png", // Person with boss pointing
    "/lovable-uploads/fba03378-ed42-41b7-a427-0018e2317e3e.png", // People laughing at someone
    "/lovable-uploads/9ab2f5fc-7ac7-43fc-ad04-f6d53c1f97bb.png", // Depressed person
    "/lovable-uploads/2d0c9586-a654-465a-99c7-04a321842952.png", // Sad businessman
    "/lovable-uploads/59ee5ed7-42af-4a95-8e04-28f248deafa3.png", // Self hugging person
  ]
};

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
