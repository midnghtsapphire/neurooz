import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWizardDialogue } from "@/hooks/use-wizard-dialogue";
import { Sparkles, Star, Trophy } from "lucide-react";

interface QuestCompletionProps {
  isVisible: boolean;
  questTitle?: string;
  onComplete: () => void;
}

export function QuestCompletion({ isVisible, questTitle, onComplete }: QuestCompletionProps) {
  const wizard = useWizardDialogue();
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (isVisible) {
      setMessage(wizard.getCompletionMessage().text);
      const timer = setTimeout(onComplete, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, wizard]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Celebration particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 600,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 600,
                scale: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.3,
                ease: "easeOut",
              }}
            >
              {i % 3 === 0 ? (
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              ) : i % 3 === 1 ? (
                <Sparkles className="h-5 w-5 text-emerald-400" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              )}
            </motion.div>
          ))}
          
          {/* Central celebration */}
          <motion.div
            className="bg-gradient-to-br from-emerald-900/95 to-background/95 backdrop-blur-sm rounded-2xl p-8 text-center space-y-4 border border-emerald-500/30"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-emerald-500 flex items-center justify-center"
              animate={{ 
                boxShadow: ['0 0 20px rgba(234,179,8,0.3)', '0 0 40px rgba(234,179,8,0.5)', '0 0 20px rgba(234,179,8,0.3)']
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Trophy className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h2
              className="text-2xl font-bold text-emerald-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Quest Complete!
            </motion.h2>
            
            {questTitle && (
              <motion.p
                className="text-emerald-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{questTitle}"
              </motion.p>
            )}
            
            <motion.p
              className="text-emerald-400/80 italic max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              "{message}"
            </motion.p>
          </motion.div>
          
          {/* City light surge effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
