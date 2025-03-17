
import React from "react";

interface RemindersSectionProps {
  reminders: string[];
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({ reminders }) => {
  return (
    <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
      <h3 className="font-bold mb-2">تذكر:</h3>
      <div className="text-right space-y-1 md:space-y-2">
        {reminders.map((item, index) => (
          <p key={index} className="text-blue-700">{item}</p>
        ))}
      </div>
    </div>
  );
};
