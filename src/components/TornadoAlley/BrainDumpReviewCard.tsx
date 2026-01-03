import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  Timer, 
  Coffee, 
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import tornadoAlleyImg from "@/assets/tornado-alley.png";

interface SprintSession {
  duration: number; // minutes
  breakDuration: number;
  label: string;
}

const SPRINT_PRESETS: SprintSession[] = [
  { duration: 15, breakDuration: 5, label: "Quick Focus" },
  { duration: 25, breakDuration: 5, label: "Pomodoro" },
  { duration: 45, breakDuration: 10, label: "Deep Work" },
];

const FEELING_OPTIONS = [
  { emoji: "😊", label: "Great", value: "great" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😰", label: "Stressed", value: "stressed" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "🔥", label: "Motivated", value: "motivated" },
];

interface BrainDumpReviewCardProps {
  onStartBrainDump?: () => void;
}

export function BrainDumpReviewCard({ onStartBrainDump }: BrainDumpReviewCardProps) {
  const [currentFeeling, setCurrentFeeling] = useState<string | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<SprintSession | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  const startSprint = (sprint: SprintSession) => {
    setSelectedSprint(sprint);
    setTimeRemaining(sprint.duration * 60);
    setIsTimerActive(true);
    setIsBreak(false);
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeRemaining(0);
    setSelectedSprint(null);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = selectedSprint 
    ? ((selectedSprint.duration * 60 - timeRemaining) / (selectedSprint.duration * 60)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="overflow-hidden border-2 border-primary/20 shadow-glow hover:shadow-medium transition-all">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
          <img 
            src={tornadoAlleyImg} 
            alt="Tornado Alley" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div>
              <h3 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                Tornado Alley
              </h3>
              <p className="text-sm text-muted-foreground">Brain Dump & focus sessions</p>
            </div>
            <Button onClick={onStartBrainDump} variant="secondary" size="sm" className="gap-1">
              <Sparkles className="w-4 h-4" />
              New Dump
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Feelings Check-in */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium">How are you feeling?</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {FEELING_OPTIONS.map((feeling) => (
                <button
                  key={feeling.value}
                  onClick={() => setCurrentFeeling(feeling.value)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm transition-all",
                    currentFeeling === feeling.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-primary/50 text-muted-foreground"
                  )}
                >
                  <span className="mr-1">{feeling.emoji}</span>
                  {feeling.label}
                </button>
              ))}
            </div>
            {currentFeeling && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 rounded-lg bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">
                  {currentFeeling === "stressed" && (
                    <><Lightbulb className="w-4 h-4 inline mr-1 text-amber-500" /> Try a short 15-min sprint to ease back in.</>
                  )}
                  {currentFeeling === "tired" && (
                    <><Coffee className="w-4 h-4 inline mr-1 text-amber-700" /> Consider a quick break first, then a gentle sprint.</>
                  )}
                  {currentFeeling === "motivated" && (
                    <><Sparkles className="w-4 h-4 inline mr-1 text-emerald-500" /> Ride that wave! Go for a 45-min deep work session.</>
                  )}
                  {currentFeeling === "great" && (
                    <><Heart className="w-4 h-4 inline mr-1 text-rose-500" /> Perfect state for focused work. Pick any sprint!</>
                  )}
                  {currentFeeling === "okay" && (
                    <><Timer className="w-4 h-4 inline mr-1 text-primary" /> A Pomodoro session is a solid choice.</>
                  )}
                </p>
              </motion.div>
            )}
          </div>

          {/* Sprint Timer */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Focus Sprint</span>
              {selectedSprint && (
                <Badge variant="secondary" className="ml-auto">
                  {isBreak ? "Break Time" : selectedSprint.label}
                </Badge>
              )}
            </div>

            {!selectedSprint ? (
              <div className="grid grid-cols-3 gap-2">
                {SPRINT_PRESETS.map((sprint) => (
                  <Button
                    key={sprint.label}
                    variant="outline"
                    className="flex-col h-auto py-3 hover:border-primary hover:bg-primary/5"
                    onClick={() => startSprint(sprint)}
                  >
                    <span className="text-lg font-bold">{sprint.duration}</span>
                    <span className="text-xs text-muted-foreground">min</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-foreground">
                    {formatTime(timeRemaining)}
                  </div>
                  <Progress value={progressPercent} className="mt-2 h-2" />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTimer}
                  >
                    {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BrainDumpReviewCard;
