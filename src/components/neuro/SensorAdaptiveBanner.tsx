import { useDeviceSensors } from "@/hooks/use-device-sensors";
import { useCognitiveMode } from "@/hooks/use-cognitive-mode";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Heart, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SensorAdaptiveBanner() {
  const sensors = useDeviceSensors();
  const { mode, setMode } = useCognitiveMode();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if no suggestion, or if already in suggested mode, or dismissed
  if (!sensors.suggestedMode || sensors.suggestedMode === mode || dismissed) {
    return null;
  }

  const modeConfig = {
    flow: { icon: Brain, color: "emerald", label: "Flow Mode" },
    power: { icon: Zap, color: "amber", label: "Power Mode" },
    recovery: { icon: Heart, color: "rose", label: "Recovery Mode" },
  };

  const suggested = modeConfig[sensors.suggestedMode];
  const Icon = suggested.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
          relative p-3 rounded-lg border mb-4
          bg-${suggested.color}-50 dark:bg-${suggested.color}-900/20
          border-${suggested.color}-200 dark:border-${suggested.color}-800
        `}
        style={{
          backgroundColor: suggested.color === "emerald" ? "rgb(236 253 245)" : 
                           suggested.color === "amber" ? "rgb(255 251 235)" : 
                           "rgb(255 241 242)",
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {sensors.adaptationReason}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Would you like to switch to {suggested.label}?
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setMode(sensors.suggestedMode!);
              setDismissed(true);
            }}
            className="gap-1 flex-shrink-0"
          >
            <Icon className="h-4 w-4" />
            Switch
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
