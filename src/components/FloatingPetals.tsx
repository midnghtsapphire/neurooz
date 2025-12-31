import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export const FloatingPetals = ({ count = 12 }: { count?: number }) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 12 + Math.random() * 10,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${petal.left}%`,
            top: "-20px",
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: `rotate(${petal.rotation}deg)` }}
            className="opacity-40"
          >
            <ellipse
              cx="12"
              cy="12"
              rx="6"
              ry="10"
              fill="url(#petalGradient)"
              className="drop-shadow-sm"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#fef3f3" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fce7f3" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
};
