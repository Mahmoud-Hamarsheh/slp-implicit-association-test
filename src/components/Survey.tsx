
import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SurveyProps {
  onComplete: (data: SurveyData) => void;
}

export interface SurveyData {
  age: number;
  yearsExperience: number;
  degree: string;
  gender: "male" | "female";
}

export const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [data, setData] = React.useState<SurveyData>({
    age: 0,
    yearsExperience: 0,
    degree: "",
    gender: "male"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  return (
    <Card className="w-full max-w-lg p-6 mx-auto mt-8 animate-slideIn">
      <h2 className="text-2xl font-semibold text-center mb-6">البيانات الديموغرافية</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gender">الجنس</Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(value) => setData({ ...data, gender: value as "male" | "female" })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <Label htmlFor="male">ذكر</Label>
              <RadioGroupItem value="male" id="male" />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="female">أنثى</Label>
              <RadioGroupItem value="female" id="female" />
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">العمر</Label>
          <Select
            required
            value={data.age.toString()}
            onValueChange={(value) => setData({ ...data, age: parseInt(value) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الفئة العمرية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20-30</SelectItem>
              <SelectItem value="30">30-40</SelectItem>
              <SelectItem value="40">40-50</SelectItem>
              <SelectItem value="50">50+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">سنوات الخبرة</Label>
          <Select
            required
            value={data.yearsExperience.toString()}
            onValueChange={(value) => setData({ ...data, yearsExperience: parseInt(value) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر سنوات الخبرة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">لا يوجد خبرة /طالب</SelectItem>
              <SelectItem value="1">1-2</SelectItem>
              <SelectItem value="2">2-4</SelectItem>
              <SelectItem value="5">5-10</SelectItem>
              <SelectItem value="10">10+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">الدرجة العلمية</Label>
          <Select
            required
            value={data.degree}
            onValueChange={(value) => setData({ ...data, degree: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر درجتك العلمية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">طالب</SelectItem>
              <SelectItem value="bachelors">بكالوريوس</SelectItem>
              <SelectItem value="masters">ماجستير</SelectItem>
              <SelectItem value="doctorate">دكتوراه</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          متابعة إلى اختبار IAT
        </Button>
      </form>
    </Card>
  );
};
