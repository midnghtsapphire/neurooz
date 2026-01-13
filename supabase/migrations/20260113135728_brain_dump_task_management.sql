-- Brain Dump & Task Management System Migration
-- Created: $(date)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: brain_dumps
CREATE TABLE IF NOT EXISTS brain_dumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(20) CHECK (content_type IN ('text', 'voice', 'file')) DEFAULT 'text',
  file_url TEXT,
  processed BOOLEAN DEFAULT FALSE,
  extracted_projects JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_brain_dumps_user ON brain_dumps(user_id);
CREATE INDEX idx_brain_dumps_processed ON brain_dumps(processed);

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brain_dump_id UUID REFERENCES brain_dumps(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source VARCHAR(20) CHECK (source IN ('brain_dump', 'manual')) DEFAULT 'manual',
  status VARCHAR(20) CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
  size VARCHAR(20) CHECK (size IN ('big', 'medium', 'small')),
  estimated_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Table: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(20) CHECK (task_type IN ('short_list', 'calendar', 'long_list', 'routine')) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')) DEFAULT 'pending',
  priority INTEGER CHECK (priority BETWEEN 1 AND 5),
  size VARCHAR(20) CHECK (size IN ('big', 'medium', 'small')),
  estimated_time INTEGER,
  actual_time INTEGER,
  due_date DATE,
  due_time TIME,
  google_calendar_event_id VARCHAR(255),
  google_calendar_synced_at TIMESTAMP,
  completion_date TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_google_event ON tasks(google_calendar_event_id);

-- Table: routines
CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  routine_type VARCHAR(20) CHECK (routine_type IN ('morning', 'evening', 'custom')) DEFAULT 'custom',
  steps JSONB NOT NULL,
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_routines_user ON routines(user_id);

-- Table: routine_completions
CREATE TABLE IF NOT EXISTS routine_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  routine_id UUID REFERENCES routines(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  steps_completed JSONB,
  time_taken INTEGER
);

CREATE INDEX idx_routine_completions_user ON routine_completions(user_id);
CREATE INDEX idx_routine_completions_date ON routine_completions(completed_at);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  notification_type VARCHAR(30) CHECK (notification_type IN (
    'morning', 'hourly', 'interruption_recovery', 'evening', 
    'weekly_review', 'gentle_nudge', 'celebration'
  )) NOT NULL,
  character VARCHAR(20) CHECK (character IN (
    'dorothy', 'toto', 'scarecrow', 'tin_man', 'lion', 
    'oz', 'glinda', 'bad_witch', 'tornado'
  )) NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  action_taken VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_sent ON notifications(sent_at);

-- Table: user_preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_frequency VARCHAR(20) CHECK (notification_frequency IN ('hourly', 'every_2h', 'every_3h', 'custom')) DEFAULT 'hourly',
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  notification_types_enabled JSONB DEFAULT '{}',
  character_preferences JSONB DEFAULT '{}',
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  google_calendar_token TEXT,
  google_calendar_refresh_token TEXT,
  google_calendar_token_expires_at TIMESTAMP,
  sync_frequency INTEGER DEFAULT 15,
  prep_time_buffer INTEGER DEFAULT 15,
  time_estimate_multiplier DECIMAL DEFAULT 1.5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: gamification
CREATE TABLE IF NOT EXISTS gamification (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: google_calendar_sync_log
CREATE TABLE IF NOT EXISTS google_calendar_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sync_type VARCHAR(20) CHECK (sync_type IN ('manual', 'scheduled', 'realtime')),
  sync_status VARCHAR(20) CHECK (sync_status IN ('success', 'partial', 'failed')),
  events_synced INTEGER,
  conflicts_found INTEGER,
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_log_user ON google_calendar_sync_log(user_id);
CREATE INDEX idx_sync_log_date ON google_calendar_sync_log(synced_at);

-- Enable Row Level Security
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brain_dumps
CREATE POLICY "Users can view own brain_dumps" ON brain_dumps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brain_dumps" ON brain_dumps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brain_dumps" ON brain_dumps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own brain_dumps" ON brain_dumps FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for routines
CREATE POLICY "Users can view own routines" ON routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routines" ON routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routines" ON routines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own routines" ON routines FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for routine_completions
CREATE POLICY "Users can view own routine_completions" ON routine_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routine_completions" ON routine_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for gamification
CREATE POLICY "Users can view own gamification" ON gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gamification" ON gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gamification" ON gamification FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for google_calendar_sync_log
CREATE POLICY "Users can view own sync_log" ON google_calendar_sync_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sync_log" ON google_calendar_sync_log FOR INSERT WITH CHECK (auth.uid() = user_id);
