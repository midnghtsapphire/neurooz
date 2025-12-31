
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-documents', 'user-documents', false);

-- Storage policies for user documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Brain dumps table
CREATE TABLE public.brain_dumps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  raw_content TEXT NOT NULL,
  ai_summary TEXT,
  ai_action_items JSONB,
  ai_categories JSONB,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  document_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brain_dumps ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can create their own brain dumps"
ON public.brain_dumps FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own brain dumps"
ON public.brain_dumps FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own brain dumps"
ON public.brain_dumps FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brain dumps"
ON public.brain_dumps FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_brain_dumps_updated_at
BEFORE UPDATE ON public.brain_dumps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
