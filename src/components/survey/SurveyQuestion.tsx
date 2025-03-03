
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SurveyQuestion as QuestionType } from './types';

interface SurveyQuestionProps {
  question: QuestionType;
  value: string;
  onChange: (questionId: string, value: string) => void;
}

export const SurveyQuestion: React.FC<SurveyQuestionProps> = ({ 
  question, 
  value, 
  onChange 
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label className="block text-lg font-medium text-gray-700">
            {question.text}
          </Label>
          
          {question.type === 'radio' && question.options && (
            <RadioGroup 
              value={value} 
              onValueChange={(val) => onChange(question.questionId, val)}
              className="space-y-2 mt-3"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={option} id={`${question.questionId}-${option}`} />
                  <Label htmlFor={`${question.questionId}-${option}`} className="ms-3">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.type === 'text' && (
            <textarea
              id={question.questionId}
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => onChange(question.questionId, e.target.value)}
              value={value || ''}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
