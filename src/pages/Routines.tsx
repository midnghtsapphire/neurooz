import { useMemo, useState } from "react";
import {
  useCompleteRoutine,
  useCreateRoutine,
  useDeleteRoutine,
  useRoutineCompletionsToday,
  useRoutines,
} from "@/hooks/use-routines";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, Sun, Moon, Repeat, GripVertical, CheckCircle2, Clock } from "lucide-react";
import { Routine, RoutineStep } from "@/types/brainDump.types";
import { toast } from "@/hooks/use-toast";

type RoutineTypeMeta = {
  label: string;
  icon: typeof Sun;
  color: string;
  bg: string;
  border: string;
};

const ROUTINE_TYPE_META: Record<Routine["routine_type"], RoutineTypeMeta> = {
  morning: { label: "Morning", icon: Sun, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950", border: "border-orange-200 dark:border-orange-800" },
  evening: { label: "Evening", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950", border: "border-indigo-200 dark:border-indigo-800" },
  custom: { label: "Custom", icon: Repeat, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-200 dark:border-purple-800" },
};

const generateId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10));

type RoutineCardProps = {
  routine: Routine;
  completedToday: boolean;
  onComplete: (routine: Routine, completedSteps: string[]) => Promise<void> | void;
  onDelete: (id: string) => void;
};

function RoutineCard({ routine, completedToday, onComplete, onDelete }: RoutineCardProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);

  const steps: RoutineStep[] = Array.isArray(routine.steps) ? routine.steps : [];
  const completedCount = checkedSteps.size;
  const allStepsChecked = steps.length > 0 && completedCount === steps.length;

  const meta = ROUTINE_TYPE_META[routine.routine_type];
  const Icon = meta.icon;

  const toggleStep = (stepId: string) => {
    if (completedToday) return;
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const handleCompleteClick = async () => {
    setIsCompleting(true);
    await onComplete(routine, Array.from(checkedSteps));
    setCheckedSteps(new Set());
    setIsCompleting(false);
  };

  return (
    <Card className={`p-5 border-2 ${meta.border} ${completedToday ? "opacity-70 bg-emerald-50 dark:bg-emerald-950" : ""}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${meta.bg}`}>
            <Icon className={`h-5 w-5 ${meta.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{routine.name}</h3>
            <Badge variant="secondary" className="text-xs mt-1 capitalize">
              {meta.label}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {completedToday && <Badge className="bg-emerald-500 text-white">✅ Done Today</Badge>}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(routine.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">No steps added yet.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <div key={step.id} className="flex items-center gap-3 py-1">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 opacity-40" />
                <Checkbox
                  id={`step-${step.id}`}
                  checked={checkedSteps.has(step.id)}
                  onCheckedChange={() => toggleStep(step.id)}
                  disabled={completedToday}
                />
                <label
                  htmlFor={`step-${step.id}`}
                  className={`text-sm flex-1 cursor-pointer ${checkedSteps.has(step.id) ? "line-through text-muted-foreground" : ""}`}
                >
                  {step.title}
                  {step.estimated_time && <span className="ml-2 text-xs text-muted-foreground">({step.estimated_time}min)</span>}
                </label>
              </div>
            ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          {completedCount}/{steps.length} steps done
        </p>
        {!completedToday && steps.length > 0 && (
          <Button
            size="sm"
            disabled={isCompleting || completedCount === 0}
            onClick={handleCompleteClick}
            variant={allStepsChecked ? "default" : "outline"}
          >
            {isCompleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            {allStepsChecked ? "Complete Routine!" : "Log Progress"}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function Routines() {
  const { data: routines, isLoading } = useRoutines();
  const { data: completionsToday } = useRoutineCompletionsToday();
  const createRoutine = useCreateRoutine();
  const deleteRoutine = useDeleteRoutine();
  const completeRoutine = useCompleteRoutine();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineType, setNewRoutineType] = useState<Routine["routine_type"]>("morning");
  const [newSteps, setNewSteps] = useState<string[]>([""]);

  const completedRoutineIds = useMemo(
    () => new Set(completionsToday?.map((completion) => completion.routine_id) ?? []),
    [completionsToday]
  );

  const morningRoutines = routines?.filter((r) => r.routine_type === "morning") ?? [];
  const eveningRoutines = routines?.filter((r) => r.routine_type === "evening") ?? [];
  const customRoutines = routines?.filter((r) => r.routine_type === "custom") ?? [];

  const handleAddStep = () => setNewSteps((prev) => [...prev, ""]);

  const handleStepChange = (index: number, value: string) => {
    setNewSteps((prev) => prev.map((step, i) => (i === index ? value : step)));
  };

  const handleRemoveStep = (index: number) => {
    setNewSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!newRoutineName.trim()) {
      toast({
        title: "Name required",
        description: "Add a routine name to save it.",
        variant: "destructive",
      });
      return;
    }

    const steps: RoutineStep[] = newSteps
      .map((step) => step.trim())
      .filter(Boolean)
      .map((title, index) => ({
        id: generateId(),
        title,
        order: index + 1,
      }));

    await createRoutine.mutateAsync({
      name: newRoutineName.trim(),
      routine_type: newRoutineType,
      steps,
    });

    setNewRoutineName("");
    setNewRoutineType("morning");
    setNewSteps([""]);
    setShowAddDialog(false);
  };

  const handleComplete = async (routine: Routine, completedSteps: string[]) => {
    await completeRoutine.mutateAsync({
      routineId: routine.id,
      stepsCompleted: completedSteps,
    });
  };

  const handleDelete = (id: string) => {
    deleteRoutine.mutate(id);
  };

  const totalRoutines = routines?.length ?? 0;
  const completedCount = completedRoutineIds.size;
  const completionPercent = totalRoutines > 0 ? (completedCount / totalRoutines) * 100 : 0;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🔄 Daily Routines</h1>
        <p className="text-muted-foreground">Morning, evening, and custom checklists to build consistency without decision fatigue.</p>
      </div>

      <Card className="p-4 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Today's Routine Progress</span>
          <span className="text-2xl font-bold">
            {completedCount} / {totalRoutines}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div className="h-3 rounded-full bg-orange-500 transition-all" style={{ width: `${completionPercent}%` }} />
        </div>
        {completedCount === totalRoutines && totalRoutines > 0 && (
          <p className="text-sm text-emerald-600 font-medium mt-2">🎉 All routines completed today! Incredible consistency!</p>
        )}
      </Card>

      <div className="flex justify-end mb-6">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Routine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Routine Name</Label>
                <Input value={newRoutineName} onChange={(e) => setNewRoutineName(e.target.value)} placeholder="e.g. Morning Power Routine" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newRoutineType} onValueChange={(value: Routine["routine_type"]) => setNewRoutineType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">🌅 Morning</SelectItem>
                    <SelectItem value="evening">🌙 Evening</SelectItem>
                    <SelectItem value="custom">🔄 Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Steps (optional)</Label>
                <div className="space-y-2 mt-2">
                  {newSteps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <Input value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder={`Step ${index + 1}`} />
                      {newSteps.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveStep(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddStep}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                  </Button>
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={!newRoutineName.trim() || createRoutine.isPending}>
                {createRoutine.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Routine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : totalRoutines === 0 ? (
        <Card className="p-12 text-center">
          <Repeat className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground mb-2">No routines yet.</p>
          <p className="text-sm text-muted-foreground">Create your first morning or evening routine to build consistent habits.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {morningRoutines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" /> Morning Routines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {morningRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    completedToday={completedRoutineIds.has(routine.id)}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {eveningRoutines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-500" /> Evening Routines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eveningRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    completedToday={completedRoutineIds.has(routine.id)}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {customRoutines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" /> Custom Routines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    completedToday={completedRoutineIds.has(routine.id)}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <Card className="mt-8 p-6 bg-orange-50 dark:bg-orange-950">
        <h3 className="font-semibold mb-3">💡 Routine Tips for ADHD</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Keep routines short — 5-10 steps max to avoid overwhelm</li>
          <li>• Anchor routines to existing habits (morning coffee = start routine)</li>
          <li>• Celebrate completing even partial routines — progress beats perfection</li>
          <li>• Build streaks by logging completions daily 🔥</li>
        </ul>
      </Card>
    </div>
  );
}
