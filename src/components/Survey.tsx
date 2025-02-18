
import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SurveyProps {
  onComplete: (data: SurveyData) => void;
}

export interface SurveyData {
  age: number;
  yearsExperience: number;
  degree: string;
}

export const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [data, setData] = React.useState<SurveyData>({
    age: 0,
    yearsExperience: 0,
    degree: "",
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
          <Label htmlFor="age">العمر</Label>
          <Input
            id="age"
            type="number"
            required
            min={18}
            max={100}
            value={data.age || ""}
            onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">سنوات الخبرة</Label>
          <Input
            id="experience"
            type="number"
            required
            min={0}
            max={50}
            value={data.yearsExperience || ""}
            onChange={(e) => setData({ ...data, yearsExperience: parseInt(e.target.value) })}
            className="w-full"
          />
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
              <SelectItem value="bachelors">بكالوريوس</SelectItem>
              <SelectItem value="masters">ماجستير</SelectItem>
              <SelectItem value="doctorate">دكتوراه</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
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
