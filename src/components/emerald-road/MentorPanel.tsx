import { useState, useEffect } from 'react';
import { MENTOR_QUOTES } from '@/lib/emerald-road-data';
import { MentorQuote } from '@/types/emerald-road';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MentorPanelProps {
  className?: string;
}

const mentorColors: Record<string, string> = {
  Navigator: 'text-emerald-gold',
  Strategist: 'text-moon-silver',
  Architect: 'text-emerald-gold',
  Guardian: 'text-warning-amber',
};

export function MentorPanel({ className }: MentorPanelProps) {
  const [currentQuote, setCurrentQuote] = useState<MentorQuote>(MENTOR_QUOTES[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuote(prev => {
          const currentIndex = MENTOR_QUOTES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % MENTOR_QUOTES.length;
          return MENTOR_QUOTES[nextIndex];
        });
        setIsTransitioning(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("p-4 rounded-xl bg-dark-emerald border border-moon-silver/10", className)}>
      <div className="flex items-start gap-3">
        <Quote className="w-5 h-5 text-moon-silver/40 flex-shrink-0 mt-1" />
        <div className={cn(
          "transition-opacity duration-300",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}>
          <p className="text-sm text-moon-silver/90 italic mb-2">
            "{currentQuote.quote}"
          </p>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-bold", mentorColors[currentQuote.mentor])}>
              The {currentQuote.mentor}
            </span>
            <span className="text-xs text-moon-silver/50">— {currentQuote.domain}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
