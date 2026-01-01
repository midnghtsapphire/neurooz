import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { Heart, Brain, Shield, Dog, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Subsystem {
  id: 'tinman' | 'scarecrow' | 'lion' | 'toto';
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  purpose: string;
  prompt: string;
  responses: string[];
}

const SUBSYSTEMS: Subsystem[] = [
  {
    id: 'tinman',
    name: 'Tin Man',
    icon: <Heart className="h-5 w-5" />,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    purpose: 'Emotional Processing',
    prompt: 'What feeling needs attention right now?',
    responses: [
      "That weight you carry has a name. Naming it lessens its gravity.",
      "Emotions are data, not commands. Let me help you decode this signal.",
      "Your heart is not broken. It is recalibrating.",
      "Feel it fully. Then we move forward.",
      "This storm will pass. You are not the weather.",
    ],
  },
  {
    id: 'scarecrow',
    name: 'Scarecrow',
    icon: <Brain className="h-5 w-5" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    purpose: 'Logic & Planning',
    prompt: 'What problem needs untangling?',
    responses: [
      "Let's break this into smaller pieces. Complexity shrinks under scrutiny.",
      "Your brain is not failing. It's processing too many threads. Let's close some.",
      "First principles: What is actually true here?",
      "The fog will clear. Let's find one clear step forward.",
      "You already know the answer. Let's uncover it together.",
    ],
  },
  {
    id: 'lion',
    name: 'Lion',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    purpose: 'Courage Building',
    prompt: 'What fear is holding you back?',
    responses: [
      "Fear is just excitement without breath. Breathe.",
      "You've survived every difficult day so far. That's a 100% success rate.",
      "Courage is not the absence of fear. It's taking one step while afraid.",
      "This fear is protecting something valuable. Let's find what.",
      "The thing you're avoiding contains the growth you need.",
    ],
  },
  {
    id: 'toto',
    name: 'Toto',
    icon: <Dog className="h-5 w-5" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    purpose: 'Impulse Watchdog',
    prompt: 'What impulse needs checking?',
    responses: [
      "*sniff* This impulse smells like avoidance. Is there something deeper?",
      "I've seen this pattern before. Let's pause and look closer.",
      "Not every itch needs scratching. Some just need acknowledgment.",
      "This might be your nervous system seeking distraction. Let's ground first.",
      "Good instinct to check. Let's see if this serves your true goals.",
    ],
  },
];

interface EmotionalRoutingPanelProps {
  isUnlocked?: boolean;
  className?: string;
}

export function EmotionalRoutingPanel({ isUnlocked = true, className }: EmotionalRoutingPanelProps) {
  const [activeSubsystem, setActiveSubsystem] = useState<Subsystem | null>(null);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const load = useCognitiveLoad();
  const { toast } = useToast();

  const handleSelectSubsystem = (subsystem: Subsystem) => {
    if (!isUnlocked) {
      toast({
        title: "Locked",
        description: "Emotional routing unlocks on Day 5 of your journey.",
      });
      return;
    }
    setActiveSubsystem(subsystem);
    setResponse(null);
    setInput('');
  };

  const handleSubmit = () => {
    if (!activeSubsystem || !input.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing with trauma-safe response
    setTimeout(() => {
      const randomResponse = activeSubsystem.responses[
        Math.floor(Math.random() * activeSubsystem.responses.length)
      ];
      setResponse(randomResponse);
      setIsProcessing(false);
    }, 1500);
  };

  const handleClose = () => {
    setActiveSubsystem(null);
    setResponse(null);
    setInput('');
  };

  // Get recommended subsystem based on current load
  const getRecommendedSubsystem = () => {
    if (load.emotionalLoad > 60) return 'tinman';
    if (load.logicLoad > 60) return 'scarecrow';
    if (load.anxietyLevel > 60) return 'lion';
    if (load.totoAlert) return 'toto';
    return null;
  };

  const recommended = getRecommendedSubsystem();

  return (
    <div className={className}>
      <Card className={cn(
        "border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-background",
        !isUnlocked && "opacity-60"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Emotional Routing
            {!isUnlocked && (
              <span className="text-xs text-muted-foreground ml-2">🔒 Day 5</span>
            )}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Route thoughts to the right mental subsystem
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Subsystem Grid */}
          <div className="grid grid-cols-2 gap-2">
            {SUBSYSTEMS.map((sub) => (
              <Button
                key={sub.id}
                variant="outline"
                className={cn(
                  "h-auto py-3 flex flex-col items-center gap-1 transition-all",
                  sub.borderColor,
                  recommended === sub.id && isUnlocked && "ring-2 ring-purple-500/50",
                  !isUnlocked && "cursor-not-allowed"
                )}
                onClick={() => handleSelectSubsystem(sub)}
                disabled={!isUnlocked}
              >
                <div className={cn("p-2 rounded-full", sub.bgColor, sub.color)}>
                  {sub.icon}
                </div>
                <span className="text-xs font-medium">{sub.name}</span>
                <span className="text-[10px] text-muted-foreground">{sub.purpose}</span>
              </Button>
            ))}
          </div>

          {recommended && isUnlocked && (
            <p className="text-xs text-purple-400 text-center">
              💡 {SUBSYSTEMS.find(s => s.id === recommended)?.name} may help right now
            </p>
          )}
        </CardContent>
      </Card>

      {/* Routing Dialog */}
      <AnimatePresence>
        {activeSubsystem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-md rounded-xl border p-6 bg-background",
                activeSubsystem.borderColor
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-3 rounded-full", activeSubsystem.bgColor, activeSubsystem.color)}>
                    {activeSubsystem.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeSubsystem.name}</h3>
                    <p className="text-sm text-muted-foreground">{activeSubsystem.purpose}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Prompt */}
              <p className={cn("text-sm mb-4 italic", activeSubsystem.color)}>
                "{activeSubsystem.prompt}"
              </p>

              {/* Input */}
              {!response && (
                <div className="space-y-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share what's on your mind... (this stays private)"
                    className="min-h-[100px] resize-none"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                      </motion.div>
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Processing...' : 'Route Thought'}
                  </Button>
                </div>
              )}

              {/* Response */}
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={cn(
                    "p-4 rounded-lg border",
                    activeSubsystem.borderColor,
                    activeSubsystem.bgColor
                  )}>
                    <p className="text-sm leading-relaxed italic">"{response}"</p>
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      — {activeSubsystem.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setResponse(null);
                        setInput('');
                      }}
                    >
                      Continue Routing
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleClose}
                    >
                      Feeling Better
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
