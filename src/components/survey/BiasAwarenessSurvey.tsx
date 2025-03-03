
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SurveyPageComponent } from './SurveyPage';
import { surveyPages } from './surveyData';
import { calculateBiasScore } from './scoreUtils';
import { SurveyResponses, BiasAwarenessSurveyProps } from './types';

const BiasAwarenessSurvey: React.FC<BiasAwarenessSurveyProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formResponses, setFormResponses] = useState<SurveyResponses>({});
  const [pageResponses, setPageResponses] = useState<SurveyResponses>({});

  const handleInputChange = (questionId: string, value: string) => {
    setPageResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const validatePage = (): boolean => {
    const page = surveyPages[currentPage];
    for (const question of page.questions) {
      if (!pageResponses[question.questionId]) {
        return false; // At least one question is unanswered
      }
    }
    return true; // All questions are answered
  };

  const handleNextPage = () => {
    if (!validatePage()) {
      alert('الرجاء الإجابة على جميع الأسئلة في هذه الصفحة.');
      return;
    }
    
    // Save current page responses to form responses before moving on
    const updatedFormResponses = { ...formResponses, ...pageResponses };
    setFormResponses(updatedFormResponses);
    
    // When moving to next page, reset page responses
    if (currentPage < surveyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      setPageResponses({});
    } else {
      // Calculate final score
      const responses = { ...updatedFormResponses };
      
      // Calculate the bias score
      const { biasScore, biasLevel } = calculateBiasScore(responses);

      // Include bias level and score in the responses
      responses.biasLevel = biasLevel;
      responses.biasScore = biasScore.toString();
      
      onComplete(responses);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Reset page responses when going back to previous page
      setPageResponses({});
    }
  };

  const currentSurveyPage = surveyPages[currentPage];

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">استبيان حول الوعي بالتحيز</h2>
      <p className="text-center">
        {`صفحة ${currentPage + 1} من ${surveyPages.length}`}
      </p>
      
      {currentSurveyPage && (
        <SurveyPageComponent
          page={currentSurveyPage}
          responses={pageResponses}
          onResponseChange={handleInputChange}
        />
      )}

      <div className="flex justify-between">
        <Button
          onClick={handlePrevPage}
          variant="outline"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={currentPage === 0}
        >
          السابق
        </Button>
        <Button
          onClick={handleNextPage}
          className="bg-indigo-500 hover:bg-indigo-700 text-white"
        >
          {currentPage === surveyPages.length - 1 ? 'إرسال' : 'التالي'}
        </Button>
      </div>
    </div>
  );
};

export default BiasAwarenessSurvey;
export { SurveyResponses };
