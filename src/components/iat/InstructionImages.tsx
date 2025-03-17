
import React from "react";

interface InstructionAttributesProps {
  attributes: string[];
  alt: string;
}

export const InstructionAttributes: React.FC<InstructionAttributesProps> = ({ attributes, alt }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      {attributes.map((text, index) => (
        <div key={`${alt}-${index}`} className="bg-gray-50 p-2 rounded-md">
          <span className="text-sm font-medium">{text}</span>
        </div>
      ))}
    </div>
  );
};
