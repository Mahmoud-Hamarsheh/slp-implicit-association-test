import React, { useState } from 'react';

interface SurveyResponses {
  [key: string]: string;
}

interface BiasAwarenessSurveyProps {
  onComplete: (responses: SurveyResponses) => void;
}

// Define the structure for a survey page
interface SurveyPage {
  pageId: string;
  questions: {
    questionId: string;
    text: string;
    type: 'radio' | 'text';
    options?: string[];
  }[];
}

// Define the survey pages
const surveyPages: SurveyPage[] = [
  {
    pageId: 'page1',
    questions: [
      {
        questionId: 'q1',
        text: 'أعتقد أن الأشخاص الذين يعانون من صعوبات في التواصل أقل كفاءة من غيرهم.',
        type: 'radio',
        options: ['أوافق بشدة', 'أوافق', 'محايد', 'لا أوافق', 'لا أوافق بشدة'],
      },
      {
        questionId: 'q2',
        text: 'أشعر بالراحة عند التفاعل مع شخص يعاني من صعوبات في التواصل.',
        type: 'radio',
        options: ['أوافق بشدة', 'أوافق', 'محايد', 'لا أوافق', 'لا أوافق بشدة'],
      },
    ],
  },
  {
    pageId: 'page2',
    questions: [
      {
        questionId: 'q3',
        text: 'أعتقد أن دمج الأشخاص ذوي الاحتياجات الخاصة في المجتمع يمثل عبئًا على الموارد.',
        type: 'radio',
        options: ['أوافق بشدة', 'أوافق', 'محايد', 'لا أوافق', 'لا أوافق بشدة'],
      },
      {
        questionId: 'q4',
        text: 'لديّ معرفة كافية حول التحديات التي تواجه الأشخاص ذوي الاحتياجات الخاصة.',
        type: 'radio',
        options: ['أوافق بشدة', 'أوافق', 'محايد', 'لا أوافق', 'لا أوافق بشدة'],
      },
    ],
  },
  {
    pageId: 'page3',
    questions: [
      {
        questionId: 'q5',
        text: 'أجد صعوبة في فهم احتياجات الأشخاص الذين يعانون من صعوبات في التواصل.',
        type: 'radio',
        options: ['أوافق بشدة', 'أوافق', 'محايد', 'لا أوافق', 'لا أوافق بشدة'],
      },
      {
        questionId: 'q6',
        text: 'أعتقد أن الأشخاص الذين يعانون من صعوبات في التواصل يحتاجون إلى معاملة خاصة.',
        type: 'radio',
        options: ['أوافق بشدة', 'أوافق', 'محايد', 'لا أوافق', 'لا أوافق بشدة'],
      },
    ],
  },
];

// Update the navigation handlers to reset page responses
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
    
    // When moving to next page, reset page responses
    if (currentPage < surveyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      setPageResponses({});
    } else {
      // Calculate final score
      const responses = { ...formResponses, ...pageResponses };
      
      // Calculate the bias score
      let biasScore = 0;
      let biasLevel = 'محايد';

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
      biasQuestions.forEach(questionId => {
        const response = responses[questionId];
        if (response) {
          biasScore += responseValues[response] || 0;
        }
      });

      // Normalize the score (example)
      biasScore = (biasScore / (biasQuestions.length * 5)) * 100;

      // Determine bias level based on score
      if (biasScore > 60) {
        biasLevel = 'مرتفع';
      } else if (biasScore > 40) {
        biasLevel = 'متوسط';
      } else if (biasScore > 20) {
        biasLevel = 'ضعيف';
      } else {
        biasLevel = 'محايد';
      }

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
        <div className="space-y-4">
          {currentSurveyPage.questions.map(question => (
            <div key={question.questionId} className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">{question.text}</label>
              {question.type === 'radio' && question.options && (
                <div className="mt-2">
                  {question.options.map(option => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`${question.questionId}-${option}`}
                        name={question.questionId}
                        value={option}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        onChange={(e) => handleInputChange(question.questionId, e.target.value)}
                        checked={pageResponses[question.questionId] === option}
                      />
                      <label htmlFor={`${question.questionId}-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'text' && (
                <textarea
                  id={question.questionId}
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  onChange={(e) => handleInputChange(question.questionId, e.target.value)}
                  value={pageResponses[question.questionId] || ''}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePrevPage}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={currentPage === 0}
        >
          السابق
        </button>
        <button
          onClick={handleNextPage}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {currentPage === surveyPages.length - 1 ? 'إرسال' : 'التالي'}
        </button>
      </div>
    </div>
  );
};

export default BiasAwarenessSurvey;
