
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
    "/lovable-uploads/93db19c2-e0dd-4eec-9507-f221369b92fd.png", // أصدقاء
    "/lovable-uploads/7a2f734e-6115-40d0-8760-146aed3c8705.png", // فائز
    "/lovable-uploads/4e6f71c4-8642-4827-b966-276882db5ca7.png", // بطل خارق
    "/lovable-uploads/6577b267-eeb2-42c1-807c-37c297534211.png", // رافع أثقال
    "/lovable-uploads/128c5b59-d835-4d35-8db4-91c49e5691a3.png", // خطيب
    "/lovable-uploads/aad98393-d035-4993-9df4-70d20ca8d869.png", // خريج
    "/lovable-uploads/5642c084-8273-4481-99c0-4b8061323a7d.png", // طالب ممتاز
    "/lovable-uploads/dfb07bb4-398a-4ad2-806b-2eb95159e5a0.png", // إعجاب
  ],
  NEGATIVE_ATTRIBUTES: [
    "/lovable-uploads/e7596747-4942-41b8-86df-ded740cb89ee.png", // توبيخ
    "/lovable-uploads/950c3cfe-d7a2-4f4e-8575-ab8c2640814e.png", // سخرية
    "/lovable-uploads/8a23e268-03e8-446d-abd7-0a1035a44a01.png", // عدم إعجاب
    "/lovable-uploads/2786740d-6a92-4082-bb07-40b2b80e8dc1.png", // حزين
    "/lovable-uploads/d6ffd2ec-e26c-47f6-90b1-65d7b42ea6e3.png", // حزن
    "/lovable-uploads/9997e9f9-63be-46d4-867a-6ad6d32ca19f.png", // عزلة
    "/lovable-uploads/e286e917-cb3a-4273-a2fc-8cee3bccd009.png", // يبكي 
    "/lovable-uploads/1e9f90e6-74bc-4791-a954-4ce9b884a26f.png", // إحباط
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
