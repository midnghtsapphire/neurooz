import { useEffect, useState, useRef } from "react";
import { useCognitiveLoad } from "@/hooks/use-cognitive-load";
import { Button } from "@/components/ui/button";
import { X, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const OVERLOAD_SCENARIOS = [
  {
    id: 'desert',
    title: "Lost in the Desert",
    message: "You've wandered too far from the Yellow Brick Road. The Emerald City is nowhere in sight.",
    background: "bg-gradient-to-b from-orange-900 via-yellow-900 to-orange-950",
    icon: "🏜️",
    tip: "Close some projects to find your way back."
  },
  {
    id: 'space',
    title: "Floating in Space",
    message: "You've drifted so far off course, you're not even in Oz anymore.",
    background: "bg-gradient-to-b from-slate-950 via-purple-950 to-black",
    icon: "🌌",
    tip: "Ground yourself. Finish one thing."
  },
  {
    id: 'witch',
    title: "The Witch's Domain",
    message: "Too many distractions have led you to dangerous territory.",
    background: "bg-gradient-to-b from-green-950 via-gray-900 to-black",
    icon: "🧙‍♀️",
    tip: "Focus on what matters to escape."
  },
  {
    id: 'eggs',
    title: "Sitting on Eggs",
    message: "You're a chicken sitting on too many eggs. None of them are hatching.",
    background: "bg-gradient-to-b from-amber-950 via-yellow-900 to-amber-950",
    icon: "🐔",
    tip: "Pick ONE egg to nurture. Let the others go."
  },
  {
    id: 'tornado',
    title: "Caught in the Tornado",
    message: "Your mind is spinning. Everything is chaos. You can't focus on anything.",
    background: "bg-gradient-to-b from-gray-800 via-slate-900 to-gray-950",
    icon: "🌪️",
    tip: "Stop. Breathe. Pick one thing."
  }
];

const CALMING_PHRASES = [
  "You are not broken. Your OS just needs a reboot.",
  "One brick at a time builds the whole road.",
  "The Wizard believes in you. Now believe in yourself.",
  "Chaos is just energy without direction.",
  "Close a loop. Feel the relief.",
  "Your brain is powerful. Let's aim it.",
  "Not every idea needs action today.",
  "Progress over perfection. Always.",
  "The Emerald City is waiting. You'll get there.",
];

export function OverloadIntervention() {
  const load = useCognitiveLoad();
  const [isActive, setIsActive] = useState(false);
  const [scenario, setScenario] = useState(OVERLOAD_SCENARIOS[0]);
  const [phrase, setPhrase] = useState(CALMING_PHRASES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Trigger intervention when overloaded
  useEffect(() => {
    if (load.status === 'overload' && !isActive) {
      const randomScenario = OVERLOAD_SCENARIOS[Math.floor(Math.random() * OVERLOAD_SCENARIOS.length)];
      const randomPhrase = CALMING_PHRASES[Math.floor(Math.random() * CALMING_PHRASES.length)];
      setScenario(randomScenario);
      setPhrase(randomPhrase);
      setIsActive(true);
      
      // Play calming tone if enabled
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [load.status, isActive, soundEnabled]);
  
  // Breathing animation
  useEffect(() => {
    if (!isActive) return;
    
    const phases: Array<'in' | 'hold' | 'out'> = ['in', 'hold', 'out'];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setBreathPhase(phases[currentPhase]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  const handleDismiss = () => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  if (!isActive) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000",
      scenario.background
    )}>
      {/* Binaural/calming audio (432Hz tone) */}
      <audio 
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3"
        loop
        hidden
      />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="text-center space-y-8 p-8 max-w-lg">
        {/* Scenario Icon */}
        <div className="text-8xl animate-bounce" style={{ animationDuration: '3s' }}>
          {scenario.icon}
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white">
          {scenario.title}
        </h1>
        
        {/* Message */}
        <p className="text-xl text-white/80">
          {scenario.message}
        </p>
        
        {/* Breathing Circle */}
        <div className="relative mx-auto">
          <div className={cn(
            "w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center transition-all duration-[4000ms]",
            breathPhase === 'in' && "scale-125 bg-emerald-500/20",
            breathPhase === 'hold' && "scale-125 bg-blue-500/20",
            breathPhase === 'out' && "scale-100 bg-white/10"
          )}>
            <span className="text-white/70 text-sm uppercase tracking-widest">
              {breathPhase === 'in' && "Breathe In"}
              {breathPhase === 'hold' && "Hold"}
              {breathPhase === 'out' && "Breathe Out"}
            </span>
          </div>
        </div>
        
        {/* Calming phrase */}
        <p className="text-lg text-emerald-300 italic">
          "{phrase}"
        </p>
        
        {/* Tip */}
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-white/90 text-sm">
            💡 <strong>Tip:</strong> {scenario.tip}
          </p>
        </div>
        
        {/* RAM indicator */}
        <div className="space-y-2">
          <p className="text-white/50 text-xs">Current RAM Usage</p>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all"
              style={{ width: `${load.ramUsage}%` }}
            />
          </div>
          <p className="text-white/70 text-sm">
            {load.openProjects} projects • {load.openTasks} tasks • {load.overdueTasks} overdue
          </p>
        </div>
        
        {/* Return button */}
        <Button
          onClick={handleDismiss}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
        >
          Return to Emerald City
        </Button>
      </div>
      
      {/* Animated particles/stars for space scenario */}
      {scenario.id === 'space' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
