import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, CloudFog, Battery, Moon, Zap } from "lucide-react";

type UserState = "overloaded" | "foggy" | "exhausted" | "numb" | "ready";

interface OrientationConsoleProps {
  onStateSelect: (state: UserState) => void;
}

const states: { id: UserState; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "overloaded", label: "Overloaded", icon: <Zap className="w-6 h-6" />, description: "Too much happening" },
  { id: "foggy", label: "Foggy", icon: <CloudFog className="w-6 h-6" />, description: "Can't think clearly" },
  { id: "exhausted", label: "Exhausted", icon: <Battery className="w-6 h-6" />, description: "Running on empty" },
  { id: "numb", label: "Numb", icon: <Moon className="w-6 h-6" />, description: "Disconnected" },
  { id: "ready", label: "Ready", icon: <User className="w-6 h-6" />, description: "Let's build" },
];

export const OrientationConsole = ({ onStateSelect }: OrientationConsoleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative bg-deep-night-emerald p-6"
    >
      {/* Console glow */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-emerald/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Navigator mentor header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-emerald border border-gold/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-moon-silver text-sm font-medium">THE NAVIGATOR</span>
          </div>

          <p className="text-xl md:text-2xl text-clean-white leading-relaxed">
            "Right now your only job is to find your footing.
          </p>
          <p className="text-xl md:text-2xl text-moon-silver leading-relaxed">
            Not to be perfect.
          </p>
          <p className="text-xl md:text-2xl text-gold leading-relaxed">
            Just to be present."
          </p>
        </motion.div>

        {/* State selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-moon-silver text-center mb-6">Choose your current state:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {states.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => onStateSelect(state.id)}
                  className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-dark-emerald/50 border-moon-silver/20 hover:border-gold hover:bg-dark-emerald text-clean-white transition-all duration-300 group"
                >
                  <span className="text-moon-silver group-hover:text-gold transition-colors">
                    {state.icon}
                  </span>
                  <span className="font-semibold">{state.label}</span>
                  <span className="text-xs text-moon-silver/70">{state.description}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
