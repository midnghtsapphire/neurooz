import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RAMMonitor } from "@/components/OzEngine/RAMMonitor";
import { CharacterStatus } from "@/components/OzEngine/CharacterStatus";
import { EmeraldCityDashboard } from "@/components/OzEngine/EmeraldCityDashboard";
import { OverloadIntervention } from "@/components/OzEngine/OverloadIntervention";
import { TotoFirewall } from "@/components/OzEngine/TotoFirewall";
import { TornadoEntry } from "@/components/OzEngine/TornadoEntry";
import { WizardVoice } from "@/components/OzEngine/WizardVoice";
import { FirstQuestCard } from "@/components/OzEngine/FirstQuestCard";
import { QuestCompletion } from "@/components/OzEngine/QuestCompletion";
import { VoidEvent } from "@/components/OzEngine/VoidEvent";
import { ControlledBurn } from "@/components/OzEngine/ControlledBurn";
import { ProjectOrbitDisplay } from "@/components/OzEngine/ProjectOrbitDisplay";
import { BrainDumpDialog } from "@/components/BrainDumpDialog";
import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { useOzOnboarding } from "@/hooks/use-oz-onboarding";
import { useCreateBrainDump, useProcessBrainDump } from "@/hooks/use-brain-dumps";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowLeft, 
  FolderOpen,
  Plus,
  Brain,
  Zap,
  RotateCcw,
  Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OzEngine() {
  const load = useCognitiveLoad();
  const { toast } = useToast();
  const { data: projects = [] } = useProjects();
  const createBrainDump = useCreateBrainDump();
  const processBrainDump = useProcessBrainDump();
  
  const onboarding = useOzOnboarding();
  
  const [showFirewall, setShowFirewall] = useState(false);
  const [pendingImpulse, setPendingImpulse] = useState<{
    type: 'project' | 'task' | 'idea' | 'other';
    name?: string;
    callback?: () => void;
  } | null>(null);
  
  // Controlled Burn state
  const [burnMode, setBurnMode] = useState(false);
  const [burnQuest, setBurnQuest] = useState({ title: "", duration: 25 });
  
  // First quest for new users
  const firstQuest = {
    title: "Close One Open Loop",
    description: "Pick the smallest, simplest task you've been avoiding. Complete it now. Feel the relief.",
    estimatedMinutes: 10,
    energyCost: 'low' as const,
    reward: "RAM freed. City lights surge. The Wizard nods in approval.",
  };
  
  // Handle tornado brain dump completion
  const handleTornadoComplete = async (content: string) => {
    onboarding.completeTornado(content);
    
    try {
      const result = await createBrainDump.mutateAsync({
        raw_content: content,
        title: "Entry Storm",
      });
      
      if (result) {
        await processBrainDump.mutateAsync({
          brainDumpId: result.id,
          rawContent: content,
          existingProjects: projects.map(p => p.name),
        });
      }
      
      toast({
        title: "Storm sorted",
        description: "The Wizard has organized your thoughts. Welcome to Oz.",
      });
    } catch (error) {
      console.error('Failed to process brain dump:', error);
    }
  };
  
  // Handle void event return
  const handleVoidReturn = (destination: 'planet' | 'library' | 'battle' | 'sanctuary', refocusedGoal?: string) => {
    if (destination === 'battle') {
      handleStartBurn(refocusedGoal || 'Focus Quest');
    }
    toast({
      title: "Gravity restored",
      description: destination === 'planet' && refocusedGoal 
        ? `Refocused on: "${refocusedGoal}"` 
        : `Navigating to ${destination}`,
    });
  };
  
  // Handle controlled burn
  const handleStartBurn = (title: string, duration: number = 25) => {
    setBurnQuest({ title, duration });
    setBurnMode(true);
  };
  
  const handleBurnComplete = () => {
    setBurnMode(false);
    toast({
      title: "🔥 Burn complete",
      description: "Mission accomplished. You've earned your cooldown.",
    });
  };
  
  const handleNewProjectAttempt = () => {
    // Check orbit capacity
    if (load.openProjects >= 6) {
      toast({
        title: "Orbit capacity reached",
        description: "Complete or archive a project before adding more.",
        variant: "destructive",
      });
      return;
    }
    
    setPendingImpulse({ type: 'project', name: 'New Project' });
    setShowFirewall(true);
  };
  
  const handleImpulseProceed = () => {
    setShowFirewall(false);
    toast({
      title: "Quest approved",
      description: "Toto has cleared this impulse. Proceed with intention.",
    });
  };
  
  const handleImpulseDelay = (minutes: number) => {
    setShowFirewall(false);
    toast({
      title: "Impulse delayed",
      description: `This will be revisited in ${minutes} minutes. Focus on current quests.`,
    });
  };
  
  const handleImpulseRoute = (destination: 'tinman' | 'scarecrow' | 'lion' | 'dorothy') => {
    setShowFirewall(false);
    const names = {
      tinman: 'Tin Man (Emotional Processing)',
      scarecrow: 'Scarecrow (Logic & Planning)',
      lion: 'Lion (Courage Building)',
      dorothy: 'Dorothy (Executive Decision)'
    };
    toast({
      title: `Routed to ${names[destination]}`,
      description: "This impulse has been tagged for proper processing.",
    });
  };
  
  const handleImpulseBlock = () => {
    setShowFirewall(false);
    toast({
      title: "Impulse blocked",
      description: "Toto has protected you from a destructive impulse.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-background to-background">
      {/* Tornado Entry (First-time users) */}
      <TornadoEntry
        isOpen={onboarding.showTornadoEntry}
        onComplete={handleTornadoComplete}
        onSkip={onboarding.skipTornado}
      />
      
      {/* Void Event (Orbital Drift) */}
      <VoidEvent onReturn={handleVoidReturn} />
      
      {/* Controlled Burn Mode */}
      <ControlledBurn
        isActive={burnMode}
        questTitle={burnQuest.title}
        questDuration={burnQuest.duration}
        onComplete={handleBurnComplete}
        onAbort={() => setBurnMode(false)}
      />
      
      {/* Quest Completion Celebration */}
      <QuestCompletion
        isVisible={onboarding.showQuestCompletion}
        questTitle={firstQuest.title}
        onComplete={onboarding.dismissQuestCompletion}
      />
      
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
          onBlock={handleImpulseBlock}
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
              <div>
                <h1 className="text-xl font-bold text-emerald-100">The Oz Engine</h1>
                <p className="text-xs text-emerald-400/60">Stabilize your gravity.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartBurn("Focus Session", 25)}
              className="border-orange-500/50 text-orange-400 hover:bg-orange-950/50"
            >
              <Flame className="h-4 w-4 mr-1" />
              Burn Mode
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onboarding.resetOnboarding}
              title="Reset Onboarding (Dev)"
              className="text-emerald-400/50 hover:text-emerald-400"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <BrainDumpDialog />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - City & Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wizard Greeting */}
            <WizardVoice size="lg" />
            
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
                disabled={load.status === 'overload'}
              >
                <Plus className="h-6 w-6 text-emerald-400" />
                <span>New Quest</span>
                <span className="text-xs text-muted-foreground">
                  {load.status === 'overload' ? 'Locked - RAM full' : 'Toto will check'}
                </span>
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
            
            {/* First Quest Card (for new users) */}
            {onboarding.needsFirstQuest && (
              <FirstQuestCard
                quest={firstQuest}
                onAccept={onboarding.acceptFirstQuest}
                onComplete={onboarding.completeFirstQuest}
                isAccepted={onboarding.state.hasAcceptedFirstQuest}
                isComplete={onboarding.state.hasCompletedFirstQuest}
              />
            )}
            
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
                      {load.driftLevel > 50 && (
                        <span className="text-purple-400">
                          🚀 Drift: {Math.round(load.driftLevel)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - RAM, Orbits & Characters */}
          <div className="space-y-6">
            <RAMMonitor />
            <ProjectOrbitDisplay />
            <CharacterStatus />
          </div>
        </div>
      </main>
    </div>
  );
}
