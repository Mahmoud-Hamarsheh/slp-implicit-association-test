
import React from 'react';
import { SurveyQuestion } from './SurveyQuestion';
import { SurveyPage as PageType, SurveyResponses } from './types';

interface SurveyPageProps {
  page: PageType;
  responses: SurveyResponses;
  onResponseChange: (questionId: string, value: string) => void;
}

export const SurveyPageComponent: React.FC<SurveyPageProps> = ({ 
  page, 
  responses, 
  onResponseChange 
}) => {
  return (
    <div className="space-y-4">
      {page.questions.map((question) => (
        <SurveyQuestion
          key={question.questionId}
          question={question}
          value={responses[question.questionId] || ''}
          onChange={onResponseChange}
        />
      ))}
    </div>
  );
};
