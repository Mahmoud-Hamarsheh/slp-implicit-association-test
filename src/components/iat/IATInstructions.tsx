
import React from "react";

interface InstructionsProps {
  block: number;
}

export const IATInstructions: React.FC<InstructionsProps> = ({ block }) => {
  const getBlockInstructions = (block: number) => {
    switch (block) {
      case 1:
        return {
          left: "أفيزيا",
          right: "اجتماعي",
          title: "مقطع تدريبية: الأقسام"
        };
      case 2:
        return {
          left: "سلبي",
          right: "متعاون",
          title: "مقطع تدريبية: الخصائص"
        };
      case 3:
        return {
          left: "أفيزيا أو سلبي",
          right: "اجتماعي أو متعاون",
          title: "مقطع تدريبية: مزدوج"
        };
      case 4:
        return {
          left: "أفيزيا",
          right: "اجتماعي",
          title: "مقطع اختبار: الأقسام"
        };
      case 5:
        return {
          left: "سلبي",
          right: "متعاون",
          title: "مقطع اختبار: الخصائص"
        };
      case 6:
        return {
          left: "أفيزيا أو سلبي",
          right: "اجتماعي أو متعاون",
          title: "مقطع اختبار: مزدوج"
        };
      case 7:
        return {
          left: "اجتماعي أو سلبي",
          right: "أفيزيا أو متعاون",
          title: "مقطع اختبار: عكس"
        };
      default:
        return {
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
      <p className="text-sm text-gray-600">المقطع {block} من 7</p>
      <div className="flex justify-between px-8 text-sm text-gray-600">
        <div>اضغط 'D' لـ {instructions.left}</div>
        <div>اضغط 'K' لـ {instructions.right}</div>
      </div>
    </div>
  );
};
