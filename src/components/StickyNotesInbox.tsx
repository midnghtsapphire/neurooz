import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickNotes, useUpdateQuickNote, useDeleteQuickNote, QuickNote } from "@/hooks/use-quick-notes";
import { useProjects, useCreateActionItem } from "@/hooks/use-projects";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  StickyNote, 
  Inbox, 
  Lightbulb, 
  Clock, 
  Bookmark,
  MoreVertical,
  Trash2,
  ArrowRight,
  FolderPlus,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";

type NoteCategory = "inbox" | "maybe" | "someday" | "idea" | "reference";

const CATEGORIES: { id: NoteCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" />, color: "bg-blue-500/20 border-blue-500/30" },
  { id: "maybe", label: "Maybe", icon: <Clock className="h-4 w-4" />, color: "bg-amber-500/20 border-amber-500/30" },
  { id: "someday", label: "Someday", icon: <Clock className="h-4 w-4" />, color: "bg-purple-500/20 border-purple-500/30" },
  { id: "idea", label: "Ideas", icon: <Lightbulb className="h-4 w-4" />, color: "bg-yellow-500/20 border-yellow-500/30" },
  { id: "reference", label: "Reference", icon: <Bookmark className="h-4 w-4" />, color: "bg-emerald-500/20 border-emerald-500/30" },
];

interface StickyNotesInboxProps {
  className?: string;
}

export function StickyNotesInbox({ className }: StickyNotesInboxProps) {
  const [activeCategory, setActiveCategory] = useState<NoteCategory>("inbox");
  const { data: notes = [] } = useQuickNotes();
  const { data: projects = [] } = useProjects();
  const updateNote = useUpdateQuickNote();
  const deleteNote = useDeleteQuickNote();
  const createActionItem = useCreateActionItem();

  const filteredNotes = notes.filter(note => 
    (note as any).category === activeCategory || 
    (!('category' in note) && activeCategory === "inbox")
  );

  const getCategoryCount = (categoryId: NoteCategory) => {
    return notes.filter(note => 
      (note as any).category === categoryId || 
      (!('category' in note) && categoryId === "inbox")
    ).length;
  };

  const handleMoveToCategory = (noteId: string, category: NoteCategory) => {
    updateNote.mutate({ id: noteId, category } as any);
    toast({ title: `Moved to ${CATEGORIES.find(c => c.id === category)?.label}` });
  };

  const handleConvertToAction = async (note: QuickNote, projectId?: string) => {
    await createActionItem.mutateAsync({
      title: note.content.slice(0, 100),
      description: note.content.length > 100 ? note.content : undefined,
      project_id: projectId,
    });
    
    // Mark as processed
    await updateNote.mutateAsync({ id: note.id, is_processed: true });
    toast({ title: "Created action item! ✓" });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => {
          const count = getCategoryCount(cat.id);
          return (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2 flex-shrink-0",
                activeCategory === cat.id && "bg-primary"
              )}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon}
              {cat.label}
              {count > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Sticky Notes Grid */}
      <ScrollArea className="h-[400px]">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No notes in {CATEGORIES.find(c => c.id === activeCategory)?.label}</p>
            <p className="text-sm">Use the Toto button to capture quick thoughts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note, index) => (
                <StickyNoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  projects={projects}
                  onMoveToCategory={handleMoveToCategory}
                  onConvertToAction={handleConvertToAction}
                  onDelete={() => deleteNote.mutate(note.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface StickyNoteCardProps {
  note: QuickNote;
  index: number;
  projects: { id: string; name: string; color: string }[];
  onMoveToCategory: (noteId: string, category: NoteCategory) => void;
  onConvertToAction: (note: QuickNote, projectId?: string) => void;
  onDelete: () => void;
}

function StickyNoteCard({ 
  note, 
  index, 
  projects, 
  onMoveToCategory, 
  onConvertToAction,
  onDelete 
}: StickyNoteCardProps) {
  const category = (note as any).category || "inbox";
  const categoryConfig = CATEGORIES.find(c => c.id === category);
  
  // Rotate sticky notes slightly for visual variety
  const rotation = (index % 3 - 1) * 1.5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className={cn(
        "p-4 min-h-[120px] border-2 shadow-md relative group cursor-default",
        "hover:shadow-lg transition-shadow",
        categoryConfig?.color,
        note.is_processed && "opacity-60"
      )}>
        {/* Top fold effect */}
        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-black/10 to-transparent rounded-bl-lg" />
        
        {/* Content */}
        <p className={cn(
          "text-sm whitespace-pre-wrap line-clamp-4 pr-6",
          note.is_processed && "line-through"
        )}>
          {note.content}
        </p>

        {/* Footer */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
          </span>

          {note.is_processed && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              {CATEGORIES.filter(c => c.id !== category).map((cat) => (
                <DropdownMenuItem 
                  key={cat.id}
                  onClick={() => onMoveToCategory(note.id, cat.id)}
                >
                  {cat.icon}
                  <span className="ml-2">{cat.label}</span>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Convert to Action</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onConvertToAction(note)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                No project
              </DropdownMenuItem>
              {projects.slice(0, 5).map((project) => (
                <DropdownMenuItem 
                  key={project.id}
                  onClick={() => onConvertToAction(note, project.id)}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  <span className="truncate">{project.name}</span>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}
