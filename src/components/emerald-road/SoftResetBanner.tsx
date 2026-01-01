import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoftResetBannerProps {
  onDismiss: () => void;
}

export function SoftResetBanner({ onDismiss }: SoftResetBannerProps) {
  return (
    <div className="p-4 rounded-xl bg-dark-emerald border border-emerald-gold/30 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-gold/20 flex items-center justify-center flex-shrink-0">
          <RefreshCw className="w-5 h-5 text-emerald-gold" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-clean-white mb-1">Welcome back, Traveler.</h3>
          <p className="text-sm text-moon-silver/80 mb-3">
            It's been a while since you were last here. That's okay. 
            There's no streak to break, no progress lost. 
            Your road is still here. Pick up wherever feels right.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={onDismiss}
              size="sm"
              className="bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-semibold"
            >
              Continue Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
