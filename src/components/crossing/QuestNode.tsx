import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Circle, ChevronRight } from "lucide-react";

interface QuestAction {
  layer: string;
  action: string;
}

interface QuestNodeProps {
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  actions: QuestAction[];
  meterName: string;
  meterValue: number;
  onComplete: () => void;
  isComplete: boolean;
}

export const QuestNode = ({
  name,
  subtitle,
  icon,
  actions,
  meterName,
  meterValue,
  onComplete,
  isComplete,
}: QuestNodeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleStepComplete = () => {
    if (currentStep < actions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletion(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  if (isComplete) {
    return (
      <Card className="bg-dark-emerald/50 border-gold/30 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-clean-white">{name}</h3>
            <p className="text-gold text-sm">{meterName} +{meterValue} ✓</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-emerald border-moon-silver/20 p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {showCompletion ? (
          <motion.div
            key="completion"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-gold" />
            </motion.div>
            <p className="text-gold font-semibold">{meterName} +{meterValue}</p>
          </motion.div>
        ) : (
          <motion.div key="quest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                {icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-clean-white">{name}</h3>
                <p className="text-moon-silver text-sm">{subtitle}</p>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="flex gap-2 mb-6">
              {actions.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                    index < currentStep
                      ? "bg-gold"
                      : index === currentStep
                      ? "bg-gold/50"
                      : "bg-moon-silver/20"
                  }`}
                />
              ))}
            </div>

            {/* Current action */}
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 text-moon-silver text-sm mb-2">
                <Circle className="w-3 h-3" />
                <span>{actions[currentStep].layer}</span>
              </div>
              <p className="text-clean-white text-lg pl-5">{actions[currentStep].action}</p>
            </motion.div>

            {/* Action button */}
            <Button
              onClick={handleStepComplete}
              className="w-full bg-dark-emerald hover:bg-gold/20 border border-gold/30 hover:border-gold text-clean-white group"
            >
              <span>Done</span>
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
