
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { DemographicsProps } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const Demographics: React.FC<DemographicsProps> = ({ onComplete }) => {
  const [age, setAge] = useState('31-40');
  const [yearsExperience, setYearsExperience] = useState('لا يوجد خبرة/طالب');
  const [degree, setDegree] = useState('طالب');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      age,
      yearsExperience,
      degree,
      gender
    });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold text-right mb-6">البيانات الديموغرافية</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="gender" className="block text-right font-medium">الجنس</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as 'male' | 'female')}
                className="flex flex-row-reverse justify-end space-x-6 space-x-reverse"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">ذكر</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">أنثى</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="block text-right font-medium">العمر</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الفئة العمرية" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  <SelectItem value="20-30">20-30</SelectItem>
                  <SelectItem value="31-40">31-40</SelectItem>
                  <SelectItem value="41-50">41-50</SelectItem>
                  <SelectItem value="51+">51+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience" className="block text-right font-medium">سنوات الخبرة</Label>
              <Select value={yearsExperience} onValueChange={setYearsExperience}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر سنوات الخبرة" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  <SelectItem value="لا يوجد خبرة/طالب">لا يوجد خبرة/طالب</SelectItem>
                  <SelectItem value="1-2">1-2</SelectItem>
                  <SelectItem value="2-4">2-4</SelectItem>
                  <SelectItem value="5-10">5-10</SelectItem>
                  <SelectItem value="10+">10+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree" className="block text-right font-medium">الدرجة العلمية</Label>
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الدرجة العلمية" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  <SelectItem value="طالب">طالب</SelectItem>
                  <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                  <SelectItem value="ماجستير">ماجستير</SelectItem>
                  <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-white">متابعة إلى اختبار IAT</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Demographics;
