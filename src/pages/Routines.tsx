import { useState } from "react";
import { useRoutines, useCreateRoutine, useUpdateRoutine, useDeleteRoutine, useCompleteRoutine } from "@/hooks/use-routines";
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
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newRoutine.routine_type}
                  onValueChange={(value: Routine['routine_type']) =>
                    setNewRoutine({ ...newRoutine, routine_type: value })
                  }
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
        </ul>
      </Card>
    </div>
  );
}
