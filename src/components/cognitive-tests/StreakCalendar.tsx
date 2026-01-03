import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { useCognitiveTests } from '@/hooks/use-cognitive-tests';

export function StreakCalendar() {
  const { recentSessions, baselines } = useCognitiveTests();

  const calendarData = useMemo(() => {
    const today = new Date();
    const days: { date: Date; completed: boolean; count: number }[] = [];
    
    // Build last 35 days (5 weeks)
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayStr = date.toDateString();
      const sessionsOnDay = recentSessions?.filter(s => {
        const sessionDate = new Date(s.completed_at);
        return sessionDate.toDateString() === dayStr;
      }) || [];
      
      days.push({
        date,
        completed: sessionsOnDay.length > 0,
        count: sessionsOnDay.length
      });
    }
    
    return days;
  }, [recentSessions]);

  const streakStats = useMemo(() => {
    if (!baselines?.length) return { current: 0, record: 0 };
    
    const maxStreak = Math.max(...baselines.map(b => b.streak_days || 0));
    
    // Calculate current streak from calendar data
    let currentStreak = 0;
    for (let i = calendarData.length - 1; i >= 0; i--) {
      if (calendarData[i].completed) {
        currentStreak++;
      } else if (i < calendarData.length - 1) {
        // Allow today to be incomplete
        break;
      }
    }
    
    return { current: currentStreak, record: maxStreak };
  }, [baselines, calendarData]);

  const completedDays = calendarData.filter(d => d.completed).length;
  const weekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Training Streak
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            {streakStats.current} day{streakStats.current !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Big Streak Display */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="relative">
              <motion.div
                className="text-5xl font-black text-primary"
                animate={{ scale: streakStats.current > 0 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                {streakStats.current}
              </motion.div>
              {streakStats.current >= 3 && (
                <motion.div
                  className="absolute -top-1 -right-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                >
                  <Flame className="h-6 w-6 text-orange-500" />
                </motion.div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current Streak</p>
          </motion.div>
          
          <div className="h-12 w-px bg-border" />
          
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold">{streakStats.record}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Record Streak</p>
          </div>
        </div>

        {/* Week Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekLabels.map((label, i) => (
            <div key={i} className="text-center text-[10px] text-muted-foreground font-medium">
              {label}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => {
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`
                  aspect-square rounded-md flex items-center justify-center text-xs font-medium
                  transition-all cursor-default relative
                  ${day.completed 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted/50 text-muted-foreground'
                  }
                  ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                `}
                title={`${day.date.toLocaleDateString()}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
              >
                {day.date.getDate()}
                {day.count > 1 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full text-[8px] flex items-center justify-center text-accent-foreground font-bold">
                    {day.count}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>{completedDays} active days this month</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-primary" />
            = Training day
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
