import { useState } from "react";
import {
  useCompleteTask,
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/hooks/use-tasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2, CheckCircle2, Circle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { Task } from "@/types/brainDump.types";
import { toast } from "@/hooks/use-toast";
import { formatEstimatedTime } from "@/utils/taskUtils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const { data: tasks, isLoading } = useTasks("calendar");
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_time: "",
    estimated_time: 60,
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });
  const startOffset = startOfMonth(currentMonth).getDay();

  const getTasksForDay = (day: Date): Task[] =>
    tasks?.filter((task) => task.due_date && isSameDay(new Date(task.due_date), day)) ?? [];

  const selectedDayTasks = getTasksForDay(selectedDate);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast({ title: "Title required", description: "Add a task title before saving.", variant: "destructive" });
      return;
    }

    await createTask.mutateAsync({
      title: newTask.title.trim(),
      description: newTask.description || undefined,
      due_date: format(selectedDate, "yyyy-MM-dd"),
      due_time: newTask.due_time || undefined,
      estimated_time: newTask.estimated_time || undefined,
      task_type: "calendar",
      status: "pending",
    });

    setNewTask({ title: "", description: "", due_time: "", estimated_time: 60 });
    setShowAddDialog(false);
  };

  const handleToggleComplete = async (task: Task) => {
    if (task.status === "completed") {
      await updateTask.mutateAsync({
        id: task.id,
        updates: { status: "pending", completion_date: undefined },
      });
    } else {
      await completeTask.mutateAsync(task.id);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📅 Calendar</h1>
        <p className="text-muted-foreground">
          Time-specific tasks and scheduled events. Google Calendar sync is planned — capture the day here first.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth((date) => subMonths(date, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth((date) => addMonths(date, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOffset }).map((_, index) => (
                <div key={`offset-${index}`} />
              ))}
              {days.map((day) => {
                const dayTasks = getTasksForDay(day);
                const isSelected = isSameDay(day, selectedDate);
                const today = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-2 rounded-lg text-sm font-medium transition-all min-h-[64px] flex flex-col items-center
                      ${isSelected ? "bg-blue-600 text-white" : ""}
                      ${today && !isSelected ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" : ""}
                      ${!isSelected && !today ? "hover:bg-muted" : ""}
                      ${!isSameMonth(day, currentMonth) ? "opacity-50" : ""}
                    `}
                  >
                    <span>{format(day, "d")}</span>
                    {dayTasks.length > 0 && (
                      <span className={`text-xs mt-1 ${isSelected ? "text-blue-200" : "text-blue-500"}`}>
                        {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Day</p>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold">{format(selectedDate, "EEEE, MMM d")}</h2>
              </div>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Calendar Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input value={newTask.title} onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={newTask.description}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Time (optional)</Label>
                      <Input
                        type="time"
                        value={newTask.due_time}
                        onChange={(e) => setNewTask((prev) => ({ ...prev, due_time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Estimated Minutes</Label>
                      <Input
                        type="number"
                        min={5}
                        value={newTask.estimated_time}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            estimated_time: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddTask} className="w-full" disabled={createTask.isPending}>
                    {createTask.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : selectedDayTasks.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tasks scheduled for this day.</div>
          ) : (
            <div className="space-y-3">
              {selectedDayTasks.map((task) => {
                const isDone = task.status === "completed";
                return (
                  <Card key={task.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="mt-1 text-muted-foreground hover:text-primary"
                          aria-label={isDone ? "Mark task incomplete" : "Mark task complete"}
                        >
                          {isDone ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge variant="secondary">Calendar</Badge>
                          </div>
                          {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                            {task.due_time && <span>🕒 {task.due_time}</span>}
                            {task.estimated_time ? <span>⏱️ {formatEstimatedTime(task.estimated_time)}</span> : null}
                            {task.status === "completed" && task.completion_date ? (
                              <span>✅ Done</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} aria-label="Delete task">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
