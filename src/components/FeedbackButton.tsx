import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FeedbackButtonProps {
  contentId: string;
  contentType: 'article' | 'profile' | 'report' | 'section';
  contentTitle?: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  contentId,
  contentType,
  contentTitle
}) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (type: 'up' | 'down') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setFeedback(type);

    try {
      // Submit feedback to Supabase
      const { error } = await supabase
        .from('epstein_feedback')
        .insert({
          content_id: contentId,
          content_type: contentType,
          content_title: contentTitle || '',
          feedback_type: type,
          user_ip: 'anonymous', // In production, you'd get this from a backend endpoint
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(type === 'up' ? 'Thanks for the positive feedback!' : 'Thanks for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
      setFeedback(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-buttons">
      <button
        onClick={() => handleFeedback('up')}
        disabled={feedback !== null || isSubmitting}
        className={`feedback-btn ${feedback === 'up' ? 'active-up' : ''}`}
        aria-label="Thumbs up"
      >
        <ThumbsUp size={20} />
        <span>Helpful</span>
      </button>
      <button
        onClick={() => handleFeedback('down')}
        disabled={feedback !== null || isSubmitting}
        className={`feedback-btn ${feedback === 'down' ? 'active-down' : ''}`}
        aria-label="Thumbs down"
      >
        <ThumbsDown size={20} />
        <span>Not Helpful</span>
      </button>
    </div>
  );
};
