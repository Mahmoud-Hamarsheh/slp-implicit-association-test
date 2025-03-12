
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
      "✔ إذا أخطأت سيظهر رمز X أحمر. ويمكنك المحاولة مرة أخرى.",
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
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها بأسرع ما يمكن.",
          leftKey: "",
          rightKey: "",
          reminder: reminders
        };
      case 3:
        return {
          title: "٣ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل",
          reminder: reminders
        };
      case 4:
        return {
          title: "٤ من اصل ٧",
          description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل",
          reminder: reminders
        };
      case 5:
        return {
          title: "٥ من اصل ٧",
          description: "انتبه، لقد تغيرت أماكن التسميات!",
          leftKey: "",
          rightKey: "",
          reminder: reminders
        };
      case 6:
        return {
          title: "٦ من اصل ٧",
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل",
          reminder: reminders
        };
      case 7:
        return {
          title: "٧ من اصل ٧",
          description: "هذا مماثل للجزء السابق",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل",
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
  
  // Determine if block includes positive/negative attributes
  const isPositiveOnLeft = (block === 2) || (block === 3) || (block === 4);
  const isPositiveOnRight = (block === 5) || (block === 6) || (block === 7);
  const isNegativeOnLeft = (block === 5) || (block === 6) || (block === 7);
  const isNegativeOnRight = (block === 2) || (block === 3) || (block === 4);

  // Determine if block shows communication categories
  const showCommunicationOnLeft = block === 1 || block === 3 || block === 4 || block === 6 || block === 7;
  const showCommunicationOnRight = block === 1 || block === 3 || block === 4 || block === 6 || block === 7;

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
        <div className="space-y-5">
          <div className="flex flex-col items-center">
            {showCommunicationOnLeft && (
              <p className="text-lg mb-2">اضغط على (K) إذا كانت الكلمة تنتمي إلى {instructions.leftKey}</p>
            )}
            {isPositiveOnLeft && (
              <>
                {block === 2 && <p className="text-lg mb-2">اضغط على (K) إذا كانت الكلمة تنتمي إلى صفات إيجابية</p>}
                <div className="flex flex-wrap gap-2 mt-1 justify-center">
                  <img src="/lovable-uploads/3d280a97-f40f-42c4-8095-644ba45df460.png" alt="Positive attribute 1" className="h-8 w-8" />
                  <img src="/lovable-uploads/4ec5761a-9111-4ed1-87e2-cfd914be2cac.png" alt="Positive attribute 2" className="h-8 w-8" />
                  <img src="/lovable-uploads/0614e6dd-0a9e-4360-9278-dbba71cc546b.png" alt="Light bulb idea" className="h-8 w-8" />
                  <img src="/lovable-uploads/2e29f911-0a75-4712-8eea-e2e98db244cb.png" alt="Strong person" className="h-8 w-8" />
                  <img src="/lovable-uploads/80d66870-170b-4907-b25b-fa6a9181c7c9.png" alt="Additional positive" className="h-8 w-8" />
                </div>
              </>
            )}
            {isNegativeOnLeft && (
              <>
                {block === 5 && <p className="text-lg mb-2">اضغط على (K) إذا كانت الكلمة تنتمي إلى صفات سلبية</p>}
                <div className="flex flex-wrap gap-2 mt-1 justify-center">
                  <img src="/lovable-uploads/c5746857-ee51-4e54-b918-f49f50369faf.png" alt="Sad face" className="h-8 w-8" />
                  <img src="/lovable-uploads/901566ad-77e2-4163-aa28-528697bcf20d.png" alt="Timer clock" className="h-8 w-8" />
                  <img src="/lovable-uploads/0ad74854-9e13-4400-b348-cf97697cadc7.png" alt="Additional negative 1" className="h-8 w-8" />
                  <img src="/lovable-uploads/2df0738b-33e7-4fbe-9bd5-785fbb2f81dc.png" alt="Additional negative 2" className="h-8 w-8" />
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            {showCommunicationOnRight && (
              <p className="text-lg mb-2">اضغط على (D) إذا كانت الكلمة تنتمي إلى {instructions.rightKey}</p>
            )}
            {isPositiveOnRight && (
              <>
                {block === 5 && <p className="text-lg mb-2">اضغط على (D) إذا كانت الكلمة تنتمي إلى صفات إيجابية</p>}
                <div className="flex flex-wrap gap-2 mt-1 justify-center">
                  <img src="/lovable-uploads/3d280a97-f40f-42c4-8095-644ba45df460.png" alt="Positive attribute 1" className="h-8 w-8" />
                  <img src="/lovable-uploads/4ec5761a-9111-4ed1-87e2-cfd914be2cac.png" alt="Positive attribute 2" className="h-8 w-8" />
                  <img src="/lovable-uploads/0614e6dd-0a9e-4360-9278-dbba71cc546b.png" alt="Light bulb idea" className="h-8 w-8" />
                  <img src="/lovable-uploads/2e29f911-0a75-4712-8eea-e2e98db244cb.png" alt="Strong person" className="h-8 w-8" />
                  <img src="/lovable-uploads/80d66870-170b-4907-b25b-fa6a9181c7c9.png" alt="Additional positive" className="h-8 w-8" />
                </div>
              </>
            )}
            {isNegativeOnRight && (
              <>
                {block === 2 && <p className="text-lg mb-2">اضغط على (D) إذا كانت الكلمة تنتمي إلى صفات سلبية</p>}
                <div className="flex flex-wrap gap-2 mt-1 justify-center">
                  <img src="/lovable-uploads/c5746857-ee51-4e54-b918-f49f50369faf.png" alt="Sad face" className="h-8 w-8" />
                  <img src="/lovable-uploads/901566ad-77e2-4163-aa28-528697bcf20d.png" alt="Timer clock" className="h-8 w-8" />
                  <img src="/lovable-uploads/0ad74854-9e13-4400-b348-cf97697cadc7.png" alt="Additional negative 1" className="h-8 w-8" />
                  <img src="/lovable-uploads/2df0738b-33e7-4fbe-9bd5-785fbb2f81dc.png" alt="Additional negative 2" className="h-8 w-8" />
                </div>
              </>
            )}
          </div>
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
