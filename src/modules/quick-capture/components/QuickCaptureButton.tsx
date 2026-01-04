/**
 * Quick Capture Floating Button
 * Draggable button that opens the capture panel
 */

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraggableFloatingButton } from "@/components/neuro/DraggableFloatingButton";
import { cn } from "@/lib/utils";

interface QuickCaptureButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unprocessedCount?: number;
  buttonImage?: string;
  storageKey?: string;
}

export function QuickCaptureButton({
  isOpen,
  onToggle,
  unprocessedCount = 0,
  buttonImage,
  storageKey = "quick-capture-position",
}: QuickCaptureButtonProps) {
  return (
    <DraggableFloatingButton storageKey={storageKey}>
      <div className="relative">
        <Button
          size="lg"
          className={cn(
            "h-20 w-20 rounded-full shadow-xl transition-all overflow-hidden p-0",
            "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500",
            "border-4 border-amber-300/50",
            isOpen && "ring-4 ring-amber-300"
          )}
          onClick={onToggle}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center justify-center w-full h-full bg-amber-600"
              >
                <X className="h-8 w-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="w-full h-full relative"
              >
                {buttonImage ? (
                  <img
                    src={buttonImage}
                    alt="Quick Capture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-1.5 border-2 border-card shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Pulse indicator for unprocessed notes */}
        {unprocessedCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 text-white text-xs items-center justify-center font-medium">
              {unprocessedCount}
            </span>
          </span>
        )}
      </div>
    </DraggableFloatingButton>
  );
}
