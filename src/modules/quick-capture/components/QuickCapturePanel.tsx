/**
 * Quick Capture Panel
 * The main input panel for capturing notes
 */

import { motion } from "framer-motion";
import { Send, Mic, MicOff, Sparkles, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteItem } from "./NoteItem";
import { cn } from "@/lib/utils";
import type { QuickNote } from "../types";

interface QuickCapturePanelProps {
  content: string;
  onContentChange: (content: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isSubmitting?: boolean;
  notes?: QuickNote[];
  onDeleteNote?: (id: string) => void;
  showHistory: boolean;
  onToggleHistory: () => void;
  onOrganize?: () => void;
  isOrganizing?: boolean;
  headerImage?: string;
  title?: string;
  placeholder?: string;
}

export function QuickCapturePanel({
  content,
  onContentChange,
  onSubmit,
  onKeyDown,
  isRecording,
  onStartRecording,
  onStopRecording,
  isSubmitting = false,
  notes = [],
  onDeleteNote,
  showHistory,
  onToggleHistory,
  onOrganize,
  isOrganizing = false,
  headerImage,
  title = "Quick Notes",
  placeholder = "Quick thought... (⌘+Enter to save)",
}: QuickCapturePanelProps) {
  const unprocessedCount = notes.filter((n) => !n.is_processed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-32 right-6 z-50 w-80 sm:w-96"
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {headerImage && (
                <img
                  src={headerImage}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <span className="font-semibold text-sm">{title}</span>
            </div>
            <div className="flex items-center gap-1">
              {unprocessedCount > 0 && onOrganize && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1"
                  onClick={onOrganize}
                  disabled={isOrganizing}
                >
                  <Brain className="h-3 w-3" />
                  {isOrganizing ? "..." : "Organize"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-7 px-2 text-xs", showHistory && "bg-muted")}
                onClick={onToggleHistory}
              >
                <Clock className="h-3 w-3 mr-1" />
                History
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {showHistory ? (
          <ScrollArea className="h-64">
            {notes.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notes yet</p>
                <p className="text-xs">Quick thoughts go here!</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onDelete={() => onDeleteNote?.(note.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="p-4">
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="min-h-[100px] resize-none bg-muted/50 border-muted"
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={isRecording ? onStopRecording : onStartRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-3 w-3 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 mr-1" />
                      Voice
                    </>
                  )}
                </Button>
                {isRecording && (
                  <span className="flex items-center gap-1 text-xs text-destructive">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    Recording...
                  </span>
                )}
              </div>

              <Button
                size="sm"
                className="h-8"
                onClick={onSubmit}
                disabled={!content.trim() || isSubmitting}
              >
                <Send className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              💡 Jot it down before it vanishes!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
