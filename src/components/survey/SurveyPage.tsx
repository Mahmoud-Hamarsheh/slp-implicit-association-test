
import React from 'react';
import { SurveyQuestion } from './SurveyQuestion';
import { SurveyPage as PageType, SurveyResponses } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="space-y-6 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md border-primary/10 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            {page.questions.map((question) => (
              <SurveyQuestion
                key={question.questionId}
                question={question}
                value={responses[question.questionId] || ''}
                onChange={onResponseChange}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
