import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const TerritoryComplete = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center relative bg-deep-night-emerald p-6"
    >
      {/* Celebration glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, hsl(var(--gold)/0.15), transparent 60%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8 border-2 border-gold"
        >
          <MapPin className="w-12 h-12 text-gold" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-display font-bold text-clean-white mb-4"
        >
          The Road Illuminates.
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-moon-silver mb-4"
        >
          Territory I — The Crossing
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-gold font-semibold text-lg mb-12"
        >
          COMPLETE
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">+15</p>
            <p className="text-moon-silver text-sm">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-clean-white">3/3</p>
            <p className="text-moon-silver text-sm">Nodes Cleared</p>
          </div>
        </motion.div>

        {/* Next territory teaser */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="bg-dark-emerald/50 border border-moon-silver/20 rounded-lg p-6 mb-8"
        >
          <p className="text-moon-silver text-sm mb-2">UNLOCKED</p>
          <p className="text-clean-white text-lg font-semibold">Territory II — Engine Fields</p>
          <p className="text-moon-silver/70 text-sm">Energy, sleep, and rhythm systems</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold/90 text-deep-night-emerald font-semibold"
          >
            <Link to="/oz-engine">
              Return to Command
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
