import { useMemo } from "react";
import { ActionItem } from "@/hooks/use-projects";
import { PicketFence } from "./PicketFence";
import { Flower2, TreePine, Sprout, Droplets, Shovel } from "lucide-react";
import { cn } from "@/lib/utils";

interface GardenRewardsProps {
  actionItems: ActionItem[];
  className?: string;
}

// Plant types with CO2 savings info
const PLANTS = [
  { id: "corn", name: "Corn", co2: 20, icon: "🌽", color: "text-yellow-500", requiredPoints: 5 },
  { id: "flower", name: "Flower", co2: 5, icon: "🌸", color: "text-pink-400", requiredPoints: 3 },
  { id: "magnolia", name: "Magnolia", co2: 50, icon: "🌺", color: "text-rose-300", requiredPoints: 15 },
  { id: "palm", name: "Palm Tree", co2: 75, icon: "🌴", color: "text-green-500", requiredPoints: 25 },
  { id: "oak", name: "Oak Tree", co2: 100, icon: "🌳", color: "text-green-700", requiredPoints: 40 },
  { id: "sunflower", name: "Sunflower", co2: 15, icon: "🌻", color: "text-amber-400", requiredPoints: 8 },
];

// Tools earned from showstopper tasks
const TOOLS = [
  { id: "hoe", name: "Garden Hoe", icon: "🪓", description: "Unlocked by completing high-priority tasks" },
  { id: "soil", name: "Rich Soil", icon: "🟤", description: "Unlocked by completing 3+ tasks in a row" },
  { id: "water", name: "Water Can", icon: "💧", description: "Unlocked by completing tasks on time" },
];

// Garden theme
const GARDEN_THEME = {
  name: "Magnolia Paradise",
  description: "A Southern garden with magnolias, flowers, and shade trees",
  background: "from-green-100 via-emerald-50 to-lime-100",
};

function GardenPlant({ plant, index, isNew = false }: { plant: typeof PLANTS[0]; index: number; isNew?: boolean }) {
  const delay = index * 0.1;
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center transition-all duration-500",
        isNew && "animate-bounce"
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-2xl md:text-3xl drop-shadow-md" role="img" aria-label={plant.name}>
        {plant.icon}
      </span>
      <div className="text-[10px] text-center mt-1 font-medium text-green-700 bg-white/60 px-1 rounded">
        {plant.co2}kg CO₂
      </div>
    </div>
  );
}

function GardenTool({ tool, earned }: { tool: typeof TOOLS[0]; earned: boolean }) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
        earned 
          ? "bg-amber-50 border-amber-200 text-amber-800" 
          : "bg-gray-100 border-gray-200 text-gray-400 opacity-50"
      )}
    >
      <span className="text-xl">{tool.icon}</span>
      <div>
        <div className="text-sm font-medium">{tool.name}</div>
        <div className="text-[10px]">{earned ? "Earned!" : tool.description}</div>
      </div>
    </div>
  );
}

export function GardenRewards({ actionItems, className }: GardenRewardsProps) {
  const stats = useMemo(() => {
    const completed = actionItems.filter(item => item.is_completed);
    const highPriorityCompleted = completed.filter(item => item.priority === "high");
    const mediumPriorityCompleted = completed.filter(item => item.priority === "medium");
    
    // Calculate points: high = 10, medium = 5, low = 2
    let points = 0;
    completed.forEach(item => {
      if (item.priority === "high") points += 10;
      else if (item.priority === "medium") points += 5;
      else points += 2;
    });
    
    // Calculate total CO2 saved based on earned plants
    let totalCo2 = 0;
    const earnedPlants: typeof PLANTS[0][] = [];
    
    let remainingPoints = points;
    // Award plants based on points (best plants first)
    const sortedPlants = [...PLANTS].sort((a, b) => b.requiredPoints - a.requiredPoints);
    
    for (const plant of sortedPlants) {
      while (remainingPoints >= plant.requiredPoints) {
        earnedPlants.push(plant);
        totalCo2 += plant.co2;
        remainingPoints -= plant.requiredPoints;
      }
    }
    
    // Determine earned tools
    const earnedTools = {
      hoe: highPriorityCompleted.length >= 2,
      soil: completed.length >= 5,
      water: mediumPriorityCompleted.length >= 3 || completed.length >= 3,
    };
    
    return {
      completedCount: completed.length,
      points,
      totalCo2,
      earnedPlants: earnedPlants.slice(0, 20), // Max 20 plants shown
      earnedTools,
      nextPlant: PLANTS.find(p => p.requiredPoints > remainingPoints) || PLANTS[0],
      pointsToNext: Math.min(...PLANTS.filter(p => p.requiredPoints > remainingPoints).map(p => p.requiredPoints - remainingPoints)) || 0,
    };
  }, [actionItems]);

  return (
    <div className={cn("relative", className)}>
      {/* Garden Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
          <Sprout className="h-5 w-5" />
          {GARDEN_THEME.name}
        </h3>
        <p className="text-sm text-green-600">{GARDEN_THEME.description}</p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-1 text-green-700">
          <TreePine className="h-4 w-4" />
          <span className="font-bold">{stats.earnedPlants.length}</span> plants
        </div>
        <div className="flex items-center gap-1 text-blue-600">
          <Droplets className="h-4 w-4" />
          <span className="font-bold">{stats.totalCo2}</span>kg CO₂ saved
        </div>
        <div className="flex items-center gap-1 text-amber-600">
          <Shovel className="h-4 w-4" />
          <span className="font-bold">{stats.points}</span> garden points
        </div>
      </div>

      {/* Tools Section */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        {TOOLS.map(tool => (
          <GardenTool 
            key={tool.id} 
            tool={tool} 
            earned={stats.earnedTools[tool.id as keyof typeof stats.earnedTools]} 
          />
        ))}
      </div>

      {/* Garden Bed */}
      <div className={cn(
        "relative rounded-2xl overflow-hidden border-4 border-amber-700/30",
        `bg-gradient-to-b ${GARDEN_THEME.background}`
      )}>
        {/* Sky area */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/30 to-transparent h-1/2" />
        
        {/* Sun */}
        <div className="absolute top-4 right-6 w-10 h-10 bg-yellow-300 rounded-full shadow-lg shadow-yellow-200/50 animate-pulse" />
        
        {/* Clouds */}
        <div className="absolute top-6 left-10 text-2xl opacity-60">☁️</div>
        <div className="absolute top-8 left-1/3 text-xl opacity-40">☁️</div>
        
        {/* Plants Area */}
        <div className="relative pt-16 pb-8 px-6 min-h-[160px]">
          {stats.earnedPlants.length === 0 ? (
            <div className="text-center py-8 text-green-600/60">
              <Flower2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Complete tasks to grow your garden!</p>
              <p className="text-xs mt-1">
                Next plant in <span className="font-bold">{stats.pointsToNext || PLANTS[0].requiredPoints}</span> points
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {stats.earnedPlants.map((plant, index) => (
                <GardenPlant 
                  key={`${plant.id}-${index}`} 
                  plant={plant} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Soil/Ground */}
        <div className="h-6 bg-gradient-to-t from-amber-800/40 via-amber-700/30 to-transparent" />
        
        {/* Fence at bottom */}
        <div className="relative -mb-4">
          <PicketFence className="h-20" showFlowers={true} />
        </div>
      </div>

      {/* Progress to next plant */}
      {stats.earnedPlants.length > 0 && stats.pointsToNext > 0 && (
        <div className="mt-3 text-center">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{stats.pointsToNext} more points</span> until next plant
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mx-auto mt-1 overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, ((stats.points % PLANTS[0].requiredPoints) / PLANTS[0].requiredPoints) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}