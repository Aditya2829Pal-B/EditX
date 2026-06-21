import React, { useState } from 'react';
import { ImageComparisonSlider } from './ImageComparisonSlider';
import { ImageDisplay } from './ImageDisplay';
import { Sliders, Columns, Download, Sparkles } from 'lucide-react';

interface ComparisonViewProps {
  originalSrc: string | null;
  enhancedSrc: string | null;
}

type ViewMode = 'slider' | 'side-by-side';

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalSrc,
  enhancedSrc,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('slider');

  if (!originalSrc && !enhancedSrc) return null;

  const handleDownload = () => {
    if (!enhancedSrc) return;
    const link = document.createElement('a');
    link.href = enhancedSrc;
    // Extract format or fallback to png
    const match = enhancedSrc.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const extension = match ? match[1].split('/')[1] : 'png';
    link.download = `enhanced-photo-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mt-8 flex flex-col items-center space-y-6 animate-fade-in" id="comparison-view-layout">
      {/* View Switcher and Actions Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700/50 shadow-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-blue" />
          <h3 className="text-lg font-semibold text-white">Compare Results</h3>
        </div>

        {/* Segmented Control Switcher */}
        {enhancedSrc && (
          <div className="flex items-center bg-gray-900 border border-gray-700/60 rounded-xl p-1" id="comparison-mode-selector">
            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'slider'
                  ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              id="btn-mode-slider"
            >
              <Sliders className="w-4 h-4" />
              <span>Slider Reveal</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'side-by-side'
                  ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              id="btn-mode-side"
            >
              <Columns className="w-4 h-4" />
              <span>Side-by-Side</span>
            </button>
          </div>
        )}

        {/* Action Button: Download */}
        {enhancedSrc && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 w-full sm:w-auto justify-center px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 text-white font-medium rounded-xl text-sm transition-all duration-200 active:scale-98 shadow-md"
            id="btn-download-enhanced"
          >
            <Download className="w-4 h-4 text-white animate-bounce" />
            <span>Download Enhanced Image</span>
          </button>
        )}
      </div>

      {/* Main Display Body */}
      <div className="w-full">
        {/* If only original is uploaded, side-by-side is the default panel layout */}
        {!enhancedSrc ? (
          <div className="w-full max-w-2xl mx-auto">
            {originalSrc && <ImageDisplay title="Original Loaded Photo" src={originalSrc} />}
          </div>
        ) : viewMode === 'slider' ? (
          <div className="max-w-4xl mx-auto w-full">
            <ImageComparisonSlider originalSrc={originalSrc || ''} enhancedSrc={enhancedSrc} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {originalSrc && (
              <div className="relative group">
                <ImageDisplay title="Original" src={originalSrc} />
                <span className="absolute bottom-6 right-6 bg-gray-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs text-gray-400 border border-gray-700/50">
                  Before
                </span>
              </div>
            )}
            {enhancedSrc && (
              <div className="relative group">
                <ImageDisplay title="Enhanced" src={enhancedSrc} isEnhanced={true} />
                <span className="absolute bottom-6 right-6 bg-brand-purple/80 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white border border-brand-purple/30">
                  After
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
