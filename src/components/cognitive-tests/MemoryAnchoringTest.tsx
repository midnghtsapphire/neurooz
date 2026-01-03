import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Play, RotateCcw, Trophy, Eye } from 'lucide-react';
import { useCognitiveTests } from '@/hooks/use-cognitive-tests';

const SYMBOLS = ['🌟', '🔷', '🔶', '⭐', '💎', '🌙', '☀️', '🌈', '🍀', '🎯', '🔮', '💫'];

interface MemoryAnchoringTestProps {
  onComplete?: (score: number, level: number) => void;
}

export function MemoryAnchoringTest({ onComplete }: MemoryAnchoringTestProps) {
  const { recordResult, getBaseline } = useCognitiveTests();
  const baseline = getBaseline('memory_anchoring');

  const [gameState, setGameState] = useState<'idle' | 'showing' | 'recall' | 'feedback' | 'complete'>('idle');
  const [level, setLevel] = useState(3); // Start with 3 items
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [highestLevel, setHighestLevel] = useState(3);
  const totalRounds = 8;

  const generateSequence = useCallback((length: number) => {
    const shuffled = [...SYMBOLS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, length);
  }, []);

  const startGame = useCallback(() => {
    setLevel(3);
    setRound(1);
    setCorrectRounds(0);
    setHighestLevel(3);
    
    const newSequence = generateSequence(3);
    setSequence(newSequence);
    setUserSequence([]);
    setGameState('showing');
  }, [generateSequence]);

  const startRecall = useCallback(() => {
    // Create available symbols including the correct ones plus distractors
    const distractors = SYMBOLS.filter(s => !sequence.includes(s)).slice(0, 4);
    const allSymbols = [...sequence, ...distractors].sort(() => Math.random() - 0.5);
    setAvailableSymbols(allSymbols);
    setUserSequence([]);
    setGameState('recall');
  }, [sequence]);

  const handleSymbolClick = useCallback((symbol: string) => {
    if (gameState !== 'recall') return;

    const newUserSequence = [...userSequence, symbol];
    setUserSequence(newUserSequence);

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((s, i) => s === sequence[i]);
      
      if (isCorrect) {
        setCorrectRounds(c => c + 1);
        setHighestLevel(h => Math.max(h, level));
        setLevel(l => Math.min(l + 1, 8)); // Cap at 8 items
      } else {
        setLevel(l => Math.max(l - 1, 3)); // Floor at 3 items
      }

      setGameState('feedback');
    }
  }, [gameState, userSequence, sequence, level]);

  const nextRound = useCallback(() => {
    if (round >= totalRounds) {
      // Calculate final score based on highest level achieved and accuracy
      const accuracyScore = (correctRounds / totalRounds) * 50;
      const levelScore = ((highestLevel - 3) / 5) * 50; // 3-8 range = 0-50 points
      const finalScore = accuracyScore + levelScore;

      setGameState('complete');

      recordResult.mutate({
        test_type: 'memory_anchoring',
        score: finalScore,
        correct_answers: correctRounds,
        total_questions: totalRounds,
        difficulty_level: highestLevel,
        metadata: { highest_level: highestLevel },
      });

      onComplete?.(finalScore, highestLevel);
    } else {
      setRound(r => r + 1);
      const newSequence = generateSequence(level);
      setSequence(newSequence);
      setUserSequence([]);
      setGameState('showing');
    }
  }, [round, totalRounds, correctRounds, highestLevel, level, generateSequence, recordResult, onComplete]);

  // Auto-advance from showing to recall after delay
  useEffect(() => {
    if (gameState === 'showing') {
      const timer = setTimeout(() => {
        startRecall();
      }, 1500 + level * 500); // More time for longer sequences
      return () => clearTimeout(timer);
    }
  }, [gameState, level, startRecall]);

  const isCorrect = userSequence.length === sequence.length && 
    userSequence.every((s, i) => s === sequence[i]);

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Memory Anchoring</CardTitle>
          </div>
          {baseline && baseline.current_best_score && (
            <Badge variant="outline" className="text-xs">
              Best: {baseline.current_best_score.toFixed(0)}%
            </Badge>
          )}
        </div>
        <CardDescription>
          Memorize and recall the sequence in order
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
              <Eye className="h-12 w-12 mx-auto text-accent/50" />
              <p className="text-sm text-muted-foreground">
                {totalRounds} rounds • Difficulty adapts to your memory
              </p>
              <Button onClick={startGame} className="gap-2">
                <Play className="h-4 w-4" />
                Start Test
              </Button>
            </motion.div>
          )}

          {gameState === 'showing' && (
            <motion.div
              key="showing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Round {round}/{totalRounds}</span>
                <Progress value={(round / totalRounds) * 100} className="flex-1 h-1.5" />
                <Badge variant="secondary" className="text-xs">Level {level}</Badge>
              </div>

              <p className="text-center text-sm text-muted-foreground">Memorize this sequence...</p>

              <div className="flex justify-center gap-3 flex-wrap py-4">
                {sequence.map((symbol, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-2xl"
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'recall' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Round {round}/{totalRounds}</span>
                <Progress value={(round / totalRounds) * 100} className="flex-1 h-1.5" />
              </div>

              <p className="text-center text-sm font-medium">
                Click symbols in order ({userSequence.length}/{sequence.length})
              </p>

              {/* User's current selection */}
              <div className="flex justify-center gap-2 min-h-[56px]">
                {userSequence.map((symbol, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-xl"
                  >
                    {symbol}
                  </motion.div>
                ))}
                {Array.from({ length: sequence.length - userSequence.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30" />
                ))}
              </div>

              {/* Available symbols */}
              <div className="flex justify-center gap-2 flex-wrap">
                {availableSymbols.map((symbol, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-12 h-12 text-xl p-0"
                    onClick={() => handleSymbolClick(symbol)}
                    disabled={userSequence.includes(symbol)}
                  >
                    {symbol}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-4"
            >
              <p className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-destructive'}`}>
                {isCorrect ? '✓ Perfect!' : '✗ Not quite'}
              </p>

              {!isCorrect && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Correct sequence:</p>
                  <div className="flex justify-center gap-2">
                    {sequence.map((s, i) => (
                      <span key={i} className="text-xl">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={nextRound} className="gap-2">
                {round >= totalRounds ? 'See Results' : 'Next Round'}
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
              <Trophy className={`h-12 w-12 mx-auto ${highestLevel >= 5 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-bold">Level {highestLevel}</p>
                <p className="text-sm text-muted-foreground">
                  {correctRounds}/{totalRounds} rounds correct
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Memory span: {highestLevel} items
              </p>

              {baseline && baseline.current_best_score && (
                <p className="text-xs text-muted-foreground">
                  {((correctRounds / totalRounds) * 50 + ((highestLevel - 3) / 5) * 50) > baseline.current_best_score
                    ? '🎉 New record!'
                    : `Previous best: ${baseline.current_best_score.toFixed(0)}%`
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
