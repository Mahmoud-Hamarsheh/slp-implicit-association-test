
import { BlockInstructions } from "../types/instructionTypes";

// Standard reminders shown on all instruction screens
export const standardReminders = [
  "✔ حاول الإجابة بسرعة ودون تردد.",
  "✔ إذا أخطأت سيظهر رمز X أحمر. ويجب تصحيح الإجابة للمتابعة.",
  "✔ ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة."
];

// Image arrays for positive and negative attributes
export const positiveImages = [
  "/lovable-uploads/4ee1dd40-8b8f-434f-8e90-709c1f2a4812.png", // Thumbs up
  "/lovable-uploads/013b45f6-a99e-48fe-98fc-74537c635a43.png", // Trophy winner
  "/lovable-uploads/4e511310-63b0-4dc6-97c6-08f559b7f288.png", // Superhero
  "/lovable-uploads/17922e80-7727-4e77-ba76-efcb82e55f31.png", // Weight lifter
];

export const negativeImages = [
  "/lovable-uploads/4d29ef76-64fb-4508-8d76-2b27461fd844.png", // crying person
  "/lovable-uploads/a3279a90-96f3-4e35-aff6-00a3f84b6355.png", // thumbs down
  "/lovable-uploads/7b1dc96e-d083-46e9-be18-1d7a21122d40.png", // sad person
  "/lovable-uploads/b786a712-7b99-484d-8a15-f2f80241dd1c.png", // depressed walk
];

export const getInstructionsForBlock = (blockNum: number): BlockInstructions => {
  switch (blockNum) {
    case 1:
      return {
        title: `١ من اصل ٧`,
        description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها إلى تواصل طبيعي أو اضطراب تواصل بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي",
        rightKey: "اضطراب تواصل",
        reminder: standardReminders
      };
    case 2:
      return {
        title: `٢ من اصل ٧`,
        description: "ستظهر لك على الشاشة مجموعة من الصور، ومهمتك هي تصنيفها بأسرع ما يمكن.",
        leftKey: "إيجابي",
        rightKey: "سلبي",
        reminder: standardReminders,
        showPositiveImages: true,
        showNegativeImages: true
      };
    case 3:
      return {
        title: `٣ من اصل ٧`,
        description: "ستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي أو إيجابي",
        rightKey: "اضطراب تواصل أو سلبي",
        reminder: standardReminders,
        showPositiveImages: true,
        showNegativeImages: true
      };
    case 4:
      return {
        title: `٤ من اصل ٧`,
        description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي أو إيجابي",
        rightKey: "اضطراب تواصل أو سلبي",
        reminder: standardReminders,
        showPositiveImages: true,
        showNegativeImages: true
      };
    case 5:
      return {
        title: `٥ من اصل ٧`,
        description: "انتبه، لقد تغيرت أماكن التسميات!",
        leftKey: "سلبي",
        rightKey: "إيجابي",
        reminder: standardReminders,
        showPositiveImages: true,
        showNegativeImages: true
      };
    case 6:
      return {
        title: `٦ من اصل ٧`,
        description: "ستظهر لك على الشاشة مجموعة من الكلمات والصور، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي أو سلبي",
        rightKey: "اضطراب تواصل أو إيجابي",
        reminder: standardReminders,
        showPositiveImages: true,
        showNegativeImages: true
      };
    case 7:
      return {
        title: `٧ من اصل ٧`,
        description: "هذا مماثل للجزء السابق",
        leftKey: "تواصل طبيعي أو سلبي",
        rightKey: "اضطراب تواصل أو إيجابي",
        reminder: standardReminders,
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

// Arabic numerals for display
export const arabicNumerals = ["١", "٢", "٣", "٤", "٥", "٦", "٧"];
