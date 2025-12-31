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
import { Dog, AlertTriangle, Sparkles, Timer, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface TotoFirewallProps {
  isOpen: boolean;
  onClose: () => void;
  impulseType: 'project' | 'task' | 'idea' | 'other';
  impulseName?: string;
  onProceed: () => void;
  onDelay: () => void;
  onRoute: (destination: 'tinman' | 'scarecrow' | 'lion') => void;
}

const IMPULSE_QUESTIONS = {
  project: "Is starting a new project right now a real quest or a dopamine trap?",
  task: "Is this task helping your current mission or distracting from it?",
  idea: "Is this idea worth capturing or just mental noise?",
  other: "Is this action moving you forward or sideways?",
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

export function TotoFirewall({ 
  isOpen, 
  onClose, 
  impulseType, 
  impulseName,
  onProceed,
  onDelay,
  onRoute 
}: TotoFirewallProps) {
  const load = useCognitiveLoad();
  const [showRouting, setShowRouting] = useState(false);
  
  const getTotoResponse = () => {
    const responses = TOTO_RESPONSES[load.status];
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const canProceed = load.status !== 'overload';
  
  const getBackgroundClass = () => {
    switch (load.status) {
      case 'overload': return 'bg-gradient-to-br from-red-950 to-background border-red-500/50';
      case 'critical': return 'bg-gradient-to-br from-orange-950 to-background border-orange-500/50';
      case 'elevated': return 'bg-gradient-to-br from-yellow-950 to-background border-yellow-500/50';
      default: return 'bg-gradient-to-br from-emerald-950 to-background border-emerald-500/50';
    }
  };

  if (showRouting) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className={cn("border-2", getBackgroundClass())}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Route This Impulse
            </AlertDialogTitle>
            <AlertDialogDescription>
              Where should this impulse go for processing?
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
            {load.status === 'overload' && (
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
          
          <button
            onClick={onDelay}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Timer className="h-4 w-4" />
            Delay 10 min
          </button>
          
          <button
            onClick={() => setShowRouting(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-purple-500/50 bg-purple-950/30 hover:bg-purple-950/50 text-purple-200 h-10 px-4 py-2"
          >
            <Brain className="h-4 w-4" />
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
