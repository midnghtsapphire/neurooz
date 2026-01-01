import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Wind, Zap, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrivalGate } from "@/components/crossing/ArrivalGate";
import { OrientationConsole } from "@/components/crossing/OrientationConsole";
import { QuestNode } from "@/components/crossing/QuestNode";
import { ProgressMeters } from "@/components/crossing/ProgressMeters";
import { TerritoryComplete } from "@/components/crossing/TerritoryComplete";

type Phase = "arrival" | "orientation" | "quests" | "complete";
type UserState = "overloaded" | "foggy" | "exhausted" | "numb" | "ready";

const TheCrossing = () => {
  const [phase, setPhase] = useState<Phase>("arrival");
  const [userState, setUserState] = useState<UserState | null>(null);
  const [meters, setMeters] = useState({ signal: 0, power: 0, control: 0 });
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const handleEnter = () => {
    setPhase("orientation");
  };

  const handleStateSelect = (state: UserState) => {
    setUserState(state);
    setPhase("quests");
  };

  const handleQuestComplete = (questId: string, meterType: "signal" | "power" | "control") => {
    setCompletedQuests((prev) => [...prev, questId]);
    setMeters((prev) => ({ ...prev, [meterType]: prev[meterType] + 5 }));

    // Check if all quests complete
    if (completedQuests.length === 2) {
      setTimeout(() => setPhase("complete"), 1000);
    }
  };

  const quests = [
    {
      id: "grounding",
      name: "Restore Signal",
      subtitle: "Grounding Node",
      icon: <Wind className="w-6 h-6" />,
      meterType: "signal" as const,
      meterName: "Signal Meter",
      actions: [
        { layer: "Stabilize", action: "Take 5 slow, deep breaths" },
        { layer: "Build", action: "Drink a glass of water" },
        { layer: "Expand", action: "Step outside or face sunlight" },
      ],
    },
    {
      id: "power",
      name: "Restore Power",
      subtitle: "Body Power Node",
      icon: <Zap className="w-6 h-6" />,
      meterType: "power" as const,
      meterName: "Power Meter",
      actions: [
        { layer: "Stabilize", action: "Sit upright" },
        { layer: "Build", action: "Stretch your arms overhead" },
        { layer: "Expand", action: "Walk for 3 minutes" },
      ],
    },
    {
      id: "control",
      name: "Restore Control",
      subtitle: "Order Node",
      icon: <Shield className="w-6 h-6" />,
      meterType: "control" as const,
      meterName: "Control Meter",
      actions: [
        { layer: "Stabilize", action: "Clear one surface" },
        { layer: "Build", action: "Put away 3 items" },
        { layer: "Expand", action: "Create one safe space" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-deep-night-emerald">
      <AnimatePresence mode="wait">
        {phase === "arrival" && <ArrivalGate key="arrival" onEnter={handleEnter} />}

        {phase === "orientation" && (
          <OrientationConsole key="orientation" onStateSelect={handleStateSelect} />
        )}

        {phase === "quests" && (
          <motion.div
            key="quests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-deep-night-emerald p-6"
          >
            {/* Header */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="ghost"
                  asChild
                  className="text-moon-silver hover:text-clean-white"
                >
                  <Link to="/oz-engine">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Command
                  </Link>
                </Button>

                <div className="text-center">
                  <h1 className="text-xl font-display font-bold text-clean-white">
                    Territory I — The Crossing
                  </h1>
                  <p className="text-moon-silver text-sm">Stabilization & Orientation</p>
                </div>

                <div className="w-32" /> {/* Spacer for centering */}
              </div>

              {/* Progress meters */}
              <div className="mb-8 p-4 bg-dark-emerald/50 rounded-lg border border-moon-silver/10">
                <ProgressMeters
                  signal={meters.signal}
                  power={meters.power}
                  control={meters.control}
                />
              </div>

              {/* Quests grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {quests.map((quest) => (
                  <QuestNode
                    key={quest.id}
                    name={quest.name}
                    subtitle={quest.subtitle}
                    icon={quest.icon}
                    actions={quest.actions}
                    meterName={quest.meterName}
                    meterValue={5}
                    isComplete={completedQuests.includes(quest.id)}
                    onComplete={() => handleQuestComplete(quest.id, quest.meterType)}
                  />
                ))}
              </div>

              {/* ADHD Safety note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-moon-silver/60 text-sm mt-12"
              >
                No failure. No deadlines. Go at your pace.
              </motion.p>
            </div>
          </motion.div>
        )}

        {phase === "complete" && <TerritoryComplete key="complete" />}
      </AnimatePresence>
    </div>
  );
};

export default TheCrossing;
