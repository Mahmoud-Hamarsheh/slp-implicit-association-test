
import type { Response } from "./IATTypes";

export const calculateDScore = (responses: Response[]) => {
  // Step 1: Delete trials > 10,000ms
  const validResponses = responses.filter(r => r.responseTime <= 10);

  // Step 2: Check if more than 10% of trials are < 300ms
  const fastTrials = validResponses.filter(r => r.responseTime < 0.3);
  if (fastTrials.length / validResponses.length > 0.1) {
    return null; // Invalid data - too many fast responses
  }

  const block3Responses = validResponses.filter(r => r.block === 3);
  const block4Responses = validResponses.filter(r => r.block === 4);
  const block6Responses = validResponses.filter(r => r.block === 6);
  const block7Responses = validResponses.filter(r => r.block === 7);

  // Step 3: Compute inclusive standard deviations
  const sd1 = calculatePooledSD([...block3Responses, ...block6Responses]);
  const sd2 = calculatePooledSD([...block4Responses, ...block7Responses]);

  // Step 4: Compute means for each stage
  const mean3 = calculateMean(block3Responses);
  const mean4 = calculateMean(block4Responses);
  const mean6 = calculateMean(block6Responses);
  const mean7 = calculateMean(block7Responses);

  // Step 5: Compute differences
  const diff1 = mean6 - mean3;
  const diff2 = mean7 - mean4;

  // Step 6: Divide by standard deviations
  const d1 = diff1 / sd1;
  const d2 = diff2 / sd2;

  // Step 7: Average the D scores
  return (d1 + d2) / 2;
};

const calculateMean = (responses: Response[]): number => {
  if (responses.length === 0) return 0;
  const sum = responses.reduce((acc, r) => {
    // Add 600ms penalty for incorrect responses
    const time = r.correct ? r.responseTime : r.responseTime + 0.6;
    return acc + time;
  }, 0);
  return sum / responses.length;
};

const calculatePooledSD = (responses: Response[]): number => {
  if (responses.length === 0) return 0;
  
  const mean = calculateMean(responses);
  const sumSquares = responses.reduce((acc, r) => {
    const time = r.correct ? r.responseTime : r.responseTime + 0.6;
    return acc + Math.pow(time - mean, 2);
  }, 0);
  
  return Math.sqrt(sumSquares / (responses.length - 1));
};
