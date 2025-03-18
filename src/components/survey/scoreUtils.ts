
import { SurveyResponses } from './types';

export const calculateBiasScore = (responses: SurveyResponses): { biasScore: number; biasLevel: string } => {
  // Mapping of responses to numerical values
  const responseValues: { [key: string]: number } = {
    'أوافق بشدة': 5,
    'أوافق': 4,
    'محايد': 3,
    'لا أوافق': 2,
    'لا أوافق بشدة': 1,
  };

  // Items that need reverse scoring (q5 and q8)
  const reverseItems = ['q5', 'q8'];
  
  // Calculate the sum of scores
  let totalScore = 0;
  let answeredQuestions = 0;
  
  // Process all question responses
  for (let i = 1; i <= 12; i++) {
    const questionId = `q${i}`;
    const response = responses[questionId];
    
    if (response) {
      answeredQuestions++;
      let score = responseValues[response] || 0;
      
      // Apply reverse scoring for negative items
      if (reverseItems.includes(questionId)) {
        score = 6 - score; // Reverse the score: 6 - original score
      }
      
      totalScore += score;
    }
  }
  
  // Calculate average score if at least one question was answered
  const averageScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 0;
  
  // Determine bias level based on average score according to the new thresholds
  let biasLevel = '';
  if (averageScore <= 2.5) {
    biasLevel = 'منخفض';
  } else if (averageScore <= 3.5) {
    biasLevel = 'متوسط';
  } else {
    biasLevel = 'مرتفع';
  }

  console.log(`Calculated bias score: ${averageScore.toFixed(2)}, level: ${biasLevel}`);

  return { 
    biasScore: Number(averageScore.toFixed(2)), 
    biasLevel 
  };
};
