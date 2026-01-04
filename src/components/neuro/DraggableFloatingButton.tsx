/**
 * Draggable Floating Button
 * Modular component using the oz-engine hooks
 */

import { useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { useDraggablePosition } from "@/modules/oz-engine";

interface DraggableFloatingButtonProps {
  children: ReactNode;
  storageKey: string;
  className?: string;
}

export function DraggableFloatingButton({ 
  children, 
  storageKey,
  className = "fixed bottom-24 right-6",
}: DraggableFloatingButtonProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { offset, onDragStart, onDragEnd } = useDraggablePosition(storageKey);

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
        onDragStart={onDragStart}
        onDragEnd={(_, info) => onDragEnd(info.offset.x, info.offset.y)}
        style={{ x: offset.x, y: offset.y }}
        className={`${className} z-50 cursor-grab active:cursor-grabbing`}
        whileDrag={{ scale: 1.05 }}
      >
        {children}
      </motion.div>
    </>
  );
}
