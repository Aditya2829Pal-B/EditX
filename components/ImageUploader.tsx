
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  }, [onFileChange]);
  
  const handleClick = () => {
      fileInputRef.current?.click();
  };

  return (
    <div 
      className={`relative border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-blue transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center text-gray-400">
        <UploadIcon className="w-12 h-12 mb-4 text-gray-500" />
        {fileName ? (
          <>
            <p className="font-semibold text-gray-300">Selected File:</p>
            <p className="text-brand-blue">{fileName}</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-300">Click to upload a photo</p>
            <p className="text-sm">PNG, JPG, or WEBP</p>
          </>
        )}
      </div>
    </div>
  );
};
