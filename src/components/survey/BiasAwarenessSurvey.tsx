
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SurveyPageComponent } from './SurveyPage';
import { surveyPages } from './surveyData';
import { calculateBiasScore } from './scoreUtils';
import { SurveyResponses, BiasAwarenessSurveyProps } from './types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BiasAwarenessSurvey: React.FC<BiasAwarenessSurveyProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formResponses, setFormResponses] = useState<SurveyResponses>({});
  const [pageResponses, setPageResponses] = useState<SurveyResponses>({});

  // Calculate progress percentage
  const progressPercentage = ((currentPage + 1) / surveyPages.length) * 100;

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
  const isLastPage = currentPage === surveyPages.length - 1;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-primary">استبيان حول الوعي بالتحيز</CardTitle>
          <div className="text-sm text-muted-foreground mt-2 font-medium">
            {`صفحة ${currentPage + 1} من ${surveyPages.length}`}
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2 bg-secondary/50" />
          </div>
        </CardHeader>
        
        <CardContent className="px-4 pt-6 pb-2 md:px-8">
          {currentSurveyPage && (
            <SurveyPageComponent
              page={currentSurveyPage}
              responses={pageResponses}
              onResponseChange={handleInputChange}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between p-6 border-t border-gray-100">
          <Button
            onClick={handlePrevPage}
            variant="outline"
            className="flex items-center gap-2"
            disabled={currentPage === 0}
          >
            <ArrowRight className="h-4 w-4" />
            السابق
          </Button>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <span className="font-medium">{currentPage + 1}</span>
              <span className="mx-1">من</span>
              <span className="font-medium">{surveyPages.length}</span>
            </div>
          </div>
          
          <Button
            onClick={handleNextPage}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            {isLastPage ? (
              <>
                إرسال
                <Send className="h-4 w-4 ms-1" />
              </>
            ) : (
              <>
                التالي
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BiasAwarenessSurvey;

