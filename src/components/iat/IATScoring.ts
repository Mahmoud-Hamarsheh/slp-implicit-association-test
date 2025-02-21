
import type { Response } from "./IATTypes";

export const calculateDScore = (responses: Response[]) => {
  const validResponses = responses.filter(r => r.responseTime >= 0.3);

  const blockResponses = {
    3: validResponses.filter(r => r.block === 3),
    4: validResponses.filter(r => r.block === 4),
    6: validResponses.filter(r => r.block === 6),
    7: validResponses.filter(r => r.block === 7)
  };

  const sd1 = calculatePooledSD(blockResponses[3], blockResponses[4]);
  const sd2 = calculatePooledSD(blockResponses[6], blockResponses[7]);

  const diff1 = calculateMeanDiff(blockResponses[6], blockResponses[3]);
  const diff2 = calculateMeanDiff(blockResponses[7], blockResponses[4]);

  const d1 = diff1 / sd1;
  const d2 = diff2 / sd2;

  return (d1 + d2) / 2;
};

const calculatePooledSD = (responses1: Response[], responses2: Response[]) => {
  const allTimes = [...responses1, ...responses2].map(r => r.responseTime);
  const mean = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
  const variance = allTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / allTimes.length;
  return Math.sqrt(variance);
};

const calculateMeanDiff = (responses1: Response[], responses2: Response[]) => {
  const mean1 = responses1.reduce((a, b) => a + b.responseTime, 0) / responses1.length;
  const mean2 = responses2.reduce((a, b) => a + b.responseTime, 0) / responses2.length;
  return mean1 - mean2;
};
