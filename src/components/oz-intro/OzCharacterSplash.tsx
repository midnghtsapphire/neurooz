import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OzCharacterSplashProps {
  onComplete: () => void;
}

const CHARACTERS = [
  {
    name: "Dorothy",
    image: "/dorothy-casual-green.jpg",
    angle: 0,
  },
  {
    name: "Scarecrow",
    image: "/scarecrow-hacker.png",
    angle: 45,
  },
  {
    name: "Tin Man",
    image: "/tinman-cyborg.png",
    angle: 90,
  },
  {
    name: "Lion",
    image: "/lion-cosplay-warrior.png",
    angle: 135,
  },
  {
    name: "Glinda",
    image: "/glinda-good-witch-final.webp",
    angle: 180,
  },
  {
    name: "Bad Witch",
    image: "/bad-witch-tall-hat.webp",
    angle: 225,
  },
  {
    name: "Toto",
    image: "/toto-guy-dog-cosplay.png",
    angle: 270,
  },
  {
    name: "Tornado Alley",
    image: "/tornado-chaos.png",
    angle: 315,
  },
];

export function OzCharacterSplash({ onComplete }: OzCharacterSplashProps) {
  const radius = 280; // Distance from center
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransition = () => {
    setIsTransitioning(true);
    // Wait for tornado animation to complete before calling onComplete
    setTimeout(() => {
      onComplete();
    }, 2500); // Tornado animation duration
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Emerald Gateway Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/emerald-gateway-bg.png)' }}
      />
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main container */}
      <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
        
        {/* Center - Oz */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isTransitioning ? [1, 1.2, 0] : 1, 
            opacity: isTransitioning ? [1, 0.5, 0] : 1,
            rotate: isTransitioning ? [0, 180, 360] : 0
          }}
          transition={{ 
            delay: isTransitioning ? 0.5 : 0.2, 
            duration: isTransitioning ? 1.5 : 0.6, 
            type: "spring" 
          }}
          className="absolute z-20"
        >
          <div className="relative w-56 h-56 md:w-72 md:h-72">
            {/* Outer concentric ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400/60" 
              style={{ boxShadow: '0 0 30px rgba(52, 211, 153, 0.6), 0 0 60px rgba(163, 230, 53, 0.3)' }}
            />
            {/* Inner circle with image */}
            <div className="absolute inset-4 md:inset-6 rounded-full overflow-hidden border-4 border-emerald-400"
              style={{ boxShadow: '0 0 40px rgba(52, 211, 153, 0.8), 0 0 80px rgba(52, 211, 153, 0.4), inset 0 0 20px rgba(52, 211, 153, 0.2)' }}
            >
              <img
                src="/oz-wizard-center.jpg"
                alt="Oz"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-900/40 to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Characters in circle */}
        {CHARACTERS.map((character, index) => {
          const angleRad = (character.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <motion.div
              key={character.name}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{ 
                scale: isTransitioning ? [1, 0.8, 0] : 1, 
                opacity: isTransitioning ? [1, 0.3, 0] : 1, 
                x: isTransitioning ? [x, x * 0.5, 0] : x, 
                y: isTransitioning ? [y, y * 0.5, 0] : y,
                rotate: isTransitioning ? [0, 360 * (index % 2 === 0 ? 1 : -1)] : 0
              }}
              transition={{ 
                delay: isTransitioning ? index * 0.1 : 0.4 + index * 0.1, 
                duration: isTransitioning ? 1.2 : 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="absolute z-10"
            >
              <div className={`relative ${character.name === "Tornado Alley" ? "w-36 h-36 md:w-44 md:h-44" : "w-28 h-28 md:w-36 md:h-36"}`}>
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full rounded-full object-cover object-center border-4 border-emerald-400 shadow-2xl hover:border-yellow-400 transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{ boxShadow: '0 0 30px rgba(52, 211, 153, 0.9), 0 0 60px rgba(163, 230, 53, 0.5), inset 0 0 15px rgba(52, 211, 153, 0.3)' }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>
          );
        })}

        {/* Yellow Brick Road connecting lines (subtle) */}
        <svg className="absolute inset-0 w-full h-full z-0 opacity-20">
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
          </defs>
          {CHARACTERS.map((character, index) => {
            const angleRad = (character.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius + radius * 1.4;
            const y = Math.sin(angleRad) * radius + radius * 1.4;
            const centerX = radius * 1.4;
            const centerY = radius * 1.4;

            return (
              <motion.line
                key={`line-${index}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: isTransitioning ? [1, 0] : 1, 
                  opacity: isTransitioning ? [0.3, 0] : 0.3 
                }}
                transition={{ 
                  delay: isTransitioning ? 0 : 0.8 + index * 0.05, 
                  duration: isTransitioning ? 0.8 : 0.4 
                }}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="url(#roadGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>
      </div>

      {/* Tornado Transition Effect */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Large spinning tornado image */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 2, 3, 4],
                opacity: [0, 0.8, 0.9, 0],
                rotate: [0, 360, 720, 1080]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <img
                src="/tornado-chaos.png"
                alt="Tornado"
                className="w-96 h-96 object-contain"
              />
            </motion.div>

            {/* Swirling particles effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ 
                  x: Math.cos((i / 20) * Math.PI * 2) * 100,
                  y: Math.sin((i / 20) * Math.PI * 2) * 100,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: [
                    Math.cos((i / 20) * Math.PI * 2) * 100,
                    Math.cos((i / 20) * Math.PI * 2 + Math.PI) * 300,
                    0
                  ],
                  y: [
                    Math.sin((i / 20) * Math.PI * 2) * 100,
                    Math.sin((i / 20) * Math.PI * 2 + Math.PI) * 300,
                    0
                  ],
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                  rotate: [0, 720]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-400 rounded-full z-30"
                style={{ filter: 'blur(2px)' }}
              />
            ))}

            {/* Screen flash effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2.5 }}
              className="absolute inset-0 bg-white z-50 pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {/* Continue button */}
      {!isTransitioning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-12 z-30"
        >
          <Button
            onClick={handleTransition}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-6 text-lg shadow-lg shadow-emerald-500/50"
          >
            Enter Neurooz
          </Button>
        </motion.div>
      )}

      {/* Skip button */}
      {!isTransitioning && (
        <button
          onClick={handleTransition}
          className="fixed top-6 right-6 text-white/50 hover:text-white text-sm transition-colors z-50"
        >
          Skip
        </button>
      )}
    </div>
  );
}

export default OzCharacterSplash;
