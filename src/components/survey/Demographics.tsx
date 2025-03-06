
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { DemographicsProps } from './types';

export const Demographics: React.FC<DemographicsProps> = ({ onComplete }) => {
  const [age, setAge] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [degree, setDegree] = useState('');
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
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="100"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="yearsExperience">سنوات الخبرة</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                min="0"
                max="50"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="degree">المؤهل العلمي</Label>
              <Input
                id="degree"
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label>الجنس</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as 'male' | 'female')}
                className="flex flex-col space-y-2 mt-1"
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
          </div>

          <Button type="submit" className="w-full">متابعة</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Demographics;
