import { Link } from "react-router-dom";
import { useTasks } from "@/hooks/use-tasks";
import { useRoutines } from "@/hooks/use-routines";
import { useRoutineCompletionsToday } from "@/hooks/use-routines";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ListTodo, Calendar, Repeat, ArrowRight, Loader2, Star, Zap, Trophy } from "lucide-react";
import { BrainDumpDialog } from "@/components/BrainDumpDialog";
import { Gamification } from "@/types/brainDump.types";
import { calculateLevel, levelProgress } from "@/utils/gamificationCalculator";

function useGamification() {
  return useQuery({
    queryKey: ["gamification"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("gamification")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data as unknown as Gamification | null;
    },
  });
}

export default function TaskDashboard() {
  const { data: shortListTasks } = useTasks('short_list');
  const { data: longListTasks } = useTasks('long_list');
  const { data: calendarTasks } = useTasks('calendar');
  const { data: routines } = useRoutines();
  const { data: completionsToday } = useRoutineCompletionsToday();
  const { data: gamification } = useGamification();

  const shortListPending = shortListTasks?.filter(t => t.status !== 'completed').length || 0;
  const shortListCompleted = shortListTasks?.filter(t => t.status === 'completed').length || 0;

  const totalRoutines = routines?.length ?? 0;
  const completedRoutinesCount = completionsToday
    ? new Set(completionsToday.map(c => c.routine_id)).size
    : 0;

  const totalPoints = gamification?.total_points ?? 0;
  const currentStreak = gamification?.current_streak ?? 0;
  const { currentLevel, progressPercentage, pointsNeededForNext } = levelProgress(totalPoints);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🎯 Task Management Hub</h1>
        <p className="text-muted-foreground">
          The 4-List System designed for ADHD brains. Clear, focused, and guilt-free.
        </p>
      </div>

      {/* Brain Dump CTA */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🌪️ Feeling Overwhelmed?</h2>
            <p className="text-muted-foreground mb-4">
              Dump everything in your head. AI will organize it into actionable tasks.
            </p>
          </div>
          <BrainDumpDialog />
        </div>
      </Card>

      {/* Gamification Stats */}
      <Card className="p-5 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Your Progress
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">Lvl {currentLevel}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level {currentLevel}</span>
            <span>Level {currentLevel + 1}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progressPercentage)}% to next level
          </p>
        </div>
      </Card>

      {/* The 4 Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Short List */}
        <Link to="/tasks/today">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <ListTodo className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Short List</h3>
                  <p className="text-sm text-muted-foreground">Today's 1-5 tasks</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold text-emerald-600">{shortListPending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-400">{shortListCompleted}</p>
                <p className="text-xs text-muted-foreground">Done Today</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Your sacred focus zone. Maximum 5 tasks.
            </p>
          </Card>
        </Link>

        {/* Calendar */}
        <Link to="/tasks/calendar">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Calendar</h3>
                  <p className="text-sm text-muted-foreground">Scheduled events</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{calendarTasks?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Time-specific tasks with Google Calendar sync.
            </p>
          </Card>
        </Link>

        {/* Long List */}
        <Link to="/tasks/someday">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Long List</h3>
                  <p className="text-sm text-muted-foreground">Someday/Maybe</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">{longListTasks?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Waiting</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Unlimited parking lot. No guilt, no pressure.
            </p>
          </Card>
        </Link>

        {/* Routines */}
        <Link to="/tasks/routines">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Repeat className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Routines</h3>
                  <p className="text-sm text-muted-foreground">Daily checklists</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">{completedRoutinesCount}/{totalRoutines}</p>
              <p className="text-xs text-muted-foreground">Done Today</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Morning & evening checklists for consistency.
            </p>
          </Card>
        </Link>
      </div>

      {/* How it works */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-4 text-lg">🧠 How the 4-List System Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">📋 Short List (1-5 tasks)</h4>
            <p className="text-muted-foreground">
              Your ONLY focus for today. Maximum 5 tasks. This is sacred. Complete these and you're done!
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">📅 Calendar (time-specific)</h4>
            <p className="text-muted-foreground">
              Appointments, meetings, and time-blocked work. Syncs with Google Calendar automatically.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">📚 Long List (unlimited)</h4>
            <p className="text-muted-foreground">
              Your "someday/maybe" parking lot. Add anything here guilt-free. Review weekly.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">🔄 Routines (checklists)</h4>
            <p className="text-muted-foreground">
              Morning and evening routines. Build consistency without thinking.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
