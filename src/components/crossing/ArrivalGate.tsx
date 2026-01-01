import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ArrivalGateProps {
  onEnter: () => void;
}

export const ArrivalGate = ({ onEnter }: ArrivalGateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-deep-night-emerald"
    >
      {/* Cinematic background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-night-emerald via-dark-emerald/50 to-deep-night-emerald" />
      
      {/* Gold road glow effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-2/3"
        style={{
          background: "linear-gradient(to top, hsl(var(--gold)/0.3), transparent)",
          filter: "blur(60px)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Horizontal gold road lines */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent"
            style={{
              bottom: `${i * 20 + 20}px`,
              width: `${60 - i * 10}%`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-8" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-display font-bold text-clean-white mb-6"
        >
          Welcome, Traveler.
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-2 mb-12"
        >
          <p className="text-xl text-moon-silver">You are not behind.</p>
          <p className="text-xl text-moon-silver">You are not broken.</p>
          <p className="text-xl text-gold font-semibold">You are rebuilding.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={onEnter}
            size="lg"
            className="bg-gold hover:bg-gold/90 text-deep-night-emerald font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-gold/20"
          >
            ENTER THE CROSSING
          </Button>
        </motion.div>
      </div>

      {/* Subtle particle effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};
