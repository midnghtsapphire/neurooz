import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTravelerProfile } from '@/hooks/use-traveler-profile';
import { TravelerState, Pace, TRAVELER_STATES } from '@/types/emerald-road';
import { Map, ChevronRight, ChevronLeft, User, Compass, Gauge, Brain, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrainDumpCard from '@/components/TornadoAlley/BrainDumpCard';
import { useCreateProject, useCreateActionItem } from '@/hooks/use-projects';
import { toast } from 'sonner';

export default function Onboarding() {
  const navigate = useNavigate();
  const { initializeProfile } = useTravelerProfile();
  const createProject = useCreateProject();
  const createActionItem = useCreateActionItem();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [currentState, setCurrentState] = useState<TravelerState>('foggy');
  const [pace, setPace] = useState<Pace>('standard');

  const handleBrainDumpComplete = async (items: any[]) => {
    // Create projects and tasks from brain dump results
    const projects = items.filter(i => i.type === 'project');
    const tasks = items.filter(i => i.type === 'task' || i.type === 'idea' || i.type === 'concern');
    
    for (const project of projects) {
      try {
        await createProject.mutateAsync({
          name: project.title,
          description: project.description || '',
          color: project.priority === 'high' ? '#ef4444' : project.priority === 'medium' ? '#f59e0b' : '#22c55e'
        });
      } catch (err) {
        console.error('Failed to create project:', err);
      }
    }

    for (const task of tasks) {
      try {
        await createActionItem.mutateAsync({
          title: task.title,
          description: task.description || '',
          priority: task.priority || 'medium'
        });
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    }

    toast.success(`Created ${projects.length} projects and ${tasks.length} tasks!`);
    handleComplete();
  };

  const handleComplete = () => {
    if (!name.trim()) return;
    initializeProfile(name.trim(), currentState, pace);
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-night-emerald flex flex-col">
      {/* Header */}
      <header className="border-b border-emerald-gold/20 bg-night-emerald/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-gold flex items-center justify-center">
              <Map className="w-5 h-5 text-night-emerald" />
            </div>
            <span className="text-lg font-bold text-clean-white">Emerald Road OS</span>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                s === step ? "bg-emerald-gold w-8" : s < step ? "bg-emerald-gold/60" : "bg-moon-silver/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 max-w-md">
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-gold/20 flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-emerald-gold" />
            </div>
            <h1 className="text-2xl font-bold text-clean-white text-center mb-2">
              Welcome, Traveler.
            </h1>
            <p className="text-moon-silver/80 text-center mb-8">
              Let's set up your profile. What should we call you?
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-moon-silver">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 bg-dark-emerald border-moon-silver/20 text-clean-white placeholder:text-moon-silver/50 focus:border-emerald-gold"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-gold/20 flex items-center justify-center mx-auto mb-6">
              <Compass className="w-8 h-8 text-emerald-gold" />
            </div>
            <h1 className="text-2xl font-bold text-clean-white text-center mb-2">
              Where are you right now?
            </h1>
            <p className="text-moon-silver/80 text-center mb-8">
              No judgment. Just orientation. This helps us meet you where you are.
            </p>
            
            <RadioGroup value={currentState} onValueChange={(v) => setCurrentState(v as TravelerState)}>
              <div className="space-y-3">
                {TRAVELER_STATES.map((state) => (
                  <div key={state.value}>
                    <RadioGroupItem
                      value={state.value}
                      id={state.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={state.value}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                        currentState === state.value
                          ? "bg-emerald-gold/10 border-emerald-gold"
                          : "bg-dark-emerald border-moon-silver/20 hover:border-moon-silver/40"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        currentState === state.value ? "border-emerald-gold" : "border-moon-silver/40"
                      )}>
                        {currentState === state.value && (
                          <div className="w-2 h-2 rounded-full bg-emerald-gold" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-clean-white">{state.label}</div>
                        <div className="text-sm text-moon-silver/70">{state.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-gold/20 flex items-center justify-center mx-auto mb-6">
              <Gauge className="w-8 h-8 text-emerald-gold" />
            </div>
            <h1 className="text-2xl font-bold text-clean-white text-center mb-2">
              Choose your pace.
            </h1>
            <p className="text-moon-silver/80 text-center mb-8">
              This affects the tone and pacing of prompts. You can change it anytime.
            </p>
            
            <RadioGroup value={pace} onValueChange={(v) => setPace(v as Pace)}>
              <div className="space-y-3">
                <div>
                  <RadioGroupItem value="gentle" id="gentle" className="peer sr-only" />
                  <Label
                    htmlFor="gentle"
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                      pace === 'gentle'
                        ? "bg-emerald-gold/10 border-emerald-gold"
                        : "bg-dark-emerald border-moon-silver/20 hover:border-moon-silver/40"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      pace === 'gentle' ? "border-emerald-gold" : "border-moon-silver/40"
                    )}>
                      {pace === 'gentle' && (
                        <div className="w-2 h-2 rounded-full bg-emerald-gold" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-clean-white">Gentle</div>
                      <div className="text-sm text-moon-silver/70">Softer prompts, more compassionate tone</div>
                    </div>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
                  <Label
                    htmlFor="standard"
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                      pace === 'standard'
                        ? "bg-emerald-gold/10 border-emerald-gold"
                        : "bg-dark-emerald border-moon-silver/20 hover:border-moon-silver/40"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      pace === 'standard' ? "border-emerald-gold" : "border-moon-silver/40"
                    )}>
                      {pace === 'standard' && (
                        <div className="w-2 h-2 rounded-full bg-emerald-gold" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-clean-white">Standard</div>
                      <div className="text-sm text-moon-silver/70">Direct and clear, steady pace</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-gold/20 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-emerald-gold" />
            </div>
            <h1 className="text-2xl font-bold text-clean-white text-center mb-2">
              Tornado Alley
            </h1>
            <p className="text-moon-silver/80 text-center mb-8">
              Let's get everything out of your head and organized into projects.
            </p>
            <BrainDumpCard onComplete={handleBrainDumpComplete} />
          </div>
        )}
      </main>

      {/* Footer navigation */}
      {step < 4 && (
        <footer className="border-t border-moon-silver/10 bg-night-emerald">
          <div className="container mx-auto px-4 py-4 max-w-md">
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="flex-1 border-moon-silver/30 text-moon-silver hover:bg-dark-emerald"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex-1 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-semibold"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-semibold"
                >
                  Brain Dump
                  <Brain className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
            {step === 3 && (
              <Button
                onClick={handleComplete}
                variant="ghost"
                className="w-full mt-2 text-moon-silver/70 hover:text-moon-silver"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip Brain Dump
              </Button>
            )}
          </div>
        </footer>
      )}

      {step === 4 && (
        <footer className="border-t border-moon-silver/10 bg-night-emerald">
          <div className="container mx-auto px-4 py-4 max-w-md">
            <Button
              onClick={handleComplete}
              variant="ghost"
              className="w-full text-moon-silver/70 hover:text-moon-silver"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Skip & Continue to Dashboard
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
