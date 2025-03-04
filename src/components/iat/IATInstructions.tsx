
import React from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

interface InstructionsProps {
  block: number;
  onStart: () => void;
}

interface BlockInstructions {
  title: string;
  description: string | string[];
  leftKey: string;
  rightKey: string;
  reminder?: string[];
}

interface IATInstructionsProps {
  block: number;
  onStart: () => void;
}

export const IATInstructions: React.FC<IATInstructionsProps> = ({ 
  block, 
  onStart 
}) => {
  const getInstructionsForBlock = (block: number): BlockInstructions => {
    const reminders = [
      "✔ حاول الإجابة بسرعة ودون تردد.",
      "✔ إذا أخطأت سيظهر رمز X أحمر. ويمكنك المحاولة مرة أخرى.",
      "✔ ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة."
    ];

    switch (block) {
      case 1:
        return {
          title: "١ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل",
          rightKey: "تواصل طبيعي",
          reminder: reminders
        };
      case 2:
        return {
          title: "٢ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى صفات ايجابية أو صفات سلبية بأسرع ما يمكن.",
          leftKey: "صفات سلبية",
          rightKey: "صفات إيجابية",
          reminder: reminders
        };
      case 3:
        return {
          title: "٣ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل أو صفة سلبية",
          rightKey: "تواصل طبيعي أو صفة إيجابية",
          reminder: reminders
        };
      case 4:
        return {
          title: "٤ من اصل ٧",
          description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل أو صفة سلبية",
          rightKey: "تواصل طبيعي أو صفة إيجابية",
          reminder: reminders
        };
      case 5:
        return {
          title: "٥ من اصل ٧",
          description: "انتبه، لقد تغيرت أماكن التسميات!",
          leftKey: "صفات إيجابية",
          rightKey: "صفات سلبية",
          reminder: reminders
        };
      case 6:
        return {
          title: "٦ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل أو صفة ايجابية",
          rightKey: "تواصل طبيعي أو صفة سلبية",
          reminder: reminders
        };
      case 7:
        return {
          title: "٧ من اصل ٧",
          description: "هذا مماثل للجزء السابق",
          leftKey: "اضطراب تواصل أو صفة ايجابية",
          rightKey: "تواصل طبيعي أو صفة سلبية",
          reminder: reminders
        };
      default:
        return {
          title: "",
          description: "",
          leftKey: "",
          rightKey: ""
        };
    }
  };

  const instructions = getInstructionsForBlock(block);

  return (
    <div className="p-6 text-center space-y-4 max-w-3xl mx-auto animate-slideUpFade">
      <h2 className="text-2xl font-bold">{instructions.title}</h2>
      
      {instructions.description && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-amber-800 whitespace-pre-line">{instructions.description}</p>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">التصنيفات:</h3>
        <div className="space-y-3">
          <p className="text-lg">اضغط على (D) إذا كانت الكلمة تنتمي إلى {instructions.leftKey}</p>
          <p className="text-lg">اضغط على (K) إذا كانت الكلمة تنتمي إلى {instructions.rightKey}</p>
        </div>
      </div>

      {instructions.reminder && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold mb-2">تذكر:</h3>
          <div className="text-right space-y-2">
            {instructions.reminder.map((item, index) => (
              <p key={index} className="text-blue-700">{item}</p>
            ))}
          </div>
        </div>
      )}

      <Button onClick={onStart} size="lg">بدء المرحلة</Button>
    </div>
  );
};
