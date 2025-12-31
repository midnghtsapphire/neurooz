import { ActionItem, useUpdateActionItem, useDeleteActionItem } from "@/hooks/use-projects";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ActionItemRowProps {
  item: ActionItem;
}

const priorityColors = {
  low: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-red-500/10 text-red-600 border-red-500/20",
};

const priorityPoints = {
  low: 2,
  medium: 5,
  high: 10,
};

export function ActionItemRow({ item }: ActionItemRowProps) {
  const updateItem = useUpdateActionItem();
  const deleteItem = useDeleteActionItem();
  const [showReward, setShowReward] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(item.is_completed);

  useEffect(() => {
    // Show reward animation when item gets completed
    if (item.is_completed && !wasCompleted) {
      setShowReward(true);
      const timer = setTimeout(() => setShowReward(false), 2000);
      return () => clearTimeout(timer);
    }
    setWasCompleted(item.is_completed);
  }, [item.is_completed, wasCompleted]);

  const toggleComplete = () => {
    updateItem.mutate({ id: item.id, is_completed: !item.is_completed });
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high") => {
    updateItem.mutate({ id: item.id, priority });
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 p-4 rounded-lg border bg-card transition-all",
        item.is_completed && "opacity-60"
      )}
    >
      {/* Reward animation */}
      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="animate-bounce flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full shadow-lg border border-green-200">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">+{priorityPoints[item.priority]} Garden Points!</span>
            <span className="text-lg">🌱</span>
          </div>
        </div>
      )}
      
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
        
        {/* Priority Dropdown */}
        <Select 
          value={item.priority} 
          onValueChange={(value) => handlePriorityChange(value as "low" | "medium" | "high")}
        >
          <SelectTrigger className={cn(
            "w-[100px] h-8 text-xs capitalize",
            priorityColors[item.priority]
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border shadow-lg z-50">
            <SelectItem value="high" className="text-red-600">
              <div className="flex items-center gap-2">
                <span className="text-xs">🔥</span>
                <span>High (+10 pts)</span>
              </div>
            </SelectItem>
            <SelectItem value="medium" className="text-yellow-600">
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <span>Medium (+5 pts)</span>
              </div>
            </SelectItem>
            <SelectItem value="low" className="text-green-600">
              <div className="flex items-center gap-2">
                <span className="text-xs">🌿</span>
                <span>Low (+2 pts)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

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
