
import React from "react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "./CategoryCard";

interface IATInstructionsProps {
  block: number;
  onStart: () => void;
  testModel: "A" | "B";
}

export const IATInstructions: React.FC<IATInstructionsProps> = ({ block, onStart, testModel }) => {
  const getInstructionText = () => {
    // Map block number to effective block based on test model
    const effectiveBlock = testModel === "A" ? block : getEffectiveBlockForModelB(block);
    
    switch (effectiveBlock) {
      case 1:
        return "في هذه المرحلة، ستقوم بتصنيف الكلمات المعروضة إلى فئتين: تواصل طبيعي أو اضطراب تواصل. اضغط على مفتاح (D) للكلمات المتعلقة باضطراب التواصل، واضغط على مفتاح (K) للكلمات المتعلقة بالتواصل الطبيعي.";
      case 2:
        return "في هذه المرحلة، ستقوم بتصنيف الصور المعروضة إلى فئتين: إيجابي أو سلبي. اضغط على مفتاح (D) للصور السلبية، واضغط على مفتاح (K) للصور الإيجابية.";
      case 3:
      case 4:
        return "في هذه المرحلة، ستقوم بتصنيف الكلمات والصور. اضغط على مفتاح (D) للكلمات المتعلقة باضطراب التواصل أو الصور السلبية، واضغط على مفتاح (K) للكلمات المتعلقة بالتواصل الطبيعي أو الصور الإيجابية.";
      case 5:
        return "انتبه! تم عكس المفاتيح للصور. في هذه المرحلة، اضغط على مفتاح (D) للصور الإيجابية، واضغط على مفتاح (K) للصور السلبية.";
      case 6:
      case 7:
        return "انتبه! في هذه المرحلة، اضغط على مفتاح (D) للكلمات المتعلقة باضطراب التواصل أو الصور الإيجابية، واضغط على مفتاح (K) للكلمات المتعلقة بالتواصل الطبيعي أو الصور السلبية.";
      default:
        return "اضغط ابدأ للمتابعة.";
    }
  };

  // Maps original block to effective block for test model B
  const getEffectiveBlockForModelB = (originalBlock: number): number => {
    switch (originalBlock) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 6;
      case 4: return 7;
      case 5: return 5;
      case 6: return 3;
      case 7: return 4;
      default: return originalBlock;
    }
  };

  const getInstructionCategories = () => {
    // Map block number to effective block based on test model
    const effectiveBlock = testModel === "A" ? block : getEffectiveBlockForModelB(block);
    
    switch (effectiveBlock) {
      case 1:
        return {
          left: { label: "تواصل طبيعي", showPositive: false, showNegative: false },
          right: { label: "اضطراب تواصل", showPositive: false, showNegative: false },
        };
      case 2:
        return {
          left: { label: "إيجابي", showPositive: true, showNegative: false },
          right: { label: "سلبي", showPositive: false, showNegative: true },
        };
      case 3:
      case 4:
        return {
          left: { label: "تواصل طبيعي\nأو\nإيجابي", showPositive: true, showNegative: false },
          right: { label: "اضطراب تواصل\nأو\nسلبي", showPositive: false, showNegative: true },
        };
      case 5:
        return {
          left: { label: "سلبي", showPositive: false, showNegative: true },
          right: { label: "إيجابي", showPositive: true, showNegative: false },
        };
      case 6:
      case 7:
        return {
          left: { label: "تواصل طبيعي\nأو\nسلبي", showPositive: false, showNegative: true },
          right: { label: "اضطراب تواصل\nأو\nإيجابي", showPositive: true, showNegative: false },
        };
      default:
        return {
          left: { label: "", showPositive: false, showNegative: false },
          right: { label: "", showPositive: false, showNegative: false },
        };
    }
  };

  const categories = getInstructionCategories();

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-4 md:p-8 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">تعليمات المرحلة {block}</h2>
      
      <p className="text-lg md:text-xl mb-8 text-center">{getInstructionText()}</p>
      
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
        <CategoryCard 
          keyLetter="K" 
          categoryLabel={categories.left.label} 
          keyLabel="اضغط K" 
          showPositiveImages={categories.left.showPositive}
          showNegativeImages={categories.left.showNegative}
        />
        <CategoryCard 
          keyLetter="D" 
          categoryLabel={categories.right.label} 
          keyLabel="اضغط D" 
          showPositiveImages={categories.right.showPositive}
          showNegativeImages={categories.right.showNegative}
        />
      </div>
      
      <div className="text-center">
        <Button 
          className="px-8 py-2 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg" 
          onClick={onStart}
        >
          ابدأ
        </Button>
      </div>
    </div>
  );
};
