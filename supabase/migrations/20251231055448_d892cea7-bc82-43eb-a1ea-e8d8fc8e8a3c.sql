-- Add assigned_to and is_completed to projects table
ALTER TABLE public.projects 
ADD COLUMN assigned_to TEXT,
ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Create project_items table for bulk uploaded items
CREATE TABLE public.project_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_action_item BOOLEAN NOT NULL DEFAULT false,
  action_item_id UUID REFERENCES public.action_items(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_items
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_items (matching projects table - public access)
CREATE POLICY "Anyone can view project items"
ON public.project_items
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create project items"
ON public.project_items
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update project items"
ON public.project_items
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete project items"
ON public.project_items
FOR DELETE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_project_items_updated_at
BEFORE UPDATE ON public.project_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();