-- Add scoring and check-in system to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS focus_score INTEGER,
ADD COLUMN IF NOT EXISTS scope_creep_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lessons_learned TEXT,
ADD COLUMN IF NOT EXISTS daily_checkin_required BOOLEAN DEFAULT true;

-- Create daily check-in table
CREATE TABLE public.project_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  priorities_reviewed BOOLEAN DEFAULT false,
  stakeholders_contacted TEXT[],
  focus_intention TEXT,
  distractions_to_avoid TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, checkin_date)
);

-- Enable RLS
ALTER TABLE public.project_checkins ENABLE ROW LEVEL SECURITY;

-- Anyone can manage check-ins (matches projects table)
CREATE POLICY "Anyone can view project checkins" ON public.project_checkins FOR SELECT USING (true);
CREATE POLICY "Anyone can create project checkins" ON public.project_checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update project checkins" ON public.project_checkins FOR UPDATE USING (true);

-- Create pattern tracking table
CREATE TABLE public.focus_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  pattern_type TEXT NOT NULL,
  pattern_description TEXT NOT NULL,
  times_occurred INTEGER DEFAULT 1,
  impact_on_score INTEGER,
  lesson TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.focus_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view focus patterns" ON public.focus_patterns FOR SELECT USING (true);
CREATE POLICY "Anyone can create focus patterns" ON public.focus_patterns FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update focus patterns" ON public.focus_patterns FOR UPDATE USING (true);

-- Add comments
COMMENT ON TABLE public.project_checkins IS 'Daily Oz ritual - must complete before working on project';
COMMENT ON TABLE public.focus_patterns IS 'Track recurring distraction patterns for ADHD learning';
COMMENT ON COLUMN public.projects.focus_score IS 'Score 0-100 based on focus, setbacks, scope creep';