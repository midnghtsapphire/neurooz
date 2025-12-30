import { Project } from "@/hooks/use-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FolderOpen } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  actionItemCount: number;
  onSelect: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, actionItemCount, onSelect, onDelete }: ProjectCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-l-4"
      style={{ borderLeftColor: project.color }}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
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
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="h-4 w-4" />
          <span>{actionItemCount} action item{actionItemCount !== 1 ? "s" : ""}</span>
        </div>
      </CardContent>
    </Card>
  );
}
