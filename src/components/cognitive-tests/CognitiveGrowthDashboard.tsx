import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChartLine, 
  Download,
  Eye,
  Zap,
  BrainCircuit,
  Focus,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCognitiveTests, TestType } from '@/hooks/use-cognitive-tests';
import {
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { StreakCalendar } from './StreakCalendar';
import { ImpactStatsCards } from './ImpactStatsCards';

const TEST_INFO: Record<TestType, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  change_blindness: { label: 'Awareness', icon: Eye, description: 'Visual attention' },
  focus_duration: { label: 'Focus', icon: Focus, description: 'Sustained attention' },
  pattern_recognition: { label: 'Patterns', icon: Target, description: 'Logical reasoning' },
  memory_anchoring: { label: 'Memory', icon: BrainCircuit, description: 'Working memory' },
  reaction_time: { label: 'Reaction', icon: Zap, description: 'Processing speed' },
};

export function CognitiveGrowthDashboard() {
  const { baselines, recentSessions, baselinesLoading } = useCognitiveTests();

  const overallStats = useMemo(() => {
    if (!baselines?.length) return null;

    const totalSessions = baselines.reduce((sum, b) => sum + (b.total_sessions || 0), 0);
    const avgImprovement = baselines.reduce((sum, b) => sum + (b.improvement_percentage || 0), 0) / baselines.length;
    const maxStreak = Math.max(...baselines.map(b => b.streak_days || 0));
    const testsCompleted = baselines.length;

    return { totalSessions, avgImprovement, maxStreak, testsCompleted };
  }, [baselines]);

  const chartData = useMemo(() => {
    if (!recentSessions?.length) return [];

    // Group sessions by date
    const byDate: Record<string, Record<string, number[]>> = {};
    
    recentSessions.forEach(session => {
      const date = new Date(session.completed_at).toLocaleDateString();
      if (!byDate[date]) byDate[date] = {};
      if (!byDate[date][session.test_type]) byDate[date][session.test_type] = [];
      if (session.score !== null) {
        byDate[date][session.test_type].push(session.score);
      }
    });

    // Convert to chart format with averages
    return Object.entries(byDate)
      .map(([date, tests]) => {
        const entry: Record<string, string | number> = { date };
        Object.entries(tests).forEach(([type, scores]) => {
          entry[type] = scores.reduce((a, b) => a + b, 0) / scores.length;
        });
        return entry;
      })
      .reverse()
      .slice(-14); // Last 14 days
  }, [recentSessions]);

  const handleExportReport = () => {
    if (!baselines?.length) return;

    const report = {
      generatedAt: new Date().toISOString(),
      summary: overallStats,
      baselines: baselines.map(b => ({
        test: TEST_INFO[b.test_type as TestType]?.label || b.test_type,
        baseline: b.baseline_score,
        currentBest: b.current_best_score,
        improvement: `${b.improvement_percentage?.toFixed(1)}%`,
        totalSessions: b.total_sessions,
        streak: b.streak_days,
      })),
      recentSessions: recentSessions?.slice(0, 20).map(s => ({
        date: new Date(s.completed_at).toLocaleString(),
        test: TEST_INFO[s.test_type as TestType]?.label || s.test_type,
        score: s.score,
        duration: s.duration_seconds,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognitive-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (baselinesLoading) {
    return (
      <Card className="border-accent/30">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading your cognitive data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streak Calendar - Featured at top */}
      <StreakCalendar />
      
      {/* Impact Stats Cards */}
      <ImpactStatsCards />

      {/* Individual Test Progress */}
      <Card className="border-accent/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" />
              Test Progress
            </CardTitle>
            <CardDescription>Your improvement in each cognitive area</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(TEST_INFO) as TestType[]).map((testType) => {
            const baseline = baselines?.find(b => b.test_type === testType);
            const info = TEST_INFO[testType];
            const Icon = info.icon;

            return (
              <motion.div
                key={testType}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{info.label}</span>
                    <span className="text-xs text-muted-foreground">({info.description})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {baseline ? (
                      <>
                        <Badge variant="outline" className="text-xs">
                          {baseline.total_sessions} sessions
                        </Badge>
                        {baseline.improvement_percentage > 0 && (
                          <Badge className="bg-green-500/20 text-green-600 text-xs">
                            +{baseline.improvement_percentage.toFixed(0)}%
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Not started</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={baseline?.average_score || 0} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs font-mono w-12 text-right">
                    {baseline?.average_score?.toFixed(0) || 0}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Trend Chart */}
      {chartData.length > 1 && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>14-Day Trend</CardTitle>
            <CardDescription>Your cognitive performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="pattern_recognition"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                    name="Patterns"
                  />
                  <Area
                    type="monotone"
                    dataKey="memory_anchoring"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent) / 0.2)"
                    strokeWidth={2}
                    name="Memory"
                  />
                  <Area
                    type="monotone"
                    dataKey="reaction_time"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3) / 0.2)"
                    strokeWidth={2}
                    name="Reaction"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
