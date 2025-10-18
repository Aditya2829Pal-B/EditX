
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue"></div>
    </div>
  );
};
