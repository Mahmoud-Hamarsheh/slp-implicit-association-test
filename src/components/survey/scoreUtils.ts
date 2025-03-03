
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

  // Questions that indicate bias if agreed with
  const biasQuestions = ['q1', 'q3', 'q5', 'q6'];
  
  // Calculate the score based on responses
  let biasScore = 0;
  
  biasQuestions.forEach(questionId => {
    const response = responses[questionId];
    if (response) {
      biasScore += responseValues[response] || 0;
    }
  });

  // Normalize the score
  biasScore = (biasScore / (biasQuestions.length * 5)) * 100;

  // Determine bias level based on score
  let biasLevel = 'محايد';
  if (biasScore > 60) {
    biasLevel = 'مرتفع';
  } else if (biasScore > 40) {
    biasLevel = 'متوسط';
  } else if (biasScore > 20) {
    biasLevel = 'ضعيف';
  }

  return { biasScore, biasLevel };
};
