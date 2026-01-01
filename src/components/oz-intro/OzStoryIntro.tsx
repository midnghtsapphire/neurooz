import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import emeraldRoadHero from "@/assets/emerald-road-hero.jpg";

interface OzStoryIntroProps {
  onComplete: () => void;
  onSignIn: () => void;
}

const STORY_SLIDES = [
  {
    character: "🌪️",
    title: "Your brain feels like a tornado",
    description: "A million thoughts. Nothing sticks. You can't even remember what you were doing 5 minutes ago.",
    bgClass: "from-slate-800 via-slate-700 to-slate-900",
    isImageSlide: false,
  },
  {
    character: "🛤️",
    title: "Life is a yellow brick road",
    description: "We're all walking toward our own Emerald City. The perfect life. But here's the secret...",
    bgClass: "from-yellow-900 via-amber-900 to-slate-900",
    isImageSlide: true,
  },
  {
    character: "🏰",
    title: "It's about the journey, not the destination",
    description: "That perfect city? It's always ahead. But the road is where we learn. Where we grow. Where we find our friends.",
    bgClass: "from-emerald-900 via-green-900 to-slate-900",
    isImageSlide: false,
  },
  {
    character: "🧠",
    title: "\"I feel like I don't have a brain\"",
    description: "That's the Scarecrow in you. So much going on up there that it feels like... nothing. Overload. The Scarecrow needed a brain — you need to dump yours out and organize it.",
    bgClass: "from-amber-900 via-yellow-900 to-slate-900",
    isImageSlide: false,
  },
  {
    character: "❤️",
    title: "\"I feel heartless\"",
    description: "That's the Tin Man. When you're so overwhelmed you snap at people you love. When emotions feel rusty and stuck. He needed a heart — you need to reconnect with yours.",
    bgClass: "from-red-900 via-rose-900 to-slate-900",
    isImageSlide: false,
  },
  {
    character: "🦁",
    title: "\"I'm scared to start\"",
    description: "That's the Lion. The task feels too big. The fear is real. He needed courage — and so do you. One tiny step. That's all it takes.",
    bgClass: "from-orange-900 via-amber-900 to-slate-900",
    isImageSlide: false,
  },
  {
    character: "👧🐕",
    title: "You're Dorothy. And this is your Toto.",
    description: "This app is your companion. When you feel like a Scarecrow, Tin Man, or Lion... you'll know exactly what to do. Patterns that work in the app AND in real life.",
    bgClass: "from-blue-900 via-indigo-900 to-slate-900",
    isImageSlide: false,
  },
  {
    character: "✨",
    title: "Ready to walk the road?",
    description: "Your Emerald City is waiting. And these friends will help you get there — step by step, brain dump by brain dump.",
    bgClass: "from-emerald-800 via-teal-900 to-slate-900",
    isImageSlide: false,
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
    <div className={`min-h-screen bg-gradient-to-br ${slide.bgClass} flex flex-col items-center justify-center p-6 transition-all duration-700 relative overflow-hidden`}>
      {/* Background image for the road slide */}
      {slide.isImageSlide && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={emeraldRoadHero} 
            alt="Yellow brick road to Emerald City" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </motion.div>
      )}

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
        className="fixed top-6 right-6 text-white/50 hover:text-white text-sm transition-colors z-50"
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
          className="text-center max-w-lg mx-auto relative z-10"
        >
          {/* Character */}
          <motion.div 
            className="text-7xl md:text-8xl mb-8"
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {slide.character}
          </motion.div>

          {/* Title - styled like a quote for the feeling slides */}
          <h1 className={`text-2xl md:text-3xl font-display font-bold text-white mb-4 ${
            slide.title.startsWith('"') ? 'italic' : ''
          }`}>
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 leading-relaxed mb-12">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center gap-4 px-6 z-50">
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
          {isLastSlide ? "Let's Go!" : "Continue"}
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
        className="fixed bottom-8 right-6 text-white/40 hover:text-white text-sm transition-colors z-50"
      >
        Already have an account? Sign in
      </button>
    </div>
  );
}

export default OzStoryIntro;
