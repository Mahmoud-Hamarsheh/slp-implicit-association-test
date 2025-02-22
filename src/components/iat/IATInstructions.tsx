
import React from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

interface InstructionsProps {
  block: number;
}

export const IATInstructions: React.FC<InstructionsProps> = ({ block }) => {
  const getBlockInstructions = (block: number) => {
    switch (block) {
      case 1:
        return {
          title: "١ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل",
          rightKey: "تواصل طبيعي"
        };
      case 2:
        return {
          title: "٢ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى صفات ايجابية أو صفات سلبية بأسرع ما يمكن.",
          leftKey: "صفات سلبية",
          rightKey: "صفات إيجابية"
        };
      case 3:
        return {
          title: "٣ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل أو صفات سلبية",
          rightKey: "تواصل طبيعي أو صفات إيجابية"
        };
      case 4:
        return {
          title: "٤ من اصل ٧",
          description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "اضطراب تواصل أو صفات سلبية",
          rightKey: "تواصل طبيعي أو صفات إيجابية"
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
          leftKey: "اضطراب تواصل أو صفات إيجابية",
          rightKey: "تواصل طبيعي أو صفات سلبية"
        };
      case 7:
        return {
          title: "٧ من اصل ٧",
          description: "هذا مماثل للجزء السابق",
          leftKey: "اضطراب تواصل أو صفات إيجابية",
          rightKey: "تواصل طبيعي أو صفات سلبية"
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
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">{instructions.title}</h2>
      <p className="text-lg">{instructions.description}</p>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-xl font-bold mb-4">التصنيفات:</div>
        <div className="space-y-3 text-right">
          <div className="text-lg">
            اضغط على (D) إذا كانت الكلمة تنتمي إلى {instructions.leftKey}
          </div>
          <div className="text-lg">
            اضغط على (K) إذا كانت الكلمة تنتمي إلى {instructions.rightKey}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-xl font-bold mb-4">تذكر:</div>
        <ul className="space-y-3 text-right">
          <li className="flex items-center justify-end gap-2">
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
            حاول الإجابة بسرعة ودون تردد.
          </li>
          <li className="flex items-center justify-end gap-2">
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
            إذا أخطأت سيظهر رمز X أحمر. ويمكنك المحاولة مرة أخرى.
          </li>
          <li className="flex items-center justify-end gap-2">
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
            ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة.
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-lg mb-4">عند استعدادك، اضغط على "ابدأ" للمتابعة!</p>
        <Button>ابدأ</Button>
      </div>
    </div>
  );
};
