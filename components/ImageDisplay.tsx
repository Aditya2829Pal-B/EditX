
import React from 'react';

interface ImageDisplayProps {
  title: string;
  src: string;
  isEnhanced?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, src, isEnhanced = false }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col items-center">
      <h3 className={`text-xl font-semibold mb-4 ${isEnhanced ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple' : 'text-white'}`}>{title}</h3>
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-900">
        <img src={src} alt={title} className="w-full h-full object-contain" />
      </div>
    </div>
  );
};
