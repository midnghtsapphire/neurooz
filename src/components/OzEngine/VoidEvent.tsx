import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Compass, Sparkles, ArrowRight } from "lucide-react";

interface VoidEventProps {
  onReturn: (refocusedGoal: string) => void;
}

const VOID_SCENARIOS = [
  {
    name: "Deep Space",
    bg: "bg-gradient-to-b from-black via-slate-950 to-black",
    description: "You've drifted into the void between stars.",
    particles: "bg-white/20",
  },
  {
    name: "White Desert",
    bg: "bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300",
    description: "You're standing in endless white sand. No landmarks.",
    particles: "bg-stone-400/30",
    darkText: true,
  },
  {
    name: "Frozen Plain",
    bg: "bg-gradient-to-b from-slate-800 via-blue-950 to-slate-900",
    description: "Ice stretches in every direction. Time feels frozen.",
    particles: "bg-blue-300/20",
  },
  {
    name: "The Grid",
    bg: "bg-black",
    description: "You're standing on a floating black grid. Nothing else exists.",
    particles: "bg-emerald-500/10",
    showGrid: true,
  },
];

export function VoidEvent({ onReturn }: VoidEventProps) {
  const load = useCognitiveLoad();
  const [phase, setPhase] = useState<'fade' | 'void' | 'question' | 'answer'>('fade');
  const [scenario] = useState(() => VOID_SCENARIOS[Math.floor(Math.random() * VOID_SCENARIOS.length)]);
  const [answer, setAnswer] = useState("");
  
  // Only show if drift level is critical
  if (!load.isInVoid) return null;
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('void'), 2000);
    const timer2 = setTimeout(() => setPhase('question'), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  const handleReturn = () => {
    if (answer.trim()) {
      onReturn(answer.trim());
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] overflow-hidden"
      >
        {/* Fade Phase */}
        {phase === 'fade' && (
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
        )}
        
        {/* Void Phase */}
        {(phase === 'void' || phase === 'question' || phase === 'answer') && (
          <motion.div
            className={`absolute inset-0 ${scenario.bg} flex flex-col items-center justify-center p-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Grid overlay for Grid scenario */}
            {scenario.showGrid && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
            )}
            
            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${scenario.particles}`}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                }}
                animate={{
                  y: [null, Math.random() * 100 - 50],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
            
            {/* Content */}
            <motion.div
              className="relative z-10 max-w-xl text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Compass icon */}
              <motion.div
                className="mx-auto"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Compass className={`h-16 w-16 ${scenario.darkText ? 'text-stone-600' : 'text-white/40'}`} />
              </motion.div>
              
              {/* Scenario description */}
              <motion.p
                className={`text-lg ${scenario.darkText ? 'text-stone-600' : 'text-white/60'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {scenario.description}
              </motion.p>
              
              {/* The Question */}
              {(phase === 'question' || phase === 'answer') && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className={`text-2xl font-light ${scenario.darkText ? 'text-stone-800' : 'text-white'}`}>
                    "What were you <span className="font-semibold text-emerald-400">actually</span> trying to do<br />
                    before you left the planet?"
                  </p>
                  
                  <Textarea
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (phase !== 'answer') setPhase('answer');
                    }}
                    placeholder="My real goal was..."
                    className={`min-h-[100px] max-w-md mx-auto resize-none ${
                      scenario.darkText 
                        ? 'bg-white/80 border-stone-400 text-stone-800 placeholder:text-stone-500'
                        : 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
                    }`}
                  />
                  
                  {phase === 'answer' && answer.trim() && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Button
                        onClick={handleReturn}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Return to Oz
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {/* Drift level indicator */}
              <motion.p
                className={`text-xs ${scenario.darkText ? 'text-stone-500' : 'text-white/30'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Orbital drift: {Math.round(load.driftLevel)}%
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}