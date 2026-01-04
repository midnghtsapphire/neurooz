/**
 * Oz Engine™ - Draggable Position Hook
 * Standalone module - can be reused across applications
 */

import { useState, useEffect, useCallback } from "react";
import type { Position } from "../types";

export interface UseDraggablePositionReturn {
  offset: Position;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: (offsetX: number, offsetY: number) => void;
  resetPosition: () => void;
}

/**
 * Clamp offset to keep element visible on screen
 */
function clampToViewport(offset: Position): Position {
  if (typeof window === "undefined") return offset;
  
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;
  
  return {
    x: Math.max(-maxX, Math.min(maxX, offset.x)),
    y: Math.max(-maxY, Math.min(maxY, offset.y)),
  };
}

export function useDraggablePosition(
  storageKey: string,
  defaultOffset: Position = { x: 0, y: 0 }
): UseDraggablePositionReturn {
  const [offset, setOffset] = useState<Position>(defaultOffset);
  const [isDragging, setIsDragging] = useState(false);

  // Load saved offset from localStorage (clamped to viewport)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOffset(clampToViewport(parsed));
      } catch {
        // Keep default offset
      }
    }
  }, [storageKey]);

  // Save offset to localStorage when not dragging
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem(storageKey, JSON.stringify(offset));
    }
  }, [offset, isDragging, storageKey]);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback((offsetX: number, offsetY: number) => {
    setIsDragging(false);
    setOffset((prev) => clampToViewport({
      x: prev.x + offsetX,
      y: prev.y + offsetY,
    }));
  }, []);

  const resetPosition = useCallback(() => {
    setOffset(defaultOffset);
    localStorage.removeItem(storageKey);
  }, [defaultOffset, storageKey]);

  return {
    offset,
    isDragging,
    onDragStart,
    onDragEnd,
    resetPosition,
  };
}
