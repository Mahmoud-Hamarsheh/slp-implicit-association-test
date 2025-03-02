
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

export const IATInstructions: React.FC<InstructionsProps> = ({ block, onStart }) => {
  const getBlockInstructions = (block: number): BlockInstructions => {
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
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل"
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

  const instructions = getBlockInstructions(block);

  return (
    <div className="max-w-3xl mx-auto text-right space-y-6">
      <h2 className="text-2xl font-bold mb-4">{instructions.title}</h2>
      <p className="text-lg mb-6">{instructions.description}</p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">التصنيفات:</h3>
        <div className="space-y-3">
          <p className="text-lg">اضغط على (K) إذا كانت الكلمة تنتمي إلى {instructions.leftKey}</p>
          <p className="text-lg">اضغط على (D) إذا كانت الكلمة تنتمي إلى {instructions.rightKey}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">تذكر:</h3>
        <ul className="space-y-3">
          <li className="flex items-center justify-end gap-2">
            <span>حاول الإجابة بسرعة ودون تردد.</span>
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>إذا أخطأت سيظهر رمز X أحمر. ويمكنك المحاولة مرة أخرى.</span>
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
          </li>
          <li className="flex items-center justify-end gap-2">
            <span>ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة.</span>
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
          </li>
        </ul>
      </div>

      <div className="text-center mt-8">
        <Button 
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
        >
          ابدأ
        </Button>
      </div>
    </div>
  );
};
