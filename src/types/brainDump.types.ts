export interface BrainDump {
  id: string;
  user_id: string;
  content: string;
  content_type: 'text' | 'voice' | 'file';
  file_url?: string;
  processed: boolean;
  extracted_projects?: ExtractedProject[];
  created_at: string;
  updated_at: string;
}

export interface ExtractedProject {
  title: string;
  description: string;
  subtasks: string[];
  size: 'big' | 'medium' | 'small';
  estimatedTime: number;
  recommendedList: 'short_list' | 'calendar' | 'long_list';
  dueDate?: string;
}

export interface Project {
  id: string;
  user_id: string;
  brain_dump_id?: string;
  title: string;
  description?: string;
  source: 'brain_dump' | 'manual';
  status: 'active' | 'completed' | 'archived';
  size?: 'big' | 'medium' | 'small';
  estimated_time?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  description?: string;
  task_type: 'short_list' | 'calendar' | 'long_list' | 'routine';
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority?: number;
  size?: 'big' | 'medium' | 'small';
  estimated_time?: number;
  actual_time?: number;
  due_date?: string;
  due_time?: string;
  google_calendar_event_id?: string;
  google_calendar_synced_at?: string;
  completion_date?: string;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  routine_type: 'morning' | 'evening' | 'custom';
  steps: RoutineStep[];
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  description?: string;
  estimated_time?: number;
  order: number;
}

export interface RoutineCompletion {
  id: string;
  routine_id: string;
  user_id: string;
  completed_at: string;
  steps_completed: string[];
  time_taken?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  task_id?: string;
  notification_type: NotificationType;
  character: OzCharacter;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  read_at?: string;
  action_taken?: string;
  created_at: string;
}

export type NotificationType =
  | 'morning'
  | 'hourly'
  | 'interruption_recovery'
  | 'evening'
  | 'weekly_review'
  | 'gentle_nudge'
  | 'celebration';

export type OzCharacter =
  | 'dorothy'
  | 'toto'
  | 'scarecrow'
  | 'tin_man'
  | 'lion'
  | 'oz'
  | 'glinda'
  | 'bad_witch'
  | 'tornado';

export interface UserPreferences {
  user_id: string;
  notification_frequency: 'hourly' | 'every_2h' | 'every_3h' | 'custom';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  notification_types_enabled: Record<NotificationType, boolean>;
  character_preferences: Record<NotificationType, OzCharacter>;
  google_calendar_connected: boolean;
  google_calendar_token?: string;
  google_calendar_refresh_token?: string;
  google_calendar_token_expires_at?: string;
  sync_frequency: number;
  prep_time_buffer: number;
  time_estimate_multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface Gamification {
  user_id: string;
  total_points: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  achievements: Achievement[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface GoogleCalendarSyncLog {
  id: string;
  user_id: string;
  sync_type: 'manual' | 'scheduled' | 'realtime';
  sync_status: 'success' | 'partial' | 'failed';
  events_synced: number;
  conflicts_found: number;
  error_message?: string;
  synced_at: string;
}
