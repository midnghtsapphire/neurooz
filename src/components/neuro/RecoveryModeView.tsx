import { useState } from "react";
import { ActionItem, useUpdateActionItem } from "@/hooks/use-projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronRight, Sparkles, Moon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecoveryModeViewProps {
  actionItems: ActionItem[];
}

export function RecoveryModeView({ actionItems }: RecoveryModeViewProps) {
  const updateActionItem = useUpdateActionItem();
  const [showCelebration, setShowCelebration] = useState(false);

  // Get the single most important uncompleted task
  const incompleteTasks = actionItems
    .filter((item) => !item.is_completed && !item.blocked_by)
    .sort((a, b) => (b.priority_score || 50) - (a.priority_score || 50));

  const nextTask = incompleteTasks[0];
  const completedToday = actionItems.filter((i) => i.is_completed).length;
  const remainingCount = incompleteTasks.length;

  const handleComplete = async () => {
    if (!nextTask) return;
    
    await updateActionItem.mutateAsync({
      id: nextTask.id,
      is_completed: true,
    });
    
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  // All done state
  if (!nextTask) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="relative inline-block mb-6">
          <Moon className="h-20 w-20 text-indigo-400 mx-auto" />
          <Sparkles className="h-8 w-8 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">
          Nothing more right now.
        </h2>
        <p className="text-muted-foreground text-lg mb-6">
          You completed {completedToday} task{completedToday !== 1 ? "s" : ""} today.
          <br />
          <span className="text-base">Rest is productive too.</span>
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300">
          <Heart className="h-4 w-4" />
          <span className="text-sm font-medium">You're doing enough.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Header - Ultra minimal */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400 text-sm font-medium mb-4">
          <Heart className="h-4 w-4" />
          Recovery Mode
        </div>
        <h2 className="text-xl font-medium text-muted-foreground">
          Just one thing.
        </h2>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-scale-in">
            <CheckCircle2 className="h-24 w-24 text-emerald-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-emerald-600">Done! 🌟</p>
          </div>
        </div>
      )}

      {/* The ONE task */}
      <Card className="border-2 border-rose-200 dark:border-rose-800 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={false}
              onCheckedChange={handleComplete}
              className="h-6 w-6 mt-1 rounded-full border-2"
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {nextTask.title}
              </h3>
              
              {nextTask.description && (
                <p className="text-muted-foreground mb-4">
                  {nextTask.description}
                </p>
              )}
              
              <Button 
                onClick={handleComplete}
                className="w-full gap-2 h-12 text-base"
                disabled={updateActionItem.isPending}
              >
                <CheckCircle2 className="h-5 w-5" />
                Mark as Done
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimal context - no pressure */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {remainingCount > 1 ? (
            <span className="flex items-center justify-center gap-1">
              {remainingCount - 1} more after this
              <ChevronRight className="h-4 w-4" />
            </span>
          ) : (
            <span>This is your last one for now.</span>
          )}
        </p>
        
        {completedToday > 0 && (
          <Badge variant="secondary" className="mt-3 gap-1">
            <Sparkles className="h-3 w-3" />
            {completedToday} done today
          </Badge>
        )}
      </div>
    </div>
  );
}
