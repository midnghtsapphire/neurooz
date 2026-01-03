import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { ActionItem, useUpdateActionItem } from "@/hooks/use-projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Calendar, Clock, User, AlertTriangle, GripVertical } from "lucide-react";
import { format } from "date-fns";

interface KanbanBoardProps {
  actionItems: ActionItem[];
}

type KanbanStatus = "backlog" | "todo" | "in_progress" | "waiting" | "done";

const KANBAN_COLUMNS: { id: KanbanStatus; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "bg-muted" },
  { id: "todo", label: "To Do", color: "bg-blue-500/20" },
  { id: "in_progress", label: "In Progress", color: "bg-amber-500/20" },
  { id: "waiting", label: "Waiting On", color: "bg-purple-500/20" },
  { id: "done", label: "Done", color: "bg-emerald-500/20" },
];

export function KanbanBoard({ actionItems }: KanbanBoardProps) {
  const updateItem = useUpdateActionItem();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const getItemsByStatus = (status: KanbanStatus) => {
    return actionItems.filter((item) => {
      // Map completed items to done
      if (item.is_completed) return status === "done";
      // Map waiting_on items to waiting
      if ((item as any).waiting_on) return status === "waiting";
      // Use kanban_status or default to backlog
      const itemStatus = (item as any).kanban_status || "backlog";
      return itemStatus === status;
    });
  };

  const handleDrop = (item: ActionItem, newStatus: KanbanStatus) => {
    const updates: any = { id: item.id };
    
    if (newStatus === "done") {
      updates.is_completed = true;
      updates.kanban_status = "done";
    } else if (newStatus === "waiting") {
      updates.kanban_status = "waiting";
      updates.waiting_on = "Pending response";
    } else {
      updates.is_completed = false;
      updates.kanban_status = newStatus;
      updates.waiting_on = null;
    }
    
    updateItem.mutate(updates);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          items={getItemsByStatus(column.id)}
          onDrop={(item) => handleDrop(item, column.id)}
          draggedItem={draggedItem}
          setDraggedItem={setDraggedItem}
        />
      ))}
    </div>
  );
}

interface KanbanColumnProps {
  column: { id: KanbanStatus; label: string; color: string };
  items: ActionItem[];
  onDrop: (item: ActionItem) => void;
  draggedItem: string | null;
  setDraggedItem: (id: string | null) => void;
}

function KanbanColumn({ column, items, onDrop, draggedItem, setDraggedItem }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const itemData = e.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData);
      onDrop(item);
    }
  };

  return (
    <div
      className={cn(
        "flex-shrink-0 w-72 rounded-xl p-3 transition-colors",
        column.color,
        isDragOver && "ring-2 ring-primary ring-offset-2"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{column.label}</h3>
        <Badge variant="secondary" className="text-xs">
          {items.length}
        </Badge>
      </div>

      <div className="space-y-2 min-h-[200px]">
        {items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            isDragging={draggedItem === item.id}
            onDragStart={() => setDraggedItem(item.id)}
            onDragEnd={() => setDraggedItem(null)}
          />
        ))}
        
        {items.length === 0 && (
          <div className="h-20 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-muted-foreground/20 rounded-lg">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  item: ActionItem;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function KanbanCard({ item, isDragging, onDragStart, onDragEnd }: KanbanCardProps) {
  const updateItem = useUpdateActionItem();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    onDragStart();
  };

  const priorityColors = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-emerald-500",
  };

  const isOverdue = item.due_date && new Date(item.due_date) < new Date() && !item.is_completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        className={cn(
          "p-3 cursor-grab active:cursor-grabbing border-l-4 hover:shadow-md transition-shadow",
          priorityColors[item.priority || "low"],
          item.is_completed && "opacity-60"
        )}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <Checkbox
                checked={item.is_completed}
                onCheckedChange={(checked) => 
                  updateItem.mutate({ 
                    id: item.id, 
                    is_completed: !!checked,
                    kanban_status: checked ? "done" : "todo"
                  } as any)
                }
                className="mt-0.5"
              />
              <p className={cn(
                "text-sm font-medium truncate",
                item.is_completed && "line-through text-muted-foreground"
              )}>
                {item.title}
              </p>
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 ml-6">
                {item.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 ml-6 flex-wrap">
              {item.due_date && (
                <Badge 
                  variant={isOverdue ? "destructive" : "outline"} 
                  className="text-xs h-5"
                >
                  {isOverdue && <AlertTriangle className="h-3 w-3 mr-1" />}
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(item.due_date), "MMM d")}
                </Badge>
              )}
              
              {(item as any).waiting_on && (
                <Badge variant="secondary" className="text-xs h-5">
                  <Clock className="h-3 w-3 mr-1" />
                  Waiting
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
