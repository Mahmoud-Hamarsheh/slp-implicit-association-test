
import React from "react";
import type { Trial } from "./IATTypes";
import { useIsMobile, useIsTouchDevice } from "@/hooks/use-mobile";

interface IATTrialProps {
  trial: Trial;
  showFeedback: boolean;
  isCorrect: boolean;
  onTouchLeft?: () => void;
  onTouchRight?: () => void;
}

export const IATTrial: React.FC<IATTrialProps> = ({ 
  trial, 
  showFeedback, 
  isCorrect,
  onTouchLeft,
  onTouchRight
}) => {
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  const shouldShowTouchControls = isMobile || isTouch;

  const getTrialCategories = (trial: Trial) => {
    // Use the effective block (which accounts for test model) to determine categories
    const effectiveBlock = trial.effectiveBlock || trial.block;

    switch (effectiveBlock) {
      case 1:
        return {
          left: "تواصل طبيعي",
          right: "اضطراب تواصل"
        };
      case 2:
        return {
          left: "إيجابي",
          right: "سلبي"
        };
      case 3:
      case 4:
        return {
          left: "تواصل طبيعي\nأو\nإيجابي",
          right: "اضطراب تواصل\nأو\nسلبي"
        };
      case 5:
        return {
          left: "سلبي",
          right: "إيجابي"
        };
      case 6:
      case 7:
        return {
          left: "تواصل طبيعي\nأو\nسلبي",
          right: "اضطراب تواصل\nأو\nإيجابي"
        };
      default:
        return {
          left: "",
          right: ""
        };
    }
  };

  const categories = getTrialCategories(trial);

  return (
    <div className="max-w-3xl mx-auto border-2 border-blue-200 rounded-lg p-4 md:p-8 bg-white">
      {/* عرض الإكس عند الخطأ في أعلى الصفحة */}
      {showFeedback && !isCorrect && (
        <div className="flex justify-center mb-4">
          <div className="text-red-500 text-4xl md:text-6xl font-bold">X</div>
        </div>
      )}
      
      {shouldShowTouchControls ? (
        // واجهة اللمس للهاتف/الجهاز اللوحي - المربعات الخضراء في الأعلى
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
          <div 
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={onTouchLeft}
          >
            <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
              {categories.left}
            </div>
            <div className="w-20 h-20 md:w-32 md:h-32 bg-green-400 rounded-lg mb-2"></div>
            <div className="text-sm md:text-lg">المس هنا</div>
          </div>
          <div 
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={onTouchRight}
          >
            <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
              {categories.right}
            </div>
            <div className="w-20 h-20 md:w-32 md:h-32 bg-green-400 rounded-lg mb-2"></div>
            <div className="text-sm md:text-lg">المس هنا</div>
          </div>
        </div>
      ) : (
        // واجهة لوحة المفاتيح للكمبيوتر الشخصي
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="text-center flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">K</div>
            {categories.left && (
              <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
                {categories.left}
              </div>
            )}
            <div className="text-sm md:text-lg">اضغط "K"</div>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">D</div>
            {categories.right && (
              <div className="whitespace-pre-line text-base md:text-xl text-green-600 mb-1 md:mb-2">
                {categories.right}
              </div>
            )}
            <div className="text-sm md:text-lg">اضغط "D"</div>
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي في الأسفل - تكبير حجم النص والصور */}
      <div className="flex justify-center items-center min-h-[180px] md:min-h-[250px]">
        {trial.isImage ? (
          <div className="flex justify-center">
            <img src={trial.stimulus} alt="Attribute" className="h-24 w-24 md:h-36 md:w-36" />
          </div>
        ) : (
          <div className="text-3xl md:text-5xl font-bold">{trial.stimulus}</div>
        )}
      </div>
    </div>
  );
};
