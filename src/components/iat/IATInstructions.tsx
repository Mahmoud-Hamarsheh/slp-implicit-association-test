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
    switch (block) {
      case 1:
        return {
          title: "١ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل"
        };
      case 2:
        return {
          title: "٢ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى صفات ايجابية أو صفات سلبية بأسرع ما يمكن.",
          leftKey: "صفات إيجابية",
          rightKey: "صفات سلبية"
        };
      case 3:
        return {
          title: "٣ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو صفة إيجابية",
          rightKey: "اضطراب تواصل أو صفة سلبية"
        };
      case 4:
        return {
          title: "٤ من اصل ٧",
          description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو صفة إيجابية",
          rightKey: "اضطراب تواصل أو صفة سلبية"
        };
      case 5:
        return {
          title: "٥ من اصل ٧",
          description: "انتبه، لقد تغيرت أماكن التسميات!",
          leftKey: "صفات إيجابية",
          rightKey: "صفات سلبية"
        };
      case 6:
        return {
          title: "٦ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو صفة سلبية",
          rightKey: "اضطراب تواصل أو صفة ايجابية"
        };
      case 7:
        return {
          title: "٧ من اصل ٧",
          description: "هذا مماثل للجزء السابق",
          leftKey: "تواصل طبيعي أو صفة سلبية",
          rightKey: "اضطراب تواصل أو صفة ايجابية"
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
          <p className="text-amber-800">{instructions.description}</p>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">التصنيفات:</h3>
        <div className="space-y-3">
          {block === 5 ? (
            <>
              <p className="text-lg">اضغط على (D) إذا كانت الكلمة تنتمي إلى {instructions.leftKey}</p>
              <p className="text-lg">اضغط على (K) إذا كانت الكلمة تنتمي إلى {instructions.rightKey}</p>
            </>
          ) : (
            <>
              <p className="text-lg">اضغط على D إذا كانت الكلمة تنتمي إلى {instructions.leftKey}</p>
              <p className="text-lg">اضغط على K إذا كانت الكلمة تنتمي إلى {instructions.rightKey}</p>
            </>
          )}
        </div>
      </div>

      <Button onClick={onStart} size="lg">بدء المرحلة</Button>
    </div>
  );
};
