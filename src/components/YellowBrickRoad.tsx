import { useState } from "react";
import { ActionItem } from "@/hooks/use-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Brain, Heart, Shield, AlertTriangle, Lock, Flower2, 
  Sparkles, MapPin, Castle, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateActionItem } from "@/hooks/use-projects";

interface YellowBrickRoadProps {
  actionItems: ActionItem[];
  allActionItems?: ActionItem[];
}

const TASK_TYPE_CONFIG = {
  scarecrow: {
    icon: Brain,
    label: "Scarecrow",
    description: "Planning & Strategy",
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    priority: 3,
  },
  tinman: {
    icon: Heart,
    label: "Tin Man", 
    description: "Passion Project",
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    priority: 2,
  },
  lion: {
    icon: Shield,
    label: "Lion",
    description: "Courage Required",
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    priority: 1,
  },
};

export function YellowBrickRoad({ actionItems, allActionItems = [] }: YellowBrickRoadProps) {
  const updateActionItem = useUpdateActionItem();
  
  // Sort by priority score (higher first), then by blocked status
  const sortedItems = [...actionItems].sort((a, b) => {
    // Blocked items go to the end
    const aBlocked = a.blocked_by ? 1 : 0;
    const bBlocked = b.blocked_by ? 1 : 0;
    if (aBlocked !== bBlocked) return aBlocked - bBlocked;
    
    // Then by priority score
    const aScore = a.priority_score || 50;
    const bScore = b.priority_score || 50;
    return bScore - aScore;
  });

  const completedCount = actionItems.filter(i => i.is_completed).length;
  const totalCount = actionItems.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getBlockingTask = (blockedBy: string | null) => {
    if (!blockedBy) return null;
    return allActionItems.find(i => i.id === blockedBy);
  };

  const toggleComplete = (item: ActionItem) => {
    updateActionItem.mutate({
      id: item.id,
      is_completed: !item.is_completed,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Emerald City Progress */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold">Yellow Brick Road</h2>
          </div>
          <div className="flex items-center gap-2">
            <Castle className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-medium">
              {completedCount}/{totalCount} to Emerald City
            </span>
          </div>
        </div>
        
        {/* Progress Road */}
        <div className="relative h-4 bg-yellow-200 dark:bg-yellow-900/50 rounded-full overflow-hidden border-2 border-yellow-400">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Brick pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)",
          }} />
        </div>

        {/* Garden along the road */}
        <div className="flex justify-between mt-2 px-2">
          {[...Array(Math.min(completedCount, 10))].map((_, i) => (
            <Flower2 
              key={i} 
              className="h-4 w-4 text-pink-400 animate-bounce"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-sm">
        {Object.entries(TASK_TYPE_CONFIG).map(([key, config]) => (
          <div key={key} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full", config.bg)}>
            <config.icon className={cn("h-4 w-4", config.color)} />
            <span className="font-medium">{config.label}</span>
            <span className="text-muted-foreground text-xs">({config.description})</span>
          </div>
        ))}
      </div>

      {/* Task Cards on the Road */}
      <div className="space-y-3">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Your Yellow Brick Road awaits!</p>
            <p className="text-sm">Add action items to start your journey to Oz</p>
          </div>
        ) : (
          sortedItems.map((item, index) => {
            const taskType = item.task_type || "lion";
            const config = TASK_TYPE_CONFIG[taskType as keyof typeof TASK_TYPE_CONFIG];
            const isBlocked = !!item.blocked_by;
            const blockingTask = getBlockingTask(item.blocked_by);
            const isSetback = item.is_setback;
            const Icon = config.icon;

            return (
              <div key={item.id} className="relative">
                {/* Connecting brick path */}
                {index > 0 && (
                  <div className="absolute -top-3 left-6 w-0.5 h-3 bg-yellow-400" />
                )}
                
                <Card 
                  className={cn(
                    "transition-all border-l-4",
                    item.is_completed && "opacity-60 bg-muted/30",
                    isBlocked && "opacity-70",
                    isSetback && "border-red-500 bg-red-50 dark:bg-red-900/20"
                  )}
                  style={{ 
                    borderLeftColor: isSetback ? undefined : 
                      isBlocked ? "#9ca3af" : "#facc15"
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <Checkbox
                        checked={item.is_completed}
                        onCheckedChange={() => toggleComplete(item)}
                        disabled={isBlocked && !item.is_completed}
                        className="mt-1"
                      />

                      {/* Task Type Icon */}
                      <div className={cn("p-2 rounded-lg", config.bg)}>
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={cn(
                            "font-medium",
                            item.is_completed && "line-through text-muted-foreground"
                          )}>
                            {item.title}
                          </h3>
                          
                          {isBlocked && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Lock className="h-3 w-3" />
                              Blocked
                            </Badge>
                          )}
                          
                          {isSetback && (
                            <Badge variant="destructive" className="text-xs gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Setback
                            </Badge>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        {isBlocked && blockingTask && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            Waiting on: <span className="font-medium">{blockingTask.title}</span>
                          </p>
                        )}

                        {isSetback && item.setback_reason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                            ⚠️ {item.setback_reason}
                          </p>
                        )}
                      </div>

                      {/* Priority indicator */}
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Emerald City destination */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="text-center py-8 bg-gradient-to-b from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-900/10 rounded-xl border-2 border-emerald-300">
          <Castle className="h-16 w-16 mx-auto mb-4 text-emerald-500" />
          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            Welcome to the Emerald City!
          </h3>
          <p className="text-emerald-600 dark:text-emerald-500">
            You had the power all along! 🌟
          </p>
        </div>
      )}
    </div>
  );
}
