import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  FolderKanban, 
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useProjects, useActionItems } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";

export function ProjectsQuickCard() {
  const navigate = useNavigate();
  const { data: projects = [] } = useProjects();
  const { data: actionItems = [] } = useActionItems();

  const activeProjects = projects.filter(p => !p.is_completed);
  const completedTasks = actionItems.filter(a => a.is_completed).length;
  const totalTasks = actionItems.length;
  const overdueTasks = actionItems.filter(a => 
    !a.is_completed && a.due_date && new Date(a.due_date) < new Date()
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get top 3 projects by most recent activity
  const topProjects = activeProjects.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="overflow-hidden border-2 border-accent/20 shadow-soft hover:shadow-medium transition-all group">
        <div className="relative h-20 bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/10">
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">Projects</h3>
                <p className="text-sm text-muted-foreground">{activeProjects.length} active</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              className="gap-1"
              onClick={() => navigate("/projects")}
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">{completedTasks} done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">{totalTasks - completedTasks} pending</span>
            </div>
            {overdueTasks > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-destructive">{overdueTasks} overdue</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          {/* Project List */}
          {topProjects.length > 0 ? (
            <div className="space-y-2">
              {topProjects.map((project) => {
                const projectTasks = actionItems.filter(a => a.project_id === project.id);
                const projectCompleted = projectTasks.filter(a => a.is_completed).length;
                const projectTotal = projectTasks.length;

                return (
                  <div 
                    key={project.id}
                    onClick={() => navigate("/projects")}
                    className={cn(
                      "p-3 rounded-lg border border-border/50 bg-muted/30",
                      "hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer",
                      "flex items-center justify-between"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color || 'hsl(var(--accent))' }}
                      />
                      <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                        {project.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {projectCompleted}/{projectTotal}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No active projects. Start one!
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full gap-2 group-hover:border-accent group-hover:text-accent"
            onClick={() => navigate("/projects")}
          >
            View All Projects
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ProjectsQuickCard;
