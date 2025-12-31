import { useState } from "react";
import { ActionItem, useUpdateActionItem } from "@/hooks/use-projects";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Link2, Unlink, Brain, Heart, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SetbackMatrixProps {
  actionItems: ActionItem[];
}

const TASK_TYPES = [
  { value: "scarecrow", label: "Scarecrow (Planning)", icon: Brain, color: "text-amber-600" },
  { value: "tinman", label: "Tin Man (Passion)", icon: Heart, color: "text-rose-500" },
  { value: "lion", label: "Lion (Courage)", icon: Shield, color: "text-orange-600" },
];

export function SetbackMatrix({ actionItems }: SetbackMatrixProps) {
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [blockedBy, setBlockedBy] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("lion");
  const [isSetback, setIsSetback] = useState(false);
  const [setbackReason, setSetbackReason] = useState("");
  const [open, setOpen] = useState(false);
  
  const updateActionItem = useUpdateActionItem();
  const { toast } = useToast();

  const handleSelectItem = (item: ActionItem) => {
    setSelectedItem(item);
    setBlockedBy(item.blocked_by || "");
    setTaskType(item.task_type || "lion");
    setIsSetback(item.is_setback || false);
    setSetbackReason(item.setback_reason || "");
  };

  const handleSave = () => {
    if (!selectedItem) return;

    updateActionItem.mutate({
      id: selectedItem.id,
      blocked_by: blockedBy || null,
      task_type: taskType as "scarecrow" | "tinman" | "lion",
      is_setback: isSetback,
      setback_reason: isSetback ? setbackReason : null,
    }, {
      onSuccess: () => {
        toast({ title: "Task updated", description: "Dependencies and type saved" });
        setOpen(false);
        setSelectedItem(null);
      },
    });
  };

  const setbacks = actionItems.filter(i => i.is_setback);
  const blockedItems = actionItems.filter(i => i.blocked_by);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link2 className="h-4 w-4" />
          Dependencies & Setbacks
          {(setbacks.length > 0 || blockedItems.length > 0) && (
            <Badge variant="secondary" className="ml-1">
              {setbacks.length + blockedItems.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Setback Matrix & Dependencies
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Setbacks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{setbacks.length}</p>
                <p className="text-xs text-muted-foreground">Tasks done out of order</p>
              </CardContent>
            </Card>
            
            <Card className="border-amber-200 dark:border-amber-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-amber-500" />
                  Blocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">{blockedItems.length}</p>
                <p className="text-xs text-muted-foreground">Waiting on other tasks</p>
              </CardContent>
            </Card>
          </div>

          {/* Task List for Editing */}
          <div className="space-y-2">
            <Label>Select a task to configure:</Label>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {actionItems.map((item) => {
                const itemTaskType = item.task_type || "lion";
                const typeConfig = TASK_TYPES.find(t => t.value === itemTaskType);
                const TypeIcon = typeConfig?.icon || Shield;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      selectedItem?.id === item.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <TypeIcon className={cn("h-4 w-4", typeConfig?.color)} />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.is_setback && (
                      <Badge variant="destructive" className="text-xs">Setback</Badge>
                    )}
                    {item.blocked_by && (
                      <Badge variant="outline" className="text-xs">Blocked</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Selected Item */}
          {selectedItem && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{selectedItem.title}</CardTitle>
                <CardDescription>Configure dependencies and task type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Task Type */}
                <div className="space-y-2">
                  <Label>Task Type (Oz Character)</Label>
                  <Select value={taskType} onValueChange={setTaskType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className={cn("h-4 w-4", type.color)} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Blocked By */}
                <div className="space-y-2">
                  <Label>Blocked By (Dependency)</Label>
                  <Select value={blockedBy} onValueChange={setBlockedBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="None - Ready to start" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        <div className="flex items-center gap-2">
                          <Unlink className="h-4 w-4" />
                          None - Ready to start
                        </div>
                      </SelectItem>
                      {actionItems
                        .filter(i => i.id !== selectedItem.id)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Setback Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isSetback"
                      checked={isSetback}
                      onChange={(e) => setIsSetback(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isSetback" className="flex items-center gap-2 cursor-pointer">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Mark as Setback (done out of order)
                    </Label>
                  </div>
                  
                  {isSetback && (
                    <Textarea
                      placeholder="What went wrong? What should have been done first?"
                      value={setbackReason}
                      onChange={(e) => setSetbackReason(e.target.value)}
                      rows={2}
                    />
                  )}
                </div>

                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
