import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, Shield, Sparkles, Dog, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
  name: string;
  icon: React.ReactNode;
  state: string;
  stateColor: string;
  load: number;
  description: string;
}

function CharacterCard({ name, icon, state, stateColor, load, description }: CharacterCardProps) {
  return (
    <Card className={cn(
      "border transition-all duration-300",
      load >= 70 ? "border-red-500/50 bg-red-950/20" :
      load >= 40 ? "border-yellow-500/50 bg-yellow-950/20" :
      "border-emerald-500/30 bg-emerald-950/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            load >= 70 ? "bg-red-500/20 text-red-400" :
            load >= 40 ? "bg-yellow-500/20 text-yellow-400" :
            "bg-emerald-500/20 text-emerald-400"
          )}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{name}</h4>
              <span className={cn("text-xs font-medium", stateColor)}>
                {state}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  load >= 70 ? "bg-red-500" :
                  load >= 40 ? "bg-yellow-500" :
                  "bg-emerald-500"
                )}
                style={{ width: `${load}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CharacterStatus() {
  const load = useCognitiveLoad();
  
  const characters = [
    {
      name: "Dorothy",
      icon: <Crown className="h-4 w-4" />,
      state: load.dorothyState === 'paralyzed' ? '🚫 Paralyzed' : 
             load.dorothyState === 'wavering' ? '⚖️ Wavering' : '👑 Decisive',
      stateColor: load.dorothyState === 'paralyzed' ? 'text-red-400' : 
                  load.dorothyState === 'wavering' ? 'text-yellow-400' : 'text-emerald-400',
      load: load.executiveLoad,
      description: "Executive control & decision making"
    },
    {
      name: "Tin Man",
      icon: <Heart className="h-4 w-4" />,
      state: load.tinManState === 'burnout' ? '🔥 Burnout' : 
             load.tinManState === 'stressed' ? '😓 Stressed' : '💚 Healthy',
      stateColor: load.tinManState === 'burnout' ? 'text-red-400' : 
                  load.tinManState === 'stressed' ? 'text-yellow-400' : 'text-emerald-400',
      load: load.emotionalLoad,
      description: "Emotional processing & burnout monitor"
    },
    {
      name: "Scarecrow",
      icon: <Brain className="h-4 w-4" />,
      state: load.scarecrowState === 'scattered' ? '🌀 Scattered' : 
             load.scarecrowState === 'foggy' ? '🌫️ Foggy' : '🧠 Sharp',
      stateColor: load.scarecrowState === 'scattered' ? 'text-red-400' : 
                  load.scarecrowState === 'foggy' ? 'text-yellow-400' : 'text-emerald-400',
      load: load.logicLoad,
      description: "Logic, planning & memory sequencing"
    },
    {
      name: "Lion",
      icon: <Shield className="h-4 w-4" />,
      state: load.lionState === 'frozen' ? '❄️ Frozen' : 
             load.lionState === 'anxious' ? '😰 Anxious' : '🦁 Brave',
      stateColor: load.lionState === 'frozen' ? 'text-red-400' : 
                  load.lionState === 'anxious' ? 'text-yellow-400' : 'text-emerald-400',
      load: load.anxietyLevel,
      description: "Anxiety, fear & confidence levels"
    },
    {
      name: "Toto",
      icon: <Dog className="h-4 w-4" />,
      state: load.totoAlert ? '🚨 Alert!' : '🐕 Watching',
      stateColor: load.totoAlert ? 'text-amber-400' : 'text-emerald-400',
      load: load.totoAlert ? 80 : 20,
      description: "Impulse watchdog & drift detector"
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        Mental Subsystems
      </h3>
      <div className="grid gap-3">
        {characters.map((char) => (
          <CharacterCard key={char.name} {...char} />
        ))}
      </div>
    </div>
  );
}
