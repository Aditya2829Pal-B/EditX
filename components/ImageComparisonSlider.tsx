import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface ImageComparisonSliderProps {
  originalSrc: string;
  enhancedSrc: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  originalSrc,
  enhancedSrc,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Update window listeners during drag for smooth tracking outside container bounds
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Set initial position immediately on click/tap
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    handleMove(clientX);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        ref={containerRef}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className="relative w-full aspect-square md:aspect-[4/3] max-h-[500px] rounded-2xl overflow-hidden bg-gray-950 border border-gray-700/60 shadow-2xl cursor-ew-resize select-none"
        id="image-comparison-container"
      >
        {/* Original image on the bottom - left side */}
        <img 
          src={originalSrc} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          referrerPolicy="no-referrer"
          id="slider-original-image"
        />
        
        {/* Label Left (Original) */}
        <div className="absolute left-4 top-4 z-10 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase text-gray-300 border border-gray-700/50 shadow-md">
          Before (Original)
        </div>

        {/* Enhanced image on top, clipped */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
          id="slider-enhanced-overlay"
        >
          <img 
            src={enhancedSrc} 
            alt="Enhanced" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            id="slider-enhanced-image"
          />
        </div>

        {/* Label Right (Enhanced) */}
        <div className="absolute right-4 top-4 z-10 bg-gradient-to-r from-brand-blue to-brand-purple px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase text-white shadow-md">
          After (Enhanced)
        </div>

        {/* Divider line and handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
          style={{ left: `${sliderPosition}%` }}
          id="slider-divider-line"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-gray-900 shadow-xl flex items-center justify-center border-4 border-gray-900 hover:scale-105 active:scale-95 transition-all duration-150">
            <MoveHorizontal className="w-5 h-5 text-gray-800" />
          </div>
        </div>

        {/* Drag control hint overlay on bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-950/70 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 pointer-events-none border border-gray-800/60 shadow-lg">
          Drag slider or tap anywhere to slide reveal
        </div>
      </div>
    </div>
  );
};
