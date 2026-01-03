/**
 * ============================================================
 * FLOATING TORNADO BUTTON - Emergency Access to Tornado Alley
 * ============================================================
 * 
 * PURPOSE:
 * This is a 911-style emergency button that's ALWAYS visible.
 * When users are overwhelmed and can't think, they need one
 * visual landmark to find help: "Go to tornado."
 * 
 * ACCESSIBILITY CONSIDERATIONS:
 * - Large enough to find when stressed/impaired
 * - Animated to draw attention
 * - Always visible on every page
 * - Positioned opposite from Munchkin Notes (left side)
 * - High contrast for visibility
 * 
 * FUTURE ENHANCEMENTS:
 * - Voice activation ("Hey Toto, I'm overwhelmed")
 * - Haptic feedback on mobile
 * - Keyboard shortcut (Cmd+Shift+T for "Tornado")
 * ============================================================
 */

import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import tornadoAlleyImg from "@/assets/tornado-alley.png";

export function FloatingTornadoButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the Tornado Alley page itself
  if (location.pathname === "/tornado-alley") {
    return null;
  }

  return (
    <motion.button
      onClick={() => navigate("/tornado-alley")}
      className="fixed bottom-6 left-6 z-50 group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      aria-label="Go to Tornado Alley - Emergency overwhelm support"
    >
      {/* Outer glow ring - pulses to draw attention */}
      <motion.div
        className="absolute inset-0 rounded-full bg-amber-500/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Button container */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 group-hover:border-amber-400 group-hover:shadow-amber-400/30 transition-all duration-300">
        {/* Swirling tornado image */}
        <motion.img
          src={tornadoAlleyImg}
          alt="Tornado Alley"
          className="w-full h-full object-cover"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Swirl overlay effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-transparent to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Label - visible on hover for sighted users, always in aria for screen readers */}
      <motion.span
        className="absolute left-1/2 -translate-x-1/2 -bottom-7 text-xs font-medium text-amber-400/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      >
        Tornado Alley
      </motion.span>
    </motion.button>
  );
}
