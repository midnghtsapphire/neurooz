import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target,
  Clock,
  Award
} from 'lucide-react';
import { useCognitiveTests } from '@/hooks/use-cognitive-tests';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sublabel?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon, value, label, sublabel, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className={`border-2 ${color} overflow-hidden group hover:shadow-lg transition-all`}>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-xl bg-muted group-hover:scale-110 transition-transform">
              {icon}
            </div>
          </div>
          <motion.div 
            className="text-4xl font-black tracking-tight"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.div>
          <p className="text-sm font-medium text-foreground mt-1">{label}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ImpactStatsCards() {
  const { baselines, recentSessions } = useCognitiveTests();

  const stats = useMemo(() => {
    const totalSessions = baselines?.reduce((sum, b) => sum + (b.total_sessions || 0), 0) || 0;
    const avgImprovement = baselines?.length 
      ? baselines.reduce((sum, b) => sum + (b.improvement_percentage || 0), 0) / baselines.length 
      : 0;
    
    // Calculate total training time
    const totalMinutes = recentSessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
    const hours = Math.floor(totalMinutes / 3600);
    const minutes = Math.floor((totalMinutes % 3600) / 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    // Best score across all tests
    const bestScore = baselines?.reduce((best, b) => 
      Math.max(best, b.current_best_score || 0), 0
    ) || 0;
    
    // Fastest reaction (for reaction time test)
    const reactionBaseline = baselines?.find(b => b.test_type === 'reaction_time');
    const fastestReaction = reactionBaseline?.current_best_score;
    
    // Tests mastered (avg > 80%)
    const masteredTests = baselines?.filter(b => (b.average_score || 0) >= 80).length || 0;
    
    return {
      totalSessions,
      avgImprovement,
      timeStr,
      bestScore,
      fastestReaction,
      masteredTests,
      totalTests: baselines?.length || 0
    };
  }, [baselines, recentSessions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Your Impact</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Brain className="h-5 w-5 text-violet-500" />}
          value={stats.totalSessions}
          label="Total Sessions"
          sublabel="Brain workouts completed"
          color="border-violet-500/30 hover:border-violet-500/50"
          delay={0}
        />
        
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          value={`+${stats.avgImprovement.toFixed(0)}%`}
          label="Improvement"
          sublabel="Avg across all tests"
          color="border-emerald-500/30 hover:border-emerald-500/50"
          delay={0.1}
        />
        
        <StatCard
          icon={<Clock className="h-5 w-5 text-sky-500" />}
          value={stats.timeStr}
          label="Time Invested"
          sublabel="Total training time"
          color="border-sky-500/30 hover:border-sky-500/50"
          delay={0.2}
        />
        
        <StatCard
          icon={<Target className="h-5 w-5 text-amber-500" />}
          value={`${stats.masteredTests}/${stats.totalTests}`}
          label="Tests Mastered"
          sublabel="Scored 80%+ average"
          color="border-amber-500/30 hover:border-amber-500/50"
          delay={0.3}
        />
      </div>

      {stats.bestScore > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Personal Best</p>
                    <p className="text-xs text-muted-foreground">Your highest score ever</p>
                  </div>
                </div>
                <div className="text-3xl font-black text-primary">
                  {stats.bestScore.toFixed(0)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
