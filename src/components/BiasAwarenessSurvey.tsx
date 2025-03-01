
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface BiasAwarenessSurveyProps {
  onComplete: (data: SurveyResponses) => void;
}

export interface SurveyResponses {
  [key: string]: string;
}

const LIKERT_OPTIONS = [
  "أوافق بشدة",
  "أوافق",
  "محايد",
  "لا أوافق",
  "لا أوافق بشدة"
];

const QUESTIONS = [
  "الأشخاص الذين يعانون من اضطرابات التواصل أقل قدرة على التعلم مقارنة بالأشخاص غير المصابين.",
  "الأشخاص الذين يعانون من اضطرابات التواصل يجدون صعوبة في التفكير المعقد واتخاذ القرارات.",
  "يميل الأشخاص الذين يعانون من اضطرابات التواصل إلى أن يكونوا أقل اجتماعية من غيرهم.",
  "من الصعب إجراء محادثة ممتعة مع شخص يعاني من اضطرابات التواصل.",
  "من السهل إجراء محادثة ممتعة مع شخص يعاني من اضطرابات التواصل.", // Negative statement - requires reverse scoring
  "يجب إعطاء الأولوية في العلاج للأشخاص الذين لديهم احتمال أكبر للتحسن.",
  "بعض اضطرابات التواصل ليست بحاجة إلى تدخل علاجي لأنها لا تؤثر بشكل كبير على حياة الشخص.",
  "يجب إعطاء الأولوية في العلاج للأشخاص بغض النظر عن احتمالات تحسنهم.", // Negative statement - requires reverse scoring
  "الأشخاص الذين يعانون من اضطرابات التواصل لديهم فرص أقل للنجاح في حياتهم المهنية.",
  "من الأفضل للأطفال الذين لديهم اضطرابات التواصل أن يتلقوا تعليمًا في بيئات خاصة بدلاً من المدارس العادية.",
  "أفضل ان تكون علاقاتي رسمية مع الأشخاص الذين لديهم اضطرابات التواصل.",
  "أرى ان الأشخاص الذين لديهم اضطرابات التواصل غير قادرين على التحكم بمشاعرهم وردات فعلهم العاطفية."
];

// Questions that need reverse scoring (0-based index)
const REVERSE_SCORING_QUESTIONS = [4, 7];

export const BiasAwarenessSurvey: React.FC<BiasAwarenessSurveyProps> = ({ onComplete }) => {
  const [responses, setResponses] = useState<SurveyResponses>({});
  const [currentPage, setCurrentPage] = useState(0);
  
  // Split questions into pages of 4 questions each
  const questionsPerPage = 4;
  const totalPages = Math.ceil(QUESTIONS.length / questionsPerPage);
  
  const currentPageQuestions = QUESTIONS.slice(
    currentPage * questionsPerPage, 
    (currentPage + 1) * questionsPerPage
  );

  const handleResponse = (question: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const isPageComplete = () => {
    return currentPageQuestions.every(question => responses[question]);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Final page - calculate and submit
      calculateBiasScore();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculateBiasScore = () => {
    // Map LIKERT_OPTIONS to numeric values (from 5 to 1)
    const likertToNumber: Record<string, number> = {
      "أوافق بشدة": 5,
      "أوافق": 4,
      "محايد": 3,
      "لا أوافق": 2,
      "لا أوافق بشدة": 1
    };

    // Calculate sum of all responses with reverse scoring for negative items
    let sum = 0;
    QUESTIONS.forEach((question, index) => {
      const responseValue = likertToNumber[responses[question]] || 0;
      
      // Apply reverse scoring for negative statements
      if (REVERSE_SCORING_QUESTIONS.includes(index)) {
        sum += (6 - responseValue); // Reverse formula: 6 - original score
      } else {
        sum += responseValue;
      }
    });

    // Calculate the mean score
    const meanScore = sum / QUESTIONS.length;
    
    // Determine bias level
    let biasLevel = "";
    if (meanScore <= 2.5) {
      biasLevel = "منخفض";
    } else if (meanScore <= 3.5) {
      biasLevel = "متوسط";
    } else {
      biasLevel = "عالي";
    }

    // Add bias score to responses
    const finalResponses = {
      ...responses,
      biasScore: meanScore.toString(),
      biasLevel: biasLevel
    };
    
    onComplete(finalResponses);
  };

  return (
    <Card className="w-full max-w-4xl p-8 mx-auto mt-8 space-y-8">
      <h2 className="text-2xl font-semibold text-right mb-6">استبيان تجاه الأفراد ذوي اضطرابات التواصل</h2>
      
      <div className="space-y-6">
        {currentPageQuestions.map((question, index) => (
          <div key={index} className="space-y-4">
            <p className="text-right">{question}</p>
            <RadioGroup
              className="flex flex-row-reverse justify-end gap-4"
              onValueChange={(value) => handleResponse(question, value)}
              value={responses[question]}
            >
              {LIKERT_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2 flex-row-reverse">
                  <Label htmlFor={`${currentPage * questionsPerPage + index}-${option}`} className="text-right">{option}</Label>
                  <RadioGroupItem value={option} id={`${currentPage * questionsPerPage + index}-${option}`} />
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {currentPage > 0 && (
          <Button onClick={handlePrevPage} variant="outline">
            السابق
          </Button>
        )}
        <div className="flex-1 text-center">
          صفحة {currentPage + 1} من {totalPages}
        </div>
        <Button 
          onClick={handleNextPage}
          disabled={!isPageComplete()}
        >
          {currentPage < totalPages - 1 ? "التالي" : "إنهاء"}
        </Button>
      </div>
    </Card>
  );
};
