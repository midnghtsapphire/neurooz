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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
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
  X,
  Briefcase,
  Target,
  AlertTriangle,
  Star,
  Zap,
  ArrowDown,
  Pill,
  Heart,
  Activity,
  Moon,
  Sun,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import MaintenanceCalendar from "./MaintenanceCalendar";
import type { RecurringTask } from "./MaintenanceCalendar";

export type { RecurringTask };

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
  wellness: { icon: Heart, color: "text-pink-500", emoji: "🧘" },
  fitness: { icon: Dumbbell, color: "text-emerald-500", emoji: "💪" },
  medication: { icon: Pill, color: "text-red-500", emoji: "💊" },
  chores: { icon: Home, color: "text-amber-500", emoji: "🏠" },
  health: { icon: Stethoscope, color: "text-rose-500", emoji: "🏥" },
  shopping: { icon: ShoppingCart, color: "text-blue-500", emoji: "🛒" },
  work: { icon: CalendarIcon, color: "text-purple-500", emoji: "💼" },
  personal: { icon: Sparkles, color: "text-primary", emoji: "✨" },
  job: { icon: Briefcase, color: "text-indigo-500", emoji: "👔" },
};

// Wellness presets
const WELLNESS_PRESET_TASKS: RecurringTask[] = [
  { id: "morning-meditation", title: "Morning meditation", category: "wellness", frequency: "daily", time: "07:00", icon: "🧘", priority: "high", energyLevel: "high" },
  { id: "journal", title: "Gratitude journaling", category: "wellness", frequency: "daily", time: "21:00", icon: "📓", priority: "medium", energyLevel: "low" },
  { id: "hydration", title: "Drink 8 glasses of water", category: "wellness", frequency: "daily", icon: "💧", priority: "high" },
  { id: "screen-break", title: "Take screen breaks", category: "wellness", frequency: "daily", icon: "👀", priority: "medium" },
  { id: "self-care", title: "Self-care time", category: "wellness", frequency: "weekly", daysOfWeek: [0], icon: "🛁", priority: "medium", energyLevel: "low" },
  { id: "nature-walk", title: "Walk in nature", category: "wellness", frequency: "weekly", daysOfWeek: [6], icon: "🌿", priority: "low" },
];

// Fitness presets
const FITNESS_PRESET_TASKS: RecurringTask[] = [
  { id: "workout-mwf", title: "Strength training", category: "fitness", frequency: "weekly", daysOfWeek: [1, 3, 5], time: "18:00", icon: "🏋️", priority: "high", energyLevel: "high" },
  { id: "morning-stretch", title: "Morning stretches", category: "fitness", frequency: "daily", time: "06:30", icon: "🤸", priority: "medium", energyLevel: "high" },
  { id: "cardio", title: "Cardio session", category: "fitness", frequency: "weekly", daysOfWeek: [2, 4], time: "07:00", icon: "🏃", priority: "high", energyLevel: "high" },
  { id: "yoga", title: "Yoga practice", category: "fitness", frequency: "weekly", daysOfWeek: [0, 3], time: "19:00", icon: "🧘‍♀️", priority: "medium", energyLevel: "low" },
  { id: "steps", title: "10,000 steps", category: "fitness", frequency: "daily", icon: "👟", priority: "medium" },
];

// Medication presets
const MEDICATION_PRESET_TASKS: RecurringTask[] = [
  { id: "morning-meds", title: "Morning medications", category: "medication", frequency: "daily", time: "08:00", icon: "💊", priority: "high", energyLevel: "high" },
  { id: "evening-meds", title: "Evening medications", category: "medication", frequency: "daily", time: "20:00", icon: "💊", priority: "high", energyLevel: "low" },
  { id: "vitamins", title: "Take vitamins", category: "medication", frequency: "daily", time: "08:30", icon: "🍊", priority: "medium" },
  { id: "supplements", title: "Supplements with food", category: "medication", frequency: "daily", time: "12:00", icon: "🥗", priority: "medium" },
  { id: "weekly-med", title: "Weekly medication", category: "medication", frequency: "weekly", daysOfWeek: [0], time: "09:00", icon: "📅", priority: "high" },
];

// General daily presets
const DAILY_PRESET_TASKS: RecurringTask[] = [
  { id: "trash", title: "Take out trash", category: "chores", frequency: "weekly", daysOfWeek: [1], icon: "🗑️", priority: "medium" },
  { id: "groceries", title: "Grocery shopping", category: "shopping", frequency: "weekly", daysOfWeek: [6], icon: "🛒", priority: "medium" },
  { id: "laundry", title: "Do laundry", category: "chores", frequency: "weekly", daysOfWeek: [6], icon: "🧺", priority: "medium" },
  { id: "meal-prep", title: "Meal prep", category: "personal", frequency: "weekly", daysOfWeek: [0], icon: "🍱", priority: "medium" },
  { id: "tidy-up", title: "Quick tidy up", category: "chores", frequency: "daily", time: "21:00", icon: "🧹", priority: "low", energyLevel: "low" },
];

const JOB_PRESET_TASKS: RecurringTask[] = [
  { id: "check-email", title: "Check & respond to emails", category: "job", frequency: "daily", time: "09:00", icon: "📧", priority: "high", energyLevel: "high" },
  { id: "standup", title: "Daily standup/check-in", category: "job", frequency: "daily", time: "09:30", icon: "🗣️", priority: "high" },
  { id: "timesheet", title: "Submit timesheet", category: "job", frequency: "weekly", daysOfWeek: [5], icon: "⏱️", priority: "high" },
  { id: "expense-report", title: "Submit expense reports", category: "job", frequency: "monthly", icon: "🧾", priority: "medium" },
  { id: "1on1", title: "1-on-1 with manager", category: "job", frequency: "weekly", daysOfWeek: [2], icon: "👥", priority: "high" },
  { id: "review-tasks", title: "Review & plan tasks", category: "job", frequency: "daily", time: "08:30", icon: "📋", priority: "high", energyLevel: "high" },
];

const PRIORITY_CONFIG = {
  high: { color: "text-red-500", bg: "bg-red-500/10", icon: AlertTriangle, label: "High" },
  medium: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Star, label: "Medium" },
  low: { color: "text-blue-500", bg: "bg-blue-500/10", icon: ArrowDown, label: "Low" },
};

const ENERGY_CONFIG = {
  high: { label: "Morning (high energy)", time: "morning" },
  medium: { label: "Afternoon (medium energy)", time: "afternoon" },
  low: { label: "Evening (low energy)", time: "evening" },
};

// Preset task item component
function PresetTaskItem({ 
  preset, 
  isSelected, 
  onToggle, 
  accentColor 
}: { 
  preset: RecurringTask; 
  isSelected: boolean; 
  onToggle: () => void; 
  accentColor: string;
}) {
  const borderClass = isSelected ? `border-${accentColor}-500 bg-${accentColor}-500/10` : "border-border hover:border-primary/50";
  
  return (
    <div 
      className={cn(
        "p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all text-sm",
        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
      )}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{preset.icon}</span>
        <div>
          <div className="font-medium">{preset.title}</div>
          <div className="text-xs text-muted-foreground">
            {preset.frequency === "daily" ? "Daily" : 
              preset.daysOfWeek?.map(d => DAYS_OF_WEEK[d].short).join(", ")}
            {preset.time && ` • ${preset.time}`}
          </div>
        </div>
      </div>
      {isSelected && <Check className="w-4 h-4 text-primary" />}
    </div>
  );
}

interface MaintenanceRoutineCardProps {
  onOpenWizard?: () => void;
}

export function MaintenanceRoutineCard({ onOpenWizard }: MaintenanceRoutineCardProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [showPrioritizer, setShowPrioritizer] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [tasks, setTasks] = useState<RecurringTask[]>([]);
  const [newTask, setNewTask] = useState<Partial<RecurringTask>>({
    category: "personal",
    frequency: "weekly",
    daysOfWeek: [],
    priority: "medium",
  });
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({});
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayCompleted = completedTasks[todayKey] || [];

  const today = new Date().getDay();
  const currentHour = new Date().getHours();
  
  const todaysTasks = tasks.filter(task => {
    if (task.frequency === "daily") return true;
    if (task.frequency === "weekly" && task.daysOfWeek?.includes(today)) return true;
    return false;
  });

  // Prioritize tasks based on priority and energy level matching current time
  const prioritizedTasks = [...todaysTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority || "medium"];
    const bPriority = priorityOrder[b.priority || "medium"];
    
    // First sort by priority
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // Then by time if available
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    
    return 0;
  });

  const getTimeOfDay = () => {
    if (currentHour < 12) return "morning";
    if (currentHour < 17) return "afternoon";
    return "evening";
  };

  const suggestedNextTask = prioritizedTasks.find(task => {
    if (todayCompleted.includes(task.id)) return false;
    const timeOfDay = getTimeOfDay();
    if (task.energyLevel === "high" && timeOfDay === "morning") return true;
    if (task.energyLevel === "medium" && timeOfDay === "afternoon") return true;
    if (task.energyLevel === "low" && timeOfDay === "evening") return true;
    if (!task.energyLevel) return true;
    return false;
  }) || prioritizedTasks.find(task => !todayCompleted.includes(task.id));

  const toggleComplete = (taskId: string, date?: Date) => {
    const dateKey = date ? format(date, "yyyy-MM-dd") : todayKey;
    setCompletedTasks(prev => {
      const currentTasks = prev[dateKey] || [];
      const updated = currentTasks.includes(taskId)
        ? currentTasks.filter(id => id !== taskId)
        : [...currentTasks, taskId];
      return { ...prev, [dateKey]: updated };
    });
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
      priority: newTask.priority as any || "medium",
      energyLevel: newTask.energyLevel as any,
    };
    setTasks(prev => [...prev, task]);
    setNewTask({ category: "personal", frequency: "weekly", daysOfWeek: [], priority: "medium" });
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

  const addJobPresets = () => {
    const existingIds = tasks.map(t => t.id);
    const newJobTasks = JOB_PRESET_TASKS.filter(t => !existingIds.includes(t.id));
    setTasks(prev => [...prev, ...newJobTasks]);
    toast.success(`Added ${newJobTasks.length} job maintenance tasks!`);
  };

  const addPresetsByCategory = (presets: RecurringTask[]) => {
    const existingIds = tasks.map(t => t.id);
    const newTasks = presets.filter(t => !existingIds.includes(t.id));
    setTasks(prev => [...prev, ...newTasks]);
    toast.success(`Added ${newTasks.length} tasks!`);
  };

  const togglePreset = (preset: RecurringTask) => {
    if (tasks.find(t => t.id === preset.id)) {
      removeTask(preset.id);
    } else {
      setTasks(prev => [...prev, preset]);
    }
  };

  const completedCount = todaysTasks.filter(t => todayCompleted.includes(t.id)).length;
  const highPriorityRemaining = prioritizedTasks.filter(t => t.priority === "high" && !todayCompleted.includes(t.id)).length;
  const completionPercent = todaysTasks.length > 0 ? (completedCount / todaysTasks.length) * 100 : 0;

  // Calendar view
  if (showCalendar) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card className="border-2 border-amber-500/20 shadow-glow">
          <CardContent className="p-4">
            <MaintenanceCalendar
              tasks={tasks}
              completedTasks={completedTasks}
              onToggleComplete={toggleComplete}
              onClose={() => setShowCalendar(false)}
              onEditTask={(task) => {
                setShowCalendar(false);
                setShowWizard(true);
                setWizardStep(5);
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
              {[1, 2, 3, 4].map(step => (
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
                  <h3 className="font-semibold">Step 1: Daily Essentials</h3>
                  <p className="text-sm text-muted-foreground">Select categories to add presets:</p>
                  
                  <Tabs defaultValue="wellness" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                      <TabsTrigger value="wellness" className="text-xs flex flex-col gap-1 py-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        Wellness
                      </TabsTrigger>
                      <TabsTrigger value="fitness" className="text-xs flex flex-col gap-1 py-2">
                        <Dumbbell className="w-4 h-4 text-emerald-500" />
                        Fitness
                      </TabsTrigger>
                      <TabsTrigger value="medication" className="text-xs flex flex-col gap-1 py-2">
                        <Pill className="w-4 h-4 text-red-500" />
                        Medication
                      </TabsTrigger>
                      <TabsTrigger value="daily" className="text-xs flex flex-col gap-1 py-2">
                        <Home className="w-4 h-4 text-amber-500" />
                        Daily
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="wellness" className="mt-3">
                      <ScrollArea className="h-40">
                        <div className="space-y-2">
                          {WELLNESS_PRESET_TASKS.map(preset => (
                            <PresetTaskItem
                              key={preset.id}
                              preset={preset}
                              isSelected={!!tasks.find(t => t.id === preset.id)}
                              onToggle={() => togglePreset(preset)}
                              accentColor="pink"
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <Button variant="outline" size="sm" onClick={() => addPresetsByCategory(WELLNESS_PRESET_TASKS)} className="w-full mt-2 gap-2">
                        <Heart className="w-4 h-4" />
                        Add All Wellness
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="fitness" className="mt-3">
                      <ScrollArea className="h-40">
                        <div className="space-y-2">
                          {FITNESS_PRESET_TASKS.map(preset => (
                            <PresetTaskItem
                              key={preset.id}
                              preset={preset}
                              isSelected={!!tasks.find(t => t.id === preset.id)}
                              onToggle={() => togglePreset(preset)}
                              accentColor="emerald"
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <Button variant="outline" size="sm" onClick={() => addPresetsByCategory(FITNESS_PRESET_TASKS)} className="w-full mt-2 gap-2">
                        <Dumbbell className="w-4 h-4" />
                        Add All Fitness
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="medication" className="mt-3">
                      <ScrollArea className="h-40">
                        <div className="space-y-2">
                          {MEDICATION_PRESET_TASKS.map(preset => (
                            <PresetTaskItem
                              key={preset.id}
                              preset={preset}
                              isSelected={!!tasks.find(t => t.id === preset.id)}
                              onToggle={() => togglePreset(preset)}
                              accentColor="red"
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <Button variant="outline" size="sm" onClick={() => addPresetsByCategory(MEDICATION_PRESET_TASKS)} className="w-full mt-2 gap-2">
                        <Pill className="w-4 h-4" />
                        Add All Medication
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="daily" className="mt-3">
                      <ScrollArea className="h-40">
                        <div className="space-y-2">
                          {DAILY_PRESET_TASKS.map(preset => (
                            <PresetTaskItem
                              key={preset.id}
                              preset={preset}
                              isSelected={!!tasks.find(t => t.id === preset.id)}
                              onToggle={() => togglePreset(preset)}
                              accentColor="amber"
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <Button variant="outline" size="sm" onClick={() => addPresetsByCategory(DAILY_PRESET_TASKS)} className="w-full mt-2 gap-2">
                        <Home className="w-4 h-4" />
                        Add All Daily
                      </Button>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {wizardStep === 2 && (
                <motion.div
                  key="step2-job"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    Step 2: Job Maintenance Tasks
                  </h3>
                  <p className="text-sm text-muted-foreground">Add work-related recurring tasks:</p>
                  
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {JOB_PRESET_TASKS.map(preset => (
                        <div 
                          key={preset.id}
                          className={cn(
                            "p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all",
                            tasks.find(t => t.id === preset.id)
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-border hover:border-indigo-500/50"
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
                              <div className="text-sm font-medium flex items-center gap-2">
                                {preset.title}
                                {preset.priority && (
                                  <Badge variant="outline" className={cn("text-xs", PRIORITY_CONFIG[preset.priority].color)}>
                                    {PRIORITY_CONFIG[preset.priority].label}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {preset.frequency === "daily" ? "Every day" : 
                                  preset.daysOfWeek?.map(d => DAYS_OF_WEEK[d].full).join(", ")}
                                {preset.time && ` at ${preset.time}`}
                              </div>
                            </div>
                          </div>
                          {tasks.find(t => t.id === preset.id) && (
                            <Check className="w-5 h-5 text-indigo-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <Button variant="outline" onClick={addJobPresets} className="w-full gap-2">
                    <Briefcase className="w-4 h-4" />
                    Add All Job Tasks
                  </Button>
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
                  <h3 className="font-semibold">Step 3: Add Custom Task</h3>
                  
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

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Priority</Label>
                        <Select 
                          value={newTask.priority || "medium"} 
                          onValueChange={(v) => setNewTask(prev => ({ ...prev, priority: v as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">🔴 High</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="low">🔵 Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Best Time</Label>
                        <Select 
                          value={newTask.energyLevel || ""} 
                          onValueChange={(v) => setNewTask(prev => ({ ...prev, energyLevel: v as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">☀️ Morning</SelectItem>
                            <SelectItem value="medium">🌤️ Afternoon</SelectItem>
                            <SelectItem value="low">🌙 Evening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

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

              {wizardStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold">Step 4: Review Your Routine</h3>
                  
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
                              <div className="text-sm font-medium flex items-center gap-2">
                                {task.title}
                                {task.priority && (
                                  <span className={cn("w-2 h-2 rounded-full", 
                                    task.priority === "high" ? "bg-red-500" :
                                    task.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                                  )} />
                                )}
                              </div>
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
              {wizardStep < 4 && (
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
                <p className="text-sm text-muted-foreground">Daily, weekly & job routines</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="gap-1" onClick={() => setShowCalendar(true)}>
                <CalendarIcon className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowPrioritizer(!showPrioritizer)}>
                <Target className="w-4 h-4" />
                Prioritize
              </Button>
              <Button size="sm" variant="secondary" className="gap-1" onClick={() => setShowWizard(true)}>
                <Plus className="w-4 h-4" />
                Setup
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* High priority alert */}
          {highPriorityRemaining > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium text-red-600">
                {highPriorityRemaining} high priority task{highPriorityRemaining > 1 ? 's' : ''} remaining
              </span>
            </div>
          )}

          {/* Suggested next task */}
          {suggestedNextTask && !todayCompleted.includes(suggestedNextTask.id) && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Suggested Next</span>
              </div>
              <div 
                onClick={() => toggleComplete(suggestedNextTask.id)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox checked={false} />
                <span className="text-lg">{suggestedNextTask.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{suggestedNextTask.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {suggestedNextTask.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {suggestedNextTask.time}
                      </span>
                    )}
                    {suggestedNextTask.priority && (
                      <Badge variant="outline" className={cn("text-xs", PRIORITY_CONFIG[suggestedNextTask.priority].color)}>
                        {PRIORITY_CONFIG[suggestedNextTask.priority].label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {/* Prioritized task list or regular list */}
          {showPrioritizer ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prioritized Order</span>
                <Badge variant="outline" className="text-xs">
                  {getTimeOfDay() === "morning" ? "☀️ Morning" : 
                   getTimeOfDay() === "afternoon" ? "🌤️ Afternoon" : "🌙 Evening"}
                </Badge>
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {prioritizedTasks.map((task, index) => (
                    <div 
                      key={task.id}
                      onClick={() => toggleComplete(task.id)}
                      className={cn(
                        "p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all",
                        todayCompleted.includes(task.id)
                          ? "border-emerald-500/50 bg-emerald-500/10 opacity-60"
                          : task.priority === "high" 
                            ? "border-red-500/30 hover:border-red-500/50"
                            : "border-border hover:border-amber-500/50"
                      )}
                    >
                      <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <Checkbox checked={todayCompleted.includes(task.id)} />
                      <span className="text-lg">{task.icon}</span>
                      <div className="flex-1">
                        <div className={cn(
                          "text-sm font-medium flex items-center gap-2",
                          todayCompleted.includes(task.id) && "line-through"
                        )}>
                          {task.title}
                          {task.priority && (
                            <span className={cn("w-2 h-2 rounded-full", 
                              task.priority === "high" ? "bg-red-500" :
                              task.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
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
                          {task.category === "job" && (
                            <Badge variant="outline" className="text-xs text-indigo-500">Job</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-2">
              {prioritizedTasks.slice(0, 4).map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleComplete(task.id)}
                  className={cn(
                    "p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all",
                    todayCompleted.includes(task.id)
                      ? "border-emerald-500/50 bg-emerald-500/10 opacity-60"
                      : task.priority === "high"
                        ? "border-red-500/30 hover:border-red-500/50"
                        : "border-border hover:border-amber-500/50"
                  )}
                >
                  <Checkbox checked={todayCompleted.includes(task.id)} />
                  <span className="text-lg">{task.icon}</span>
                  <div className="flex-1">
                    <div className={cn(
                      "text-sm font-medium flex items-center gap-2",
                      todayCompleted.includes(task.id) && "line-through"
                    )}>
                      {task.title}
                      {task.priority === "high" && (
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {task.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.time}
                        </span>
                      )}
                      {task.category === "job" && (
                        <Badge variant="outline" className="text-xs text-indigo-500">Job</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {todaysTasks.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No tasks scheduled for today
                </div>
              )}
              {todaysTasks.length > 4 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-muted-foreground"
                  onClick={() => setShowPrioritizer(true)}
                >
                  +{todaysTasks.length - 4} more tasks
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MaintenanceRoutineCard;
