import { useState, useEffect } from "react";
import magnoliaFlowers from "@/assets/magnolia-flowers.png";
import { Flower2 } from "lucide-react";

interface MagnoliaSplashProps {
  onComplete?: () => void;
  duration?: number;
}

export const MagnoliaSplash = ({ onComplete, duration = 3000 }: MagnoliaSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 800);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-800 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, hsl(var(--garden-cream)) 0%, hsl(var(--garden-sage)/0.3) 50%, hsl(var(--primary)/0.2) 100%)',
      }}
    >
      {/* Floating petals background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-petal-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            <div 
              className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 opacity-60"
              style={{ transform: `rotate(${Math.random() * 360}deg)` }}
            />
          </div>
        ))}
      </div>

      {/* Main magnolia bloom */}
      <div className="relative animate-scale-in">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-200 via-white to-pink-200 opacity-50 scale-150" />
        
        {/* Center magnolia */}
        <div className="relative">
          <img 
            src={magnoliaFlowers}
            alt="Blooming Magnolia"
            className="w-80 h-80 lg:w-[500px] lg:h-[500px] object-contain drop-shadow-2xl animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          {/* Orbiting flowers */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateX(180px) rotate(-${i * 60}deg)`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <Flower2 className="w-6 h-6 text-pink-300 drop-shadow-lg" />
            </div>
          ))}
        </div>

        {/* Brand text */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary animate-fade-in" style={{ animationDelay: '0.5s' }}>
            VineTaxes
          </h1>
          <p className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            Cultivating tax clarity
          </p>
        </div>
      </div>

      {/* Corner magnolias */}
      <img 
        src={magnoliaFlowers}
        alt=""
        className="absolute top-0 left-0 w-48 opacity-40 -translate-x-1/4 -translate-y-1/4 rotate-45 animate-float"
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers}
        alt=""
        className="absolute top-0 right-0 w-56 opacity-50 translate-x-1/4 -translate-y-1/4 -rotate-12 animate-float"
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers}
        alt=""
        className="absolute bottom-0 left-0 w-52 opacity-40 -translate-x-1/4 translate-y-1/4 rotate-180 animate-float"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers}
        alt=""
        className="absolute bottom-0 right-0 w-48 opacity-45 translate-x-1/4 translate-y-1/4 -rotate-90 animate-float"
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default MagnoliaSplash;
