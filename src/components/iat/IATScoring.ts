
import type { Response } from "./IATTypes";

export const calculateDScore = (responses: Response[]) => {
  console.log("Calculating D-Score with responses:", responses);
  
  // Step 1: Delete trials > 10,000ms (10 seconds)
  const validResponses = responses.filter(r => r.responseTime <= 10);
  console.log(`Filtered ${responses.length - validResponses.length} responses > 10 seconds`);

  // Step 2: Check if more than 10% of trials are < 300ms
  const fastTrials = validResponses.filter(r => r.responseTime < 0.3);
  const tooManyFastResponses = fastTrials.length / validResponses.length > 0.1;
  console.log(`Found ${fastTrials.length} fast trials (< 300ms) out of ${validResponses.length} valid trials`);
  
  if (tooManyFastResponses) {
    console.log("Warning: More than 10% of trials are < 300ms, subject should be deleted");
    // We'll continue with calculation but mark this in the result
  }

  // Get responses for blocks 4 and 7 only (as per updated requirements)
  const block4Responses = validResponses.filter(r => r.block === 4);
  const block7Responses = validResponses.filter(r => r.block === 7);

  console.log(`Block counts for D-score calculation: B4=${block4Responses.length}, B7=${block7Responses.length}`);

  // If we're missing responses from critical blocks, return 0
  if (!block4Responses.length || !block7Responses.length) {
    console.log("Missing responses for one or more critical blocks (4 or 7), returning 0");
    return 0;
  }

  // Step 3: Compute the standard deviation for blocks 4 & 7 combined
  const sd = calculatePooledSD([...block4Responses, ...block7Responses]);

  // Step 4: Compute mean latency for blocks 4 and 7
  const mean4 = calculateMean(block4Responses);
  const mean7 = calculateMean(block7Responses);

  console.log(`Means: B4=${mean4.toFixed(3)}, B7=${mean7.toFixed(3)}`);
  console.log(`SD: ${sd.toFixed(3)}`);

  // Step 5: Compute the mean difference (block7 - block4)
  // Block 7 is typically the incompatible block and Block 4 is the compatible block
  const diff = mean7 - mean4;

  // Step 6: Divide the difference score by the pooled standard deviation
  const dScore = diff / sd;
  console.log(`Final D-Score: ${dScore.toFixed(3)}`);
  
  // Handle NaN cases
  if (isNaN(dScore)) {
    console.log("Calculated D-Score is NaN, returning 0 instead");
    return 0;
  }
  
  return dScore;
};

export const getIATResultInterpretation = (dScore: number): string => {
  if (dScore > 0.65) {
    return "تحيز قوي سلبي ضد اضطرابات التواصل";
  } else if (dScore > 0.35) {
    return "تحيز متوسط سلبي ضد اضطرابات التواصل";
  } else if (dScore > 0.15) {
    return "تحيز خفيف سلبي ضد اضطرابات التواصل";
  } else if (dScore > -0.15) {
    return "لا يوجد تحيز ضمني واضح";
  } else if (dScore > -0.35) {
    return "تحيز خفيف إيجابي نحو اضطرابات التواصل";
  } else if (dScore > -0.65) {
    return "تحيز متوسط إيجابي نحو اضطرابات التواصل";
  } else {
    return "تحيز قوي إيجابي نحو اضطرابات التواصل";
  }
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
  if (responses.length <= 1) return 1; // Return 1 to avoid division by zero
  
  const mean = calculateMean(responses);
  const sumSquares = responses.reduce((acc, r) => {
    const time = r.correct ? r.responseTime : r.responseTime + 0.6;
    return acc + Math.pow(time - mean, 2);
  }, 0);
  
  return Math.sqrt(sumSquares / (responses.length - 1));
};
