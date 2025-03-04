
import type { Response } from "./IATTypes";

export const calculateDScore = (responses: Response[]) => {
  console.log("Calculating D-Score with responses:", responses);
  
  // Step 1: Delete trials > 10,000ms (10 seconds)
  const validResponses = responses.filter(r => r.responseTime <= 10);
  console.log(`Filtered ${responses.length - validResponses.length} responses > 10 seconds`);

  // Step 2: Check if more than 10% of trials are < 300ms
  const fastTrials = validResponses.filter(r => r.responseTime < 0.3);
  console.log(`Found ${fastTrials.length} fast trials (< 300ms) out of ${validResponses.length} valid trials`);
  
  if (fastTrials.length / validResponses.length > 0.1) {
    console.log("Invalid data - too many fast responses (>10%)");
    return null; // Invalid data - too many fast responses
  }

  // Get responses for each block
  const block3Responses = validResponses.filter(r => r.block === 3);
  const block4Responses = validResponses.filter(r => r.block === 4);
  const block6Responses = validResponses.filter(r => r.block === 6);
  const block7Responses = validResponses.filter(r => r.block === 7);

  console.log(`Block counts: B3=${block3Responses.length}, B4=${block4Responses.length}, B6=${block6Responses.length}, B7=${block7Responses.length}`);

  // Ensure we have responses for all blocks
  if (block3Responses.length === 0 || block4Responses.length === 0 || 
      block6Responses.length === 0 || block7Responses.length === 0) {
    console.log("Missing responses for one or more critical blocks");
    return null;
  }

  // Step 3: Compute inclusive standard deviations
  const sd1 = calculatePooledSD([...block3Responses, ...block6Responses]);
  const sd2 = calculatePooledSD([...block4Responses, ...block7Responses]);

  // Step 4: Compute means for each stage
  const mean3 = calculateMean(block3Responses);
  const mean4 = calculateMean(block4Responses);
  const mean6 = calculateMean(block6Responses);
  const mean7 = calculateMean(block7Responses);

  console.log(`Means: B3=${mean3.toFixed(3)}, B4=${mean4.toFixed(3)}, B6=${mean6.toFixed(3)}, B7=${mean7.toFixed(3)}`);
  console.log(`SDs: SD1=${sd1.toFixed(3)}, SD2=${sd2.toFixed(3)}`);

  // Step 5: Compute differences
  const diff1 = mean6 - mean3;
  const diff2 = mean7 - mean4;

  // Step 6: Divide by standard deviations
  const d1 = diff1 / sd1;
  const d2 = diff2 / sd2;

  // Step 7: Average the D scores
  const dScore = (d1 + d2) / 2;
  console.log(`D scores: D1=${d1.toFixed(3)}, D2=${d2.toFixed(3)}, Final D=${dScore.toFixed(3)}`);
  
  return dScore;
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
  if (responses.length <= 1) return 1; // Return 1 to avoid division by zero, minimum valid value
  
  const mean = calculateMean(responses);
  const sumSquares = responses.reduce((acc, r) => {
    const time = r.correct ? r.responseTime : r.responseTime + 0.6;
    return acc + Math.pow(time - mean, 2);
  }, 0);
  
  return Math.sqrt(sumSquares / (responses.length - 1));
};
