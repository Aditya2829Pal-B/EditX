
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { ComparisonView } from './components/ComparisonView';
import { enhanceImageWithGemini } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = useCallback(async (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setEnhancedImage(null);
      try {
        const base64 = await fileToBase64(selectedFile);
        setOriginalImage(base64);
      } catch (err) {
        setError('Failed to read the selected file. Please try another image.');
        setOriginalImage(null);
        setFile(null);
      }
    }
  }, []);

  const handleEnhanceClick = useCallback(async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(file, true);
      const resultBase64 = await enhanceImageWithGemini(base64Data, mimeType);
      setEnhancedImage(`data:${mimeType};base64,${resultBase64}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Enhancement failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
              Upload Your Blurry Photo
            </h2>
            <p className="text-gray-400 mt-2">Let AI transform it into a sharp, high-quality image.</p>
          </div>
          
          <ImageUploader onFileChange={handleFileChange} disabled={isLoading} />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center animate-fade-in">
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleEnhanceClick}
              disabled={!file || isLoading}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Enhancing...' : 'Enhance Photo'}
            </button>
          </div>
        </div>

        {isLoading && <Spinner />}
        
        {!isLoading && (originalImage || enhancedImage) && (
          <ComparisonView originalSrc={originalImage} enhancedSrc={enhancedImage} />
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
