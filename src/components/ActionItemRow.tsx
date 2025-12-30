import { ActionItem, useUpdateActionItem, useDeleteActionItem } from "@/hooks/use-projects";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ActionItemRowProps {
  item: ActionItem;
}

const priorityColors = {
  low: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ActionItemRow({ item }: ActionItemRowProps) {
  const updateItem = useUpdateActionItem();
  const deleteItem = useDeleteActionItem();

  const toggleComplete = () => {
    updateItem.mutate({ id: item.id, is_completed: !item.is_completed });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border bg-card transition-all",
        item.is_completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={item.is_completed}
        onCheckedChange={toggleComplete}
        className="h-5 w-5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium truncate",
            item.is_completed && "line-through text-muted-foreground"
          )}
        >
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground truncate">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.due_date && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(item.due_date), "MMM d")}</span>
          </div>
        )}
        <Badge variant="outline" className={cn("capitalize", priorityColors[item.priority])}>
          {item.priority}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => deleteItem.mutate(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
