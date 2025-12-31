import { useState } from "react";
import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dog, AlertTriangle, Sparkles, Timer, Brain, Ban, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImpulseClassification = 
  | 'novelty'      // Dopamine chase → Delayed
  | 'emotional'    // Needs feeling processing → Tin Man
  | 'fear'         // Avoidance/anxiety → Lion
  | 'logic'        // Needs planning → Scarecrow
  | 'executive'    // Decision fatigue → Dorothy
  | 'legitimate'   // Real quest → Proceed
  | 'destructive'; // Hard block

interface TotoFirewallProps {
  isOpen: boolean;
  onClose: () => void;
  impulseType: 'project' | 'task' | 'idea' | 'buy' | 'text' | 'scroll' | 'quit' | 'tab' | 'other';
  impulseName?: string;
  onProceed: () => void;
  onDelay: (minutes: number) => void;
  onRoute: (destination: 'tinman' | 'scarecrow' | 'lion' | 'dorothy') => void;
  onBlock: () => void;
}

const IMPULSE_QUESTIONS: Record<TotoFirewallProps['impulseType'], string> = {
  project: "Is starting a new project right now a real quest or a dopamine trap?",
  task: "Is this task helping your current mission or distracting from it?",
  idea: "Is this idea worth capturing or just mental noise?",
  buy: "Is this purchase necessary or an impulse escape?",
  text: "Does this message need to be sent right now?",
  scroll: "Are you seeking information or avoiding discomfort?",
  quit: "Are you abandoning this for good reason or fleeing difficulty?",
  tab: "Do you need this tab open or are you fragmenting attention?",
  other: "Is this action moving you forward or sideways?",
};

const IMPULSE_CLASSIFICATIONS: Record<TotoFirewallProps['impulseType'], ImpulseClassification> = {
  project: 'novelty',
  task: 'legitimate',
  idea: 'logic',
  buy: 'emotional',
  text: 'emotional',
  scroll: 'novelty',
  quit: 'fear',
  tab: 'novelty',
  other: 'legitimate',
};

const TOTO_RESPONSES = {
  overload: [
    "🐕 *growls* The city is overloaded! No new projects allowed right now.",
    "🐕 Toto blocks your path. Too many open loops!",
    "🐕 *barks urgently* RAM critical! Close something first!",
  ],
  critical: [
    "🐕 *whimpers* Are you sure? The city is straining...",
    "🐕 Toto looks concerned. Maybe finish something first?",
    "🐕 *tilts head* This feels like a distraction to me...",
  ],
  elevated: [
    "🐕 *sniffs* Proceed carefully. Your load is building.",
    "🐕 Toto is watching. Make sure this is intentional.",
  ],
  stable: [
    "🐕 *wags tail* Looks safe! Go ahead if it's aligned with your quest.",
    "🐕 Toto approves. Your RAM is stable.",
  ],
};

const CLASSIFICATION_ADVICE: Record<ImpulseClassification, { emoji: string; text: string; action: string }> = {
  novelty: { emoji: "✨", text: "Novelty chase detected", action: "Consider delaying" },
  emotional: { emoji: "❤️", text: "Emotional impulse", action: "Route to Tin Man" },
  fear: { emoji: "🦁", text: "Fear/avoidance pattern", action: "Route to Lion" },
  logic: { emoji: "🧠", text: "Needs planning", action: "Route to Scarecrow" },
  executive: { emoji: "👠", text: "Decision overload", action: "Route to Dorothy" },
  legitimate: { emoji: "✅", text: "Legitimate task", action: "Schedule it" },
  destructive: { emoji: "⛔", text: "Destructive impulse", action: "Hard block" },
};

export function TotoFirewall({ 
  isOpen, 
  onClose, 
  impulseType, 
  impulseName,
  onProceed,
  onDelay,
  onRoute,
  onBlock,
}: TotoFirewallProps) {
  const load = useCognitiveLoad();
  const [showRouting, setShowRouting] = useState(false);
  const [showDelayOptions, setShowDelayOptions] = useState(false);
  
  const classification = IMPULSE_CLASSIFICATIONS[impulseType];
  const advice = CLASSIFICATION_ADVICE[classification];
  
  const getTotoResponse = () => {
    const responses = TOTO_RESPONSES[load.status];
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Destructive impulses are always blocked
  const isDestructive = classification === 'destructive';
  const canProceed = load.status !== 'overload' && !isDestructive;
  
  const getBackgroundClass = () => {
    if (isDestructive) return 'bg-gradient-to-br from-red-950 to-background border-red-500';
    switch (load.status) {
      case 'overload': return 'bg-gradient-to-br from-red-950 to-background border-red-500/50';
      case 'critical': return 'bg-gradient-to-br from-orange-950 to-background border-orange-500/50';
      case 'elevated': return 'bg-gradient-to-br from-yellow-950 to-background border-yellow-500/50';
      default: return 'bg-gradient-to-br from-emerald-950 to-background border-emerald-500/50';
    }
  };

  // Delay options view
  if (showDelayOptions) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className={cn("border-2", getBackgroundClass())}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-400" />
              Delay This Impulse
            </AlertDialogTitle>
            <AlertDialogDescription>
              How long should Toto hold this for you?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-4">
            {[5, 10, 30, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => onDelay(minutes)}
                className="p-3 rounded-lg border border-blue-500/30 bg-blue-950/30 hover:bg-blue-950/50 transition-colors text-center"
              >
                <p className="font-medium">{minutes} min</p>
              </button>
            ))}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDelayOptions(false)}>Back</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Routing view
  if (showRouting) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className={cn("border-2", getBackgroundClass())}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-400" />
              Route This Impulse
            </AlertDialogTitle>
            <AlertDialogDescription>
              Which subsystem should process this?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-3 py-4">
            <button
              onClick={() => onRoute('tinman')}
              className="flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-950/30 hover:bg-red-950/50 transition-colors text-left"
            >
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-medium text-sm">Tin Man</p>
                <p className="text-xs text-muted-foreground">Emotional processing needed</p>
              </div>
            </button>
            
            <button
              onClick={() => onRoute('scarecrow')}
              className="flex items-center gap-3 p-3 rounded-lg border border-yellow-500/30 bg-yellow-950/30 hover:bg-yellow-950/50 transition-colors text-left"
            >
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-medium text-sm">Scarecrow</p>
                <p className="text-xs text-muted-foreground">Needs planning & logic</p>
              </div>
            </button>
            
            <button
              onClick={() => onRoute('lion')}
              className="flex items-center gap-3 p-3 rounded-lg border border-orange-500/30 bg-orange-950/30 hover:bg-orange-950/50 transition-colors text-left"
            >
              <span className="text-2xl">🦁</span>
              <div>
                <p className="font-medium text-sm">Lion</p>
                <p className="text-xs text-muted-foreground">Fear or anxiety based</p>
              </div>
            </button>
            
            <button
              onClick={() => onRoute('dorothy')}
              className="flex items-center gap-3 p-3 rounded-lg border border-pink-500/30 bg-pink-950/30 hover:bg-pink-950/50 transition-colors text-left"
            >
              <span className="text-2xl">👠</span>
              <div>
                <p className="font-medium text-sm">Dorothy</p>
                <p className="text-xs text-muted-foreground">Executive decision needed</p>
              </div>
            </button>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRouting(false)}>Back</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={cn("border-2", getBackgroundClass())}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Dog className="h-5 w-5 text-amber-400" />
            Toto's Impulse Check
            {(load.status === 'overload' || isDestructive) && (
              <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse ml-auto" />
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="font-medium text-foreground">
              {IMPULSE_QUESTIONS[impulseType]}
            </p>
            {impulseName && (
              <p className="text-sm bg-muted/50 p-2 rounded">
                "{impulseName}"
              </p>
            )}
            
            {/* Classification badge */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{advice.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{advice.text}</p>
                <p className="text-xs text-muted-foreground">{advice.action}</p>
              </div>
            </div>
            
            <p className="text-sm italic">
              {getTotoResponse()}
            </p>
            
            {/* Current load indicator */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Current RAM:</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all",
                    load.status === 'overload' ? 'bg-red-500' :
                    load.status === 'critical' ? 'bg-orange-500' :
                    load.status === 'elevated' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  )}
                  style={{ width: `${load.ramUsage}%` }}
                />
              </div>
              <span className="text-xs font-mono">{Math.round(load.ramUsage)}%</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose}>
            Nevermind
          </AlertDialogCancel>
          
          {isDestructive ? (
            <button
              onClick={onBlock}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
            >
              <Ban className="h-4 w-4" />
              Block This
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDelayOptions(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <Timer className="h-4 w-4" />
                Delay
              </button>
              
              <button
                onClick={() => setShowRouting(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-purple-500/50 bg-purple-950/30 hover:bg-purple-950/50 text-purple-200 h-10 px-4 py-2"
              >
                <Compass className="h-4 w-4" />
                Route It
              </button>
              
              {canProceed ? (
                <AlertDialogAction onClick={onProceed} className="bg-emerald-600 hover:bg-emerald-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Real Quest
                </AlertDialogAction>
              ) : (
                <div className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  RAM overloaded - close loops first
                </div>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
