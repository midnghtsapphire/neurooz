import { useMemo, useState, useEffect } from "react";
import { ActionItem } from "@/hooks/use-projects";
import { PicketFence } from "./PicketFence";
import { Flower2, TreePine, Droplets, Shovel, Snowflake, Sun, Leaf, Cherry, Award, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CO2Leaderboard } from "./CO2Leaderboard";
import { useUpdateCO2Stats } from "@/hooks/use-co2-leaderboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GardenRewardsProps {
  actionItems: ActionItem[];
  className?: string;
}

// Seasonal themes with unique plants and visuals
const SEASONS = {
  spring: {
    name: "Spring Blossom Garden",
    description: "Cherry blossoms, tulips, and fresh spring blooms",
    icon: Cherry,
    background: "from-pink-100 via-rose-50 to-green-100",
    skyGradient: "from-sky-200/40 to-pink-100/20",
    sunColor: "bg-yellow-300",
    groundColor: "from-amber-700/30 via-green-600/20 to-transparent",
    borderColor: "border-pink-300/50",
    textColor: "text-pink-800",
    subtextColor: "text-pink-600",
    plants: [
      { id: "cherry_blossom", name: "Cherry Blossom", co2: 45, icon: "🌸", requiredPoints: 12 },
      { id: "tulip", name: "Tulip", co2: 8, icon: "🌷", requiredPoints: 4 },
      { id: "daisy", name: "Daisy", co2: 5, icon: "🌼", requiredPoints: 3 },
      { id: "butterfly", name: "Butterfly Bush", co2: 25, icon: "🦋", requiredPoints: 10 },
      { id: "daffodil", name: "Daffodil", co2: 6, icon: "🌻", requiredPoints: 4 },
      { id: "magnolia", name: "Magnolia", co2: 60, icon: "🌺", requiredPoints: 20 },
    ],
    decorations: ["🦋", "🐝", "🐞"],
    weather: "☁️",
  },
  summer: {
    name: "Tropical Paradise",
    description: "Palm trees, hibiscus, and summer sunshine",
    icon: Sun,
    background: "from-cyan-100 via-sky-50 to-yellow-100",
    skyGradient: "from-sky-300/30 to-cyan-100/20",
    sunColor: "bg-orange-400",
    groundColor: "from-amber-800/40 via-yellow-600/20 to-transparent",
    borderColor: "border-cyan-300/50",
    textColor: "text-cyan-800",
    subtextColor: "text-cyan-600",
    plants: [
      { id: "palm", name: "Palm Tree", co2: 80, icon: "🌴", requiredPoints: 25 },
      { id: "hibiscus", name: "Hibiscus", co2: 15, icon: "🌺", requiredPoints: 6 },
      { id: "sunflower", name: "Sunflower", co2: 18, icon: "🌻", requiredPoints: 7 },
      { id: "cactus", name: "Cactus", co2: 12, icon: "🌵", requiredPoints: 5 },
      { id: "tropical", name: "Tropical Flower", co2: 20, icon: "🏵️", requiredPoints: 8 },
      { id: "coconut", name: "Coconut Palm", co2: 100, icon: "🥥", requiredPoints: 35 },
    ],
    decorations: ["🦜", "🌊", "⛱️"],
    weather: "☀️",
  },
  fall: {
    name: "Harvest Garden",
    description: "Pumpkins, corn, and autumn colors",
    icon: Leaf,
    background: "from-orange-100 via-amber-50 to-yellow-100",
    skyGradient: "from-orange-200/30 to-amber-100/20",
    sunColor: "bg-amber-400",
    groundColor: "from-amber-900/50 via-orange-700/30 to-transparent",
    borderColor: "border-orange-300/50",
    textColor: "text-orange-800",
    subtextColor: "text-orange-600",
    plants: [
      { id: "pumpkin", name: "Pumpkin", co2: 15, icon: "🎃", requiredPoints: 6 },
      { id: "corn", name: "Corn", co2: 22, icon: "🌽", requiredPoints: 8 },
      { id: "maple", name: "Maple Tree", co2: 90, icon: "🍁", requiredPoints: 30 },
      { id: "apple", name: "Apple Tree", co2: 70, icon: "🍎", requiredPoints: 22 },
      { id: "wheat", name: "Wheat", co2: 10, icon: "🌾", requiredPoints: 4 },
      { id: "mushroom", name: "Mushroom", co2: 3, icon: "🍄", requiredPoints: 2 },
    ],
    decorations: ["🍂", "🦃", "🌰"],
    weather: "🍃",
  },
  winter: {
    name: "Evergreen Wonderland",
    description: "Pine trees, holly, and winter magic",
    icon: Snowflake,
    background: "from-slate-100 via-blue-50 to-white",
    skyGradient: "from-blue-200/40 to-slate-100/30",
    sunColor: "bg-blue-200",
    groundColor: "from-slate-300/50 via-blue-100/30 to-transparent",
    borderColor: "border-blue-200/50",
    textColor: "text-blue-800",
    subtextColor: "text-blue-600",
    plants: [
      { id: "pine", name: "Pine Tree", co2: 85, icon: "🌲", requiredPoints: 28 },
      { id: "holly", name: "Holly Bush", co2: 20, icon: "🎄", requiredPoints: 8 },
      { id: "snowdrop", name: "Snowdrop", co2: 5, icon: "❄️", requiredPoints: 3 },
      { id: "spruce", name: "Blue Spruce", co2: 95, icon: "🎋", requiredPoints: 32 },
      { id: "mistletoe", name: "Mistletoe", co2: 8, icon: "🌿", requiredPoints: 4 },
      { id: "poinsettia", name: "Poinsettia", co2: 12, icon: "🌺", requiredPoints: 5 },
    ],
    decorations: ["⛄", "❄️", "🦌"],
    weather: "🌨️",
  },
};

type Season = keyof typeof SEASONS;

// Determine current season based on date
function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return "spring"; // Mar-May
  if (month >= 5 && month <= 7) return "summer"; // Jun-Aug
  if (month >= 8 && month <= 10) return "fall";  // Sep-Nov
  return "winter"; // Dec-Feb
}

// Tools earned from showstopper tasks
const TOOLS = [
  { id: "hoe", name: "Garden Hoe", icon: "🪓", description: "Complete 2+ high-priority tasks" },
  { id: "soil", name: "Rich Soil", icon: "🟤", description: "Complete 5+ total tasks" },
  { id: "water", name: "Water Can", icon: "💧", description: "Complete 3+ tasks" },
];

// Seasonal achievements
const ACHIEVEMENTS = {
  spring: [
    { id: "spring_sprout", name: "Spring Sprout", icon: "🌱", description: "Complete 3 tasks in spring", requirement: 3, tier: "bronze" },
    { id: "spring_bloomer", name: "Spring Bloomer", icon: "🌸", description: "Complete 7 tasks in spring", requirement: 7, tier: "silver" },
    { id: "spring_master", name: "Blossom Master", icon: "🌺", description: "Complete 15 tasks in spring", requirement: 15, tier: "gold" },
  ],
  summer: [
    { id: "summer_starter", name: "Summer Starter", icon: "☀️", description: "Complete 3 tasks in summer", requirement: 3, tier: "bronze" },
    { id: "summer_surfer", name: "Wave Rider", icon: "🏄", description: "Complete 7 tasks in summer", requirement: 7, tier: "silver" },
    { id: "summer_champion", name: "Beach Champion", icon: "🏆", description: "Complete 15 tasks in summer", requirement: 15, tier: "gold" },
  ],
  fall: [
    { id: "fall_harvester", name: "Fall Harvester", icon: "🍂", description: "Complete 3 tasks in fall", requirement: 3, tier: "bronze" },
    { id: "fall_gatherer", name: "Harvest Gatherer", icon: "🎃", description: "Complete 7 tasks in fall", requirement: 7, tier: "silver" },
    { id: "fall_legend", name: "Autumn Legend", icon: "🍁", description: "Complete 15 tasks in fall", requirement: 15, tier: "gold" },
  ],
  winter: [
    { id: "winter_walker", name: "Winter Walker", icon: "❄️", description: "Complete 3 tasks in winter", requirement: 3, tier: "bronze" },
    { id: "winter_warrior", name: "Frost Warrior", icon: "⛄", description: "Complete 7 tasks in winter", requirement: 7, tier: "silver" },
    { id: "winter_champion", name: "Winter Champion", icon: "👑", description: "Complete 15 tasks in winter", requirement: 15, tier: "gold" },
  ],
};

type Achievement = typeof ACHIEVEMENTS.spring[0];

type Plant = typeof SEASONS.spring.plants[0];

function GardenPlant({ plant, index, season }: { plant: Plant; index: number; season: Season }) {
  const delay = index * 0.1;
  const theme = SEASONS[season];
  
  return (
    <div 
      className="flex flex-col items-center transition-all duration-500 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-2xl md:text-3xl drop-shadow-md hover:scale-110 transition-transform cursor-default" role="img" aria-label={plant.name}>
        {plant.icon}
      </span>
      <div className={cn(
        "text-[10px] text-center mt-1 font-medium px-1 rounded bg-white/70",
        theme.textColor
      )}>
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

function AchievementBadge({ achievement, earned, progress, season }: { 
  achievement: Achievement; 
  earned: boolean; 
  progress: number;
  season: Season;
}) {
  const theme = SEASONS[season];
  const tierColors = {
    bronze: "from-amber-600 to-amber-400 border-amber-500",
    silver: "from-slate-400 to-slate-200 border-slate-400",
    gold: "from-yellow-500 to-amber-300 border-yellow-500",
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-default min-w-[70px]",
              earned 
                ? `bg-gradient-to-b ${tierColors[achievement.tier as keyof typeof tierColors]} shadow-lg` 
                : "bg-gray-100/80 border-gray-300 opacity-60"
            )}
          >
            <span className={cn(
              "text-2xl transition-all",
              earned ? "drop-shadow-md" : "grayscale"
            )}>
              {achievement.icon}
            </span>
            <div className={cn(
              "text-[9px] font-bold text-center mt-1 leading-tight",
              earned ? "text-white drop-shadow" : "text-gray-500"
            )}>
              {achievement.name}
            </div>
            {!earned && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all",
                    season === "spring" ? "bg-pink-500" :
                    season === "summer" ? "bg-cyan-500" :
                    season === "fall" ? "bg-orange-500" : "bg-blue-400"
                  )}
                  style={{ width: `${Math.min(100, (progress / achievement.requirement) * 100)}%` }}
                />
              </div>
            )}
            {earned && (
              <div className="absolute -top-1 -right-1 text-xs">
                {achievement.tier === "gold" ? "👑" : achievement.tier === "silver" ? "🥈" : "🥉"}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <div className="text-center">
            <div className="font-bold">{achievement.name}</div>
            <div className="text-xs text-muted-foreground">{achievement.description}</div>
            <div className="text-xs mt-1 font-medium">
              {earned ? "✅ Achieved!" : `Progress: ${progress}/${achievement.requirement}`}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SeasonSelector({ 
  currentSeason, 
  selectedSeason, 
  onSeasonChange 
}: { 
  currentSeason: Season; 
  selectedSeason: Season; 
  onSeasonChange: (season: Season) => void;
}) {
  const allSeasons: Season[] = ["spring", "summer", "fall", "winter"];
  
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      {/* Visual indicators */}
      <div className="flex gap-1">
        {allSeasons.map((s) => {
          const theme = SEASONS[s];
          const Icon = theme.icon;
          const isActive = s === selectedSeason;
          const isCurrent = s === currentSeason;
          return (
            <button
              key={s}
              onClick={() => onSeasonChange(s)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all",
                isActive 
                  ? `${theme.textColor} bg-white shadow-md border ${theme.borderColor}` 
                  : "text-gray-400 bg-gray-100/50 hover:bg-gray-200/50",
                isCurrent && !isActive && "ring-1 ring-offset-1 ring-gray-300"
              )}
              title={isCurrent ? `${s} (current)` : s}
            >
              <Icon className="h-3 w-3" />
              <span className="capitalize hidden sm:inline">{s}</span>
            </button>
          );
        })}
      </div>
      
      {/* Dropdown for mobile */}
      <Select value={selectedSeason} onValueChange={(value) => onSeasonChange(value as Season)}>
        <SelectTrigger className="w-[140px] h-8 text-xs sm:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allSeasons.map((s) => {
            const theme = SEASONS[s];
            const Icon = theme.icon;
            const isCurrent = s === currentSeason;
            return (
              <SelectItem key={s} value={s}>
                <div className="flex items-center gap-2">
                  <Icon className="h-3 w-3" />
                  <span className="capitalize">{s}</span>
                  {isCurrent && <span className="text-muted-foreground">(now)</span>}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export function GardenRewards({ actionItems, className }: GardenRewardsProps) {
  const currentSeason = getCurrentSeason();
  const [selectedSeason, setSelectedSeason] = useState<Season>(currentSeason);
  const theme = SEASONS[selectedSeason];
  const SeasonIcon = theme.icon;
  const updateCO2Stats = useUpdateCO2Stats();

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
    const earnedPlants: Plant[] = [];
    
    let remainingPoints = points;
    // Award plants based on points (best plants first)
    const sortedPlants = [...theme.plants].sort((a, b) => b.requiredPoints - a.requiredPoints);
    
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
    
    const minPlantCost = Math.min(...theme.plants.map(p => p.requiredPoints));
    const pointsToNext = remainingPoints < minPlantCost ? minPlantCost - remainingPoints : 0;
    
    // Check achievements for the selected season
    const seasonAchievements = ACHIEVEMENTS[selectedSeason];
    const earnedAchievements = seasonAchievements.map(achievement => ({
      ...achievement,
      earned: completed.length >= achievement.requirement,
    }));
    
    return {
      completedCount: completed.length,
      points,
      totalCo2,
      earnedPlants: earnedPlants.slice(0, 20), // Max 20 plants shown
      earnedTools,
      pointsToNext,
      remainingPoints,
      earnedAchievements,
    };
  }, [actionItems, theme.plants, selectedSeason]);

  // Sync CO2 stats to database for leaderboard
  useEffect(() => {
    if (stats.completedCount > 0) {
      updateCO2Stats.mutate({
        totalCO2Saved: stats.totalCo2,
        completedTasksCount: stats.completedCount,
        currentSeason: selectedSeason,
      });
    }
  }, [stats.totalCo2, stats.completedCount, selectedSeason]);

  return (
    <div className={cn("relative", className)}>
      {/* Season Selector */}
      <SeasonSelector 
        currentSeason={currentSeason} 
        selectedSeason={selectedSeason} 
        onSeasonChange={setSelectedSeason} 
      />

      {/* Garden Header */}
      <div className="text-center mb-4">
        <h3 className={cn("text-lg font-bold flex items-center justify-center gap-2", theme.textColor)}>
          <SeasonIcon className="h-5 w-5" />
          {theme.name}
        </h3>
        <p className={cn("text-sm", theme.subtextColor)}>{theme.description}</p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className={cn("flex items-center gap-1", theme.textColor)}>
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

      {/* Achievements Section */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className={cn("h-4 w-4", theme.textColor)} />
          <span className={cn("text-sm font-semibold", theme.textColor)}>
            {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} Achievements
          </span>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {stats.earnedAchievements.map(achievement => (
            <AchievementBadge 
              key={achievement.id}
              achievement={achievement}
              earned={achievement.earned}
              progress={stats.completedCount}
              season={selectedSeason}
            />
          ))}
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
        "relative rounded-2xl overflow-hidden border-4",
        `bg-gradient-to-b ${theme.background}`,
        theme.borderColor
      )}>
        {/* Sky area */}
        <div className={cn("absolute inset-0 h-1/2", `bg-gradient-to-b ${theme.skyGradient}`)} />
        
        {/* Sun/Moon */}
        <div className={cn(
          "absolute top-4 right-6 w-10 h-10 rounded-full shadow-lg animate-pulse",
          theme.sunColor
        )} />
        
        {/* Weather decoration */}
        <div className="absolute top-6 left-10 text-2xl opacity-60">{theme.weather}</div>
        <div className="absolute top-8 left-1/3 text-xl opacity-40">{theme.weather}</div>
        
        {/* Seasonal decorations */}
        <div className="absolute top-12 right-1/4 text-lg opacity-50 animate-bounce" style={{ animationDuration: '3s' }}>
          {theme.decorations[0]}
        </div>
        <div className="absolute top-16 left-1/4 text-lg opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          {theme.decorations[1]}
        </div>
        
        {/* Plants Area */}
        <div className="relative pt-16 pb-8 px-6 min-h-[160px]">
          {stats.earnedPlants.length === 0 ? (
            <div className={cn("text-center py-8 opacity-60", theme.subtextColor)}>
              <Flower2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Complete tasks to grow your {selectedSeason} garden!</p>
              <p className="text-xs mt-1">
                Next plant in <span className="font-bold">{stats.pointsToNext}</span> points
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {stats.earnedPlants.map((plant, index) => (
                <GardenPlant 
                  key={`${plant.id}-${index}`} 
                  plant={plant} 
                  index={index}
                  season={selectedSeason}
                />
              ))}
            </div>
          )}
        </div>

        {/* Soil/Ground */}
        <div className={cn("h-6", `bg-gradient-to-t ${theme.groundColor}`)} />
        
        {/* Fence at bottom */}
        <div className="relative -mb-4">
          <PicketFence className="h-20" showFlowers={selectedSeason === "spring" || selectedSeason === "summer"} />
        </div>
      </div>

      {/* Progress to next plant */}
      {stats.pointsToNext > 0 && (
        <div className="mt-3 text-center">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{stats.pointsToNext} more points</span> until next {selectedSeason} plant
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mx-auto mt-1 overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", 
                selectedSeason === "spring" ? "bg-pink-500" :
                selectedSeason === "summer" ? "bg-cyan-500" :
                selectedSeason === "fall" ? "bg-orange-500" : "bg-blue-400"
              )}
              style={{ 
                width: `${Math.min(100, (stats.remainingPoints / Math.min(...theme.plants.map(p => p.requiredPoints))) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* CO2 Leaderboard */}
      <div className="mt-6">
        <CO2Leaderboard />
      </div>
    </div>
  );
}