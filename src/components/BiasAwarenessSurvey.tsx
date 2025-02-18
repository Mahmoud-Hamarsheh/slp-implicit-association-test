
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface BiasAwarenessSurveyProps {
  onComplete: (data: SurveyResponses) => void;
}

export interface SurveyResponses {
  implicitBiasAwareness: { [key: string]: string };
  positiveAttitudes: { [key: string]: string };
  negativeAttitudes: { [key: string]: string };
  normalCommunication: { [key: string]: string };
  communicationDisorders: { [key: string]: string };
}

const LIKERT_OPTIONS = [
  "أوافق بشدة",
  "أوافق",
  "محايد",
  "لا أوافق",
  "لا أوافق بشدة"
];

const QUESTIONS = {
  implicitBiasAwareness: [
    "التحيزات الضمنية قد تؤثر على قراراتي الاكلينيكية في تشخيصي وعلاجي للأفراد الذين يعانون من اضطرابات التواصل",
    "أنا على دراية باحتمالية تأثير التحيزات الضمنية على قدراتي التشخيصية والعلاجية للأفراد الذين يعانون من اضطرابات التواصل",
    "اعتقد بأن التحيّز الضمني قد يؤثر على نظرتي للأفراد الذين يعانون من اضطرابات التواصل",
    "أثق بأنني خالٍ/خالية من أي تحيّز أثناء العمل مع الأفراد الذين لديهم اضطرابات تواصل",
    "أحرص دائمًا على مراجعة أفكاري لضمان عدم تأثير التحيّز الضمني على عملي",
    "لا أعتقد أن التحيّز تجاه الأفراد الذين يعانون من اضطرابات التواصل يُعد مشكلة في مجال النطق والتخاطب"
  ],
  positiveAttitudes: [
    "أعتقد أن الأشخاص الذين يعانون من اضطرابات التواصل يتمتعون بالكفاءة مثل أولئك الذين يتمتعون بتواصل طبيعي",
    "أرى أن الأشخاص الذين يعانون من اضطرابات التواصل يتمتعون بالقوة في إدارة حياتهم اليومية",
    "أرى أن الأشخاص الذين يعانون من اضطرابات التواصل هم أفراد واثقون",
    "يمكن للأشخاص الذين يعانون من اضطرابات التواصل أن يظهروا الذكاء بشكل مشابه لأولئك الذين لا يعانون من هذه الاضطرابات",
    "أجد أن الأشخاص الذين يعانون من اضطرابات التواصل يكونون منتبهين للآخرين",
    "الأشخاص الذين يعانون من اضطرابات التواصل يتأقلمون بسرعة في المواقف الاجتماعية",
    "أرى أن الأشخاص الذين يعانون من اضطرابات التواصل يكونون متعاونين في مختلف البيئات"
  ],
  // ... Continue with other categories
};

export const BiasAwarenessSurvey: React.FC<BiasAwarenessSurveyProps> = ({ onComplete }) => {
  const [responses, setResponses] = useState<SurveyResponses>({
    implicitBiasAwareness: {},
    positiveAttitudes: {},
    negativeAttitudes: {},
    normalCommunication: {},
    communicationDisorders: {},
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
          <h3 className="text-xl font-medium text-right">{category}</h3>
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
