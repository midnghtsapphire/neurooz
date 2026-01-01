import { motion } from "framer-motion";
import { Signal, Zap, Shield } from "lucide-react";

interface ProgressMetersProps {
  signal: number;
  power: number;
  control: number;
}

export const ProgressMeters = ({ signal, power, control }: ProgressMetersProps) => {
  const meters = [
    { name: "Signal", value: signal, icon: <Signal className="w-4 h-4" />, max: 5 },
    { name: "Power", value: power, icon: <Zap className="w-4 h-4" />, max: 5 },
    { name: "Control", value: control, icon: <Shield className="w-4 h-4" />, max: 5 },
  ];

  return (
    <div className="flex gap-6 justify-center">
      {meters.map((meter) => (
        <div key={meter.name} className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-moon-silver">
            {meter.icon}
            <span className="text-sm font-medium">{meter.name}</span>
          </div>
          
          {/* Meter bar */}
          <div className="w-20 h-2 bg-deep-night-emerald rounded-full overflow-hidden border border-moon-silver/20">
            <motion.div
              className="h-full bg-gradient-to-r from-gold/80 to-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(meter.value / meter.max) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <span className="text-gold text-sm font-semibold">
            +{meter.value}
          </span>
        </div>
      ))}
    </div>
  );
};
