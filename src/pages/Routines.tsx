import { useState } from "react";
import { useRoutines, useCreateRoutine, useUpdateRoutine, useDeleteRoutine, useCompleteRoutine } from "@/hooks/use-routines";
import { useRoutines, useCreateRoutine, useDeleteRoutine, useCompleteRoutine, useRoutineCompletionsToday } from "@/hooks/use-routines";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, Sun, Moon, Repeat, GripVertical, CheckCircle2 } from "lucide-react";
import { Routine, RoutineStep } from "@/types/brainDump.types";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const ROUTINE_TYPE_META = {
  morning: { label: "Morning", icon: Sun, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950", border: "border-orange-200 dark:border-orange-800" },
  evening: { label: "Evening", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950", border: "border-indigo-200 dark:border-indigo-800" },
  custom: { label: "Custom", icon: Repeat, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-200 dark:border-purple-800" },
};

function RoutineCard({ routine }: { routine: Routine }) {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const deleteRoutine = useDeleteRoutine();
  const completeRoutine = useCompleteRoutine();

  const meta = ROUTINE_TYPE_META[routine.routine_type];
  const Icon = meta.icon;
  const steps: RoutineStep[] = Array.isArray(routine.steps) ? routine.steps : [];
  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const allDone = steps.length > 0 && completedCount === steps.length;

  const handleToggleStep = (stepId: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    const completedIds = steps.filter((s) => checkedSteps[s.id]).map((s) => s.id);
    await completeRoutine.mutateAsync({
      routineId: routine.id,
      stepsCompleted: completedIds,
    });
    setCheckedSteps({});
    setIsCompleting(false);
  };

  return (
    <Card className={`p-5 border-2 ${meta.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${meta.bg}`}>
            <Icon className={`h-5 w-5 ${meta.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{routine.name}</h3>
            <Badge variant="secondary" className="text-xs mt-1">
              {meta.label}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => deleteRoutine.mutate(routine.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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
                  checked={!!checkedSteps[step.id]}
                  onCheckedChange={() => handleToggleStep(step.id)}
                />
                <label
                  htmlFor={`step-${step.id}`}
                  className={`text-sm flex-1 cursor-pointer ${checkedSteps[step.id] ? "line-through text-muted-foreground" : ""}`}
                >
                  {step.title}
                  {step.estimated_time && (
                    <span className="ml-2 text-xs text-muted-foreground">({step.estimated_time}min)</span>
                  )}
                </label>
              </div>
            ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          {completedCount}/{steps.length} steps done
        </p>
        {steps.length > 0 && (
          <Button
            size="sm"
            disabled={isCompleting || completedCount === 0}
            onClick={handleComplete}
            variant={allDone ? "default" : "outline"}
          >
            {isCompleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            {allDone ? "Complete Routine!" : "Log Progress"}
          </Button>
        )}
      </div>
import { Plus, Trash2, Loader2, Sun, Moon, Clock } from "lucide-react";
import { Routine, RoutineStep } from "@/types/brainDump.types";
import { toast } from "@/hooks/use-toast";

function RoutineCard({
  routine,
  completedToday,
  onComplete,
  onDelete,
}: {
  routine: Routine;
  completedToday: boolean;
  onComplete: (routine: Routine, completedSteps: string[]) => void;
  onDelete: (id: string) => void;
}) {
  const steps: RoutineStep[] = Array.isArray(routine.steps) ? routine.steps : [];
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
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

  const allStepsChecked = steps.length > 0 && checkedSteps.size === steps.length;

  const typeIcon = routine.routine_type === "morning"
    ? <Sun className="h-5 w-5 text-yellow-500" />
    : routine.routine_type === "evening"
    ? <Moon className="h-5 w-5 text-blue-500" />
    : <Clock className="h-5 w-5 text-purple-500" />;

  const typeBorderClass = routine.routine_type === "morning"
    ? "border-yellow-200 dark:border-yellow-800"
    : routine.routine_type === "evening"
    ? "border-blue-200 dark:border-blue-800"
    : "border-purple-200 dark:border-purple-800";

  return (
    <Card className={`p-5 border-2 ${typeBorderClass} ${completedToday ? "opacity-70 bg-emerald-50 dark:bg-emerald-950" : ""}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {typeIcon}
          <div>
            <h3 className="text-lg font-semibold">{routine.name}</h3>
            <Badge variant="outline" className="text-xs capitalize mt-1">
              {routine.routine_type}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {completedToday && (
            <Badge className="bg-emerald-500 text-white">✅ Done Today</Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(routine.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-2 mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
              <Checkbox
                id={`step-${step.id}`}
                checked={checkedSteps.has(step.id)}
                onCheckedChange={() => toggleStep(step.id)}
                disabled={completedToday}
              />
              <label
                htmlFor={`step-${step.id}`}
                className={`text-sm flex-1 cursor-pointer ${
                  checkedSteps.has(step.id) ? "line-through text-muted-foreground" : ""
                }`}
              >
                {step.title}
                {step.estimated_time && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({step.estimated_time}min)
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4 italic">No steps added yet.</p>
      )}

      {!completedToday && (
        <Button
          className="w-full"
          disabled={steps.length > 0 && !allStepsChecked}
          onClick={() => onComplete(routine, Array.from(checkedSteps))}
          variant={allStepsChecked || steps.length === 0 ? "default" : "outline"}
        >
          {steps.length > 0 && !allStepsChecked
            ? `Complete all steps (${checkedSteps.size}/${steps.length})`
            : "Mark Routine Complete ✅"}
        </Button>
      )}
    </Card>
  );
}

export default function Routines() {
  const { data: routines, isLoading } = useRoutines();
  const createRoutine = useCreateRoutine();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    routine_type: "morning" as Routine['routine_type'],
  });
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepTime, setNewStepTime] = useState("");

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    const step: RoutineStep = {
      id: generateId(),
      title: newStepTitle.trim(),
      estimated_time: newStepTime ? parseInt(newStepTime) : undefined,
      order: steps.length + 1,
    };
    setSteps((prev) => [...prev, step]);
    setNewStepTitle("");
    setNewStepTime("");
  };

  const handleRemoveStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreate = async () => {
    if (!newRoutine.name.trim()) return;
    await createRoutine.mutateAsync({
      name: newRoutine.name.trim(),
      routine_type: newRoutine.routine_type,
      steps,
    });
    setNewRoutine({ name: "", routine_type: "morning" });
    setSteps([]);
    setShowAddDialog(false);
  };

  const morningRoutines = routines?.filter((r) => r.routine_type === "morning") || [];
  const eveningRoutines = routines?.filter((r) => r.routine_type === "evening") || [];
  const customRoutines = routines?.filter((r) => r.routine_type === "custom") || [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🔄 Routines</h1>
        <p className="text-muted-foreground">
          Build consistent habits with morning, evening, and custom routines.
          Small repeated actions create big change over time.
        </p>
      </div>

  const { data: completionsToday } = useRoutineCompletionsToday();
  const createRoutine = useCreateRoutine();
  const deleteRoutine = useDeleteRoutine();
  const completeRoutine = useCompleteRoutine();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineType, setNewRoutineType] = useState<Routine["routine_type"]>("morning");
  const [newSteps, setNewSteps] = useState<string[]>([""]);

  const completedRoutineIds = new Set(completionsToday?.map((c) => c.routine_id) ?? []);

  const morningRoutines = routines?.filter((r) => r.routine_type === "morning") ?? [];
  const eveningRoutines = routines?.filter((r) => r.routine_type === "evening") ?? [];
  const customRoutines = routines?.filter((r) => r.routine_type === "custom") ?? [];

  const handleAddStep = () => setNewSteps((prev) => [...prev, ""]);
  const handleStepChange = (index: number, value: string) => {
    setNewSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  };
  const handleRemoveStep = (index: number) => {
    setNewSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!newRoutineName.trim()) return;

    const steps: RoutineStep[] = newSteps
      .filter((s) => s.trim())
      .map((title, i) => ({
        id: crypto.randomUUID(),
        title,
        order: i + 1,
      }));

    await createRoutine.mutateAsync({
      name: newRoutineName,
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

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🔄 Daily Routines</h1>
        <p className="text-muted-foreground">
          Morning and evening checklists. Build consistency without thinking.
        </p>
      </div>

      {/* Progress */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Today's Routine Progress</span>
          <span className="text-2xl font-bold">
            {completedCount} / {totalRoutines}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-orange-500 transition-all"
            style={{
              width: totalRoutines > 0 ? `${(completedCount / totalRoutines) * 100}%` : "0%",
            }}
          />
        </div>
        {completedCount === totalRoutines && totalRoutines > 0 && (
          <p className="text-sm text-emerald-600 font-medium mt-2">
            🎉 All routines completed today! Incredible consistency!
          </p>
        )}
      </Card>

      {/* Add Routine Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Routine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newRoutine.name}
                  onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                  placeholder="e.g. Morning Power-Up"
              Add Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Routine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Routine Name</Label>
                <Input
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="e.g. Morning Power Routine"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newRoutine.routine_type}
                  onValueChange={(value: Routine['routine_type']) =>
                    setNewRoutine({ ...newRoutine, routine_type: value })
                  }
                  value={newRoutineType}
                  onValueChange={(v: Routine["routine_type"]) => setNewRoutineType(v)}
                >
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

              {/* Steps */}
              <div>
                <Label>Steps</Label>
                {steps.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {steps.map((step, i) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm py-1 px-2 rounded bg-muted">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        <span className="flex-1">{step.title}</span>
                        {step.estimated_time && (
                          <span className="text-xs text-muted-foreground">{step.estimated_time}min</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveStep(step.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    placeholder="Step title"
                    onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={newStepTime}
                    onChange={(e) => setNewStepTime(e.target.value)}
                    placeholder="min"
                    className="w-20"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddStep}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={createRoutine.isPending || !newRoutine.name.trim()}
              >
                {createRoutine.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <SelectItem value="morning">☀️ Morning</SelectItem>
                    <SelectItem value="evening">🌙 Evening</SelectItem>
                    <SelectItem value="custom">⚙️ Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Steps (optional)</Label>
                <div className="space-y-2 mt-1">
                  {newSteps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={step}
                        onChange={(e) => handleStepChange(i, e.target.value)}
                        placeholder={`Step ${i + 1}`}
                      />
                      {newSteps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStep(i)}
                        >
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
              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={!newRoutineName.trim() || createRoutine.isPending}
              >
                {createRoutine.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
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
      ) : routines?.length === 0 ? (
        <Card className="p-12 text-center">
          <Repeat className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground mb-2">No routines yet.</p>
          <p className="text-sm text-muted-foreground">
            Create your first morning or evening routine to build consistent habits.
      ) : totalRoutines === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No routines yet. Create your first morning or evening checklist!
          </p>
          <p className="text-sm text-muted-foreground">
            💡 Start simple: just 3-5 steps you do every day.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {morningRoutines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" /> Morning Routines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {morningRoutines.map((r) => <RoutineCard key={r.id} routine={r} />)}
              </div>
            </section>
          )}
          {eveningRoutines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-500" /> Evening Routines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eveningRoutines.map((r) => <RoutineCard key={r.id} routine={r} />)}
              </div>
            </section>
          )}
          {customRoutines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Repeat className="h-5 w-5 text-purple-500" /> Custom Routines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customRoutines.map((r) => <RoutineCard key={r.id} routine={r} />)}
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                Morning Routines
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
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5 text-blue-500" />
                Evening Routines
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
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Custom Routines
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

      <Card className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-950">
        <h3 className="font-semibold mb-3">💡 Routine Tips for ADHD</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Keep routines short — 5-10 steps max to avoid overwhelm</li>
          <li>• Anchor routines to existing habits (morning coffee = start routine)</li>
          <li>• Celebrate completing even partial routines — progress beats perfection</li>
          <li>• Build streaks by logging completions daily 🔥</li>
      {/* Tips */}
      <Card className="mt-8 p-6 bg-orange-50 dark:bg-orange-950">
        <h3 className="font-semibold mb-3">💡 Routine Tips for ADHD</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Keep routines to 5-10 minutes max to stay consistent</li>
          <li>• Attach routines to existing habits (after coffee, before bed)</li>
          <li>• Even doing 1 step counts as a win!</li>
          <li>• Consistency over perfection - the streak matters 🔥</li>
        </ul>
      </Card>
    </div>
  );
}
