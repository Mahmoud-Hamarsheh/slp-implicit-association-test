import React, { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

interface IATProps {
  onComplete: (result: number) => void;
  surveyData: { 
    age: number; 
    yearsExperience: number; 
    degree: string;
    biasAwarenessResponses: {
      implicitBiasAwareness: { [key: string]: string };
      positiveAttitudes: { [key: string]: string };
      negativeAttitudes: { [key: string]: string };
      normalCommunication: { [key: string]: string };
      communicationDisorders: { [key: string]: string };
    }
  };
}

interface Trial {
  stimulus: string;
  category: string;
  correctKey: "e" | "i";
}

const BLOCKS = {
  COMMUNICATION_DISORDER: ["أفيزيا", "تأتأة", "ديسارثريا", "اضطراب صوت", "أبراكسيا", "تأخر لغوي"],
  NORMAL_COMMUNICATION: ["اجتماعي", "نشط", "متفاعل", "معبر", "طليق", "مركز"],
  NEGATIVE_ATTRIBUTES: ["محدود", "ضعيف", "سلبي", "أخرق", "مشتت", "بطيء", "متردد", "متوتر"],
  POSITIVE_ATTRIBUTES: ["كفو/قادر", "قوي", "واثق", "ذكي", "منتبه", "سريع", "مرن", "متعاون"]
};

export const IAT: React.FC<IATProps> = ({ onComplete, surveyData }) => {
  const { toast } = useToast();
  const [currentBlock, setCurrentBlock] = useState(1);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState<{ block: number; responseTime: number; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);

  const generateTrials = useCallback((block: number): Trial[] => {
    let newTrials: Trial[] = [];
    switch (block) {
      case 1: // Practice: Communication Disorder vs Normal Communication
      case 4: // Test: Communication Disorder vs Normal Communication
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: "e" as const
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: "i" as const
          }))
        ];
        break;
      case 2: // Practice: Negative vs Positive Attributes
      case 5: // Test: Negative vs Positive Attributes
        newTrials = [
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: "e" as const
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: "i" as const
          }))
        ];
        break;
      case 3: // Practice: Combined Compatible
      case 6: // Test: Combined Compatible
      case 7: // Test: Combined Incompatible
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: block === 7 ? "i" as const : "e" as const
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: block === 7 ? "e" as const : "i" as const
          })),
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: block === 7 ? "i" as const : "e" as const
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: block === 7 ? "e" as const : "i" as const
          }))
        ];
        break;
    }
    return newTrials.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    setTrials(generateTrials(currentBlock));
    setCurrentTrial(0);
  }, [currentBlock, generateTrials]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    console.log('Key pressed:', e.key, 'Current trial:', currentTrial, 'Start time:', startTime, 'Show feedback:', showFeedback);
    
    if (!isTestStarted || !startTime || showFeedback) return;

    const responseTime = Date.now() - startTime;
    const currentStimulus = trials[currentTrial];

    if (e.key.toLowerCase() === "e" || e.key.toLowerCase() === "i") {
      console.log('Valid key press detected');
      const correct = e.key.toLowerCase() === currentStimulus.correctKey;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      const newResponse = {
        block: currentBlock,
        responseTime,
        correct
      };
      
      setResponses(prev => [...prev, newResponse]);

      setTimeout(() => {
        setShowFeedback(false);
        if (currentTrial + 1 >= trials.length) {
          if (currentBlock < 7) {
            setCurrentBlock(currentBlock + 1);
          } else {
            const dScore = calculateDScore(responses);
            saveResults(dScore);
            onComplete(dScore);
          }
        } else {
          setCurrentTrial(currentTrial + 1);
        }
      }, 500);
    }
  }, [currentTrial, trials, startTime, showFeedback, responses, currentBlock, onComplete, isTestStarted]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!showFeedback && isTestStarted) {
      setStartTime(Date.now());
    }
  }, [currentTrial, showFeedback, isTestStarted]);

  const calculateDScore = (responses: { block: number; responseTime: number; correct: boolean }[]) => {
    // Get responses from blocks 4 and 7 (test blocks)
    const block4Responses = responses.filter(r => r.block === 4);
    const block7Responses = responses.filter(r => r.block === 7);

    // Calculate means
    const mean4 = block4Responses.reduce((acc, r) => acc + r.responseTime, 0) / block4Responses.length;
    const mean7 = block7Responses.reduce((acc, r) => acc + r.responseTime, 0) / block7Responses.length;

    // Calculate standard deviation
    const allTestResponses = [...block4Responses, ...block7Responses];
    const mean = allTestResponses.reduce((acc, r) => acc + r.responseTime, 0) / allTestResponses.length;
    const variance = allTestResponses.reduce((acc, r) => acc + Math.pow(r.responseTime - mean, 2), 0) / allTestResponses.length;
    const sd = Math.sqrt(variance);

    // Calculate D score
    return (mean7 - mean4) / sd;
  };

  const saveResults = async (dScore: number) => {
    try {
      const { error } = await supabase
        .from('iat_results')
        .insert([
          {
            d_score: dScore,
            age: surveyData.age,
            years_experience: surveyData.yearsExperience,
            degree: surveyData.degree,
            implicit_bias_awareness: surveyData.biasAwarenessResponses.implicitBiasAwareness,
            positive_attitudes: surveyData.biasAwarenessResponses.positiveAttitudes,
            negative_attitudes: surveyData.biasAwarenessResponses.negativeAttitudes,
            normal_communication: surveyData.biasAwarenessResponses.normalCommunication,
            communication_disorders: surveyData.biasAwarenessResponses.communicationDisorders,
            survey_responses: surveyData.biasAwarenessResponses,
            responses: responses
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "تم حفظ النتائج بنجاح",
        description: "تم تسجيل إجاباتك في قاعدة البيانات",
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ النتائج",
        description: "حدث خطأ أثناء حفظ النتائج، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const getBlockInstructions = (block: number) => {
    switch (block) {
      case 1:
        return {
          left: "أفيزيا",
          right: "اجتماعي",
          title: "مقطع تدريبية: الأقسام"
        };
      case 2:
        return {
          left: "سلبي",
          right: "متعاون",
          title: "مقطع تدريبية: الخصائص"
        };
      case 3:
        return {
          left: "أفيزيا أو سلبي",
          right: "اجتماعي أو متعاون",
          title: "مقطع تدريبية: مزدوج"
        };
      case 4:
        return {
          left: "أفيزيا",
          right: "اجتماعي",
          title: "مقطع اختبار: الأقسام"
        };
      case 5:
        return {
          left: "سلبي",
          right: "متعاون",
          title: "مقطع اختبار: الخصائص"
        };
      case 6:
        return {
          left: "أفيزيا أو سلبي",
          right: "اجتماعي أو متعاون",
          title: "مقطع اختبار: مزدوج"
        };
      case 7:
        return {
          left: "اجتماعي أو سلبي",
          right: "أفيزيا أو متعاون",
          title: "مقطع اختبار: عكس"
        };
      default:
        return {
          left: "",
          right: "",
          title: ""
        };
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
    setStartTime(Date.now());
  };

  if (!trials.length) return null;

  const instructions = getBlockInstructions(currentBlock);

  return (
    <Card className="w-full max-w-2xl p-8 mx-auto mt-8 animate-fadeIn">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">{instructions.title}</h2>
        <p className="text-sm text-gray-600">المقطع {currentBlock} من 7</p>
        
        {!isTestStarted ? (
          <div className="space-y-4">
            <p className="text-lg">اضغط الزر أدناه لبدء الاختبار</p>
            <Button onClick={startTest}>ابدأ</Button>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold my-8">{trials[currentTrial]?.stimulus}</div>
            
            <div className="flex justify-between px-8 text-sm text-gray-600">
              <div>اضغط 'E' لـ {instructions.left}</div>
              <div>اضغط 'I' لـ {instructions.right}</div>
            </div>

            {showFeedback && (
              <div className={`text-xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                {isCorrect ? "صحيح!" : "خطأ"}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
