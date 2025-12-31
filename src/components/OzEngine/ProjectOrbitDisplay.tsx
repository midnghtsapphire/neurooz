import { useCognitiveLoad, ProjectOrbit } from "@/hooks/use-cognitive-load";
import { useProjects } from "@/hooks/use-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe2, 
  Moon, 
  Satellite, 
  Archive,
  Lock,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrbitSlotProps {
  type: ProjectOrbit;
  projectId: string | null;
  projectName?: string;
  isActive: boolean;
  canAdd: boolean;
}

function OrbitSlot({ type, projectId, projectName, isActive, canAdd }: OrbitSlotProps) {
  const icons = {
    planet: <Globe2 className="h-6 w-6" />,
    moon: <Moon className="h-5 w-5" />,
    probe: <Satellite className="h-4 w-4" />,
    archived: <Archive className="h-4 w-4" />,
  };
  
  const labels = {
    planet: 'Planet',
    moon: 'Moon',
    probe: 'Probe',
    archived: 'Archived',
  };
  
  const colors = {
    planet: 'from-emerald-500 to-teal-600',
    moon: 'from-blue-500 to-indigo-600',
    probe: 'from-purple-500 to-pink-600',
    archived: 'from-slate-500 to-slate-600',
  };

  return (
    <div className={cn(
      "relative rounded-lg border p-3 transition-all",
      isActive 
        ? "border-emerald-500/50 bg-gradient-to-br from-emerald-950/50 to-transparent" 
        : canAdd
          ? "border-dashed border-muted-foreground/30 bg-muted/10"
          : "border-muted-foreground/20 bg-muted/5 opacity-50"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-full",
          isActive 
            ? `bg-gradient-to-br ${colors[type]} text-white`
            : "bg-muted text-muted-foreground"
        )}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {labels[type]}
            </span>
            {isActive && <Check className="h-3 w-3 text-emerald-400" />}
            {!canAdd && !isActive && <Lock className="h-3 w-3 text-muted-foreground" />}
          </div>
          {projectName ? (
            <p className="text-sm font-medium truncate">{projectName}</p>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              {canAdd ? 'Available' : 'Locked'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectOrbitDisplay() {
  const load = useCognitiveLoad();
  const { data: projects = [] } = useProjects();
  
  const getProjectName = (id: string | null) => {
    if (!id) return undefined;
    return projects.find(p => p.id === id)?.name;
  };

  return (
    <Card className="border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-purple-400" />
            Project Orbits
          </span>
          <Badge variant="outline" className="text-xs">
            {load.openProjects}/6 active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Planet slot */}
        <OrbitSlot
          type="planet"
          projectId={load.planetProject}
          projectName={getProjectName(load.planetProject)}
          isActive={!!load.planetProject}
          canAdd={load.canAddPlanet}
        />
        
        {/* Moon slots */}
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <OrbitSlot
              key={`moon-${i}`}
              type="moon"
              projectId={load.moonProjects[i] || null}
              projectName={getProjectName(load.moonProjects[i] || null)}
              isActive={!!load.moonProjects[i]}
              canAdd={load.canAddMoon}
            />
          ))}
        </div>
        
        {/* Probe slots */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <OrbitSlot
              key={`probe-${i}`}
              type="probe"
              projectId={load.probeProjects[i] || null}
              projectName={getProjectName(load.probeProjects[i] || null)}
              isActive={!!load.probeProjects[i]}
              canAdd={load.canAddProbe}
            />
          ))}
        </div>
        
        {/* Archived count */}
        {load.archivedCount > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-2">
              <Archive className="h-3 w-3" />
              Cosmic Library
            </span>
            <span>{load.archivedCount} archived</span>
          </div>
        )}
        
        {/* Capacity warning */}
        {load.openProjects >= 6 && (
          <p className="text-xs text-amber-400 flex items-center gap-1">
            ⚠️ Orbit capacity reached. Complete or archive projects to add more.
          </p>
        )}
      </CardContent>
    </Card>
  );
}