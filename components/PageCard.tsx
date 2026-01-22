
import React, { useState } from 'react';
import { PageItem, PageType } from '../types';
import { ICONS } from '../constants';

interface PageCardProps {
  page: PageItem;
  index: number;
  onRemove: () => void;
  onRotate: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const PageCard: React.FC<PageCardProps> = ({ 
  page, index, onRemove, onRotate, 
  onDragStart, onDragOver, onDragEnd, isDragging 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col items-center transition-all duration-300 cursor-move ${
        isDragging ? 'opacity-30 scale-95' : 'opacity-100 hover:scale-[1.02]'
      }`}
    >
      <div className="absolute -top-3 -left-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center paper-shadow text-[10px] font-bold text-gray-400">
        {index + 1}
      </div>

      <div className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden paper-shadow paper-shadow-hover transition-all">
        {/* Preview Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
        
        {/* Image Container with Rotation */}
        <div className="w-full h-full flex items-center justify-center p-2">
          <img 
            src={page.dataUrl} 
            alt={`Page ${index + 1}`}
            className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-300"
            style={{ transform: `rotate(${page.rotation}deg)` }}
          />
        </div>

        {/* Floating Actions */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
            onClick={(e) => { e.stopPropagation(); onRotate(); }}
            className="p-2 bg-white/90 hover:bg-white rounded-lg paper-shadow text-gray-600 transition-colors"
            title="Rotate 90°"
           >
             <ICONS.Rotate />
           </button>
           <button 
            onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
            className="p-2 bg-white/90 hover:bg-white rounded-lg paper-shadow text-gray-600 transition-colors"
            title="Preview"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           </button>
           <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-2 bg-red-50 hover:bg-red-100 rounded-lg paper-shadow text-red-400 transition-colors"
            title="Remove"
           >
             <ICONS.Trash />
           </button>
        </div>
      </div>

      <div className="mt-2 w-full px-1">
        <p className="text-[10px] text-gray-400 truncate w-full text-center">
          {page.sourceFileName}
        </p>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-full max-h-full bg-white rounded-2xl p-2 shadow-2xl">
             <img 
               src={page.dataUrl} 
               alt="Full preview"
               className="max-w-full max-h-[85vh] object-contain rounded-xl"
               style={{ transform: `rotate(${page.rotation}deg)` }}
             />
             <div className="absolute -top-12 right-0 flex gap-4 text-white">
               <button onClick={() => setIsZoomed(false)} className="hover:text-gray-200 transition-colors">
                 <ICONS.X />
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageCard;
