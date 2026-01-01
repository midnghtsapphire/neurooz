import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface OzStoryIntroProps {
  onComplete: () => void;
  onSignIn: () => void;
}

const STORY_SLIDES = [
  {
    character: "🌪️",
    title: "Life can feel like a tornado",
    description: "Thoughts swirling. Tasks piling up. It's hard to know where to start.",
    bgClass: "from-slate-800 via-slate-700 to-slate-900",
  },
  {
    character: "👧",
    title: "Meet Dorothy — that's you",
    description: "You don't need to have it all figured out. You just need a place to land.",
    bgClass: "from-blue-900 via-indigo-900 to-slate-900",
  },
  {
    character: "🐕",
    title: "Toto is your loyal companion",
    description: "A gentle nudge when you need it. Always by your side, never pushy.",
    bgClass: "from-amber-900 via-orange-900 to-slate-900",
  },
  {
    character: "🧠",
    title: "The Scarecrow helps you think",
    description: "Dump your thoughts. He'll help organize them into something clear.",
    bgClass: "from-yellow-900 via-amber-900 to-slate-900",
  },
  {
    character: "❤️",
    title: "The Tin Man feels with you",
    description: "Process emotions. Understand what's really going on underneath.",
    bgClass: "from-red-900 via-rose-900 to-slate-900",
  },
  {
    character: "🦁",
    title: "The Lion gives you courage",
    description: "When it's time to act, he's there. One step at a time.",
    bgClass: "from-orange-900 via-amber-900 to-slate-900",
  },
  {
    character: "🧙",
    title: "The Wizard brings it all together",
    description: "AI-powered guidance that learns your patterns and helps you find your way home.",
    bgClass: "from-emerald-900 via-green-900 to-slate-900",
  },
  {
    character: "🏠",
    title: "This is your home now",
    description: "A calm place to return to. Always here. Helping you build patterns that stick — in the app and in real life.",
    bgClass: "from-emerald-800 via-teal-900 to-slate-900",
  },
];

export function OzStoryIntro({ onComplete, onSignIn }: OzStoryIntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = STORY_SLIDES[currentSlide];
  const isLastSlide = currentSlide === STORY_SLIDES.length - 1;

  const nextSlide = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bgClass} flex flex-col items-center justify-center p-6 transition-all duration-700`}>
      {/* Progress dots */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {STORY_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-6" 
                : index < currentSlide 
                  ? "bg-white/60" 
                  : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="fixed top-6 right-6 text-white/50 hover:text-white text-sm transition-colors"
      >
        Skip intro
      </button>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-lg mx-auto"
        >
          {/* Character */}
          <motion.div 
            className="text-8xl md:text-9xl mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {slide.character}
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          onClick={nextSlide}
          size="lg"
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 min-w-40"
        >
          {isLastSlide ? "Begin Your Journey" : "Continue"}
          {!isLastSlide && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="text-white/50 hover:text-white hover:bg-white/10"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Sign in link */}
      <button
        onClick={onSignIn}
        className="fixed bottom-8 right-6 text-white/40 hover:text-white text-sm transition-colors"
      >
        Already have an account? Sign in
      </button>
    </div>
  );
}

export default OzStoryIntro;
