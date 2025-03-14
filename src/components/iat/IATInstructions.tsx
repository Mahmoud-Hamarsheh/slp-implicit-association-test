
import React from "react";
import { Button } from "../ui/button";

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
      "✔ إذا أخطأت سيظهر رمز X أحمر. ويجب تصحيح الإجابة للمتابعة.",
      "✔ ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة."
    ];

    switch (block) {
      case 1:
        return {
          title: "١ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل",
          reminder: reminders
        };
      case 2:
        return {
          title: "٢ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الصور، ومهمتك هي تصنيفها بأسرع ما يمكن.",
          leftKey: "إيجابي",
          rightKey: "سلبي",
          reminder: reminders
        };
      case 3:
        return {
          title: "٣ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو إيجابي",
          rightKey: "اضطراب تواصل أو سلبي",
          reminder: reminders
        };
      case 4:
        return {
          title: "٤ من اصل ٧",
          description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو إيجابي",
          rightKey: "اضطراب تواصل أو سلبي",
          reminder: reminders
        };
      case 5:
        return {
          title: "٥ من اصل ٧",
          description: "انتبه، لقد تغيرت أماكن التسميات!",
          leftKey: "سلبي",
          rightKey: "إيجابي",
          reminder: reminders
        };
      case 6:
        return {
          title: "٦ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو سلبي",
          rightKey: "اضطراب تواصل أو إيجابي",
          reminder: reminders
        };
      case 7:
        return {
          title: "٧ من اصل ٧",
          description: "هذا مماثل للجزء السابق",
          leftKey: "تواصل طبيعي أو سلبي",
          rightKey: "اضطراب تواصل أو إيجابي",
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
    <div className="p-4 md:p-6 text-center space-y-4 max-w-3xl mx-auto animate-slideUpFade">
      <h2 className="text-xl md:text-2xl font-bold">{instructions.title}</h2>
      
      {instructions.description && (
        <div className="bg-amber-50 border border-amber-200 p-3 md:p-4 rounded-lg">
          <p className="text-amber-800 whitespace-pre-line">{instructions.description}</p>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">التصنيفات:</h3>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold mb-2">K</div>
            <div className="text-green-600 whitespace-pre-line">{instructions.leftKey}</div>
            <p className="mt-2">اضغط "K"</p>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold mb-2">D</div>
            <div className="text-green-600 whitespace-pre-line">{instructions.rightKey}</div>
            <p className="mt-2">اضغط "D"</p>
          </div>
        </div>
      </div>

      {instructions.reminder && (
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold mb-2">تذكر:</h3>
          <div className="text-right space-y-1 md:space-y-2">
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
