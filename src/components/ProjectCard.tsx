import { Project, useUpdateProject } from "@/hooks/use-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, FolderOpen, User, CheckCircle2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  actionItemCount: number;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function ProjectCard({ project, actionItemCount, onSelect, onDelete, onEdit }: ProjectCardProps) {
  const updateProject = useUpdateProject();

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProject.mutate({
      id: project.id,
      is_completed: !project.is_completed,
      completed_at: !project.is_completed ? new Date().toISOString() : null,
    });
  };

  return (
    <Card
      variant="vine"
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-l-4",
        project.is_completed && "opacity-70 bg-muted/30"
      )}
      style={{ borderLeftColor: project.color }}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              checked={project.is_completed}
              onClick={handleToggleComplete}
              className="flex-shrink-0"
            />
            <CardTitle className={cn(
              "text-lg font-semibold truncate",
              project.is_completed && "line-through text-muted-foreground"
            )}>
              {project.name}
            </CardTitle>
            {project.is_completed && (
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            <span>{actionItemCount} action item{actionItemCount !== 1 ? "s" : ""}</span>
          </div>
          {project.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="truncate max-w-[100px]">{project.assigned_to}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
