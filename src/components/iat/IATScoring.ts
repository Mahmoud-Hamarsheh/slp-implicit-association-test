
import type { Response } from "./IATTypes";

export const calculateDScore = (responses: Response[], testModel: "A" | "B" = "A") => {
  console.log(`Calculating D-Score with responses for test model ${testModel}:`, responses);
  
  // If we're using test model B, we need to correct the block numbers before calculation
  // In model B, blocks are reversed: blocks 2-4 in UI are actually blocks 5-7, and vice versa
  const normalizedResponses = testModel === "B" 
    ? responses.map(response => {
        let effectiveBlock = response.block;
        if (response.block >= 2 && response.block <= 4) {
          // Convert UI blocks 2,3,4 to effective blocks 5,6,7 for calculation
          effectiveBlock = response.block + 3;
        } else if (response.block >= 5 && response.block <= 7) {
          // Convert UI blocks 5,6,7 to effective blocks 2,3,4 for calculation
          effectiveBlock = response.block - 3;
        }
        return { ...response, block: effectiveBlock };
      })
    : responses;
  
  // Step 1: Delete trials > 10,000ms (10 seconds)
  const validResponses = normalizedResponses.filter(r => r.responseTime <= 10);
  console.log(`Filtered ${normalizedResponses.length - validResponses.length} responses > 10 seconds`);

  // Step 2: Check for exclusion criteria
  // Count trials with reaction time < 300ms (outliers)
  const fastTrials = validResponses.filter(r => r.responseTime < 0.3);
  const tooManyFastResponses = fastTrials.length / validResponses.length > 0.1;
  
  // Count incorrect responses
  const incorrectResponses = validResponses.filter(r => !r.correct);
  const tooManyIncorrectResponses = incorrectResponses.length / validResponses.length > 0.3;
  
  // Exclude participant data if they meet either exclusion criterion
  if (tooManyFastResponses || tooManyIncorrectResponses) {
    if (tooManyFastResponses) {
      console.log("Exclusion: More than 10% of trials are < 300ms");
    }
    if (tooManyIncorrectResponses) {
      console.log("Exclusion: More than 30% incorrect responses");
    }
    // Discard this participant's data
    return 0;
  }

  // Remove trials with reaction time < 300ms (outliers)
  const filteredResponses = validResponses.filter(r => r.responseTime >= 0.3);
  console.log(`Removed ${validResponses.length - filteredResponses.length} responses < 300ms as outliers`);
  
  // Get responses for blocks 3, 4, 6, and 7
  // Blocks 3 & 4 = compatible blocks, Blocks 6 & 7 = incompatible blocks
  const block3Responses = filteredResponses.filter(r => r.block === 3); // Practice compatible
  const block4Responses = filteredResponses.filter(r => r.block === 4); // Test compatible
  const block6Responses = filteredResponses.filter(r => r.block === 6); // Practice incompatible
  const block7Responses = filteredResponses.filter(r => r.block === 7); // Test incompatible

  console.log(`Block counts for D-score calculation: 
    Compatible: B3=${block3Responses.length}, B4=${block4Responses.length}
    Incompatible: B6=${block6Responses.length}, B7=${block7Responses.length}`);

  // If we're missing responses from critical blocks, return 0
  if (!block3Responses.length || !block4Responses.length || 
      !block6Responses.length || !block7Responses.length) {
    console.log("Missing responses for one or more critical blocks (3, 4, 6, or 7), returning 0");
    return 0;
  }

  // Calculate means for each block (correct responses only)
  const mean3 = calculateBlockMean(block3Responses, true);
  const mean4 = calculateBlockMean(block4Responses, true);
  const mean6 = calculateBlockMean(block6Responses, true);
  const mean7 = calculateBlockMean(block7Responses, true);

  console.log(`Block means (correct responses only):
    Block 3: ${mean3.toFixed(3)}s
    Block 4: ${mean4.toFixed(3)}s
    Block 6: ${mean6.toFixed(3)}s 
    Block 7: ${mean7.toFixed(3)}s`);

  // Now handle the incorrect responses with block mean + 600ms penalty
  // Create new arrays with corrected response times
  const correctedBlock3 = correctResponseTimes(block3Responses, mean3);
  const correctedBlock4 = correctResponseTimes(block4Responses, mean4);
  const correctedBlock6 = correctResponseTimes(block6Responses, mean6);
  const correctedBlock7 = correctResponseTimes(block7Responses, mean7);

  // Combine compatible and incompatible blocks with corrections applied
  const compatibleResponses = [...correctedBlock3, ...correctedBlock4];
  const incompatibleResponses = [...correctedBlock6, ...correctedBlock7];

  // Calculate means for compatible and incompatible blocks
  const meanCompatible = calculateMean(compatibleResponses);
  const meanIncompatible = calculateMean(incompatibleResponses);

  // Calculate the pooled standard deviation across all critical blocks
  const sd = calculatePooledSD([...compatibleResponses, ...incompatibleResponses]);

  console.log(`Final means: Compatible=${meanCompatible.toFixed(3)}, Incompatible=${meanIncompatible.toFixed(3)}`);
  console.log(`Pooled SD: ${sd.toFixed(3)}`);

  // Compute the mean difference (Incompatible - Compatible)
  const meanDifference = meanIncompatible - meanCompatible;

  // Divide the difference score by the pooled standard deviation
  const dScore = meanDifference / sd;
  console.log(`Final D-Score: ${dScore.toFixed(3)}`);
  
  // Handle NaN cases
  if (isNaN(dScore)) {
    console.log("Calculated D-Score is NaN, returning 0 instead");
    return 0;
  }
  
  return dScore;
};

// Calculate mean for correct responses only in a block
const calculateBlockMean = (responses: Response[], correctOnly: boolean): number => {
  if (responses.length === 0) return 0;
  
  const filteredResponses = correctOnly ? responses.filter(r => r.correct) : responses;
  if (filteredResponses.length === 0) return 0;
  
  const sum = filteredResponses.reduce((acc, r) => acc + r.responseTime, 0);
  return sum / filteredResponses.length;
};

// Apply corrections to response times (replace incorrect with mean + 600ms)
const correctResponseTimes = (responses: Response[], blockMean: number): Response[] => {
  return responses.map(response => {
    if (!response.correct) {
      // For incorrect responses, use block mean + 600ms penalty
      return {
        ...response,
        responseTime: blockMean + 0.6 // 600ms penalty
      };
    }
    return response;
  });
};

// Calculate mean across all responses (after corrections)
const calculateMean = (responses: Response[]): number => {
  if (responses.length === 0) return 0;
  const sum = responses.reduce((acc, r) => acc + r.responseTime, 0);
  return sum / responses.length;
};

const calculatePooledSD = (responses: Response[]): number => {
  if (responses.length <= 1) return 1; // Return 1 to avoid division by zero
  
  const mean = calculateMean(responses);
  const sumSquares = responses.reduce((acc, r) => {
    return acc + Math.pow(r.responseTime - mean, 2);
  }, 0);
  
  return Math.sqrt(sumSquares / (responses.length - 1));
};

export const getIATResultInterpretation = (dScore: number): string => {
  if (dScore > 0.65) {
    return "تحيز قوي سلبي ضد اضطرابات التواصل";
  } else if (dScore > 0.35) {
    return "تحيز متوسط سلبي ضد اضطرابات التواصل";
  } else if (dScore > 0.15) {
    return "تحيز خفيف سلبي ضد اضطرابات التواصل";
  } else if (dScore >= -0.15) {
    return "لا يوجد تحيز ضمني واضح";
  } else if (dScore >= -0.35) {
    return "تحيز خفيف إيجابي نحو اضطرابات التواصل";
  } else if (dScore >= -0.65) {
    return "تحيز متوسط إيجابي نحو اضطرابات التواصل";
  } else {
    return "تحيز قوي إيجابي نحو اضطرابات التواصل";
  }
};
