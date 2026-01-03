import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

interface DraggableFloatingButtonProps {
  children: ReactNode;
  defaultPosition: Position;
  storageKey: string;
}

export function DraggableFloatingButton({ 
  children, 
  defaultPosition, 
  storageKey 
}: DraggableFloatingButtonProps) {
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultPosition;
      }
    }
    return defaultPosition;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Save position to localStorage
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem(storageKey, JSON.stringify(position));
    }
  }, [position, isDragging, storageKey]);

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
          setPosition(prev => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        style={{ 
          position: "fixed",
          top: defaultPosition.y,
          left: defaultPosition.x,
          x: position.x,
          y: position.y,
        }}
        className="z-50 cursor-grab active:cursor-grabbing"
        whileDrag={{ scale: 1.05 }}
      >
        {children}
      </motion.div>
    </>
  );
}
