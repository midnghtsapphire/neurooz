export const PicketFence = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Horizontal rail */}
      <div className="absolute bottom-6 left-0 right-0 h-2 bg-gradient-to-b from-white to-gray-100 shadow-sm" />
      <div className="absolute bottom-12 left-0 right-0 h-2 bg-gradient-to-b from-white to-gray-100 shadow-sm" />
      
      {/* Pickets */}
      <div className="flex justify-center">
        <div className="flex gap-3">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="relative"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
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
            </div>
          ))}
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
        </div>
      ))}
      {/* Horizontal rail */}
      <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-white/80" />
    </div>
  );
};
