
import React from "react";

interface InstructionImagesProps {
  images: string[];
  alt: string;
}

export const InstructionImages: React.FC<InstructionImagesProps> = ({ images, alt }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      {images.map((src, index) => (
        <div key={`${alt}-${index}`} className="bg-gray-50 p-2 rounded-md">
          <img src={src} alt={alt} className="w-12 h-12 object-contain mx-auto" />
        </div>
      ))}
    </div>
  );
};
