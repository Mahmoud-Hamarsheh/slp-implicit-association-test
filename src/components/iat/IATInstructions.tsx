
import React from "react";

interface InstructionsProps {
  block: number;
}

export const IATInstructions: React.FC<InstructionsProps> = ({ block }) => {
  const getBlockInstructions = (block: number) => {
    switch (block) {
      case 1:
        return {
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
          left: "اضطراب تواصل",
          right: "تواصل طبيعي",
          title: "١ من اصل ٧"
        };
      case 2:
        return {
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى صفات ايجابية أو صفات سلبية بأسرع ما يمكن.",
          left: "صفات سلبية",
          right: "صفات إيجابية",
          title: "٢ من اصل ٧"
        };
      case 3:
        return {
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          left: "اضطراب تواصل أو صفات سلبية",
          right: "تواصل طبيعي أو صفات إيجابية",
          title: "٣ من اصل ٧"
        };
      case 4:
        return {
          description: "هذا مماثل للجزء السابق - ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          left: "اضطراب تواصل أو صفات سلبية",
          right: "تواصل طبيعي أو صفات إيجابية",
          title: "٤ من اصل ٧"
        };
      case 5:
        return {
          description: "انتبه، لقد تغيرت أماكن التسميات!",
          left: "صفات إيجابية",
          right: "صفات سلبية",
          title: "٥ من اصل ٧"
        };
      case 6:
        return {
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          left: "اضطراب تواصل أو صفات إيجابية",
          right: "تواصل طبيعي أو صفات سلبية",
          title: "٦ من اصل ٧"
        };
      case 7:
        return {
          description: "هذا مماثل للجزء السابق",
          left: "اضطراب تواصل أو صفات إيجابية",
          right: "تواصل طبيعي أو صفات سلبية",
          title: "٧ من اصل ٧"
        };
      default:
        return {
          description: "",
          left: "",
          right: "",
          title: ""
        };
    }
  };

  const instructions = getBlockInstructions(block);

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold">{instructions.title}</h2>
      <p className="text-lg mb-4">{instructions.description}</p>
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="text-lg font-medium">التصنيفات:</div>
        <div className="flex justify-between px-8 text-md">
          <div>اضغط (D) إذا كانت الكلمة تنتمي إلى {instructions.left}</div>
          <div>اضغط (K) إذا كانت الكلمة تنتمي إلى {instructions.right}</div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2 mt-4">
        <div className="text-lg font-medium">تذكر:</div>
        <ul className="text-right space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✔</span>
            حاول الإجابة بسرعة ودون تردد.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✔</span>
            إذا أخطأت سيظهر رمز X أحمر. ويمكنك المحاولة مرة أخرى.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✔</span>
            ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة.
          </li>
        </ul>
      </div>
    </div>
  );
};
