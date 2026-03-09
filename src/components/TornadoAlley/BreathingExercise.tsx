/**
 * Breathing Exercise Component
 * Visual breathing pacer to help users calm down during overwhelm
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type BreathingPhase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  cycles: number;
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Box Breathing",
    description: "4-4-4-4 pattern used by Navy SEALs for stress relief",
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    cycles: 4,
  },
  {
    name: "4-7-8 Technique",
    description: "Dr. Weil's relaxation breath for anxiety and sleep",
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 0,
    cycles: 4,
  },
  {
    name: "Calm Breathing",
    description: "Simple 4-6 pattern for general stress relief",
    inhale: 4,
    hold: 0,
    exhale: 6,
    rest: 0,
    cycles: 5,
  },
  {
    name: "Deep Relaxation",
    description: "Longer exhale to activate parasympathetic nervous system",
    inhale: 5,
    hold: 2,
    exhale: 8,
    rest: 2,
    cycles: 4,
  },
];

export function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const phaseTime = {
      inhale: selectedPattern.inhale,
      hold: selectedPattern.hold,
      exhale: selectedPattern.exhale,
      rest: selectedPattern.rest,
    }[currentPhase];

    if (phaseTime === 0) {
      // Skip phases with 0 duration
      moveToNextPhase();
      return;
    }

    const interval = setInterval(() => {
      setPhaseProgress((prev) => {
        if (prev >= phaseTime) {
          moveToNextPhase();
          return 0;
        }
        return prev + 0.1;
      });
      setTotalSeconds((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, selectedPattern]);

  const moveToNextPhase = () => {
    const phases: BreathingPhase[] = ["inhale", "hold", "exhale", "rest"];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex === phases.length - 1) {
      // Completed one cycle
      setCompletedCycles((prev) => {
        const newCount = prev + 1;
        if (newCount >= selectedPattern.cycles) {
          // Exercise complete
          setIsActive(false);
          return newCount;
        }
        return newCount;
      });
      setCurrentPhase("inhale");
    } else {
      setCurrentPhase(phases[currentIndex + 1]);
    }
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setPhaseProgress(0);
    setCompletedCycles(0);
    setTotalSeconds(0);
  };

  const getCircleSize = () => {
    const baseSize = 120;
    const maxSize = 240;
    
    if (currentPhase === "inhale") {
      return baseSize + ((maxSize - baseSize) * (phaseProgress / selectedPattern.inhale));
    } else if (currentPhase === "exhale") {
      return maxSize - ((maxSize - baseSize) * (phaseProgress / selectedPattern.exhale));
    } else if (currentPhase === "hold") {
      return maxSize;
    }
    return baseSize;
  };

  const getPhaseText = () => {
    if (currentPhase === "inhale") return "Breathe In";
    if (currentPhase === "hold") return "Hold";
    if (currentPhase === "exhale") return "Breathe Out";
    return "Rest";
  };

  const getPhaseColor = () => {
    if (currentPhase === "inhale") return "from-sky-400 to-blue-500";
    if (currentPhase === "hold") return "from-amber-400 to-orange-500";
    if (currentPhase === "exhale") return "from-emerald-400 to-green-500";
    return "from-violet-400 to-purple-500";
  };

  const isComplete = completedCycles >= selectedPattern.cycles;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Pattern Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {breathingPatterns.map((pattern) => (
          <Card
            key={pattern.name}
            className={cn(
              "cursor-pointer transition-all",
              selectedPattern.name === pattern.name
                ? "border-emerald-500 bg-emerald-500/10"
                : "hover:border-muted-foreground/50"
            )}
            onClick={() => {
              setSelectedPattern(pattern);
              handleReset();
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{pattern.name}</CardTitle>
              <CardDescription className="text-xs">{pattern.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xs text-muted-foreground">
                {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                {pattern.rest > 0 && `-${pattern.rest}`} × {pattern.cycles} cycles
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breathing Visualizer */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Animated Circle */}
            <div className="relative flex items-center justify-center h-64">
              <motion.div
                className={cn(
                  "rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center",
                  getPhaseColor()
                )}
                animate={{
                  width: getCircleSize(),
                  height: getCircleSize(),
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <div className="text-center text-white">
                  <div className="text-2xl font-bold mb-1">{getPhaseText()}</div>
                  <div className="text-5xl font-bold">
                    {Math.ceil(
                      {
                        inhale: selectedPattern.inhale - phaseProgress,
                        hold: selectedPattern.hold - phaseProgress,
                        exhale: selectedPattern.exhale - phaseProgress,
                        rest: selectedPattern.rest - phaseProgress,
                      }[currentPhase] || 0
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Progress Info */}
            <div className="text-center space-y-2">
              <div className="text-lg text-muted-foreground">
                Cycle {completedCycles + 1} of {selectedPattern.cycles}
              </div>
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-400 text-xl font-semibold"
                >
                  ✨ Exercise Complete! ✨
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!isActive && !isComplete ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </Button>
              ) : null}
              
              {isActive ? (
                <Button
                  size="lg"
                  onClick={handlePause}
                  variant="outline"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              ) : null}
              
              {(completedCycles > 0 || isComplete) && (
                <Button
                  size="lg"
                  onClick={handleReset}
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              )}
            </div>

            {/* Tips */}
            {!isActive && completedCycles === 0 && (
              <div className="max-w-md text-center text-sm text-muted-foreground space-y-2">
                <p>Find a comfortable position and relax your shoulders.</p>
                <p>Follow the visual guide and breathe naturally through your nose.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
