import { Flower2, Cherry, Sparkles } from "lucide-react";

// Buzzing bee component
const BuzzingBee = ({ style, delay = 0 }: { style?: React.CSSProperties; delay?: number }) => {
  return (
    <div 
      className="absolute text-amber-400 animate-bounce"
      style={{ 
        ...style,
        animationDuration: '1.5s',
        animationDelay: `${delay}s`,
      }}
    >
      <svg 
        className="w-3 h-3 drop-shadow-sm" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        style={{
          animation: `buzz ${0.3 + delay * 0.1}s ease-in-out infinite alternate`,
        }}
      >
        {/* Bee body */}
        <ellipse cx="12" cy="14" rx="5" ry="6" fill="#f59e0b" />
        {/* Stripes */}
        <rect x="7" y="12" width="10" height="2" fill="#1f2937" rx="1" />
        <rect x="7" y="16" width="10" height="2" fill="#1f2937" rx="1" />
        {/* Head */}
        <circle cx="12" cy="7" r="3" fill="#1f2937" />
        {/* Wings */}
        <ellipse cx="7" cy="11" rx="3" ry="4" fill="white" opacity="0.7" />
        <ellipse cx="17" cy="11" rx="3" ry="4" fill="white" opacity="0.7" />
        {/* Antennae */}
        <path d="M10 5 L8 2" stroke="#1f2937" strokeWidth="1" fill="none" />
        <path d="M14 5 L16 2" stroke="#1f2937" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

// Crawling ladybug component
const CrawlingLadybug = ({ style, delay = 0 }: { style?: React.CSSProperties; delay?: number }) => {
  return (
    <div 
      className="absolute"
      style={{ 
        ...style,
        animation: `crawl ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg 
        className="w-4 h-4 drop-shadow-sm" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        {/* Body */}
        <ellipse cx="12" cy="14" rx="7" ry="8" fill="#dc2626" />
        {/* Center line */}
        <line x1="12" y1="6" x2="12" y2="22" stroke="#1f2937" strokeWidth="1" />
        {/* Spots */}
        <circle cx="9" cy="11" r="1.5" fill="#1f2937" />
        <circle cx="15" cy="11" r="1.5" fill="#1f2937" />
        <circle cx="8" cy="16" r="1.5" fill="#1f2937" />
        <circle cx="16" cy="16" r="1.5" fill="#1f2937" />
        <circle cx="12" cy="14" r="1" fill="#1f2937" />
        {/* Head */}
        <circle cx="12" cy="5" r="3" fill="#1f2937" />
        {/* Antennae */}
        <path d="M10 3 L8 0" stroke="#1f2937" strokeWidth="1" fill="none" />
        <path d="M14 3 L16 0" stroke="#1f2937" strokeWidth="1" fill="none" />
        {/* Legs */}
        <path d="M5 12 L3 10" stroke="#1f2937" strokeWidth="1" fill="none" />
        <path d="M5 16 L2 17" stroke="#1f2937" strokeWidth="1" fill="none" />
        <path d="M19 12 L21 10" stroke="#1f2937" strokeWidth="1" fill="none" />
        <path d="M19 16 L22 17" stroke="#1f2937" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

// Small flower decorations with more variety
const FlowerDecoration = ({ style, variant = 1, size = "sm" }: { style?: React.CSSProperties; variant?: number; size?: "xs" | "sm" | "md" }) => {
  const colors = ["text-pink-300", "text-rose-300", "text-pink-200", "text-white", "text-fuchsia-200"];
  const color = colors[variant % colors.length];
  const sizeClasses = {
    xs: "w-2 h-2",
    sm: "w-3 h-3",
    md: "w-4 h-4"
  };
  
  const flowerType = variant % 3;
  
  return (
    <div className={`absolute ${color} drop-shadow-sm`} style={style}>
      {flowerType === 0 ? (
        <Flower2 className={`${sizeClasses[size]} animate-pulse`} style={{ animationDuration: `${2 + variant}s` }} />
      ) : flowerType === 1 ? (
        <Cherry className={`${sizeClasses[size]}`} />
      ) : (
        <Sparkles className={`${sizeClasses[size]} animate-pulse`} style={{ animationDuration: `${3 + variant}s` }} />
      )}
    </div>
  );
};

// Garden gate component
export const GardenGate = ({ isOpen = false, className = "" }: { isOpen?: boolean; className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Left gate */}
      <div 
        className={`w-8 h-20 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-t-lg border border-gray-200/50 shadow-md transition-transform duration-700 origin-left ${isOpen ? '-rotate-[70deg]' : 'rotate-0'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-700/30 rounded" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-700/30 rounded" />
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-600/50 rounded-full" />
      </div>
      {/* Right gate */}
      <div 
        className={`w-8 h-20 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-t-lg border border-gray-200/50 shadow-md transition-transform duration-700 origin-right ${isOpen ? 'rotate-[70deg]' : 'rotate-0'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-700/30 rounded" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-700/30 rounded" />
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-600/50 rounded-full" />
      </div>
    </div>
  );
};

export const PicketFence = ({ className = "", showFlowers = true, showGate = false }: { className?: string; showFlowers?: boolean; showGate?: boolean }) => {
  const picketCount = 25;
  const gatePosition = Math.floor(picketCount / 2);
  
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Horizontal rails */}
      <div className="absolute bottom-6 left-0 right-0 h-2 bg-gradient-to-b from-white to-gray-100 shadow-sm" />
      <div className="absolute bottom-12 left-0 right-0 h-2 bg-gradient-to-b from-white to-gray-100 shadow-sm" />
      
      {/* Ground flowers/grass */}
      {showFlowers && (
        <div className="absolute bottom-0 left-0 right-0 h-4 flex items-end justify-around px-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`ground-${i}`} className="relative">
              <div className="w-1 h-3 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full" />
              {i % 3 === 0 && (
                <Flower2 className="absolute -top-2 -left-1 w-3 h-3 text-pink-300 drop-shadow-sm" />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Pickets with flowers */}
      <div className="flex justify-center">
        <div className="flex gap-3 items-end">
          {Array.from({ length: picketCount }).map((_, i) => {
            // Insert gate in the middle
            if (showGate && i === gatePosition) {
              return <GardenGate key="gate" className="mx-2" />;
            }
            
            const hasFlower = showFlowers && (i % 3 === 0 || i % 5 === 0 || i % 7 === 0);
            const flowerOffset = (i * 17) % 20 - 10;
            
            return (
              <div
                key={i}
                className="relative"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Multiple flower decorations scattered around pickets */}
                {hasFlower && (
                  <>
                    <FlowerDecoration 
                      variant={i} 
                      size="sm"
                      style={{ 
                        top: `${4 + (i % 4) * 3}px`, 
                        left: `${flowerOffset - 4}px` 
                      }} 
                    />
                    {i % 4 === 0 && (
                      <FlowerDecoration 
                        variant={i + 2} 
                        size="xs"
                        style={{ 
                          top: `${12 + (i % 3) * 4}px`, 
                          right: `${-2 + (i % 2) * 3}px` 
                        }} 
                      />
                    )}
                  </>
                )}
                
                {/* Extra scattered flowers between some pickets */}
                {showFlowers && i % 6 === 1 && (
                  <FlowerDecoration 
                    variant={i + 5} 
                    size="md"
                    style={{ 
                      top: `-8px`, 
                      left: `50%`,
                      transform: 'translateX(-50%)'
                    }} 
                  />
                )}
                
                {/* Picket body */}
                <div className="w-4 h-16 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-t-sm shadow-sm border border-gray-200/50">
                  {/* Pointed top */}
                  <div 
                    className="absolute -top-2 left-0 w-0 h-0"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderBottom: '8px solid white',
                    }}
                  />
                  {/* Wood grain detail */}
                  <div className="absolute top-4 left-1 w-0.5 h-8 bg-gray-200/40 rounded" />
                </div>
                
                {/* Vine/leaf climbing some pickets */}
                {showFlowers && i % 5 === 2 && (
                  <div className="absolute -left-1 top-6 w-2 h-8">
                    <div className="w-0.5 h-full bg-gradient-to-t from-green-500 to-green-300 rounded-full mx-auto" />
                    <div className="absolute top-1 -left-1 w-2 h-1.5 bg-green-400 rounded-full rotate-45" />
                    <div className="absolute top-4 left-1 w-2 h-1.5 bg-green-400 rounded-full -rotate-45" />
                  </div>
                )}
                
                {/* Bees buzzing near flowers */}
                {showFlowers && i % 7 === 0 && (
                  <BuzzingBee 
                    delay={i * 0.2}
                    style={{ 
                      top: `-4px`, 
                      left: `${8 + (i % 3) * 4}px`,
                    }} 
                  />
                )}
                {showFlowers && i % 11 === 0 && (
                  <BuzzingBee 
                    delay={i * 0.15 + 0.5}
                    style={{ 
                      top: `${6 + (i % 4) * 2}px`, 
                      right: `-6px`,
                    }} 
                  />
                )}
                
                {/* Ladybugs crawling on some fence posts */}
                {showFlowers && i % 8 === 3 && (
                  <CrawlingLadybug 
                    delay={i * 0.3}
                    style={{ 
                      top: `${20 + (i % 5) * 4}px`, 
                      left: `1px`,
                    }} 
                  />
                )}
                {showFlowers && i % 13 === 0 && (
                  <CrawlingLadybug 
                    delay={i * 0.25 + 1}
                    style={{ 
                      top: `${30 + (i % 3) * 5}px`, 
                      right: `-2px`,
                    }} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const MiniFence = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-end gap-1 opacity-60 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="relative">
          <div className="w-2 h-6 bg-gradient-to-b from-white to-gray-100 rounded-t-sm shadow-sm">
            <div 
              className="absolute -top-1 left-0 w-0 h-0"
              style={{
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '4px solid white',
              }}
            />
          </div>
          {i === 2 && <Flower2 className="absolute -top-2 -left-0.5 w-2 h-2 text-pink-300" />}
        </div>
      ))}
      {/* Horizontal rail */}
      <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-white/80" />
    </div>
  );
};
