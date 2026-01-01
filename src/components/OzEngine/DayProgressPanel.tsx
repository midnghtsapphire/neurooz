import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Lock, 
  Unlock, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Ghost,
  Heart,
  Building2,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DayProgressPanelProps {
  currentDay: number;
  unlockedFeatures: {
    voidEvent: boolean;
    controlledBurn: boolean;
    emotionalRouting: boolean;
    cityExpansion: boolean;
    identityLock: boolean;
  };
  onAdvanceDay?: (day: number) => void;
  showDevControls?: boolean;
}

const DAY_MILESTONES = [
  { day: 1, title: "Arrival", description: "Storm sorted. First quest given.", icon: <Calendar className="h-4 w-4" /> },
  { day: 2, title: "Pattern Reveal", description: "Your drift tendencies revealed.", icon: <Calendar className="h-4 w-4" /> },
  { day: 3, title: "First Void", description: "Void Event unlocked. No punishment.", icon: <Ghost className="h-4 w-4" />, feature: 'voidEvent' },
  { day: 4, title: "Controlled Burn", description: "Your rage engine, harnessed.", icon: <Flame className="h-4 w-4" />, feature: 'controlledBurn' },
  { day: 5, title: "Emotional Routing", description: "Tin Man, Lion, Toto active.", icon: <Heart className="h-4 w-4" />, feature: 'emotionalRouting' },
  { day: 6, title: "City Expansion", description: "Upgrade your city with quests.", icon: <Building2 className="h-4 w-4" />, feature: 'cityExpansion' },
  { day: 7, title: "Identity Lock", description: "This city is yours.", icon: <Crown className="h-4 w-4" />, feature: 'identityLock' },
];

export function DayProgressPanel({ 
  currentDay, 
  unlockedFeatures, 
  onAdvanceDay,
  showDevControls = false 
}: DayProgressPanelProps) {
  const progress = (currentDay / 7) * 100;

  const isFeatureUnlocked = (feature?: string) => {
    if (!feature) return currentDay >= 1;
    return unlockedFeatures[feature as keyof typeof unlockedFeatures] ?? false;
  };

  return (
    <Card className="border-emerald-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            Journey Progress
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            Day {currentDay} of 7
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Arrival</span>
            <span>Identity Lock</span>
          </div>
        </div>

        {/* Day Milestones */}
        <div className="space-y-2">
          {DAY_MILESTONES.map((milestone) => {
            const isUnlocked = isFeatureUnlocked(milestone.feature);
            const isCurrent = milestone.day === currentDay;
            const isPast = milestone.day < currentDay;

            return (
              <motion.div
                key={milestone.day}
                initial={false}
                animate={{
                  opacity: isPast || isCurrent ? 1 : 0.5,
                  scale: isCurrent ? 1.02 : 1,
                }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  isCurrent && "bg-emerald-500/10 border border-emerald-500/30",
                  isPast && "bg-muted/30"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold",
                  isCurrent ? "bg-emerald-500 text-white" :
                  isPast ? "bg-emerald-500/30 text-emerald-400" :
                  "bg-muted text-muted-foreground"
                )}>
                  {milestone.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium truncate",
                      isCurrent && "text-emerald-400"
                    )}>
                      {milestone.title}
                    </span>
                    {milestone.feature && (
                      isUnlocked ? (
                        <Unlock className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {milestone.description}
                  </p>
                </div>
                <div className={cn(
                  "p-1.5 rounded",
                  isCurrent ? "bg-emerald-500/20 text-emerald-400" :
                  isPast ? "text-emerald-400/60" :
                  "text-muted-foreground"
                )}>
                  {milestone.icon}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dev Controls */}
        {showDevControls && onAdvanceDay && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Dev: Simulate Day</p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAdvanceDay(Math.max(1, currentDay - 1))}
                disabled={currentDay <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <Button
                    key={day}
                    variant={day === currentDay ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onAdvanceDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAdvanceDay(Math.min(7, currentDay + 1))}
                disabled={currentDay >= 7}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
