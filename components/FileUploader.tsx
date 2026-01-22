
import React, { useCallback, useState } from 'react';
import { ICONS } from '../constants';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesAdded, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    // Explicitly type 'f' as File to avoid 'unknown' type errors from Array.from on FileList
    const files = Array.from(e.dataTransfer.files).filter((f: File) => 
      f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded, isProcessing]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !isProcessing) {
      // Explicitly type 'f' as File to avoid 'unknown' type errors from Array.from on FileList
      const files = Array.from(e.target.files).filter((f: File) => 
        f.type.startsWith('image/') || f.type === 'application/pdf'
      );
      if (files.length > 0) {
        onFilesAdded(files);
      }
    }
  }, [onFilesAdded, isProcessing]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative group h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
        isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="file"
        multiple
        accept="image/*,.pdf"
        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleFileInput}
        disabled={isProcessing}
      />
      <div className="text-gray-400 group-hover:text-indigo-400 transition-colors mb-2">
        <ICONS.Plus />
      </div>
      <p className="text-sm text-gray-500 font-medium">Click or Drag Files</p>
      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG supported</p>
    </div>
  );
};

export default FileUploader;
