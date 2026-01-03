
-- Create table to track image awareness observations
CREATE TABLE public.awareness_observations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location TEXT NOT NULL, -- e.g., 'tornado_alley_eye'
  current_image_index INTEGER NOT NULL DEFAULT 0,
  image_changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visits_since_change INTEGER NOT NULL DEFAULT 0,
  noticed_at TIMESTAMP WITH TIME ZONE,
  total_observations INTEGER NOT NULL DEFAULT 0,
  average_visits_to_notice NUMERIC(5,2),
  fastest_notice INTEGER,
  slowest_notice INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.awareness_observations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own observations"
ON public.awareness_observations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own observations"
ON public.awareness_observations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own observations"
ON public.awareness_observations FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_awareness_observations_updated_at
BEFORE UPDATE ON public.awareness_observations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_awareness_observations_user_location 
ON public.awareness_observations(user_id, location);
