import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project, useUpdateProject } from "@/hooks/use-projects";
import { useProjectHistory, useLogProjectChange } from "@/hooks/use-project-history";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { History, Save } from "lucide-react";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [assignedTo, setAssignedTo] = useState("");
  
  const updateProject = useUpdateProject();
  const logChange = useLogProjectChange();
  const { data: history, isLoading: historyLoading } = useProjectHistory(project?.id || "");
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setColor(project.color || "#3b82f6");
      setAssignedTo(project.assigned_to || "");
    }
  }, [project]);

  const handleSave = async () => {
    if (!project || !name.trim()) return;

    const changes: { field: string; oldVal: string | null; newVal: string | null }[] = [];

    if (name !== project.name) {
      changes.push({ field: "name", oldVal: project.name, newVal: name });
    }
    if (description !== (project.description || "")) {
      changes.push({ field: "description", oldVal: project.description, newVal: description || null });
    }
    if (color !== (project.color || "#3b82f6")) {
      changes.push({ field: "color", oldVal: project.color, newVal: color });
    }
    if (assignedTo !== (project.assigned_to || "")) {
      changes.push({ field: "assigned_to", oldVal: project.assigned_to, newVal: assignedTo || null });
    }

    // Log all changes to history
    for (const change of changes) {
      await logChange.mutateAsync({
        projectId: project.id,
        fieldName: change.field,
        oldValue: change.oldVal,
        newValue: change.newVal,
      });
    }

    // Update the project
    updateProject.mutate({
      id: project.id,
      name,
      description: description || null,
      color,
      assigned_to: assignedTo || null,
    }, {
      onSuccess: () => {
        toast({ title: "Project updated", description: `${changes.length} field(s) changed` });
        onOpenChange(false);
      },
    });
  };

  const formatFieldName = (field: string) => {
    return field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Person or team"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      color === c ? "border-foreground scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            
            <Button onClick={handleSave} className="w-full" disabled={!name.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[300px]">
              {historyLoading ? (
                <p className="text-muted-foreground text-center py-4">Loading history...</p>
              ) : history && history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {formatFieldName(entry.field_name)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.changed_at), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground min-w-[50px]">From:</span>
                          <span className="text-destructive line-through">
                            {entry.old_value || "(empty)"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground min-w-[50px]">To:</span>
                          <span className="text-green-600 dark:text-green-400">
                            {entry.new_value || "(empty)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No changes recorded yet
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
