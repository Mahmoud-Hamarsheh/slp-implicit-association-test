import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
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
    const formattedData = {
      age: formatAge(data.age),
      yearsExperience: formatExperience(data.yearsExperience),
      degree: formatDegree(data.degree),
      gender: data.gender === "male" ? 1 : 2
    };
    onComplete(formattedData as unknown as SurveyData);
  };

  const formatAge = (age: number): number => {
    switch(age) {
      case 20: return 1; // 20-30
      case 31: return 2; // 31-40
      case 41: return 3; // 41-50
      case 51: return 4; // 51+
      default: return 1;
    }
  };

  const formatExperience = (experience: number): number => {
    switch(experience) {
      case 0: return 1; // No experience
      case 1: return 2; // 1-2 years
      case 2: return 3; // 2-4 years
      case 5: return 4; // 5-10 years
      case 10: return 5; // 10+ years
      default: return 1;
    }
  };

  const formatDegree = (degree: string): string => {
    switch(degree) {
      case "student": return "1";
      case "bachelors": return "2";
      case "masters": return "3";
      case "doctorate": return "4";
      default: return "1";
    }
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
              <SelectItem value="31">31-40</SelectItem>
              <SelectItem value="41">41-50</SelectItem>
              <SelectItem value="51">51+</SelectItem>
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
