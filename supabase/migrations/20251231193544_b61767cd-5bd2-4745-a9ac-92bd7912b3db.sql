-- Create project change history table
CREATE TABLE public.project_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by TEXT
);

-- Enable RLS
ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;

-- Anyone can view project history (matches projects table policy)
CREATE POLICY "Anyone can view project history" ON public.project_history FOR SELECT USING (true);

-- Anyone can create project history
CREATE POLICY "Anyone can create project history" ON public.project_history FOR INSERT WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_project_history_project_id ON public.project_history(project_id);
CREATE INDEX idx_project_history_changed_at ON public.project_history(changed_at DESC);