import { useState } from "react";
import { Link } from "react-router-dom";
import { RAMMonitor } from "@/components/OzEngine/RAMMonitor";
import { CharacterStatus } from "@/components/OzEngine/CharacterStatus";
import { EmeraldCityDashboard } from "@/components/OzEngine/EmeraldCityDashboard";
import { OverloadIntervention } from "@/components/OzEngine/OverloadIntervention";
import { TotoFirewall } from "@/components/OzEngine/TotoFirewall";
import { BrainDumpDialog } from "@/components/BrainDumpDialog";
import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowLeft, 
  Tornado, 
  FolderOpen,
  Plus,
  Brain,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OzEngine() {
  const load = useCognitiveLoad();
  const { toast } = useToast();
  const [showFirewall, setShowFirewall] = useState(false);
  const [pendingImpulse, setPendingImpulse] = useState<{
    type: 'project' | 'task' | 'idea' | 'other';
    name?: string;
    callback?: () => void;
  } | null>(null);
  
  const handleNewProjectAttempt = () => {
    setPendingImpulse({ type: 'project', name: 'New Project' });
    setShowFirewall(true);
  };
  
  const handleImpulseProceed = () => {
    setShowFirewall(false);
    toast({
      title: "Quest approved",
      description: "Toto has cleared this impulse. Proceed with intention.",
    });
    // Could navigate to create project here
  };
  
  const handleImpulseDelay = () => {
    setShowFirewall(false);
    toast({
      title: "Impulse delayed",
      description: "This will be revisited in 10 minutes. Focus on current quests.",
    });
  };
  
  const handleImpulseRoute = (destination: 'tinman' | 'scarecrow' | 'lion') => {
    setShowFirewall(false);
    const names = {
      tinman: 'Tin Man (Emotional Processing)',
      scarecrow: 'Scarecrow (Logic & Planning)',
      lion: 'Lion (Courage Building)'
    };
    toast({
      title: `Routed to ${names[destination]}`,
      description: "This impulse has been tagged for proper processing.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-background to-background">
      {/* Overload Intervention (full-screen takeover) */}
      <OverloadIntervention />
      
      {/* Toto Firewall Dialog */}
      {pendingImpulse && (
        <TotoFirewall
          isOpen={showFirewall}
          onClose={() => setShowFirewall(false)}
          impulseType={pendingImpulse.type}
          impulseName={pendingImpulse.name}
          onProceed={handleImpulseProceed}
          onDelay={handleImpulseDelay}
          onRoute={handleImpulseRoute}
        />
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-500/20 bg-emerald-950/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-emerald-100">The Oz Engine</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BrainDumpDialog />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - City & Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emerald City Visualization */}
            <Card className="border-emerald-500/30 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Emerald City
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EmeraldCityDashboard />
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 border-emerald-500/30 hover:bg-emerald-950/50"
                onClick={handleNewProjectAttempt}
              >
                <Plus className="h-6 w-6 text-emerald-400" />
                <span>New Quest</span>
                <span className="text-xs text-muted-foreground">Toto will check first</span>
              </Button>
              
              <Link to="/projects" className="contents">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 border-yellow-500/30 hover:bg-yellow-950/50"
                >
                  <FolderOpen className="h-6 w-6 text-yellow-400" />
                  <span>Active Quests</span>
                  <span className="text-xs text-muted-foreground">{load.openProjects} projects</span>
                </Button>
              </Link>
              
              <BrainDumpDialog />
            </div>
            
            {/* Status Message */}
            <Card className={`border-2 ${
              load.status === 'overload' ? 'border-red-500/50 bg-red-950/20' :
              load.status === 'critical' ? 'border-orange-500/50 bg-orange-950/20' :
              load.status === 'elevated' ? 'border-yellow-500/50 bg-yellow-950/20' :
              'border-emerald-500/50 bg-emerald-950/20'
            }`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    load.status === 'overload' ? 'bg-red-500/20' :
                    load.status === 'critical' ? 'bg-orange-500/20' :
                    load.status === 'elevated' ? 'bg-yellow-500/20' :
                    'bg-emerald-500/20'
                  }`}>
                    <Brain className={`h-6 w-6 ${
                      load.status === 'overload' ? 'text-red-400' :
                      load.status === 'critical' ? 'text-orange-400' :
                      load.status === 'elevated' ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{load.statusMessage}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" /> {load.openTasks} open loops
                      </span>
                      {load.overdueTasks > 0 && (
                        <span className="text-amber-400">
                          ⚠️ {load.overdueTasks} overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - RAM & Characters */}
          <div className="space-y-6">
            <RAMMonitor />
            <CharacterStatus />
          </div>
        </div>
      </main>
    </div>
  );
}
