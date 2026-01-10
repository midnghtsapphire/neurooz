-- Dopamine Optimization Engine
-- Variable reward scheduling, achievements, streaks, and celebrations for ADHD engagement

-- User rewards tracking
CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL, -- 'micro', 'milestone', 'surprise', 'streak'
    reward_name TEXT NOT NULL,
    reward_description TEXT,
    points_earned INTEGER DEFAULT 0,
    character TEXT, -- 'oz', 'dorothy', 'scarecrow', 'tin_man', 'lion', 'glinda', 'toto', 'tornado', 'bad_witch'
    trigger_action TEXT, -- what action triggered this reward
    is_surprise BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User streaks
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_type TEXT NOT NULL, -- 'daily_login', 'medication', 'impulse_control', 'budget_check'
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, streak_type)
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    achievement_tier TEXT, -- 'bronze', 'silver', 'gold', 'emerald'
    points_value INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    character TEXT, -- which character presents this achievement
    UNIQUE(user_id, achievement_id)
);

-- User points and levels
CREATE TABLE IF NOT EXISTS user_gamification (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    level_name TEXT DEFAULT 'Munchkin Traveler',
    next_level_points INTEGER DEFAULT 100,
    actions_since_last_reward INTEGER DEFAULT 0,
    last_reward_at TIMESTAMP WITH TIME ZONE,
    surprise_reward_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward scheduling (for variable reward algorithm)
CREATE TABLE IF NOT EXISTS reward_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    next_micro_reward_at_action INTEGER, -- trigger after X actions
    next_surprise_check_at_action INTEGER,
    last_micro_reward_action INTEGER DEFAULT 0,
    last_surprise_reward_action INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Achievement definitions (predefined achievements)
CREATE TABLE IF NOT EXISTS achievement_definitions (
    achievement_id TEXT PRIMARY KEY,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    achievement_tier TEXT,
    points_value INTEGER DEFAULT 0,
    character TEXT,
    trigger_condition TEXT, -- JSON describing unlock condition
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert predefined achievements
INSERT INTO achievement_definitions (achievement_id, achievement_name, achievement_description, achievement_tier, points_value, character, trigger_condition) VALUES
('first_impulse_hold', 'First Hold', 'You held your first impulse purchase for 24 hours!', 'bronze', 50, 'bad_witch', '{"type": "impulse_hold_count", "value": 1}'),
('impulse_master', 'Impulse Master', 'Held 10 impulse purchases successfully', 'silver', 200, 'scarecrow', '{"type": "impulse_hold_count", "value": 10}'),
('impulse_legend', 'Impulse Legend', 'Held 50 impulse purchases - you''re a legend!', 'gold', 500, 'oz', '{"type": "impulse_hold_count", "value": 50}'),
('medication_week', 'Week of Wellness', 'Logged medication for 7 days straight', 'bronze', 100, 'tin_man', '{"type": "medication_streak", "value": 7}'),
('medication_month', 'Monthly Mindfulness', 'Logged medication for 30 days straight', 'silver', 300, 'tin_man', '{"type": "medication_streak", "value": 30}'),
('medication_master', 'Medication Master', 'Logged medication for 90 days straight', 'gold', 1000, 'glinda', '{"type": "medication_streak", "value": 90}'),
('first_login', 'Welcome to Oz', 'Completed your first day in Neurooz', 'bronze', 25, 'dorothy', '{"type": "login_count", "value": 1}'),
('week_warrior', 'Week Warrior', 'Logged in for 7 days straight', 'silver', 150, 'lion', '{"type": "login_streak", "value": 7}'),
('emerald_citizen', 'Emerald Citizen', 'Logged in for 30 days straight', 'gold', 500, 'oz', '{"type": "login_streak", "value": 30}'),
('budget_boss', 'Budget Boss', 'Stayed under budget for an entire month', 'silver', 250, 'scarecrow', '{"type": "budget_success", "value": 1}'),
('savings_starter', 'Savings Starter', 'Saved $100 through impulse control', 'bronze', 100, 'tin_man', '{"type": "money_saved", "value": 100}'),
('savings_hero', 'Savings Hero', 'Saved $1000 through impulse control', 'gold', 750, 'glinda', '{"type": "money_saved", "value": 1000}'),
('tornado_survivor', 'Tornado Survivor', 'Used Tornado Alley emergency support', 'bronze', 50, 'tornado', '{"type": "tornado_alley_use", "value": 1}'),
('oz_apprentice', 'Oz Apprentice', 'Reached level 5', 'bronze', 100, 'oz', '{"type": "level_reached", "value": 5}'),
('oz_master', 'Oz Master', 'Reached level 10', 'silver', 300, 'oz', '{"type": "level_reached", "value": 10}'),
('oz_wizard', 'Oz Wizard', 'Reached level 20', 'gold', 1000, 'oz', '{"type": "level_reached", "value": 20}')
ON CONFLICT (achievement_id) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_created_at ON user_rewards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_schedule_user_id ON reward_schedule(user_id);

-- Row Level Security
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own rewards" ON user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rewards" ON user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own gamification" ON user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own gamification" ON user_gamification FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reward schedule" ON reward_schedule FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reward schedule" ON reward_schedule FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view achievement definitions" ON achievement_definitions FOR SELECT TO authenticated USING (true);

-- Function to initialize gamification for new users
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_gamification (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO reward_schedule (user_id, next_micro_reward_at_action, next_surprise_check_at_action)
    VALUES (NEW.id, floor(random() * 5 + 3)::INTEGER, floor(random() * 10 + 5)::INTEGER)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize gamification on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_gamification ON auth.users;
CREATE TRIGGER on_auth_user_created_gamification
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_gamification();

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(
    p_user_id UUID,
    p_streak_type TEXT
)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER, is_new_record BOOLEAN) AS $$
DECLARE
    v_last_activity DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
    v_is_new_record BOOLEAN := FALSE;
BEGIN
    -- Get existing streak data
    SELECT last_activity_date, user_streaks.current_streak, user_streaks.longest_streak
    INTO v_last_activity, v_current_streak, v_longest_streak
    FROM user_streaks
    WHERE user_id = p_user_id AND streak_type = p_streak_type;
    
    -- If no streak exists, create one
    IF v_last_activity IS NULL THEN
        INSERT INTO user_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date)
        VALUES (p_user_id, p_streak_type, 1, 1, CURRENT_DATE)
        RETURNING user_streaks.current_streak, user_streaks.longest_streak INTO v_current_streak, v_longest_streak;
        
        RETURN QUERY SELECT v_current_streak, v_longest_streak, TRUE;
        RETURN;
    END IF;
    
    -- Check if activity is today (already counted)
    IF v_last_activity = CURRENT_DATE THEN
        RETURN QUERY SELECT v_current_streak, v_longest_streak, FALSE;
        RETURN;
    END IF;
    
    -- Check if activity was yesterday (continue streak)
    IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
        v_current_streak := v_current_streak + 1;
        
        -- Check for new record
        IF v_current_streak > v_longest_streak THEN
            v_longest_streak := v_current_streak;
            v_is_new_record := TRUE;
        END IF;
        
        UPDATE user_streaks
        SET current_streak = v_current_streak,
            longest_streak = v_longest_streak,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = p_user_id AND streak_type = p_streak_type;
        
        RETURN QUERY SELECT v_current_streak, v_longest_streak, v_is_new_record;
        RETURN;
    END IF;
    
    -- Streak broken, reset to 1
    v_current_streak := 1;
    
    UPDATE user_streaks
    SET current_streak = v_current_streak,
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id AND streak_type = p_streak_type;
    
    RETURN QUERY SELECT v_current_streak, v_longest_streak, FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
