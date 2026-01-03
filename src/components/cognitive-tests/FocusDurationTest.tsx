import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Focus, Play, RotateCcw, Trophy, Timer } from 'lucide-react';
import { useCognitiveTests } from '@/hooks/use-cognitive-tests';

interface FocusDurationTestProps {
  onComplete?: (duration: number, distractions: number) => void;
}

export function FocusDurationTest({ onComplete }: FocusDurationTestProps) {
  const { recordResult, getBaseline } = useCognitiveTests();
  const baseline = getBaseline('focus_duration');

  const [gameState, setGameState] = useState<'idle' | 'focusing' | 'distracted' | 'complete'>('idle');
  const [duration, setDuration] = useState(0);
  const [distractionCount, setDistractionCount] = useState(0);
  const [currentDistraction, setCurrentDistraction] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const distractionRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseInsideRef = useRef(false);
  const maxDuration = 120; // 2 minutes max

  const distractions = [
    "🔔 New notification!",
    "📱 Check your phone?",
    "💭 Random thought...",
    "🍕 Feeling hungry?",
    "📧 Unread emails...",
    "🎵 That song stuck in your head",
    "🐱 Cat videos exist...",
  ];

  const startGame = useCallback(() => {
    setDuration(0);
    setDistractionCount(0);
    setCurrentDistraction(null);
    setGameState('focusing');
    isMouseInsideRef.current = false;

    // Start timer
    intervalRef.current = setInterval(() => {
      setDuration(d => {
        if (d >= maxDuration) {
          finishGame(maxDuration, 0);
          return maxDuration;
        }
        return d + 1;
      });
    }, 1000);

    // Start showing distractions
    scheduleDistraction();
  }, []);

  const scheduleDistraction = useCallback(() => {
    const delay = 5000 + Math.random() * 10000; // 5-15 seconds
    distractionRef.current = setTimeout(() => {
      if (gameState === 'focusing') {
        const randomDistraction = distractions[Math.floor(Math.random() * distractions.length)];
        setCurrentDistraction(randomDistraction);
        
        // Hide after 3 seconds
        setTimeout(() => {
          setCurrentDistraction(null);
          scheduleDistraction();
        }, 3000);
      }
    }, delay);
  }, [gameState]);

  const handleMouseEnter = useCallback(() => {
    if (gameState !== 'focusing') return;
    isMouseInsideRef.current = true;
  }, [gameState]);

  const handleMouseLeave = useCallback(() => {
    if (gameState !== 'focusing') return;
    
    if (isMouseInsideRef.current) {
      setDistractionCount(c => c + 1);
      isMouseInsideRef.current = false;
      
      // Flash the card red briefly
      setGameState('distracted');
      setTimeout(() => {
        setGameState('focusing');
      }, 500);
    }
  }, [gameState]);

  const finishGame = useCallback((finalDuration: number, finalDistractions: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (distractionRef.current) clearTimeout(distractionRef.current);
    
    // Score based on duration (max 100) with penalty for distractions
    const durationScore = (finalDuration / maxDuration) * 100;
    const penalty = finalDistractions * 5;
    const finalScore = Math.max(0, durationScore - penalty);

    setGameState('complete');

    recordResult.mutate({
      test_type: 'focus_duration',
      score: finalScore,
      duration_seconds: finalDuration,
      metadata: { 
        distractions: finalDistractions,
        raw_duration: finalDuration,
      },
    });

    onComplete?.(finalDuration, finalDistractions);
  }, [recordResult, onComplete]);

  const handleEndSession = useCallback(() => {
    finishGame(duration, distractionCount);
  }, [duration, distractionCount, finishGame]);

  // Move target periodically
  useEffect(() => {
    if (gameState !== 'focusing') return;

    const moveTarget = () => {
      setTargetPosition({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      });
    };

    const interval = setInterval(moveTarget, 3000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (distractionRef.current) clearTimeout(distractionRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Focus className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Focus Duration</CardTitle>
          </div>
          {baseline && baseline.current_best_score && (
            <Badge variant="outline" className="text-xs">
              Best: {baseline.current_best_score.toFixed(0)}
            </Badge>
          )}
        </div>
        <CardDescription>
          Keep your cursor on the target • Don't get distracted
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-4"
            >
              <Timer className="h-12 w-12 mx-auto text-accent/50" />
              <p className="text-sm text-muted-foreground">
                Keep your cursor inside the target zone
              </p>
              <p className="text-xs text-muted-foreground">
                Moving the cursor outside = distraction penalty
              </p>
              <Button onClick={startGame} className="gap-2">
                <Play className="h-4 w-4" />
                Start Focus Session
              </Button>
            </motion.div>
          )}

          {(gameState === 'focusing' || gameState === 'distracted') && (
            <motion.div
              key="focusing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Stats bar */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-lg">{formatTime(duration)}</span>
                <Badge variant={distractionCount > 0 ? 'destructive' : 'secondary'}>
                  {distractionCount} distraction{distractionCount !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Focus area */}
              <div
                className={`relative h-48 rounded-lg transition-colors cursor-crosshair overflow-hidden ${
                  gameState === 'distracted' 
                    ? 'bg-destructive/20 border-destructive' 
                    : 'bg-muted/30 border-muted'
                } border-2`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Moving target */}
                <motion.div
                  className="absolute w-16 h-16 rounded-full bg-accent/30 border-2 border-accent flex items-center justify-center"
                  animate={{
                    left: `${targetPosition.x}%`,
                    top: `${targetPosition.y}%`,
                  }}
                  transition={{ type: 'spring', damping: 20 }}
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="w-4 h-4 rounded-full bg-accent" />
                </motion.div>

                {/* Instruction */}
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                  Keep cursor inside this area
                </p>
              </div>

              {/* Distraction popup */}
              <AnimatePresence>
                {currentDistraction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
                  >
                    {currentDistraction}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button onClick={handleEndSession} variant="outline" className="w-full">
                End Session
              </Button>
            </motion.div>
          )}

          {gameState === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-4"
            >
              <Trophy className={`h-12 w-12 mx-auto ${duration >= 60 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-mono font-bold">{formatTime(duration)}</p>
                <p className="text-sm text-muted-foreground">Focus duration</p>
              </div>

              <div className="text-xs text-muted-foreground">
                {distractionCount === 0 
                  ? '🎯 Perfect focus!' 
                  : `${distractionCount} distraction${distractionCount !== 1 ? 's' : ''}`
                }
              </div>

              {baseline && baseline.current_best_score && (
                <p className="text-xs text-muted-foreground">
                  {((duration / maxDuration) * 100) > baseline.current_best_score
                    ? '🎉 New personal best!'
                    : `Previous best score: ${baseline.current_best_score.toFixed(0)}`
                  }
                </p>
              )}

              <Button onClick={startGame} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
