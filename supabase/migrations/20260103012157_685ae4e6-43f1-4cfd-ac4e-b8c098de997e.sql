-- Add category field to quick_notes for "maybe/someday" type items
ALTER TABLE public.quick_notes 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'inbox';

-- Add possible values: inbox, maybe, someday, idea, reference
COMMENT ON COLUMN public.quick_notes.category IS 'Category: inbox, maybe, someday, idea, reference';