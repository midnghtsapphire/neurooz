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
}

export function useDraggablePosition(
  storageKey: string,
  defaultOffset: Position = { x: 0, y: 0 }
): UseDraggablePositionReturn {
  const [offset, setOffset] = useState<Position>(defaultOffset);
  const [isDragging, setIsDragging] = useState(false);

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
    setOffset((prev) => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY,
    }));
  }, []);

  return {
    offset,
    isDragging,
    onDragStart,
    onDragEnd,
  };
}
