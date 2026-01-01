import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Repeat,
  Dumbbell,
  Stethoscope,
  Home,
  ShoppingCart,
  Sparkles,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RecurringTask {
  id: string;
  title: string;
  category: "chores" | "health" | "fitness" | "shopping" | "work" | "personal";
  frequency: "daily" | "weekly" | "monthly";
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
  time?: string;
  icon: string;
}

const DAYS_OF_WEEK = [
  { short: "S", full: "Sun", value: 0 },
  { short: "M", full: "Mon", value: 1 },
  { short: "T", full: "Tue", value: 2 },
  { short: "W", full: "Wed", value: 3 },
  { short: "T", full: "Thu", value: 4 },
  { short: "F", full: "Fri", value: 5 },
  { short: "S", full: "Sat", value: 6 },
];

const CATEGORY_ICONS: Record<string, { icon: any; color: string; emoji: string }> = {
  chores: { icon: Home, color: "text-amber-500", emoji: "🏠" },
  health: { icon: Stethoscope, color: "text-rose-500", emoji: "🏥" },
  fitness: { icon: Dumbbell, color: "text-emerald-500", emoji: "💪" },
  shopping: { icon: ShoppingCart, color: "text-blue-500", emoji: "🛒" },
  work: { icon: Calendar, color: "text-purple-500", emoji: "💼" },
  personal: { icon: Sparkles, color: "text-primary", emoji: "✨" },
};

const PRESET_TASKS: RecurringTask[] = [
  { id: "trash", title: "Take out trash", category: "chores", frequency: "weekly", daysOfWeek: [1], icon: "🗑️" },
  { id: "workout-mwf", title: "Workout", category: "fitness", frequency: "weekly", daysOfWeek: [1, 3, 5], time: "18:00", icon: "💪" },
  { id: "meds", title: "Take medications", category: "health", frequency: "daily", icon: "💊" },
  { id: "groceries", title: "Grocery shopping", category: "shopping", frequency: "weekly", daysOfWeek: [6], icon: "🛒" },
];

interface MaintenanceRoutineCardProps {
  onOpenWizard?: () => void;
}

export function MaintenanceRoutineCard({ onOpenWizard }: MaintenanceRoutineCardProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [tasks, setTasks] = useState<RecurringTask[]>(PRESET_TASKS);
  const [newTask, setNewTask] = useState<Partial<RecurringTask>>({
    category: "personal",
    frequency: "weekly",
    daysOfWeek: [],
  });
  const [todayCompleted, setTodayCompleted] = useState<string[]>([]);

  const today = new Date().getDay();
  const todaysTasks = tasks.filter(task => {
    if (task.frequency === "daily") return true;
    if (task.frequency === "weekly" && task.daysOfWeek?.includes(today)) return true;
    return false;
  });

  const toggleComplete = (taskId: string) => {
    setTodayCompleted(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const addTask = () => {
    if (!newTask.title) {
      toast.error("Please enter a task title");
      return;
    }
    const task: RecurringTask = {
      id: `task-${Date.now()}`,
      title: newTask.title || "",
      category: newTask.category as any || "personal",
      frequency: newTask.frequency as any || "weekly",
      daysOfWeek: newTask.daysOfWeek || [],
      time: newTask.time,
      icon: CATEGORY_ICONS[newTask.category || "personal"].emoji,
    };
    setTasks(prev => [...prev, task]);
    setNewTask({ category: "personal", frequency: "weekly", daysOfWeek: [] });
    toast.success("Task added!");
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleDay = (day: number) => {
    setNewTask(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...(prev.daysOfWeek || []), day]
    }));
  };

  const completedCount = todaysTasks.filter(t => todayCompleted.includes(t.id)).length;
  const completionPercent = todaysTasks.length > 0 ? (completedCount / todaysTasks.length) * 100 : 0;

  if (showWizard) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="border-2 border-amber-500/20 shadow-glow">
          <CardHeader className="pb-2 bg-gradient-to-br from-amber-500/10 via-primary/5 to-secondary/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Repeat className="w-5 h-5 text-amber-500" />
                Routine Wizard
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowWizard(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {/* Step indicators */}
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map(step => (
                <div 
                  key={step}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all",
                    step <= wizardStep ? "bg-amber-500" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <AnimatePresence mode="wait">
              {wizardStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold">Step 1: Quick Add Common Tasks</h3>
                  <p className="text-sm text-muted-foreground">Select tasks that apply to your routine:</p>
                  
                  <div className="space-y-2">
                    {PRESET_TASKS.map(preset => (
                      <div 
                        key={preset.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all",
                          tasks.find(t => t.id === preset.id)
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-border hover:border-amber-500/50"
                        )}
                        onClick={() => {
                          if (tasks.find(t => t.id === preset.id)) {
                            removeTask(preset.id);
                          } else {
                            setTasks(prev => [...prev, preset]);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{preset.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{preset.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {preset.frequency === "daily" ? "Every day" : 
                                preset.daysOfWeek?.map(d => DAYS_OF_WEEK[d].full).join(", ")}
                              {preset.time && ` at ${preset.time}`}
                            </div>
                          </div>
                        </div>
                        {tasks.find(t => t.id === preset.id) && (
                          <Check className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {wizardStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold">Step 2: Add Custom Task</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label>Task Name</Label>
                      <Input 
                        placeholder="e.g., Doctor appointment"
                        value={newTask.title || ""}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Category</Label>
                        <Select 
                          value={newTask.category} 
                          onValueChange={(v) => setNewTask(prev => ({ ...prev, category: v as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(CATEGORY_ICONS).map(([key, { emoji }]) => (
                              <SelectItem key={key} value={key}>
                                {emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Frequency</Label>
                        <Select 
                          value={newTask.frequency} 
                          onValueChange={(v) => setNewTask(prev => ({ ...prev, frequency: v as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newTask.frequency === "weekly" && (
                      <div>
                        <Label>Days of Week</Label>
                        <div className="flex gap-1 mt-2">
                          {DAYS_OF_WEEK.map(day => (
                            <button
                              key={day.value}
                              onClick={() => toggleDay(day.value)}
                              className={cn(
                                "w-9 h-9 rounded-full text-sm font-medium transition-all",
                                newTask.daysOfWeek?.includes(day.value)
                                  ? "bg-amber-500 text-white"
                                  : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {day.short}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Time (optional)</Label>
                      <Input 
                        type="time"
                        value={newTask.time || ""}
                        onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>

                    <Button onClick={addTask} className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Add Task
                    </Button>
                  </div>
                </motion.div>
              )}

              {wizardStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold">Step 3: Review Your Routine</h3>
                  
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div 
                          key={task.id}
                          className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{task.icon}</span>
                            <div>
                              <div className="text-sm font-medium">{task.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {task.frequency === "daily" ? "Every day" : 
                                  task.daysOfWeek?.map(d => DAYS_OF_WEEK[d].short).join(", ")}
                                {task.time && ` • ${task.time}`}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button 
                    onClick={() => {
                      setShowWizard(false);
                      toast.success("Routine saved!");
                    }}
                    className="w-full gap-2 bg-amber-500 hover:bg-amber-600"
                  >
                    <Check className="w-4 h-4" />
                    Save Routine
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWizardStep(prev => prev - 1)}
                disabled={wizardStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              {wizardStep < 3 && (
                <Button
                  size="sm"
                  onClick={() => setWizardStep(prev => prev + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="overflow-hidden border-2 border-amber-500/20 shadow-soft hover:shadow-medium transition-all">
        <div className="relative h-20 bg-gradient-to-br from-amber-500/20 via-primary/10 to-secondary/10">
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Repeat className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">Maintenance</h3>
                <p className="text-sm text-muted-foreground">Daily & weekly routines</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="gap-1" onClick={() => setShowWizard(true)}>
              <Plus className="w-4 h-4" />
              Setup
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Today's progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today's Progress</span>
            <Badge variant={completionPercent === 100 ? "default" : "secondary"}>
              {completedCount}/{todaysTasks.length} done
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
            />
          </div>

          {/* Today's tasks */}
          <div className="space-y-2">
            {todaysTasks.slice(0, 4).map(task => (
              <div 
                key={task.id}
                onClick={() => toggleComplete(task.id)}
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all",
                  todayCompleted.includes(task.id)
                    ? "border-emerald-500/50 bg-emerald-500/10 opacity-60"
                    : "border-border hover:border-amber-500/50"
                )}
              >
                <Checkbox checked={todayCompleted.includes(task.id)} />
                <span className="text-lg">{task.icon}</span>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm font-medium",
                    todayCompleted.includes(task.id) && "line-through"
                  )}>
                    {task.title}
                  </div>
                  {task.time && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {todaysTasks.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No tasks scheduled for today
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MaintenanceRoutineCard;
