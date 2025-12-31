import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface TornadoEntryProps {
  isOpen: boolean;
  onComplete: (content: string) => void;
  onSkip: () => void;
}

const WIZARD_LINES = [
  "Something brilliant just landed in my world.",
  "Let's sort your storm.",
];

export function TornadoEntry({ isOpen, onComplete, onSkip }: TornadoEntryProps) {
  const [phase, setPhase] = useState<'tornado' | 'wizard' | 'dump' | 'sorting'>('tornado');
  const [wizardLineIndex, setWizardLineIndex] = useState(0);
  const [dumpContent, setDumpContent] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  // Typewriter effect for wizard lines
  useEffect(() => {
    if (phase !== 'wizard') return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    const lineTimer = setTimeout(() => {
      if (wizardLineIndex < WIZARD_LINES.length - 1) {
        setWizardLineIndex(prev => prev + 1);
      } else {
        setTimeout(() => setPhase('dump'), 1500);
      }
    }, 2500);
    
    return () => {
      clearInterval(cursorInterval);
      clearTimeout(lineTimer);
    };
  }, [phase, wizardLineIndex]);
  
  // Initial tornado animation
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setPhase('wizard'), 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);
  
  const handleSubmit = useCallback(() => {
    if (dumpContent.trim()) {
      setPhase('sorting');
      setTimeout(() => onComplete(dumpContent), 2500);
    }
  }, [dumpContent, onComplete]);
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Tornado Phase */}
        {phase === 'tornado' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-800 to-slate-950 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Spinning vortex layers */}
            <div className="relative">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-emerald-500/30"
                  style={{
                    width: 100 + i * 80,
                    height: 100 + i * 80,
                    left: -(50 + i * 40),
                    top: -(50 + i * 40),
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                />
              ))}
              
              {/* Center eye */}
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            
            {/* Wind particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                }}
                animate={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                }}
              />
            ))}
            
            <motion.p
              className="absolute bottom-20 text-emerald-400/70 text-lg tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Entering Oz...
            </motion.p>
          </motion.div>
        )}
        
        {/* Wizard Speaking Phase */}
        {phase === 'wizard' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-background to-background flex flex-col items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Wizard glow */}
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/30 to-yellow-400/20 mb-8 flex items-center justify-center"
              animate={{ 
                boxShadow: ['0 0 30px rgba(16,185,129,0.3)', '0 0 60px rgba(16,185,129,0.5)', '0 0 30px rgba(16,185,129,0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-16 w-16 text-emerald-400" />
            </motion.div>
            
            {/* Wizard dialogue */}
            <div className="text-center max-w-lg space-y-4">
              {WIZARD_LINES.slice(0, wizardLineIndex + 1).map((line, i) => (
                <motion.p
                  key={i}
                  className="text-2xl text-emerald-100 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  "{line}"
                  {i === wizardLineIndex && showCursor && <span className="ml-1">|</span>}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Brain Dump Phase */}
        {phase === 'dump' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-background to-background flex flex-col items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-full max-w-2xl space-y-6">
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex w-16 h-16 rounded-full bg-emerald-500/20 items-center justify-center mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="h-8 w-8 text-emerald-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-emerald-100 mb-2">Dump Your Storm</h2>
                <p className="text-emerald-300/70">
                  Ideas, stress, fears, dreams, random chaos — no structure, no judgment. Just purge.
                </p>
              </div>
              
              <Textarea
                value={dumpContent}
                onChange={(e) => setDumpContent(e.target.value)}
                placeholder="Start typing everything on your mind... 

Tasks you're avoiding, ideas you can't stop thinking about, worries, dreams, phone calls you need to make, random thoughts...

Let it all out. The Wizard will help sort the storm."
                className="min-h-[250px] bg-emerald-950/50 border-emerald-500/30 text-emerald-100 placeholder:text-emerald-500/50 resize-none text-lg"
              />
              
              <div className="flex gap-4 justify-center">
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-emerald-400/70 hover:text-emerald-400"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!dumpContent.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sort My Storm
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Sorting Phase */}
        {phase === 'sorting' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-background to-background flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-center space-y-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-12 w-12 text-emerald-400" />
              </motion.div>
              <p className="text-2xl text-emerald-100 font-light">
                "Your storm has shape.<br />Let me show you what weighs the most."
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
