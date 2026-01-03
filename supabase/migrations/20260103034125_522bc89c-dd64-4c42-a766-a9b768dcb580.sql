-- Create table for tracking individual cognitive test sessions
CREATE TABLE public.cognitive_test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_type TEXT NOT NULL, -- 'change_blindness', 'focus_duration', 'pattern_recognition', 'memory_anchoring', 'reaction_time'
  score NUMERIC,
  duration_seconds INTEGER,
  difficulty_level INTEGER DEFAULT 1,
  correct_answers INTEGER,
  total_questions INTEGER,
  metadata JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking cognitive baselines and progress summaries
CREATE TABLE public.cognitive_baselines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_type TEXT NOT NULL,
  baseline_score NUMERIC,
  baseline_date TIMESTAMP WITH TIME ZONE,
  current_best_score NUMERIC,
  current_best_date TIMESTAMP WITH TIME ZONE,
  improvement_percentage NUMERIC DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  average_score NUMERIC,
  last_session_date TIMESTAMP WITH TIME ZONE,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_type)
);

-- Enable RLS
ALTER TABLE public.cognitive_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_baselines ENABLE ROW LEVEL SECURITY;

-- RLS policies for cognitive_test_sessions
CREATE POLICY "Users can view own test sessions" ON public.cognitive_test_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test sessions" ON public.cognitive_test_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for cognitive_baselines
CREATE POLICY "Users can view own baselines" ON public.cognitive_baselines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own baselines" ON public.cognitive_baselines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own baselines" ON public.cognitive_baselines
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_cognitive_baselines_updated_at
  BEFORE UPDATE ON public.cognitive_baselines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_cognitive_test_sessions_user_type ON public.cognitive_test_sessions(user_id, test_type);
CREATE INDEX idx_cognitive_test_sessions_completed ON public.cognitive_test_sessions(completed_at DESC);
CREATE INDEX idx_cognitive_baselines_user ON public.cognitive_baselines(user_id);