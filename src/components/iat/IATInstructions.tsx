
import React from "react";
import { Button } from "../ui/button";

interface BlockInstructions {
  title: string;
  description: string | string[];
  leftKey: string;
  rightKey: string;
  reminder?: string[];
  showPositiveImages?: boolean;
  showNegativeImages?: boolean;
}

interface IATInstructionsProps {
  block: number;
  onStart: () => void;
  testModel?: "A" | "B";
}

export const IATInstructions: React.FC<IATInstructionsProps> = ({ 
  block, 
  onStart,
  testModel = "A"
}) => {
  // Get the effective block number based on test model (for content display)
  const effectiveBlock = testModel === "B" && block >= 2 && block <= 7 
    ? block <= 4 ? block + 3 : block - 3 
    : block;
  
  // For display purposes, we always show the sequential block number (1-7)
  // regardless of the test model or effective block
  const displayBlockNumber = block;
  
  console.log(`Block ${block}, effective block ${effectiveBlock} for model ${testModel}, displaying as block ${displayBlockNumber}`);

  // Images for positive and negative attributes
  const positiveImages = [
    "/lovable-uploads/4ee1dd40-8b8f-434f-8e90-709c1f2a4812.png", // Thumbs up
    "/lovable-uploads/013b45f6-a99e-48fe-98fc-74537c635a43.png", // Trophy winner
    "/lovable-uploads/4e511310-63b0-4dc6-97c6-08f559b7f288.png", // Superhero
  ];

  const negativeImages = [
    "/lovable-uploads/4d29ef76-64fb-4508-8d76-2b27461fd844.png", // crying person
    "/lovable-uploads/a3279a90-96f3-4e35-aff6-00a3f84b6355.png", // thumbs down
    "/lovable-uploads/7b1dc96e-d083-46e9-be18-1d7a21122d40.png", // sad person
  ];

  const getInstructionsForBlock = (blockNum: number): BlockInstructions => {
    const reminders = [
      "✔ حاول الإجابة بسرعة ودون تردد.",
      "✔ إذا أخطأت سيظهر رمز X أحمر. ويجب تصحيح الإجابة للمتابعة.",
      "✔ ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة."
    ];

    // We'll get the content based on the effective block
    // but the title will be modified later to show the sequential number
    switch (blockNum) {
      case 1:
        return {
          title: `١ من اصل ٧`,
          description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي",
          rightKey: "اضطراب تواصل",
          reminder: reminders
        };
      case 2:
        return {
          title: `٢ من اصل ٧`,
          description: "ستظهر لك على الشاشة مجموعة من الصور، ومهمتك هي تصنيفها بأسرع ما يمكن.",
          leftKey: "إيجابي",
          rightKey: "سلبي",
          reminder: reminders,
          showPositiveImages: true,
          showNegativeImages: true
        };
      case 3:
        return {
          title: `٣ من اصل ٧`,
          description: "ستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو إيجابي",
          rightKey: "اضطراب تواصل أو سلبي",
          reminder: reminders,
          showPositiveImages: true,
          showNegativeImages: true
        };
      case 4:
        return {
          title: `٤ من اصل ٧`,
          description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو إيجابي",
          rightKey: "اضطراب تواصل أو سلبي",
          reminder: reminders,
          showPositiveImages: true,
          showNegativeImages: true
        };
      case 5:
        return {
          title: `٥ من اصل ٧`,
          description: "انتبه، لقد تغيرت أماكن التسميات!",
          leftKey: "سلبي",
          rightKey: "إيجابي",
          reminder: reminders,
          showPositiveImages: true,
          showNegativeImages: true
        };
      case 6:
        return {
          title: `٦ من اصل ٧`,
          description: "ستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
          leftKey: "تواصل طبيعي أو سلبي",
          rightKey: "اضطراب تواصل أو إيجابي",
          reminder: reminders,
          showPositiveImages: true,
          showNegativeImages: true
        };
      case 7:
        return {
          title: `٧ من اصل ٧`,
          description: "هذا مماثل للجزء السابق",
          leftKey: "تواصل طبيعي أو سلبي",
          rightKey: "اضطراب تواصل أو إيجابي",
          reminder: reminders,
          showPositiveImages: true,
          showNegativeImages: true
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

  // Get instructions based on the effective block (which content to show)
  const instructions = getInstructionsForBlock(effectiveBlock);
  
  // Create Arabic numerals for the block number (1-7)
  const arabicNumerals = ["١", "٢", "٣", "٤", "٥", "٦", "٧"];
  
  // Replace the number in the title with the sequential block number (display block)
  // This ensures we always show 1-7 in order regardless of the test model
  const displayTitle = `${arabicNumerals[displayBlockNumber-1]} من اصل ٧`;

  return (
    <div className="p-4 md:p-6 text-center space-y-4 max-w-3xl mx-auto animate-slideUpFade">
      <h2 className="text-xl md:text-2xl font-bold">{displayTitle}</h2>
      
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
            
            {/* Show positive/negative images based on the block */}
            {instructions.showPositiveImages && instructions.leftKey.includes("إيجابي") && (
              <div className="flex justify-center mt-2 gap-2">
                {positiveImages.map((src, index) => (
                  <img key={`left-pos-${index}`} src={src} alt="إيجابي" className="w-8 h-8 object-contain" />
                ))}
              </div>
            )}
            
            {instructions.showNegativeImages && instructions.leftKey.includes("سلبي") && (
              <div className="flex justify-center mt-2 gap-2">
                {negativeImages.map((src, index) => (
                  <img key={`left-neg-${index}`} src={src} alt="سلبي" className="w-8 h-8 object-contain" />
                ))}
              </div>
            )}
            
            <p className="mt-2">اضغط "K"</p>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold mb-2">D</div>
            <div className="text-green-600 whitespace-pre-line">{instructions.rightKey}</div>
            
            {/* Show positive/negative images based on the block */}
            {instructions.showPositiveImages && instructions.rightKey.includes("إيجابي") && (
              <div className="flex justify-center mt-2 gap-2">
                {positiveImages.map((src, index) => (
                  <img key={`right-pos-${index}`} src={src} alt="إيجابي" className="w-8 h-8 object-contain" />
                ))}
              </div>
            )}
            
            {instructions.showNegativeImages && instructions.rightKey.includes("سلبي") && (
              <div className="flex justify-center mt-2 gap-2">
                {negativeImages.map((src, index) => (
                  <img key={`right-neg-${index}`} src={src} alt="سلبي" className="w-8 h-8 object-contain" />
                ))}
              </div>
            )}
            
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

