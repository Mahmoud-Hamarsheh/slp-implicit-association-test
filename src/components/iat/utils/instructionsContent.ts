
import { BlockInstructions } from "../types/instructionTypes";

// Standard reminders shown on all instruction screens
export const standardReminders = [
  "✔ حاول الإجابة بسرعة ودون تردد.",
  "✔ إذا أخطأت سيظهر رمز X أحمر. ويجب تصحيح الإجابة للمتابعة.",
  "✔ ستتغير أماكن التصنيفات خلال الاختبار، لذا انتبه جيدًا لكل مرحلة."
];

// Text descriptions for positive and negative attributes
export const positiveAttributes = [
  "إيجابي",
  "ممتاز",
  "نجاح",
  "متميز"
];

export const negativeAttributes = [
  "حزين",
  "سلبي",
  "ضعيف",
  "فاشل"
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
        description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها بأسرع ما يمكن.",
        leftKey: "إيجابي",
        rightKey: "سلبي",
        reminder: standardReminders,
        showPositiveAttributes: true,
        showNegativeAttributes: true
      };
    case 3:
      return {
        title: `٣ من اصل ٧`,
        description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي أو إيجابي",
        rightKey: "اضطراب تواصل أو سلبي",
        reminder: standardReminders,
        showPositiveAttributes: true,
        showNegativeAttributes: true
      };
    case 4:
      return {
        title: `٤ من اصل ٧`,
        description: "هذا مماثل للجزء السابق\nستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي أو إيجابي",
        rightKey: "اضطراب تواصل أو سلبي",
        reminder: standardReminders,
        showPositiveAttributes: true,
        showNegativeAttributes: true
      };
    case 5:
      return {
        title: `٥ من اصل ٧`,
        description: "انتبه، لقد تغيرت أماكن التسميات!",
        leftKey: "سلبي",
        rightKey: "إيجابي",
        reminder: standardReminders,
        showPositiveAttributes: true,
        showNegativeAttributes: true
      };
    case 6:
      return {
        title: `٦ من اصل ٧`,
        description: "ستظهر لك على الشاشة مجموعة من الكلمات، ومهمتك هي تصنيفها وفقًا للفئات التالية بأسرع ما يمكن.",
        leftKey: "تواصل طبيعي أو سلبي",
        rightKey: "اضطراب تواصل أو إيجابي",
        reminder: standardReminders,
        showPositiveAttributes: true,
        showNegativeAttributes: true
      };
    case 7:
      return {
        title: `٧ من اصل ٧`,
        description: "هذا مماثل للجزء السابق",
        leftKey: "تواصل طبيعي أو سلبي",
        rightKey: "اضطراب تواصل أو إيجابي",
        reminder: standardReminders,
        showPositiveAttributes: true,
        showNegativeAttributes: true
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
