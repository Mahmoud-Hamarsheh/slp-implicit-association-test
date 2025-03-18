
import { IATResult, degreeMapping } from "../types/iatResults";

export const prepareStats = (results: IATResult[]) => {
  const totalParticipants = results.length;
  const dScores = results.map(r => r.d_score).filter(score => !isNaN(score));
  const avgDScore = dScores.length > 0 
    ? dScores.reduce((sum, score) => sum + score, 0) / dScores.length 
    : 0;
  const maxDScore = dScores.length > 0 ? Math.max(...dScores) : 0;
  const minDScore = dScores.length > 0 ? Math.min(...dScores) : 0;

  return { totalParticipants, avgDScore, maxDScore, minDScore };
};
