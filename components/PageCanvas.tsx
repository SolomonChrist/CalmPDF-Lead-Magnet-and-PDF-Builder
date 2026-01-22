
import React, { useState } from 'react';
import { PageItem } from '../types';
import PageCard from './PageCard';

interface PageCanvasProps {
  pages: PageItem[];
  onReorder: (newPages: PageItem[]) => void;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ pages, onReorder, onRemove, onRotate }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Simple native DnD implementation for reordering in the grid
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    const dragIndex = pages.findIndex(p => p.id === draggedId);
    const targetIndex = pages.findIndex(p => p.id === targetId);
    
    const newPages = [...pages];
    const [movedItem] = newPages.splice(dragIndex, 1);
    newPages.splice(targetIndex, 0, movedItem);
    
    onReorder(newPages);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 no-scrollbar overflow-y-auto pb-12">
      {pages.map((page, index) => (
        <PageCard 
          key={page.id}
          page={page}
          index={index}
          onRemove={() => onRemove(page.id)}
          onRotate={() => onRotate(page.id)}
          onDragStart={(e) => handleDragStart(e, page.id)}
          onDragOver={(e) => handleDragOver(e, page.id)}
          onDragEnd={handleDragEnd}
          isDragging={draggedId === page.id}
        />
      ))}
    </div>
  );
};

export default PageCanvas;
