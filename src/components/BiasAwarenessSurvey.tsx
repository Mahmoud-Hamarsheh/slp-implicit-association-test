
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface BiasAwarenessSurveyProps {
  onComplete: (data: SurveyResponses) => void;
}

export interface SurveyResponses {
  linguisticBias: { [key: string]: string };
  socialBias: { [key: string]: string };
  clinicalBias: { [key: string]: string };
  integrationBias: { [key: string]: string };
}

const LIKERT_OPTIONS = [
  "أوافق بشدة",
  "أوافق",
  "محايد",
  "لا أوافق",
  "لا أوافق بشدة"
];

const QUESTIONS = {
  linguisticBias: [
    "الأشخاص الذين يعانون من اضطرابات النطق واللغة أقل قدرة على التعلم مقارنة بالأشخاص غير المصابين",
    "الأشخاص الذين يعانون من اضطرابات اللغة يجدون صعوبة في التفكير المعقد واتخاذ القرارات",
    "من غير المرجح أن ينجح الأشخاص المصابون بالتلعثم في المناصب القيادية"
  ],
  socialBias: [
    "يميل الأشخاص الذين يعانون من اضطرابات التواصل إلى أن يكونوا أقل اجتماعية من غيرهم",
    "من الصعب إجراء محادثة ممتعة مع شخص يعاني من اضطراب في النطق أو اللغة",
    "يجب أن يُعامل الأشخاص المصابون باضطرابات التواصل بطرق خاصة تختلف عن الأشخاص العاديين"
  ],
  clinicalBias: [
    "يجب إعطاء الأولوية في العلاج للأشخاص الذين لديهم احتمال أكبر للتحسن السريع",
    "بعض اضطرابات التواصل ليست بحاجة إلى تدخل علاجي مكثف لأنها لا تؤثر بشكل كبير على حياة الشخص",
    "المرضى الذين يُظهرون تحفيزًا أقل أثناء الجلسات العلاجية قد لا يكونون مؤهلين للعلاج المستمر"
  ],
  integrationBias: [
    "الأشخاص الذين يعانون من اضطرابات اللغة لديهم فرص أقل للنجاح في حياتهم المهنية",
    "من الأفضل للأطفال المصابين باضطرابات اللغة أن يتلقوا تعليمًا في بيئات خاصة بدلاً من المدارس العادية"
  ]
};

export const BiasAwarenessSurvey: React.FC<BiasAwarenessSurveyProps> = ({ onComplete }) => {
  const [responses, setResponses] = useState<SurveyResponses>({
    linguisticBias: {},
    socialBias: {},
    clinicalBias: {},
    integrationBias: {},
  });

  const handleResponse = (category: keyof SurveyResponses, question: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [question]: value
      }
    }));
  };

  const isComplete = () => {
    return Object.keys(QUESTIONS).every(category => 
      QUESTIONS[category as keyof typeof QUESTIONS].every(question => 
        responses[category as keyof SurveyResponses][question]
      )
    );
  };

  const handleSubmit = () => {
    if (isComplete()) {
      onComplete(responses);
    }
  };

  return (
    <Card className="w-full max-w-4xl p-8 mx-auto mt-8 space-y-8">
      <h2 className="text-2xl font-semibold text-right mb-6">استبيان التحيز الضمني</h2>
      
      {Object.entries(QUESTIONS).map(([category, questions]) => (
        <div key={category} className="space-y-6">
          <h3 className="text-xl font-medium text-right">{getCategoryTitle(category)}</h3>
          {questions.map((question, index) => (
            <div key={index} className="space-y-4">
              <p className="text-right">{question}</p>
              <RadioGroup
                className="flex flex-row-reverse justify-end gap-4"
                onValueChange={(value) => handleResponse(category as keyof SurveyResponses, question, value)}
                value={responses[category as keyof SurveyResponses][question]}
              >
                {LIKERT_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2 flex-row-reverse">
                    <Label htmlFor={`${index}-${option}`} className="text-right">{option}</Label>
                    <RadioGroupItem value={option} id={`${index}-${option}`} />
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      ))}

      <Button 
        onClick={handleSubmit}
        disabled={!isComplete()}
        className="w-full"
      >
        متابعة
      </Button>
    </Card>
  );
};

function getCategoryTitle(category: string): string {
  switch (category) {
    case 'linguisticBias':
      return 'تحيزات تتعلق بالكفاءة اللغوية والمعرفية';
    case 'socialBias':
      return 'تحيزات اجتماعية وسلوكية';
    case 'clinicalBias':
      return 'تحيزات مهنية في الممارسة الإكلينيكية';
    case 'integrationBias':
      return 'تحيزات تتعلق بالاندماج والتوقعات المستقبلية';
    default:
      return category;
  }
}
