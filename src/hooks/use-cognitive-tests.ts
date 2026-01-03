import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TestType = 'change_blindness' | 'focus_duration' | 'pattern_recognition' | 'memory_anchoring' | 'reaction_time';

export interface TestSession {
  id: string;
  user_id: string;
  test_type: TestType;
  score: number | null;
  duration_seconds: number | null;
  difficulty_level: number;
  correct_answers: number | null;
  total_questions: number | null;
  metadata: Record<string, unknown>;
  completed_at: string;
  created_at: string;
}

export interface CognitiveBaseline {
  id: string;
  user_id: string;
  test_type: TestType;
  baseline_score: number | null;
  baseline_date: string | null;
  current_best_score: number | null;
  current_best_date: string | null;
  improvement_percentage: number;
  total_sessions: number;
  average_score: number | null;
  last_session_date: string | null;
  streak_days: number;
  created_at: string;
  updated_at: string;
  // Extended fields stored in metadata for specific tests
  duration_seconds?: number;
  difficulty_level?: number;
}

export interface RecordTestResult {
  test_type: TestType;
  score: number;
  duration_seconds?: number;
  difficulty_level?: number;
  correct_answers?: number;
  total_questions?: number;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export function useCognitiveTests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all baselines for the user
  const { data: baselines, isLoading: baselinesLoading } = useQuery({
    queryKey: ['cognitive-baselines'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cognitive_baselines')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as CognitiveBaseline[];
    },
  });

  // Fetch recent test sessions
  const { data: recentSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['cognitive-sessions-recent'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cognitive_test_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as TestSession[];
    },
  });

  // Record a new test result
  const recordResult = useMutation({
    mutationFn: async (result: RecordTestResult) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert the test session
      const { error: sessionError } = await supabase
        .from('cognitive_test_sessions')
        .insert([{
          user_id: user.id,
          test_type: result.test_type,
          score: result.score,
          duration_seconds: result.duration_seconds,
          difficulty_level: result.difficulty_level || 1,
          correct_answers: result.correct_answers,
          total_questions: result.total_questions,
          metadata: (result.metadata || {}) as Record<string, string | number | boolean | null>,
        }]);

      if (sessionError) throw sessionError;

      // Update or create baseline
      const { data: existingBaseline } = await supabase
        .from('cognitive_baselines')
        .select('*')
        .eq('user_id', user.id)
        .eq('test_type', result.test_type)
        .maybeSingle();

      const now = new Date().toISOString();

      if (existingBaseline) {
        // Calculate new average
        const newTotalSessions = (existingBaseline.total_sessions || 0) + 1;
        const currentAvg = existingBaseline.average_score || result.score;
        const newAverage = ((currentAvg * (existingBaseline.total_sessions || 0)) + result.score) / newTotalSessions;

        // Check for new best
        const isBest = !existingBaseline.current_best_score || result.score > existingBaseline.current_best_score;
        
        // Calculate improvement from baseline
        const improvement = existingBaseline.baseline_score 
          ? ((result.score - existingBaseline.baseline_score) / existingBaseline.baseline_score) * 100
          : 0;

        // Calculate streak
        const lastSession = existingBaseline.last_session_date ? new Date(existingBaseline.last_session_date) : null;
        const today = new Date();
        const daysSinceLastSession = lastSession 
          ? Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        const newStreak = daysSinceLastSession <= 1 
          ? (existingBaseline.streak_days || 0) + (daysSinceLastSession === 1 ? 1 : 0)
          : 1;

        const { error: updateError } = await supabase
          .from('cognitive_baselines')
          .update({
            total_sessions: newTotalSessions,
            average_score: newAverage,
            current_best_score: isBest ? result.score : existingBaseline.current_best_score,
            current_best_date: isBest ? now : existingBaseline.current_best_date,
            improvement_percentage: improvement,
            last_session_date: now,
            streak_days: newStreak,
          })
          .eq('id', existingBaseline.id);

        if (updateError) throw updateError;
      } else {
        // Create new baseline
        const { error: insertError } = await supabase
          .from('cognitive_baselines')
          .insert({
            user_id: user.id,
            test_type: result.test_type,
            baseline_score: result.score,
            baseline_date: now,
            current_best_score: result.score,
            current_best_date: now,
            total_sessions: 1,
            average_score: result.score,
            last_session_date: now,
            streak_days: 1,
          });

        if (insertError) throw insertError;
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['cognitive-baselines'] });
      queryClient.invalidateQueries({ queryKey: ['cognitive-sessions-recent'] });
      toast({
        title: 'Test Complete!',
        description: `Score recorded: ${result.score.toFixed(1)}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving result',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get baseline for specific test type
  const getBaseline = (testType: TestType) => {
    return baselines?.find(b => b.test_type === testType);
  };

  // Get sessions for specific test type
  const getSessionsForTest = (testType: TestType) => {
    return recentSessions?.filter(s => s.test_type === testType) || [];
  };

  return {
    baselines,
    recentSessions,
    baselinesLoading,
    sessionsLoading,
    recordResult,
    getBaseline,
    getSessionsForTest,
  };
}
