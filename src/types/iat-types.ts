
export interface SurveyResponses {
  implicitBiasAwareness: number[];
  positiveAttitudes: number[];
  negativeAttitudes: number[];
  normalCommunication: string[];
  communicationDisorders: string[];
}

export interface IATResult {
  id: string;
  created_at: string;
  d_score: number;
  age: number;
  years_experience: number;
  degree: string;
  survey_responses: SurveyResponses;
  survey_score?: number;
}

export interface DashboardStats {
  totalParticipants: number;
  averageDScore: number;
  degreeDistribution: { name: string; value: number }[];
  biasDistribution: { name: string; value: number }[];
}
