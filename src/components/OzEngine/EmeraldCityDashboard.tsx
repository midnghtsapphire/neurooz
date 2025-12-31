import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { Building2, CloudRain, Sun, CloudLightning, Tornado } from "lucide-react";

export function EmeraldCityDashboard() {
  const load = useCognitiveLoad();
  const { data: projects = [] } = useProjects();
  
  const openProjects = projects.filter(p => !p.is_completed).slice(0, 6);
  
  const getWeatherIcon = () => {
    switch (load.status) {
      case 'overload': return <Tornado className="h-8 w-8 text-red-400 animate-spin" style={{ animationDuration: '3s' }} />;
      case 'critical': return <CloudLightning className="h-8 w-8 text-orange-400 animate-pulse" />;
      case 'elevated': return <CloudRain className="h-8 w-8 text-yellow-400" />;
      default: return <Sun className="h-8 w-8 text-emerald-400" />;
    }
  };
  
  const getCityGlow = () => {
    switch (load.status) {
      case 'overload': return 'from-red-900/50 via-orange-900/30';
      case 'critical': return 'from-orange-900/40 via-yellow-900/20';
      case 'elevated': return 'from-yellow-900/30 via-emerald-900/20';
      default: return 'from-emerald-900/40 via-teal-900/20';
    }
  };
  
  const getTowerGlow = () => {
    if (load.status === 'stable') return 'shadow-emerald-500/50 shadow-lg';
    if (load.status === 'elevated') return 'shadow-yellow-500/30 shadow-md';
    return 'shadow-none opacity-70';
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden bg-gradient-to-b to-background p-6 min-h-[300px]",
      getCityGlow()
    )}>
      {/* Sky / Weather */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {getWeatherIcon()}
        <span className="text-xs text-muted-foreground capitalize">{load.status}</span>
      </div>
      
      {/* Wizard's Tower (Center) */}
      <div className="flex flex-col items-center mb-6">
        <div className={cn(
          "relative w-16 h-24 bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-t-full transition-all duration-500",
          getTowerGlow()
        )}>
          {/* Tower window */}
          <div className={cn(
            "absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-500",
            load.status === 'stable' ? 'bg-yellow-300 animate-pulse' : 'bg-gray-600'
          )} />
          {/* Tower base */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-emerald-800 rounded-sm" />
        </div>
        <p className="text-xs text-emerald-400 mt-4 font-medium">The Wizard's Tower</p>
      </div>
      
      {/* City Buildings (Projects) */}
      <div className="flex justify-center gap-2 flex-wrap">
        {openProjects.map((project, i) => {
          const height = 40 + (i % 3) * 20;
          const isActive = i < 3;
          
          return (
            <div
              key={project.id}
              className={cn(
                "relative rounded-t-sm transition-all duration-300",
                isActive ? 'bg-emerald-600' : 'bg-emerald-800/50'
              )}
              style={{ 
                width: 24 + (i % 2) * 8,
                height,
                boxShadow: isActive ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              title={project.name}
            >
              {/* Windows */}
              <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
                {Array.from({ length: Math.floor(height / 12) }).map((_, j) => (
                  <div 
                    key={j}
                    className={cn(
                      "w-2 h-2 rounded-sm",
                      isActive && j % 2 === 0 ? 'bg-yellow-300/70' : 'bg-emerald-900'
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
        
        {openProjects.length === 0 && (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-emerald-700/50 mb-2" />
            <p className="text-sm text-muted-foreground">No active projects in the city</p>
          </div>
        )}
      </div>
      
      {/* Ground / Yellow Brick Road */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-yellow-600/30 to-transparent">
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-6 h-2 bg-yellow-500/40 rounded-sm" />
          ))}
        </div>
      </div>
      
      {/* Open Loops indicator */}
      {load.openTasks > 0 && (
        <div className="absolute bottom-10 left-4 text-xs text-muted-foreground">
          <span className="text-yellow-500">{load.openTasks}</span> open loops on the road
        </div>
      )}
    </div>
  );
}
