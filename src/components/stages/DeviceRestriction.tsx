import React from "react";
import { Card } from "@/components/ui/card";
import { Smartphone, Laptop, Monitor } from "lucide-react";

export const DeviceRestriction: React.FC = () => {
  return (
    <Card className="p-8 text-center space-y-6 animate-slideIn max-w-2xl mx-auto">
      <div className="flex justify-center">
        <Smartphone size={64} className="text-red-500" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-red-600">الاختبار غير متاح على الأجهزة المحمولة.</h2>
        
        <div className="space-y-3">
          <p className="text-lg text-gray-700">
            عذراً، هذا الاختبار متاح فقط على أجهزة الكمبيوتر المكتبية أو اللابتوب
          </p>
          
          <div className="flex justify-center items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Smartphone className="text-red-400" size={20} />
              <span className="text-sm">الهواتف المحمولة</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              <Monitor className="text-red-400" size={20} />
              <span className="text-sm">.الأجهزة اللوحية</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              <Laptop className="text-green-500" size={20} />
              <span className="text-sm font-medium text-green-600">اللابتوب/الكمبيوتر</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">لماذا يتطلب الاختبار جهاز كمبيوتر؟</h3>
          <ul className="text-sm text-blue-700 text-right space-y-1">
            <li>• الاختبار يتطلب استخدام لوحة المفاتيح للاستجابة السريعة</li>
            <li>• دقة القياس تعتمد على سرعة الاستجابة باستخدام المفاتيح</li>
            <li>• الشاشات الكبيرة توفر تجربة أفضل للاختبار</li>
          </ul>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          يرجى استخدام جهاز كمبيوتر أو لابتوب لإكمال هذا الاختبار
        </div>
      </div>
    </Card>
  );
};
