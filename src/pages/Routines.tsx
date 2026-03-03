import { useState } from "react";
import { useRoutines, useCreateRoutine, useDeleteRoutine, useCompleteRoutine, useRoutineCompletionsToday } from "@/hooks/use-routines";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
                  value={newRoutineType}
                  onValueChange={(v: Routine["routine_type"]) => setNewRoutineType(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
