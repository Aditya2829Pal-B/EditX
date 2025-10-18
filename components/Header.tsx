
import React from 'react';
import { PhotoIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
         <PhotoIcon className="w-8 h-8 mr-3 text-brand-blue" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Gemini Photo Enhancer
        </h1>
      </div>
    </header>
  );
};
