import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Target, 
  Clock, 
  Zap, 
  Shield,
  SkipForward,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlledBurnProps {
  isActive: boolean;
  questTitle: string;
  questDuration: number; // in minutes
  onComplete: () => void;
  onAbort: () => void;
}

export function ControlledBurn({ 
  isActive, 
  questTitle, 
  questDuration, 
  onComplete, 
  onAbort 
}: ControlledBurnProps) {
  const [timeLeft, setTimeLeft] = useState(questDuration * 60); // seconds
  const [phase, setPhase] = useState<'ignition' | 'burn' | 'cooldown'>('ignition');
  const [intensity, setIntensity] = useState(50);
  
  const totalSeconds = questDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  
  // Timer countdown
  useEffect(() => {
    if (!isActive || phase !== 'burn') return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase('cooldown');
          return 0;
        }
        return prev - 1;
      });
      
      // Intensity pulses higher as time runs out
      const remaining = timeLeft / totalSeconds;
      if (remaining < 0.2) {
        setIntensity(90);
      } else if (remaining < 0.5) {
        setIntensity(70);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive, phase, timeLeft, totalSeconds]);
  
  // Ignition phase
  useEffect(() => {
    if (isActive && phase === 'ignition') {
      const timer = setTimeout(() => setPhase('burn'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, phase]);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  
  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] overflow-hidden"
      >
        {/* Battle Focus Background */}
        <motion.div
          className={cn(
            "absolute inset-0 transition-colors duration-1000",
            phase === 'ignition' && "bg-gradient-to-b from-orange-950 via-red-950 to-black",
            phase === 'burn' && "bg-gradient-to-b from-red-950 via-black to-red-950",
            phase === 'cooldown' && "bg-gradient-to-b from-emerald-950 via-slate-950 to-black"
          )}
        >
          {/* Pulsing vignette */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-transparent to-black/50"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Fire particles during burn */}
          {phase === 'burn' && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: typeof window !== 'undefined' ? window.innerHeight : 800,
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
          {/* Ignition Phase */}
          {phase === 'ignition' && (
            <motion.div
              className="text-center space-y-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Flame className="h-24 w-24 mx-auto text-orange-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-orange-100">
                CONTROLLED BURN INITIATED
              </h2>
              <p className="text-orange-300/70">
                Entering Battle Focus...
              </p>
              <motion.div
                className="w-48 h-1 mx-auto bg-orange-950 rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3 }}
                />
              </motion.div>
            </motion.div>
          )}
          
          {/* Burn Phase */}
          {phase === 'burn' && (
            <motion.div
              className="w-full max-w-lg space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Combat objective */}
              <Card className="border-2 border-red-500/50 bg-black/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-red-400" />
                    <span className="text-xs uppercase tracking-wider text-red-400">Combat Objective</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{questTitle}</h3>
                  
                  {/* Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-400" />
                      <span className={cn(
                        "text-3xl font-mono font-bold",
                        timeLeft < 60 ? "text-red-400 animate-pulse" : "text-orange-300"
                      )}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm text-yellow-300">Intensity: {intensity}%</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <Progress 
                      value={progress} 
                      className="h-3 bg-red-950"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Action buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="ghost"
                  onClick={onAbort}
                  className="text-red-400/70 hover:text-red-400 hover:bg-red-950/50"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Abort Mission
                </Button>
                <Button
                  onClick={() => setPhase('cooldown')}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mission Complete
                </Button>
              </div>
              
              {/* Warning */}
              <motion.p
                className="text-center text-xs text-orange-400/60 flex items-center justify-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="h-3 w-3" />
                Cooldown will be enforced after burn
              </motion.p>
            </motion.div>
          )}
          
          {/* Cooldown Phase */}
          {phase === 'cooldown' && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="h-12 w-12 text-emerald-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-emerald-100">
                BURN COMPLETE
              </h2>
              <p className="text-emerald-300/70 max-w-md">
                Mission accomplished. Your nervous system is entering cooldown mode.
                Take a breath. You've earned this.
              </p>
              
              {/* Breathing guide */}
              <motion.div
                className="w-16 h-16 mx-auto rounded-full border-2 border-emerald-500/50"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 6, repeat: 3 }}
              />
              <p className="text-xs text-emerald-400/60">Breathe with the circle...</p>
              
              <Button
                onClick={onComplete}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Return to Emerald City
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}