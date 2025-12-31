-- Add dependency and prioritization fields to action_items
ALTER TABLE public.action_items 
ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES public.action_items(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_setback BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS setback_reason TEXT,
ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS task_type TEXT DEFAULT 'lion' CHECK (task_type IN ('scarecrow', 'tinman', 'lion'));

-- Add comments explaining the Oz metaphor
COMMENT ON COLUMN public.action_items.task_type IS 'Oz metaphor: scarecrow=planning/strategy, tinman=passion/heart, lion=courage/avoided tasks';
COMMENT ON COLUMN public.action_items.blocked_by IS 'Task that must be completed before this one';
COMMENT ON COLUMN public.action_items.is_setback IS 'True if this task was done out of order causing issues';
COMMENT ON COLUMN public.action_items.priority_score IS 'Auto-calculated priority (higher = do first). Considers dependencies and type.';