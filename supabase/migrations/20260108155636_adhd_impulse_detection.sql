-- ADHD Impulse Detection and 24-Hour Hold Feature
-- Based on SnapWealth ADHD FinTech Blue Ocean Strategy

-- ============================================================================
-- 1. ADHD User Profile Extensions
-- ============================================================================

-- Add ADHD-specific fields to user profiles
CREATE TABLE IF NOT EXISTS public.adhd_user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- ADHD diagnosis and preferences
  adhd_diagnosis BOOLEAN DEFAULT false,
  adhd_type TEXT CHECK (adhd_type IN ('inattentive', 'hyperactive', 'combined', 'not_diagnosed')),
  medication_tracking_enabled BOOLEAN DEFAULT false,
  medication_name TEXT,
  medication_dosage TEXT,
  typical_medication_time TIME,
  
  -- Dopamine preferences
  dopamine_preferences JSONB DEFAULT '{"reward_frequency": "variable", "surprise_rewards": true, "micro_rewards": true}'::jsonb,
  
  -- Communication style
  communication_style TEXT CHECK (communication_style IN ('direct', 'encouraging', 'detailed', 'minimal')) DEFAULT 'encouraging',
  
  -- Impulse control settings
  impulse_detection_enabled BOOLEAN DEFAULT true,
  impulse_hold_duration_hours INTEGER DEFAULT 24,
  impulse_confidence_threshold NUMERIC DEFAULT 0.7,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_adhd_profiles_user_id ON public.adhd_user_profiles(user_id);

-- ============================================================================
-- 2. Medication Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Medication details
  medication_name TEXT,
  dosage TEXT,
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Effectiveness tracking
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medication_logs_user_taken ON public.medication_logs(user_id, taken_at DESC);

-- ============================================================================
-- 3. Transactions Table (ADHD-Enhanced)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.adhd_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction basics
  amount NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  merchant_name TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- ADHD-specific fields
  is_impulse_purchase BOOLEAN DEFAULT false,
  impulse_confidence_score NUMERIC CHECK (impulse_confidence_score BETWEEN 0 AND 1),
  was_on_medication BOOLEAN DEFAULT false,
  time_since_medication_minutes INTEGER,
  emotional_state TEXT CHECK (emotional_state IN ('calm', 'excited', 'stressed', 'overwhelmed', 'hyperfocus', 'unknown')),
  hyperfocus_indicator BOOLEAN DEFAULT false,
  
  -- ML feature data for impulse detection
  time_of_day TIME,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  category_risk_score NUMERIC,
  amount_vs_baseline NUMERIC,
  velocity_score NUMERIC,
  merchant_novelty_score NUMERIC,
  
  -- Hold status
  is_on_hold BOOLEAN DEFAULT false,
  hold_until TIMESTAMP WITH TIME ZONE,
  hold_reason TEXT,
  hold_overridden BOOLEAN DEFAULT false,
  hold_override_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adhd_transactions_user_date ON public.adhd_transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_adhd_transactions_hold ON public.adhd_transactions(user_id, is_on_hold, hold_until);
CREATE INDEX IF NOT EXISTS idx_adhd_transactions_impulse ON public.adhd_transactions(user_id, is_impulse_purchase);

-- ============================================================================
-- 4. Impulse Holds Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.impulse_holds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.adhd_transactions(id) ON DELETE CASCADE,
  
  -- Hold details
  hold_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hold_end TIMESTAMP WITH TIME ZONE NOT NULL,
  hold_duration_hours INTEGER DEFAULT 24,
  
  -- Status
  status TEXT CHECK (status IN ('active', 'completed', 'overridden', 'cancelled')) DEFAULT 'active',
  override_reason TEXT,
  override_at TIMESTAMP WITH TIME ZONE,
  
  -- Character interactions
  bad_witch_warning_shown BOOLEAN DEFAULT false,
  scarecrow_guidance_shown BOOLEAN DEFAULT false,
  user_reflection_notes TEXT,
  
  -- Outcome
  final_decision TEXT CHECK (final_decision IN ('proceeded', 'cancelled', 'modified', 'pending')),
  amount_saved NUMERIC,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_impulse_holds_user_status ON public.impulse_holds(user_id, status);
CREATE INDEX IF NOT EXISTS idx_impulse_holds_active ON public.impulse_holds(user_id, status, hold_end) WHERE status = 'active';

-- ============================================================================
-- 5. Spending Patterns (ML-Identified)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.spending_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Pattern details
  pattern_type TEXT CHECK (pattern_type IN ('impulse_trigger', 'medication_correlation', 'time_of_day', 'emotional_state', 'hyperfocus_spending')),
  pattern_data JSONB NOT NULL,
  confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 1),
  
  -- Insights
  description TEXT,
  recommendation TEXT,
  
  -- Timestamps
  identified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spending_patterns_user_type ON public.spending_patterns(user_id, pattern_type);

-- ============================================================================
-- 6. Medication-Spending Correlation
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.medication_spending_correlation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time window
  analysis_period_start DATE NOT NULL,
  analysis_period_end DATE NOT NULL,
  
  -- Correlation data
  avg_spending_on_medication NUMERIC,
  avg_spending_off_medication NUMERIC,
  correlation_coefficient NUMERIC,
  statistical_significance NUMERIC,
  
  -- Insights
  spending_reduction_percentage NUMERIC,
  optimal_medication_window_hours INTEGER,
  insights JSONB,
  
  -- Timestamps
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_med_correlation_user ON public.medication_spending_correlation(user_id, analysis_period_end DESC);

-- ============================================================================
-- 7. Dopamine Rewards Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dopamine_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Reward details
  reward_type TEXT CHECK (reward_type IN ('micro', 'milestone', 'surprise', 'streak', 'achievement')) NOT NULL,
  reward_trigger TEXT,
  reward_message TEXT,
  character_involved TEXT CHECK (character_involved IN ('oz', 'dorothy', 'scarecrow', 'tinman', 'lion', 'glinda', 'bad_witch', 'toto', 'tornado')),
  
  -- Reward value (for gamification)
  points_awarded INTEGER DEFAULT 0,
  
  -- User engagement
  was_viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP WITH TIME ZONE,
  user_reaction TEXT CHECK (user_reaction IN ('positive', 'neutral', 'negative', 'skipped')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dopamine_rewards_user ON public.dopamine_rewards(user_id, created_at DESC);

-- ============================================================================
-- 8. Functions and Triggers
-- ============================================================================

-- Function to check if user took medication recently
CREATE OR REPLACE FUNCTION public.check_recent_medication(p_user_id UUID, p_hours INTEGER DEFAULT 4)
RETURNS BOOLEAN AS $$
DECLARE
  recent_med TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT taken_at INTO recent_med
  FROM public.medication_logs
  WHERE user_id = p_user_id
  ORDER BY taken_at DESC
  LIMIT 1;
  
  IF recent_med IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN (NOW() - recent_med) <= (p_hours || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to calculate impulse confidence score
CREATE OR REPLACE FUNCTION public.calculate_impulse_score(
  p_amount NUMERIC,
  p_category TEXT,
  p_time_of_day TIME,
  p_merchant_novelty NUMERIC,
  p_velocity_score NUMERIC
)
RETURNS NUMERIC AS $$
DECLARE
  score NUMERIC := 0;
BEGIN
  -- Simple scoring algorithm (can be replaced with ML model)
  
  -- High amount increases score
  IF p_amount > 100 THEN
    score := score + 0.2;
  END IF;
  IF p_amount > 500 THEN
    score := score + 0.2;
  END IF;
  
  -- High-risk categories
  IF p_category IN ('shopping', 'entertainment', 'electronics', 'hobbies') THEN
    score := score + 0.2;
  END IF;
  
  -- Late night purchases
  IF EXTRACT(HOUR FROM p_time_of_day) >= 22 OR EXTRACT(HOUR FROM p_time_of_day) <= 6 THEN
    score := score + 0.15;
  END IF;
  
  -- New merchant
  IF p_merchant_novelty > 0.7 THEN
    score := score + 0.15;
  END IF;
  
  -- High velocity (multiple purchases quickly)
  IF p_velocity_score > 0.7 THEN
    score := score + 0.1;
  END IF;
  
  RETURN LEAST(score, 1.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply update trigger to relevant tables
DROP TRIGGER IF EXISTS update_adhd_profiles_updated_at ON public.adhd_user_profiles;
CREATE TRIGGER update_adhd_profiles_updated_at
  BEFORE UPDATE ON public.adhd_user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_adhd_transactions_updated_at ON public.adhd_transactions;
CREATE TRIGGER update_adhd_transactions_updated_at
  BEFORE UPDATE ON public.adhd_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_impulse_holds_updated_at ON public.impulse_holds;
CREATE TRIGGER update_impulse_holds_updated_at
  BEFORE UPDATE ON public.impulse_holds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 9. Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.adhd_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhd_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impulse_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_spending_correlation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dopamine_rewards ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own ADHD profile" ON public.adhd_user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own ADHD profile" ON public.adhd_user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ADHD profile" ON public.adhd_user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own medication logs" ON public.medication_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medication logs" ON public.medication_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.adhd_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.adhd_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.adhd_transactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own impulse holds" ON public.impulse_holds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own impulse holds" ON public.impulse_holds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own impulse holds" ON public.impulse_holds FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own spending patterns" ON public.spending_patterns FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own med correlation" ON public.medication_spending_correlation FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rewards" ON public.dopamine_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own rewards" ON public.dopamine_rewards FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 10. Sample Data for Testing (Optional)
-- ============================================================================

-- This will be populated by the application
