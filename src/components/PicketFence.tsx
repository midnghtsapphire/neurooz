import { Flower2, Cherry } from "lucide-react";

// Small flower decorations
const FlowerDecoration = ({ style, variant = 1 }: { style?: React.CSSProperties; variant?: number }) => {
  const colors = ["text-pink-300", "text-rose-300", "text-pink-200", "text-white"];
  const color = colors[variant % colors.length];
  
  return (
    <div className={`absolute ${color} drop-shadow-sm`} style={style}>
      {variant % 2 === 0 ? (
        <Flower2 className="w-3 h-3 animate-pulse" style={{ animationDuration: `${2 + variant}s` }} />
      ) : (
        <Cherry className="w-2.5 h-2.5" />
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
            
            const hasFlower = showFlowers && (i % 4 === 0 || i % 7 === 0);
            const flowerOffset = (i * 17) % 20 - 10;
            
            return (
              <div
                key={i}
                className="relative"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Flower decorations on some pickets */}
                {hasFlower && (
                  <FlowerDecoration 
                    variant={i} 
                    style={{ 
                      top: `${8 + (i % 3) * 4}px`, 
                      left: `${flowerOffset}px` 
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
