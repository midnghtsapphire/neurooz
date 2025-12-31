import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Cpu, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function RAMMonitor() {
  const load = useCognitiveLoad();
  
  const getStatusColor = () => {
    switch (load.status) {
      case 'overload': return 'text-red-500';
      case 'critical': return 'text-orange-500';
      case 'elevated': return 'text-yellow-500';
      default: return 'text-emerald-500';
    }
  };
  
  const getProgressColor = (value: number) => {
    if (value >= 70) return 'bg-red-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 to-background">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-emerald-400" />
          Cognitive RAM
          {load.totoAlert && (
            <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main RAM Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">System Load</span>
            <span className={cn("font-mono font-bold", getStatusColor())}>
              {Math.round(load.ramUsage)}%
            </span>
          </div>
          <div className="relative h-4 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                getProgressColor(load.ramUsage)
              )}
              style={{ width: `${load.ramUsage}%` }}
            />
            {load.status === 'overload' && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Status Message */}
        <p className={cn("text-sm font-medium", getStatusColor())}>
          {load.statusMessage}
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Cpu className="h-3 w-3" />
            <span>{load.openProjects} open projects</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>{load.openTasks} active quests</span>
          </div>
          {load.overdueTasks > 0 && (
            <div className="flex items-center gap-1 text-amber-400 col-span-2">
              <AlertTriangle className="h-3 w-3" />
              <span>{load.overdueTasks} overdue</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
