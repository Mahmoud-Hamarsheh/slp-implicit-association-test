import React from "react";
import { Button } from "../ui/button";

interface InstructionsProps {
  block: number;
}

export const IATInstructions: React.FC<InstructionsProps> = ({ block }) => {
  const getBlockInstructions = (block: number) => {
    switch (block) {
      case 1:
        return {
          title: "الجزء ١ من ٧",
          leftCategory: "اضطراب تواصل",
          rightCategory: "تواصل طبيعي",
          description: [
            "ضع إصبع اليد اليسرى على مفتاح (D) للكلمات التي تنتمي إلى فئة اضطراب تواصل.",
            "ضع إصبع اليد اليمنى على مفتاح (K) للكلمات التي تنتمي إلى فئة تواصل طبيعي.",
            "ستظهر الكلمات واحدة تلو الأخرى.",
            "إذا أخطأت سيظهر رمز X أحمر. اضغط على المفتاح الآخر للمتابعة.",
            "أجب بأسرع ما يمكن مع الحفاظ على الدقة."
          ]
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
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-8 bg-white">
      <div className="grid grid-cols-2 text-center mb-8 text-green-600 font-semibold">
        <div className="border-r border-gray-200 p-4">
          <div className="text-sm mb-2">اضغط (D) للـ</div>
          <div className="text-lg">{instructions.leftCategory}</div>
        </div>
        <div className="p-4">
          <div className="text-sm mb-2">اضغط (K) للـ</div>
          <div className="text-lg">{instructions.rightCategory}</div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-6 underline">{instructions.title}</h2>
        <div className="space-y-3 text-right">
          {instructions.description.map((line, index) => (
            <p key={index} className="text-lg">{line}</p>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-lg mb-4">اضغط على زر المسافة عندما تكون مستعداً للبدء</p>
        <Button 
          variant="outline"
          className="w-48 text-lg py-6"
        >
          ابدأ
        </Button>
      </div>
    </div>
  );
};
