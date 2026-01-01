import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Quest } from '@/types/emerald-road';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface QuestCardProps {
  quest: Quest;
  isComplete: boolean;
  completedSteps: string[];
  isLocked?: boolean;
}

export function QuestCard({ quest, isComplete, completedSteps, isLocked }: QuestCardProps) {
  const navigate = useNavigate();
  
  const steps = [
    { id: quest.stabilizeStep.id, label: 'Stabilize', instruction: quest.stabilizeStep.instruction },
    { id: quest.buildStep.id, label: 'Build', instruction: quest.buildStep.instruction },
    { id: quest.expandStep.id, label: 'Expand', instruction: quest.expandStep.instruction },
  ];

  const handleStart = () => {
    if (!isLocked) {
      navigate(`/quest/${quest.id}`);
    }
  };

  return (
    <div 
      className={cn(
        "p-5 rounded-xl border transition-all duration-300",
        isComplete 
          ? "bg-emerald-gold/10 border-emerald-gold/40" 
          : "bg-dark-emerald border-moon-silver/20 hover:border-emerald-gold/40",
        isLocked && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-emerald-gold font-medium mb-1">{quest.nodeName}</p>
          <h3 className="text-lg font-bold text-clean-white">{quest.title}</h3>
          <p className="text-sm text-moon-silver/70 mt-1">{quest.description}</p>
        </div>
        {isComplete && <CheckCircle2 className="w-6 h-6 text-emerald-gold flex-shrink-0" />}
      </div>
      
      {/* Steps preview */}
      <div className="space-y-2 mb-4">
        {steps.map((step) => {
          const isStepComplete = completedSteps.includes(step.id);
          return (
            <div key={step.id} className="flex items-start gap-3">
              {isStepComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-gold flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-moon-silver/40 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className={cn(
                  "text-xs font-medium",
                  isStepComplete ? "text-emerald-gold" : "text-moon-silver/60"
                )}>
                  {step.label}
                </span>
                <p className={cn(
                  "text-sm",
                  isStepComplete ? "text-moon-silver/60 line-through" : "text-moon-silver/80"
                )}>
                  {step.instruction}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Reward preview */}
      <div className="flex items-center justify-between pt-3 border-t border-moon-silver/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-moon-silver/50">Reward:</span>
          <span className="text-xs font-medium text-emerald-gold capitalize">
            +{quest.reward.amount} {quest.reward.metric}
          </span>
        </div>
        
        {!isComplete && (
          <Button
            onClick={handleStart}
            disabled={isLocked}
            size="sm"
            className="bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-semibold gap-1"
          >
            Start Node
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
