import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles } from 'lucide-react';
import { Territory } from '@/types/emerald-road';
import { useNavigate } from 'react-router-dom';

interface UnlockModalProps {
  territory: Territory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UnlockModal({ territory, isOpen, onClose }: UnlockModalProps) {
  const navigate = useNavigate();

  if (!territory) return null;

  const handleExplore = () => {
    onClose();
    navigate(`/territory/${territory.id}`);
  };

  const handleLater = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-night-emerald border-emerald-gold/30 max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-gold/20 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-emerald-gold" />
          </div>
          <DialogTitle className="text-2xl font-bold text-clean-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-gold" />
            Territory Unlocked
            <Sparkles className="w-5 h-5 text-emerald-gold" />
          </DialogTitle>
          <DialogDescription className="text-moon-silver/80 mt-2">
            You have unlocked a new territory on the Emerald Road.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="p-4 rounded-xl bg-dark-emerald border border-emerald-gold/20">
            <h3 className="text-xl font-bold text-clean-white mb-1">{territory.name}</h3>
            <p className="text-sm text-emerald-gold font-medium mb-2">{territory.theme}</p>
            <p className="text-sm text-moon-silver/70">{territory.description}</p>
          </div>
          
          <p className="text-center text-moon-silver/60 text-sm mt-4">
            The road illuminates. New systems await.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleLater}
            variant="outline"
            className="flex-1 border-moon-silver/30 text-moon-silver hover:bg-dark-emerald"
          >
            Return to Dashboard
          </Button>
          <Button
            onClick={handleExplore}
            className="flex-1 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-semibold"
          >
            Explore Territory
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
