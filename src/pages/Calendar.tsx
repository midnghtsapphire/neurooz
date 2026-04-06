import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useCompleteTask } from "@/hooks/use-tasks";
import { useTasks, useCreateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, CheckCircle2, Circle, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/types/brainDump.types";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { Task } from "@/types/brainDump.types";
import { formatEstimatedTime } from "@/utils/taskUtils";

function getDaysInMonth(currentDate: Date) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  return eachDayOfInterval({ start, end });
}

function getStartOffset(currentDate: Date): number {
  const start = startOfMonth(currentDate);
  return start.getDay(); // 0 = Sunday
}

export default function Calendar() {
  const { data: tasks, isLoading } = useTasks("calendar");
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_time: "",
  });

  const { data: tasks, isLoading } = useTasks("calendar");
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const completeTask = useCompleteTask();

  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const tasksByDate = (tasks || []).reduce<Record<string, Task[]>>((acc, task) => {
    if (task.due_date) {
      const key = task.due_date.split("T")[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
    }
    return acc;
  }, {});

  const selectedDateTasks = tasksByDate[selectedDate] || [];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleAdd = async () => {
    if (!newTask.title.trim()) return;
    estimated_time: 60,
  });

  const days = getDaysInMonth(currentMonth);
  const startOffset = getStartOffset(currentMonth);

  const getTasksForDay = (day: Date): Task[] => {
    return (
      tasks?.filter((t) => t.due_date && isSameDay(new Date(t.due_date), day)) ?? []
    );
  };

  const selectedDayTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !selectedDate) return;

    await createTask.mutateAsync({
      title: newTask.title,
      description: newTask.description || undefined,
      due_date: selectedDate,
      due_time: newTask.due_time || undefined,
      task_type: "calendar",
      status: "pending",
    });
    setNewTask({ title: "", description: "", due_time: "" });
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

  const todayStr = formatDate(today);
      task_type: "calendar",
      status: "pending",
      due_date: format(selectedDate, "yyyy-MM-dd"),
      due_time: newTask.due_time || undefined,
      estimated_time: newTask.estimated_time || undefined,
    });

    setNewTask({ title: "", description: "", due_time: "", estimated_time: 60 });
    setShowAddDialog(false);
  };

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📅 Calendar</h1>
        <p className="text-muted-foreground">
          Time-specific tasks and scheduled events. Google Calendar sync coming in Phase 4.
          Schedule tasks with due dates. Time-specific events with prep time calculation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth((d) => subMonths(d, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth((d) => addMonths(d, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES.map((day) => (
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const dateStr = formatDate(day);
                const dayTasks = tasksByDate[dateStr] || [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                      relative p-2 rounded-lg text-sm font-medium transition-all min-h-[48px] flex flex-col items-center
                      ${isSelected ? "bg-blue-600 text-white" : ""}
                      ${isToday && !isSelected ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" : ""}
                      ${!isSelected && !isToday ? "hover:bg-muted" : ""}
                    `}
                  >
                    <span>{day.getDate()}</span>
                    {dayTasks.length > 0 && (
                      <span className={`text-xs mt-1 ${isSelected ? "text-blue-200" : "text-blue-500"}`}>
                        {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
                      </span>
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for start offset */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {days.map((day) => {
                const dayTasks = getTasksForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);
                const inCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-1 min-h-[60px] rounded-lg text-left text-sm transition-colors
                      ${isSelected ? "bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500" : "hover:bg-muted"}
                      ${isCurrentDay && !isSelected ? "bg-emerald-50 dark:bg-emerald-950 font-bold" : ""}
                      ${!inCurrentMonth ? "opacity-30" : ""}
                    `}
                  >
                    <span
                      className={`
                        block text-center w-6 h-6 rounded-full mx-auto mb-1 text-xs leading-6
                        ${isCurrentDay ? "bg-emerald-500 text-white" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 justify-center">
                        {dayTasks.slice(0, 3).map((t) => (
                          <div
                            key={t.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === "completed" ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{dayTasks.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected day tasks */}
        <div>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {selectedDate === todayStr ? "Today" : selectedDate}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Task for {selectedDate}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="What needs to happen?"
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      />
                    </div>
                    <div>
                      <Label>Time (optional)</Label>
                      <Input
                        type="time"
                        value={newTask.due_time}
                        onChange={(e) => setNewTask({ ...newTask, due_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description (optional)</Label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Any additional details..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAdd} className="w-full" disabled={createTask.isPending}>
                      {createTask.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

          {/* Google Calendar sync placeholder */}
          <Card className="p-4 mt-4 border-dashed border-2 border-muted-foreground/30">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CalendarIcon className="h-5 w-5" />
              <div>
                <p className="font-medium">Google Calendar Sync</p>
                <p className="text-xs">Connect Google Calendar to sync events automatically (coming soon)</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto" disabled>
                Connect
              </Button>
            </div>
          </Card>
        </div>

        {/* Selected Day Panel */}
        <div>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a day"}
              </h3>
              {selectedDate && (
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add Task — {format(selectedDate, "MMM d, yyyy")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          placeholder="What needs to happen?"
                        />
                      </div>
                      <div>
                        <Label>Description (optional)</Label>
                        <Textarea
                          value={newTask.description}
                          onChange={(e) =>
                            setNewTask({ ...newTask, description: e.target.value })
                          }
                          placeholder="Notes..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Time (optional)</Label>
                        <Input
                          type="time"
                          value={newTask.due_time}
                          onChange={(e) =>
                            setNewTask({ ...newTask, due_time: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Estimated Time (minutes)</Label>
                        <Input
                          type="number"
                          value={newTask.estimated_time}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              estimated_time: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleAddTask}
                        className="w-full"
                        disabled={!newTask.title.trim() || createTask.isPending}
                      >
                        {createTask.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Add to Calendar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No tasks scheduled</p>
                <p className="text-xs mt-1">Click + to add one</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-2 p-3 rounded-lg border transition-all ${
                      task.status === "completed"
                        ? "opacity-60 bg-emerald-50 dark:bg-emerald-950"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className="mt-0.5 shrink-0"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-emerald-500" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through" : ""}`}>
                        {task.title}
                      </p>
                      {task.due_time && (
                        <Badge variant="outline" className="text-xs mt-1">
                          🕐 {task.due_time}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 shrink-0"
                      onClick={() => deleteTask.mutate(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
            ) : selectedDayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tasks scheduled.
                {selectedDate && (
                  <span className="block mt-1">Click + to add one.</span>
                )}
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border ${
                      task.status === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 opacity-70"
                        : "bg-background border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm truncate ${
                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {task.due_time && (
                            <Badge variant="outline" className="text-xs">
                              ⏰ {task.due_time}
                            </Badge>
                          )}
                          {task.estimated_time && (
                            <Badge variant="outline" className="text-xs">
                              {formatEstimatedTime(task.estimated_time)}
                            </Badge>
                          )}
                          {task.status === "completed" && (
                            <Badge className="text-xs bg-emerald-500 text-white">Done</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask.mutate(task.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Phase 4 notice */}
          <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
              🔗 Google Calendar Sync
            </p>
            <p className="text-xs text-muted-foreground">
              Two-way sync with Google Calendar is coming in Phase 4. Tasks added here will be synced automatically.
            </p>
          </Card>
        </div>
      </div>
          {/* Monthly summary */}
          <Card className="p-4 mt-4 bg-blue-50 dark:bg-blue-950">
            <h4 className="font-semibold mb-2 text-sm">This Month</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks?.filter((t) => t.due_date && isSameMonth(new Date(t.due_date), currentMonth)).length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {tasks?.filter(
                    (t) =>
                      t.status === "completed" &&
                      t.due_date &&
                      isSameMonth(new Date(t.due_date), currentMonth)
                  ).length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-3">💡 Calendar Tips for ADHD</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Add prep time: schedule tasks 15-30 min earlier than needed</li>
          <li>• Don't overschedule — leave buffer time between tasks</li>
          <li>• Put important tasks in morning hours when focus is best</li>
          <li>• Use the Short List for flexible tasks without deadlines</li>
        </ul>
      </Card>
    </div>
  );
}
