import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { learnData } from "@/lib/learn-data";
import { Sparkles } from "lucide-react";

type CognitiveMode = "flow" | "power" | "recovery";

interface ModeIndicatorPillProps {
  mode: CognitiveMode;
  compact?: boolean;
  onClick?: () => void;
}

const modeConfig = {
  flow: {
    label: "Flow Mode",
    shortLabel: "Flow",
    tagline: "One step at a time",
    icon: "🧠",
    colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    relatedModes: ["FlowForge", "ClearPath"],
  },
  power: {
    label: "Power Mode",
    shortLabel: "Power",
    tagline: "More info at once",
    icon: "⚡",
    colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    relatedModes: ["FocusFlow", "NightWeave"],
  },
  recovery: {
    label: "Recovery Mode",
    shortLabel: "Recovery",
    tagline: "Only next safe step",
    icon: "💚",
    colorClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    relatedModes: ["SoftReset", "LowEnergy"],
  },
};

export function ModeIndicatorPill({ mode, compact = false, onClick }: ModeIndicatorPillProps) {
  const config = modeConfig[mode];
  const relatedInfo = config.relatedModes
    .map((m) => learnData.modes[m as keyof typeof learnData.modes])
    .filter(Boolean);

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <Badge
          variant="outline"
          className={`${config.colorClass} cursor-pointer gap-1.5 transition-all hover:scale-105`}
          onClick={onClick}
        >
          <span>{config.icon}</span>
          <span className="hidden sm:inline">
            {compact ? config.shortLabel : config.label}
          </span>
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-4" side="bottom" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <p className="font-semibold">{config.label}</p>
              <p className="text-xs text-muted-foreground">{config.tagline}</p>
            </div>
          </div>

          {relatedInfo.length > 0 && (
            <div className="pt-2 border-t space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Related Oz Modes
              </p>
              {relatedInfo.map((info) => (
                <div key={info.id} className="flex items-center gap-2 text-sm">
                  <span>{info.icon}</span>
                  <span className="font-medium">{info.title}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2 border-t">
            Tap to change mode
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
