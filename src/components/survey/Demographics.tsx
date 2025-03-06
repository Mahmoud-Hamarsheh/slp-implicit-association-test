
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="block text-right">الجنس</Label>
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
              <Label htmlFor="age" className="block text-right">العمر</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة العمرية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-30">18-30</SelectItem>
                  <SelectItem value="31-40">31-40</SelectItem>
                  <SelectItem value="41-50">41-50</SelectItem>
                  <SelectItem value="51-60">51-60</SelectItem>
                  <SelectItem value="61+">61+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience" className="block text-right">سنوات الخبرة</Label>
              <Select value={yearsExperience} onValueChange={setYearsExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر سنوات الخبرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="لا يوجد خبرة/طالب">لا يوجد خبرة/طالب</SelectItem>
                  <SelectItem value="1-3 سنوات">1-3 سنوات</SelectItem>
                  <SelectItem value="4-6 سنوات">4-6 سنوات</SelectItem>
                  <SelectItem value="7-10 سنوات">7-10 سنوات</SelectItem>
                  <SelectItem value="أكثر من 10 سنوات">أكثر من 10 سنوات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree" className="block text-right">الدرجة العلمية</Label>
              <Select value={degree} onValueChange={setDegree}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدرجة العلمية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="طالب">طالب</SelectItem>
                  <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                  <SelectItem value="ماجستير">ماجستير</SelectItem>
                  <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">متابعة إلى اختبار IAT</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Demographics;
