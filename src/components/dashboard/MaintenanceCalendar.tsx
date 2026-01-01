import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isSameDay } from "date-fns";
import { Clock, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RecurringTask {
  id: string;
  title: string;
  category: "wellness" | "fitness" | "medication" | "chores" | "health" | "shopping" | "work" | "personal" | "job";
  frequency: "daily" | "weekly" | "monthly";
  daysOfWeek?: number[];
  time?: string;
  icon: string;
  priority?: "high" | "medium" | "low";
  energyLevel?: "high" | "medium" | "low";
}

interface MaintenanceCalendarProps {
  tasks: RecurringTask[];
  completedTasks: Record<string, string[]>; // date string -> task ids
  onToggleComplete: (taskId: string, date: Date) => void;
  onClose: () => void;
  onEditTask: (task: RecurringTask) => void;
}

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

export function MaintenanceCalendar({
  tasks,
  completedTasks,
  onToggleComplete,
  onClose,
  onEditTask,
}: MaintenanceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getTasksForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return tasks.filter(task => {
      if (task.frequency === "daily") return true;
      if (task.frequency === "weekly" && task.daysOfWeek?.includes(dayOfWeek)) return true;
      return false;
    });
  };

  const isTaskCompleted = (taskId: string, date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return completedTasks[dateKey]?.includes(taskId) || false;
  };

  const selectedDayTasks = getTasksForDate(selectedDate);
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  // Custom day render to show task dots
  const modifiers = {
    hasHighPriority: (date: Date) => {
      const dayTasks = getTasksForDate(date);
      return dayTasks.some(t => t.priority === "high");
    },
    hasTasks: (date: Date) => getTasksForDate(date).length > 0,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <span className="text-sm font-medium">
          {format(selectedDate, "MMMM d, yyyy")}
        </span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border pointer-events-auto"
        modifiers={modifiers}
        modifiersClassNames={{
          hasHighPriority: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500",
          hasTasks: "font-bold",
        }}
      />

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">
          Tasks for {format(selectedDate, "EEEE, MMM d")}
        </h4>
        
        <ScrollArea className="h-48">
          {selectedDayTasks.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No tasks scheduled
            </div>
          ) : (
            <div className="space-y-2">
              {selectedDayTasks.map(task => {
                const completed = isTaskCompleted(task.id, selectedDate);
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all",
                      completed
                        ? "border-emerald-500/50 bg-emerald-500/10 opacity-60"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => onToggleComplete(task.id, selectedDate)}
                  >
                    <Checkbox checked={completed} />
                    <span className="text-lg">{task.icon}</span>
                    <div className="flex-1">
                      <div className={cn(
                        "text-sm font-medium flex items-center gap-2",
                        completed && "line-through"
                      )}>
                        {task.title}
                        {task.priority && (
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            PRIORITY_COLORS[task.priority]
                          )} />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {task.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.time}
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default MaintenanceCalendar;
