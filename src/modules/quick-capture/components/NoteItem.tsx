/**
 * Note Item Component
 * Displays a single quick note with delete action
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { QuickNote } from "../types";

interface NoteItemProps {
  note: QuickNote;
  onDelete: () => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border/50 group">
      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {note.is_processed && (
            <Badge variant="outline" className="text-xs h-5">
              Processed
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
