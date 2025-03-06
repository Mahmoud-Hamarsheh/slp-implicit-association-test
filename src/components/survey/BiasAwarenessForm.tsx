
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { SurveyResponses } from './types';

export interface BiasAwarenessFormProps {
  onComplete: (data: SurveyResponses) => void;
}

export const BiasAwarenessForm: React.FC<BiasAwarenessFormProps> = ({ onComplete }) => {
  // This is a placeholder component that can be expanded later with actual bias awareness questions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dummyData: SurveyResponses = {
      biasLevel: 'moderate',
      biasScore: '3'
    };
    onComplete(dummyData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-center">استبيان الوعي بالتحيز</p>
          <Button type="submit" className="w-full">إرسال</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BiasAwarenessForm;
