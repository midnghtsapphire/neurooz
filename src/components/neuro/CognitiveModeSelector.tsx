import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNeuroProfile, NeuroProfile, NEURO_PROFILE_INFO } from "@/hooks/use-neuro-profile";
import { useDeviceSensors } from "@/hooks/use-device-sensors";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Check, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CognitiveModeSelectorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

// Auto-detection logic based on sensors and time
function useRecommendedProfile(): NeuroProfile | null {
  const sensors = useDeviceSensors();
  const [recommendation, setRecommendation] = useState<NeuroProfile | null>(null);

  useEffect(() => {
    // Night time detection (10pm - 6am)
    const hour = new Date().getHours();
    const isNightTime = hour >= 22 || hour < 6;
    const isLateNight = hour >= 0 && hour < 5;

    // Low battery might indicate long session / fatigue
    const isLowBattery = sensors.batteryLevel !== null && sensors.batteryLevel < 20;

    // Dark environment
    const isDarkEnvironment = sensors.ambientLight === "dark" || sensors.ambientLight === "dim";

    // Check reduced motion preference from media query
    const prefersReducedMotion = typeof window !== "undefined" 
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
      : false;

    // Recommendation logic
    if (isLateNight && isDarkEnvironment) {
      setRecommendation("vampire");
    } else if (isNightTime && isDarkEnvironment) {
      setRecommendation("vampire");
    } else if (prefersReducedMotion) {
      setRecommendation("asd");
    } else if (isLowBattery) {
      setRecommendation("fatigue");
    } else {
      setRecommendation(null);
    }
  }, [sensors]);

  return recommendation;
}

export function CognitiveModeSelector({ 
  open, 
  onOpenChange,
  showTrigger = true 
}: CognitiveModeSelectorProps) {
  const { profile, setProfile } = useNeuroProfile();
  const recommendedProfile = useRecommendedProfile();
  const [isOpen, setIsOpen] = useState(open ?? false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleSelectProfile = (newProfile: NeuroProfile) => {
    setProfile(newProfile);
    handleOpenChange(false);
  };

  const currentProfile = NEURO_PROFILE_INFO[profile];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-lg">{currentProfile.icon}</span>
            <span className="hidden sm:inline">{currentProfile.shortLabel}</span>
            <Settings2 className="h-3 w-3 opacity-50" />
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-muted/50 to-muted/30">
          <DialogTitle className="text-xl flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            Choose Your Cognitive Mode
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Each mode is a neurological contract — your system adapts to you, not the other way around.
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6">
            {/* Recommendation Banner */}
            <AnimatePresence>
              {recommendedProfile && recommendedProfile !== profile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl border-2 border-primary/30 bg-primary/5"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Recommended for you right now
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Based on time, environment, and device settings, you might feel better in{" "}
                        <strong>{NEURO_PROFILE_INFO[recommendedProfile].label}</strong>
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleSelectProfile(recommendedProfile)}
                      className="shrink-0"
                    >
                      Try it
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(NEURO_PROFILE_INFO) as NeuroProfile[]).map((p) => {
                const info = NEURO_PROFILE_INFO[p];
                const isActive = profile === p;
                const isRecommended = recommendedProfile === p;

                return (
                  <motion.div
                    key={p}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all duration-200 overflow-hidden h-full",
                        isActive && "ring-2 ring-primary shadow-lg",
                        !isActive && "hover:border-primary/50"
                      )}
                      onClick={() => handleSelectProfile(p)}
                    >
                      {/* Gradient header */}
                      <div className={cn(
                        "h-2 bg-gradient-to-r",
                        info.color
                      )} />
                      
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                              <h3 className="font-semibold text-sm">{info.label}</h3>
                              {isRecommended && !isActive && (
                                <Badge variant="secondary" className="text-[10px] h-4 mt-0.5">
                                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                                  Suggested
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isActive && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">
                          {info.description}
                        </p>
                        
                        <div className="space-y-1">
                          {info.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <div className="h-1 w-1 rounded-full bg-primary/60" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                          {info.features.length > 3 && (
                            <p className="text-[10px] text-muted-foreground/70 pl-3">
                              +{info.features.length - 3} more
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer note */}
            <p className="text-xs text-muted-foreground text-center mt-6 max-w-lg mx-auto">
              This app adapts to your energy, focus, and nervous system — not the other way around.
              Your choice is always respected and can be changed anytime.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
