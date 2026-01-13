import { useState } from "react";
import { useShortListTasks, useCreateTask, useCompleteTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ShortList() {
  const { data: tasks, isLoading } = useShortListTasks();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({
    title: "",
    description: "",
    size: "medium" as "small" | "medium" | "big",
    priority: 1,
    estimated_time: 60,
  });

  const MAX_SHORT_LIST = 5;
  const canAddMore = (tasks?.length || 0) < MAX_SHORT_LIST;

  const handleQuickAdd = async () => {
    if (!newTaskTitle.trim()) return;
    if (!canAddMore) {
      toast({
        title: "Short List is full!",
        description: "Complete or move a task before adding more. Keep it focused! 🎯",
        variant: "destructive",
      });
      return;
    }

    await createTask.mutateAsync({
      title: newTaskTitle,
      task_type: "short_list",
      status: "pending",
      priority: (tasks?.length || 0) + 1,
    });
    setNewTaskTitle("");
  };

  const handleDetailedAdd = async () => {
    if (!newTaskDetails.title.trim()) return;
    if (!canAddMore) {
      toast({
        title: "Short List is full!",
        description: "Complete or move a task before adding more.",
        variant: "destructive",
      });
      return;
    }

    await createTask.mutateAsync({
      ...newTaskDetails,
      task_type: "short_list",
      status: "pending",
      priority: (tasks?.length || 0) + 1,
    });
    setNewTaskDetails({
      title: "",
      description: "",
      size: "medium",
      priority: 1,
      estimated_time: 60,
    });
    setShowAddDialog(false);
  };

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    if (isCompleted) {
      await updateTask.mutateAsync({
        id: taskId,
        updates: { status: "pending", completion_date: undefined },
      });
    } else {
      await completeTask.mutateAsync(taskId);
    }
  };

  const sizeColors = {
    small: "bg-green-500",
    medium: "bg-yellow-500",
    big: "bg-red-500",
  };

  const sizeLabels = {
    small: "Small (< 1hr)",
    medium: "Medium (1-3hrs)",
    big: "Big (3+ hrs)",
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📋 Today's Short List</h1>
        <p className="text-muted-foreground">
          Your sacred focus zone. Max 5 tasks. These are the ONLY things you're doing today.
        </p>
      </div>

      {/* Progress indicator */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-emerald-50 to-yellow-50 dark:from-emerald-950 dark:to-yellow-950">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Short List Capacity</span>
          <span className="text-2xl font-bold">
            {tasks?.length || 0} / {MAX_SHORT_LIST}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              (tasks?.length || 0) >= MAX_SHORT_LIST
                ? "bg-red-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${((tasks?.length || 0) / MAX_SHORT_LIST) * 100}%` }}
          />
        </div>
        {!canAddMore && (
          <div className="flex items-center gap-2 mt-3 text-sm text-orange-600 dark:text-orange-400">
            <AlertCircle className="h-4 w-4" />
            <span>Short List is full! Complete tasks to add more.</span>
          </div>
        )}
      </Card>

      {/* Quick add */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Quick add: What needs to be done today?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
          disabled={!canAddMore || createTask.isPending}
        />
        <Button
          onClick={handleQuickAdd}
          disabled={!newTaskTitle.trim() || !canAddMore || createTask.isPending}
        >
          {createTask.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!canAddMore}>
              Detailed
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Task with Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newTaskDetails.title}
                  onChange={(e) =>
                    setNewTaskDetails({ ...newTaskDetails, title: e.target.value })
                  }
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={newTaskDetails.description}
                  onChange={(e) =>
                    setNewTaskDetails({ ...newTaskDetails, description: e.target.value })
                  }
                  placeholder="Any additional details..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Size</Label>
                <Select
                  value={newTaskDetails.size}
                  onValueChange={(value: any) =>
                    setNewTaskDetails({ ...newTaskDetails, size: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (&lt; 1 hour)</SelectItem>
                    <SelectItem value="medium">Medium (1-3 hours)</SelectItem>
                    <SelectItem value="big">Big (3+ hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estimated Time (minutes)</Label>
                <Input
                  type="number"
                  value={newTaskDetails.estimated_time}
                  onChange={(e) =>
                    setNewTaskDetails({
                      ...newTaskDetails,
                      estimated_time: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <Button onClick={handleDetailedAdd} className="w-full">
                Add to Short List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : tasks?.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Your Short List is empty. Add 1-5 tasks you'll complete TODAY.
          </p>
          <p className="text-sm text-muted-foreground">
            💡 Tip: Start with your most important task. Small wins build momentum!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks?.map((task, index) => (
            <Card
              key={task.id}
              className={`p-4 transition-all ${
                task.status === "completed"
                  ? "opacity-60 bg-emerald-50 dark:bg-emerald-950"
                  : "hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() =>
                    handleToggleComplete(task.id, task.status === "completed")
                  }
                  className="mt-1"
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400 hover:text-emerald-500" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-medium">{index + 1}.</span>
                    <h3
                      className={`text-lg font-medium ${
                        task.status === "completed" ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {task.size && (
                      <Badge
                        variant="secondary"
                        className={`${sizeColors[task.size]} text-white`}
                      >
                        {sizeLabels[task.size]}
                      </Badge>
                    )}
                    {task.estimated_time && (
                      <Badge variant="outline">
                        ⏱️ {task.estimated_time}min
                      </Badge>
                    )}
                    {task.points_earned > 0 && (
                      <Badge variant="outline" className="bg-yellow-50">
                        ⭐ {task.points_earned} pts
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask.mutate(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADHD-friendly tips */}
      <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          💡 ADHD-Friendly Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Start with the SMALLEST task to build momentum</li>
          <li>• Break big tasks into smaller chunks (under 1 hour each)</li>
          <li>• Only add tasks you'll do TODAY - move everything else to Long List</li>
          <li>• Celebrate each completion! You're building your Yellow Brick Road 🌈</li>
        </ul>
      </Card>
    </div>
  );
}
