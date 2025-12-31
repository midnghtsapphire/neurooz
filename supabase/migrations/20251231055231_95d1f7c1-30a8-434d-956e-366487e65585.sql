-- Create table to track user CO2 savings for leaderboard
CREATE TABLE public.user_co2_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  total_co2_saved NUMERIC NOT NULL DEFAULT 0,
  completed_tasks_count INTEGER NOT NULL DEFAULT 0,
  current_season TEXT DEFAULT 'spring',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_co2_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can view the leaderboard (public)
CREATE POLICY "Anyone can view CO2 leaderboard"
ON public.user_co2_stats
FOR SELECT
USING (true);

-- Users can insert their own stats
CREATE POLICY "Users can insert own CO2 stats"
ON public.user_co2_stats
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update own CO2 stats"
ON public.user_co2_stats
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_co2_stats_updated_at
BEFORE UPDATE ON public.user_co2_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_co2_stats;