import { Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Territory } from '@/types/emerald-road';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface TerritoryCardProps {
  territory: Territory;
  isUnlocked: boolean;
  completedQuests: number;
  isActive?: boolean;
}

export function TerritoryCard({ territory, isUnlocked, completedQuests, isActive }: TerritoryCardProps) {
  const navigate = useNavigate();
  const totalQuests = territory.quests.length;
  const isComplete = completedQuests === totalQuests && totalQuests > 0;
  const isComingSoon = territory.comingSoon;
  
  const handleClick = () => {
    if (isUnlocked && !isComingSoon) {
      navigate(`/territory/${territory.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative p-5 rounded-xl border transition-all duration-300",
        isUnlocked && !isComingSoon
          ? "bg-dark-emerald border-emerald-gold/30 cursor-pointer hover:border-emerald-gold hover:shadow-[0_0_20px_rgba(230,194,0,0.15)]"
          : "bg-night-emerald/50 border-moon-silver/10 cursor-not-allowed",
        isActive && "ring-2 ring-emerald-gold ring-offset-2 ring-offset-night-emerald"
      )}
    >
      {/* Lock overlay for locked territories */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-night-emerald/60 rounded-xl">
          <Lock className="w-6 h-6 text-moon-silver/50" />
        </div>
      )}
      
      {/* Coming Soon badge */}
      {isComingSoon && isUnlocked && (
        <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-warning-amber/20 text-warning-amber rounded">
          Coming Soon
        </div>
      )}
      
      {/* Complete badge */}
      {isComplete && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-gold" />
        </div>
      )}
      
      <div className={cn(!isUnlocked && "opacity-40")}>
        <h3 className="text-lg font-bold text-clean-white mb-1">{territory.name}</h3>
        <p className="text-xs text-emerald-gold font-medium mb-2">{territory.theme}</p>
        <p className="text-sm text-moon-silver/80 line-clamp-2 mb-3">{territory.description}</p>
        
        {totalQuests > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {territory.quests.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      i < completedQuests ? "bg-emerald-gold" : "bg-moon-silver/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-moon-silver/60">
                {completedQuests}/{totalQuests} nodes
              </span>
            </div>
            
            {isUnlocked && !isComingSoon && (
              <ChevronRight className="w-4 h-4 text-moon-silver/50" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
