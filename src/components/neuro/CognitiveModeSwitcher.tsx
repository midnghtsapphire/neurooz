import { Brain, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CognitiveMode = "flow" | "power" | "recovery";

interface CognitiveModeSwitcherProps {
  mode: CognitiveMode;
  onChange: (mode: CognitiveMode) => void;
  onPowerModeRequest?: () => void; // For consent flow
}

const MODE_CONFIG = {
  flow: {
    icon: Brain,
    label: "Flow",
    description: "Brain-safe vertical focus",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    ring: "ring-emerald-500",
  },
  power: {
    icon: Zap,
    label: "Power",
    description: "High-capacity planning",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    ring: "ring-amber-500",
  },
  recovery: {
    icon: Heart,
    label: "Recovery",
    description: "Ultra-simple, one thing only",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    ring: "ring-rose-500",
  },
};

export function CognitiveModeSwitcher({ 
  mode, 
  onChange, 
  onPowerModeRequest 
}: CognitiveModeSwitcherProps) {
  const handleModeClick = (newMode: CognitiveMode) => {
    if (newMode === "power" && mode !== "power" && onPowerModeRequest) {
      onPowerModeRequest();
    } else {
      onChange(newMode);
    }
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
      {(Object.keys(MODE_CONFIG) as CognitiveMode[]).map((m) => {
        const config = MODE_CONFIG[m];
        const Icon = config.icon;
        const isActive = mode === m;

        return (
          <Button
            key={m}
            variant="ghost"
            size="sm"
            onClick={() => handleModeClick(m)}
            className={cn(
              "gap-1.5 h-8 px-2 sm:px-3 transition-all",
              isActive && config.bg,
              isActive && "ring-2",
              isActive && config.ring
            )}
            title={config.description}
          >
            <Icon className={cn("h-4 w-4", isActive && config.color)} />
            <span className={cn(
              "text-xs font-medium hidden sm:inline",
              isActive && config.color
            )}>
              {config.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export function CognitiveModeIndicator({ mode }: { mode: CognitiveMode }) {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
      config.bg,
      config.color
    )}>
      <Icon className="h-3 w-3" />
      <span>{config.label} Mode</span>
    </div>
  );
}
