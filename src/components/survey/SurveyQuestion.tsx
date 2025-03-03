
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    <div className="animate-fadeIn transition-all duration-300">
      <div className="space-y-4">
        <Label className="block text-lg font-medium text-gray-700 mb-3">
          {question.text}
        </Label>
        
        {question.type === 'radio' && question.options && (
          <RadioGroup 
            value={value} 
            onValueChange={(val) => onChange(question.questionId, val)}
            className="space-y-3 mt-2"
          >
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2 space-x-reverse p-2 rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={`${question.questionId}-${option}`} className="ms-2" />
                <Label 
                  htmlFor={`${question.questionId}-${option}`} 
                  className="ms-2 text-base text-gray-700 cursor-pointer w-full"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {question.type === 'text' && (
          <Textarea
            id={question.questionId}
            rows={3}
            className="w-full resize-none focus-visible:ring-primary"
            onChange={(e) => onChange(question.questionId, e.target.value)}
            value={value || ''}
            placeholder="أدخل إجابتك هنا..."
          />
        )}
      </div>
    </div>
  );
};
