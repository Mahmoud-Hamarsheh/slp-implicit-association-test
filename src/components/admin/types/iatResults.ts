
export interface IATResult {
  id: string;
  created_at: string;
  d_score: number;
  age: number;
  years_experience: number;
  degree: string;
  gender?: number | null;
  survey_responses: any;
  survey_score?: number;
  test_model?: string;
}

export const degreeMapping: { [key: string]: string } = {
  "1": "طالب",
  "2": "بكالوريوس",
  "3": "ماجستير",
  "4": "دكتوراه"
};
