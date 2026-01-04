import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

interface DraggableFloatingButtonProps {
  children: ReactNode;
  defaultPosition?: Position;
  storageKey: string;
}

export function DraggableFloatingButton({ 
  children, 
  storageKey 
}: DraggableFloatingButtonProps) {
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Load saved offset from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setOffset(JSON.parse(saved));
      } catch {
        // Keep default offset
      }
    }
  }, [storageKey]);

  // Save offset to localStorage
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem(storageKey, JSON.stringify(offset));
    }
  }, [offset, isDragging, storageKey]);

  return (
    <>
      {/* Invisible container for drag constraints */}
      <div 
        ref={constraintsRef} 
        className="fixed inset-0 pointer-events-none z-40"
        style={{ margin: "1rem" }}
      />
      
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          setOffset(prev => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        style={{ 
          x: offset.x,
          y: offset.y,
        }}
        className="fixed bottom-24 right-6 z-50 cursor-grab active:cursor-grabbing"
        whileDrag={{ scale: 1.05 }}
      >
        {children}
      </motion.div>
    </>
  );
}
