import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, ArrowRight, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LongList() {
  const { data: allTasks, isLoading } = useTasks('long_list');
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    size: "medium" as "small" | "medium" | "big",
  });

  const filteredTasks = allTasks?.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newTask.title.trim()) return;

    await createTask.mutateAsync({
      ...newTask,
      task_type: "long_list",
      status: "pending",
    });
    setNewTask({ title: "", description: "", size: "medium" });
    setShowAddDialog(false);
  };

  const handleMoveToShortList = async (taskId: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      updates: { task_type: "short_list" },
    });
    toast({ title: "Moved to Short List!" });
  };

  const sizeColors = {
    small: "bg-green-500",
    medium: "bg-yellow-500",
    big: "bg-red-500",
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📚 Long List (Someday/Maybe)</h1>
        <p className="text-muted-foreground">
          Your unlimited parking lot for future tasks. No pressure, no deadlines. Just possibilities.
        </p>
      </div>

      {/* Header actions */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Long List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What do you want to do someday?"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Any details or notes..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Size</Label>
                <Select
                  value={newTask.size}
                  onValueChange={(value: any) => setNewTask({ ...newTask, size: value })}
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
              <Button onClick={handleAdd} className="w-full">
                Add to Long List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-3xl font-bold">{allTasks?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Showing</p>
            <p className="text-3xl font-bold">{filteredTasks?.length || 0}</p>
          </div>
        </div>
      </Card>

      {/* Tasks grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredTasks?.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No tasks match your search."
              : "Your Long List is empty. Add tasks you want to do someday!"}
          </p>
          <p className="text-sm text-muted-foreground">
            💡 Tip: This is your guilt-free parking lot. Add anything without pressure!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks?.map((task) => (
            <Card key={task.id} className="p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg flex-1 mr-2">{task.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask.mutate(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                {task.size && (
                  <Badge variant="secondary" className={`${sizeColors[task.size]} text-white text-xs`}>
                    {task.size}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleMoveToShortList(task.id)}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Move to Today
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* ADHD tips */}
      <Card className="mt-8 p-6 bg-purple-50 dark:bg-purple-950">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          💡 Long List Best Practices
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• This is your "someday/maybe" list - NO guilt allowed!</li>
          <li>• Add anything that pops into your head to clear mental clutter</li>
          <li>• Review weekly and move 1-2 tasks to Short List when ready</li>
          <li>• It's OK if tasks sit here forever - that's what this list is for!</li>
        </ul>
      </Card>
    </div>
  );
}
