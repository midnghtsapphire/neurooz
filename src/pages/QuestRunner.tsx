import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTravelerProfile } from '@/hooks/use-traveler-profile';
import { getQuest, getTerritory, TERRITORIES } from '@/lib/emerald-road-data';
import { ERNavbar } from '@/components/emerald-road/ERNavbar';
import { UnlockModal } from '@/components/emerald-road/UnlockModal';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Territory } from '@/types/emerald-road';

type QuestStage = 'stabilize' | 'build' | 'expand' | 'complete';

export default function QuestRunner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isLoading, hasProfile, completeStep, completeQuest, isStepComplete } = useTravelerProfile();
  
  const [stage, setStage] = useState<QuestStage>('stabilize');
  const [unlockedTerritory, setUnlockedTerritory] = useState<Territory | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [reward, setReward] = useState<{ metric: string; amount: number } | null>(null);

  const quest = id ? getQuest(id) : null;
  const territory = quest ? getTerritory(quest.territory) : null;

  useEffect(() => {
    if (!isLoading && !hasProfile) {
      navigate('/onboarding');
    }
  }, [isLoading, hasProfile, navigate]);

  // Initialize stage based on completed steps
  useEffect(() => {
    if (quest && profile) {
      if (isStepComplete(quest.id, quest.expandStep.id)) {
        setStage('complete');
      } else if (isStepComplete(quest.id, quest.buildStep.id)) {
        setStage('expand');
      } else if (isStepComplete(quest.id, quest.stabilizeStep.id)) {
        setStage('build');
      } else {
        setStage('stabilize');
      }
    }
  }, [quest, profile, isStepComplete]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-night-emerald flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-gold/30 border-t-emerald-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!quest || !territory) {
    return (
      <div className="min-h-screen bg-night-emerald">
        <ERNavbar showBack backTo="/dashboard" backLabel="Dashboard" />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-clean-white">Quest not found.</h1>
        </main>
      </div>
    );
  }

  const steps = [
    { id: 'stabilize', step: quest.stabilizeStep, label: 'Stabilize' },
    { id: 'build', step: quest.buildStep, label: 'Build' },
    { id: 'expand', step: quest.expandStep, label: 'Expand' },
  ];

  const currentStepData = steps.find(s => s.id === stage);

  const handleCompleteStep = () => {
    if (!currentStepData) return;
    
    completeStep(quest.id, currentStepData.step.id);
    
    if (stage === 'stabilize') {
      setStage('build');
    } else if (stage === 'build') {
      setStage('expand');
    } else if (stage === 'expand') {
      // Complete the quest
      const result = completeQuest(quest.id);
      if (result) {
        setReward(result.reward);
        if (result.unlockedTerritory) {
          const newTerritory = TERRITORIES.find(t => t.id === result.unlockedTerritory);
          if (newTerritory) {
            setUnlockedTerritory(newTerritory);
          }
        }
      }
      setStage('complete');
    }
  };

  const handleContinue = () => {
    if (unlockedTerritory) {
      setShowUnlockModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-night-emerald flex flex-col">
      <ERNavbar showBack backTo={`/territory/${territory.id}`} backLabel={territory.name} />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-lg">
        {/* Quest Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-emerald-gold font-medium mb-1">{quest.nodeName}</p>
          <h1 className="text-2xl font-bold text-clean-white">{quest.title}</h1>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((s, i) => {
            const isComplete = isStepComplete(quest.id, s.step.id) || 
              (stage === 'complete') ||
              (stage === 'build' && i === 0) ||
              (stage === 'expand' && i < 2);
            const isCurrent = s.id === stage;
            
            return (
              <div key={s.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isComplete 
                      ? "bg-emerald-gold text-night-emerald" 
                      : isCurrent 
                        ? "bg-emerald-gold/20 text-emerald-gold ring-2 ring-emerald-gold"
                        : "bg-moon-silver/10 text-moon-silver/40"
                  )}>
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{i + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-emerald-gold" : "text-moon-silver/50"
                  )}>
                    {s.label}
                  </span>
                </div>
                
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 -mt-5",
                    isComplete ? "bg-emerald-gold" : "bg-moon-silver/20"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {stage !== 'complete' && currentStepData && (
            <div className="animate-fade-in">
              <p className="text-emerald-gold font-medium text-lg mb-4">{currentStepData.label}</p>
              <p className="text-2xl text-clean-white font-light leading-relaxed max-w-md">
                {currentStepData.step.instruction}
              </p>
            </div>
          )}

          {stage === 'complete' && (
            <div className="animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-gold/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-emerald-gold" />
              </div>
              <h2 className="text-2xl font-bold text-clean-white mb-2">System Restored.</h2>
              
              {reward && (
                <p className="text-emerald-gold font-medium mb-4">
                  +{reward.amount} {reward.metric}
                </p>
              )}
              
              <p className="text-moon-silver/70 max-w-sm mx-auto mb-8">
                Carry this into real life. The small action you just took matters.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto pt-6">
          {stage !== 'complete' ? (
            <Button
              onClick={handleCompleteStep}
              className="w-full h-14 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-bold text-lg"
            >
              Done
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleContinue}
              className="w-full h-14 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-bold text-lg"
            >
              {unlockedTerritory ? "See What's Next" : 'Return to Dashboard'}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </main>

      <UnlockModal
        territory={unlockedTerritory}
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
      />
    </div>
  );
}
