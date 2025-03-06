
export interface SurveyResponses {
  [key: string]: string;
  biasLevel?: string;
  biasScore?: string;
}

export interface SurveyQuestion {
  questionId: string;
  text: string;
  type: 'radio' | 'text';
  options?: string[];
}

export interface SurveyPage {
  pageId: string;
  questions: SurveyQuestion[];
}

export interface BiasAwarenessSurveyProps {
  onComplete: (responses: SurveyResponses) => void;
}

export interface DemographicData {
  age: string;
  yearsExperience: string;
  degree: string;
  gender: "male" | "female";
}

export interface DemographicsProps {
  onComplete: (data: DemographicData) => void;
}
