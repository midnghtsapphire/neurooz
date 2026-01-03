-- Create quick_notes table for instant capture
CREATE TABLE public.quick_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quick_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own notes" ON public.quick_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" ON public.quick_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.quick_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.quick_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Add parent_id to action_items for subcategories
ALTER TABLE public.action_items 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.action_items(id) ON DELETE CASCADE;

-- Add waiting_on field to action_items for follow-up tracking
ALTER TABLE public.action_items 
ADD COLUMN IF NOT EXISTS waiting_on TEXT;

-- Add kanban_status for board view
ALTER TABLE public.action_items 
ADD COLUMN IF NOT EXISTS kanban_status TEXT DEFAULT 'backlog';

-- Add trigger for updated_at on quick_notes
CREATE OR REPLACE FUNCTION public.update_quick_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quick_notes_updated_at
  BEFORE UPDATE ON public.quick_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quick_notes_updated_at();