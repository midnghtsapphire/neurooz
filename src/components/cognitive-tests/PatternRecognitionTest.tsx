import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, RotateCcw, Trophy, Target } from 'lucide-react';
import { useCognitiveTests } from '@/hooks/use-cognitive-tests';

interface Pattern {
  sequence: number[];
  answer: number;
  options: number[];
}

const generatePattern = (difficulty: number): Pattern => {
  const patternTypes = [
    // Arithmetic sequences
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const diff = Math.floor(Math.random() * (difficulty + 2)) + 1;
      const length = 4 + Math.min(difficulty, 2);
      const sequence = Array.from({ length }, (_, i) => start + diff * i);
      const answer = sequence[length - 1] + diff;
      return { sequence, answer };
    },
    // Geometric sequences
    () => {
      const start = Math.floor(Math.random() * 5) + 1;
      const ratio = 2;
      const length = 4;
      const sequence = Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
      const answer = sequence[length - 1] * ratio;
      return { sequence, answer };
    },
    // Fibonacci-like
    () => {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const sequence = [a, b];
      for (let i = 2; i < 5; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      const answer = sequence[4] + sequence[3];
      return { sequence, answer };
    },
  ];

  const patternFn = patternTypes[Math.floor(Math.random() * Math.min(patternTypes.length, difficulty + 1))];
  const { sequence, answer } = patternFn();

  // Generate wrong options
  const options = [answer];
  while (options.length < 4) {
    const wrong = answer + (Math.floor(Math.random() * 10) - 5);
    if (!options.includes(wrong) && wrong > 0) {
      options.push(wrong);
    }
  }

  return {
    sequence: sequence.slice(0, -1), // Remove last to show as "?"
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

interface PatternRecognitionTestProps {
  onComplete?: (score: number, correct: number, total: number) => void;
}

export function PatternRecognitionTest({ onComplete }: PatternRecognitionTestProps) {
  const { recordResult, getBaseline } = useCognitiveTests();
  const baseline = getBaseline('pattern_recognition');

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [difficulty, setDifficulty] = useState(1);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [totalRounds] = useState(10);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startGame = useCallback(() => {
    setGameState('playing');
    setRound(1);
    setCorrect(0);
    setDifficulty(1);
    setCurrentPattern(generatePattern(1));
    setTimeLeft(15);
    setShowFeedback(null);
  }, []);

  const handleAnswer = useCallback((answer: number) => {
    if (!currentPattern || showFeedback) return;

    const isCorrect = answer === currentPattern.answer;
    setShowFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setCorrect(c => c + 1);
      setDifficulty(d => Math.min(d + 0.5, 5));
    } else {
      setDifficulty(d => Math.max(d - 0.5, 1));
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (round >= totalRounds) {
        finishGame(correct + (isCorrect ? 1 : 0));
      } else {
        setRound(r => r + 1);
        setCurrentPattern(generatePattern(Math.floor(difficulty)));
        setTimeLeft(15);
      }
    }, 800);
  }, [currentPattern, round, totalRounds, correct, difficulty, showFeedback]);

  const finishGame = useCallback((finalCorrect: number) => {
    const score = (finalCorrect / totalRounds) * 100;
    setGameState('complete');

    recordResult.mutate({
      test_type: 'pattern_recognition',
      score,
      correct_answers: finalCorrect,
      total_questions: totalRounds,
      difficulty_level: Math.floor(difficulty),
      metadata: { final_difficulty: difficulty },
    });

    onComplete?.(score, finalCorrect, totalRounds);
  }, [totalRounds, difficulty, recordResult, onComplete]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleAnswer(-1); // Timeout = wrong answer
          return 15;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showFeedback, handleAnswer]);

  const score = (correct / totalRounds) * 100;

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Pattern Recognition</CardTitle>
          </div>
          {baseline && (
            <Badge variant="outline" className="text-xs">
              Best: {baseline.current_best_score?.toFixed(0)}%
            </Badge>
          )}
        </div>
        <CardDescription>
          Find the next number in the sequence
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-4"
            >
              <Target className="h-12 w-12 mx-auto text-accent/50" />
              <p className="text-sm text-muted-foreground">
                {totalRounds} patterns • Difficulty adapts to your skill
              </p>
              <Button onClick={startGame} className="gap-2">
                <Play className="h-4 w-4" />
                Start Test
              </Button>
            </motion.div>
          )}

          {gameState === 'playing' && currentPattern && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Progress bar */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Round {round}/{totalRounds}</span>
                <Progress value={(round / totalRounds) * 100} className="flex-1 h-1.5" />
                <span className={timeLeft <= 5 ? 'text-destructive font-medium' : ''}>
                  {timeLeft}s
                </span>
              </div>

              {/* Pattern display */}
              <div className="flex items-center justify-center gap-2 py-4">
                {currentPattern.sequence.map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-lg"
                  >
                    {num}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: currentPattern.sequence.length * 0.1 }}
                  className="w-12 h-12 rounded-lg bg-accent/20 border-2 border-dashed border-accent flex items-center justify-center font-mono font-bold text-lg text-accent"
                >
                  ?
                </motion.div>
              </div>

              {/* Answer options */}
              <div className="grid grid-cols-2 gap-2">
                {currentPattern.options.map((option, i) => (
                  <Button
                    key={i}
                    variant={
                      showFeedback && option === currentPattern.answer
                        ? 'default'
                        : showFeedback === 'wrong' && option !== currentPattern.answer
                        ? 'outline'
                        : 'outline'
                    }
                    className={`h-12 font-mono text-lg ${
                      showFeedback === 'correct' && option === currentPattern.answer
                        ? 'bg-green-500 text-white'
                        : showFeedback === 'wrong' && option === currentPattern.answer
                        ? 'bg-green-500/50'
                        : ''
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={!!showFeedback}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center font-medium ${
                    showFeedback === 'correct' ? 'text-green-500' : 'text-destructive'
                  }`}
                >
                  {showFeedback === 'correct' ? '✓ Correct!' : '✗ Wrong'}
                </motion.div>
              )}
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
              <Trophy className={`h-12 w-12 mx-auto ${score >= 70 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-bold">{score.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">
                  {correct}/{totalRounds} correct
                </p>
              </div>
              
              {baseline && baseline.baseline_score && (
                <p className="text-xs text-muted-foreground">
                  {score > baseline.baseline_score 
                    ? `🎉 ${(score - baseline.baseline_score).toFixed(0)}% above baseline!`
                    : `Baseline: ${baseline.baseline_score.toFixed(0)}%`
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
