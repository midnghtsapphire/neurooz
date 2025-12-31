import { ProjectItem, useConvertToActionItem, useDeleteProjectItem } from "@/hooks/use-project-items";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Trash2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectItemRowProps {
  item: ProjectItem;
  projectId: string;
}

export function ProjectItemRow({ item, projectId }: ProjectItemRowProps) {
  const convertToAction = useConvertToActionItem();
  const deleteItem = useDeleteProjectItem();

  const handleConvert = () => {
    convertToAction.mutate({
      projectItemId: item.id,
      projectId,
      title: item.title,
      description: item.description || undefined,
    });
  };

  return (
    <Card className={cn(
      "p-3 flex items-center gap-3 transition-all",
      item.is_action_item 
        ? "bg-green-50/50 dark:bg-green-950/20 border-green-200/50" 
        : "hover:shadow-sm"
    )}>
      <div className="flex-shrink-0">
        {item.is_action_item ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium truncate",
          item.is_action_item && "text-green-700 dark:text-green-400"
        )}>
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground truncate">{item.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {!item.is_action_item && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={handleConvert}
                  disabled={convertToAction.isPending}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Make Action
                </Button>
              </TooltipTrigger>
              <TooltipContent>Convert to action item</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {item.is_action_item && (
          <span className="text-xs text-green-600 font-medium px-2">
            Action Item ✓
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => deleteItem.mutate(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
