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
 * ACCESSIBILITY CONSIDERATIONS (ADHD-friendly):
 * - Draggable to any position (user preference)
 * - Large enough to find when stressed/impaired
 * - Animated to draw attention
 * - Always visible on every page
 * ============================================================
 */

import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { DraggableFloatingButton } from "@/components/neuro/DraggableFloatingButton";
import ozTornadoImg from "@/assets/oz-tornado-icon.png";

export function FloatingTornadoButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the Tornado Alley page itself
  if (location.pathname === "/tornado-alley") {
    return null;
  }

  return (
    <DraggableFloatingButton
      storageKey="tornado-button-position"
      className="fixed top-20 right-6"
    >
      <motion.button
        onClick={() => navigate("/tornado-alley")}
        className="group"
        aria-label="Go to Tornado Alley - Emergency overwhelm support"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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

        {/* Button container - same size as Toto (h-20 w-20) */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 group-hover:border-amber-400 group-hover:shadow-amber-400/30 transition-all duration-300 bg-slate-900/80 backdrop-blur-sm">
          {/* Swirling tornado image */}
          <motion.img
            src={ozTornadoImg}
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

          {/* Symbol badge - wind/tornado for overwhelm */}
          <div className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-1.5 border-2 border-slate-900 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
            </svg>
          </div>
        </div>

        {/* Label - visible on hover */}
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs font-medium text-amber-400/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/80 px-2 py-0.5 rounded"
          initial={false}
        >
          Tornado Alley
        </motion.span>
      </motion.button>
    </DraggableFloatingButton>
  );
}
