-- Create table for tracking feedback on Epstein investigation content
CREATE TABLE IF NOT EXISTS epstein_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'profile', 'report', 'section')),
  content_title TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('up', 'down')),
  user_ip TEXT DEFAULT 'anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_epstein_feedback_content_id ON epstein_feedback(content_id);
CREATE INDEX IF NOT EXISTS idx_epstein_feedback_created_at ON epstein_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_epstein_feedback_type ON epstein_feedback(feedback_type);

-- Enable Row Level Security (RLS)
ALTER TABLE epstein_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert feedback (anonymous)
CREATE POLICY "Allow public insert feedback" ON epstein_feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all feedback (for admin dashboard)
CREATE POLICY "Allow authenticated read feedback" ON epstein_feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Create view for admin analytics
CREATE OR REPLACE VIEW epstein_feedback_stats AS
SELECT 
  content_id,
  content_type,
  content_title,
  COUNT(*) FILTER (WHERE feedback_type = 'up') as thumbs_up,
  COUNT(*) FILTER (WHERE feedback_type = 'down') as thumbs_down,
  COUNT(*) as total_feedback,
  ROUND(
    (COUNT(*) FILTER (WHERE feedback_type = 'up')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
    2
  ) as positive_percentage,
  MAX(created_at) as last_feedback_at
FROM epstein_feedback
GROUP BY content_id, content_type, content_title
ORDER BY total_feedback DESC;

-- Grant access to the view for authenticated users
GRANT SELECT ON epstein_feedback_stats TO authenticated;
