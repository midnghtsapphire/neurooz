import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, RotateCcw, Trophy, Clock } from 'lucide-react';
import { useCognitiveTests } from '@/hooks/use-cognitive-tests';

interface ReactionTimeTestProps {
  onComplete?: (avgTime: number, trials: number[]) => void;
}

export function ReactionTimeTest({ onComplete }: ReactionTimeTestProps) {
  const { recordResult, getBaseline } = useCognitiveTests();
  const baseline = getBaseline('reaction_time');

  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'clicked' | 'early' | 'complete'>('idle');
  const [trials, setTrials] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [round, setRound] = useState(0);
  const totalRounds = 5;

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = useCallback(() => {
    setGameState('waiting');
    
    // Random delay between 1.5-4 seconds
    const delay = 1500 + Math.random() * 2500;
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('ready');
    }, delay);
  }, []);

  const startGame = useCallback(() => {
    setTrials([]);
    setRound(1);
    setCurrentTime(0);
    startRound();
  }, [startRound]);

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
      return;
    }

    if (gameState === 'ready') {
      const reactionTime = performance.now() - startTimeRef.current;
      setCurrentTime(reactionTime);
      setTrials(prev => [...prev, reactionTime]);
      setGameState('clicked');
    }
  }, [gameState]);

  const nextRound = useCallback(() => {
    if (round >= totalRounds) {
      // Calculate score - lower is better, convert to 0-100 where 100 is best
      const avgTime = trials.reduce((a, b) => a + b, 0) / trials.length;
      // Score: 250ms = 100, 500ms = 50, 750ms+ = 0
      const score = Math.max(0, Math.min(100, (750 - avgTime) / 5));

      setGameState('complete');
      
      recordResult.mutate({
        test_type: 'reaction_time',
        score,
        correct_answers: trials.length,
        total_questions: totalRounds,
        metadata: { 
          trials_json: JSON.stringify(trials), 
          average_ms: avgTime,
          best_ms: Math.min(...trials),
          worst_ms: Math.max(...trials),
        },
      });

      onComplete?.(avgTime, trials);
    } else {
      setRound(r => r + 1);
      startRound();
    }
  }, [round, totalRounds, trials, startRound, recordResult, onComplete]);

  const retryAfterEarly = useCallback(() => {
    startRound();
  }, [startRound]);

  const avgTime = trials.length > 0 
    ? trials.reduce((a, b) => a + b, 0) / trials.length 
    : 0;

  const getTimeColor = (ms: number) => {
    if (ms < 250) return 'text-green-500';
    if (ms < 400) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Reaction Time</CardTitle>
          </div>
          {baseline && (
            <Badge variant="outline" className="text-xs">
              Best: {baseline.current_best_score?.toFixed(0)}
            </Badge>
          )}
        </div>
        <CardDescription>
          Click as fast as you can when the screen turns green
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
              <Clock className="h-12 w-12 mx-auto text-accent/50" />
              <p className="text-sm text-muted-foreground">
                {totalRounds} trials • Tests processing speed
              </p>
              <Button onClick={startGame} className="gap-2">
                <Play className="h-4 w-4" />
                Start Test
              </Button>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClick}
              className="cursor-pointer"
            >
              <div className="bg-destructive/20 rounded-lg p-12 text-center transition-colors">
                <p className="text-lg font-medium text-destructive">Wait for green...</p>
                <p className="text-xs text-muted-foreground mt-2">Round {round}/{totalRounds}</p>
              </div>
            </motion.div>
          )}

          {gameState === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClick}
              className="cursor-pointer"
            >
              <div className="bg-green-500 rounded-lg p-12 text-center">
                <p className="text-lg font-bold text-white">CLICK NOW!</p>
              </div>
            </motion.div>
          )}

          {gameState === 'clicked' && (
            <motion.div
              key="clicked"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-4"
            >
              <p className={`text-3xl font-mono font-bold ${getTimeColor(currentTime)}`}>
                {currentTime.toFixed(0)}ms
              </p>
              <p className="text-sm text-muted-foreground">
                {currentTime < 250 ? 'Excellent!' : currentTime < 400 ? 'Good!' : 'Keep practicing!'}
              </p>
              
              {/* Show all trials so far */}
              <div className="flex justify-center gap-2 flex-wrap">
                {trials.map((t, i) => (
                  <Badge key={i} variant="outline" className={`font-mono ${getTimeColor(t)}`}>
                    {t.toFixed(0)}ms
                  </Badge>
                ))}
              </div>

              <Button onClick={nextRound} className="gap-2">
                {round >= totalRounds ? 'See Results' : 'Next Round'}
              </Button>
            </motion.div>
          )}

          {gameState === 'early' && (
            <motion.div
              key="early"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-4"
            >
              <p className="text-xl font-medium text-destructive">Too early!</p>
              <p className="text-sm text-muted-foreground">
                Wait for the screen to turn green
              </p>
              <Button onClick={retryAfterEarly} variant="outline">
                Try Again
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
              <Trophy className={`h-12 w-12 mx-auto ${avgTime < 300 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <div>
                <p className={`text-2xl font-mono font-bold ${getTimeColor(avgTime)}`}>
                  {avgTime.toFixed(0)}ms
                </p>
                <p className="text-sm text-muted-foreground">Average reaction time</p>
              </div>
              
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span>Best: {Math.min(...trials).toFixed(0)}ms</span>
                <span>•</span>
                <span>Worst: {Math.max(...trials).toFixed(0)}ms</span>
              </div>

              {baseline && baseline.baseline_score && (
                <p className="text-xs text-muted-foreground">
                  {avgTime < (750 - baseline.baseline_score * 5)
                    ? '🎉 New personal best!'
                    : `Previous best: ${(750 - baseline.baseline_score * 5).toFixed(0)}ms`
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
