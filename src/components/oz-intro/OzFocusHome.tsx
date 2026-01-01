import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import emeraldRoadHero from "@/assets/emerald-road-hero.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OzFocusHomeProps {
  userEmail?: string;
}

// Character states users can identify with
const CHARACTER_STATES = [
  {
    emoji: "🧠",
    character: "Scarecrow",
    feeling: "My brain is mush",
    subtext: "Too many thoughts. Can't remember what I was doing 5 minutes ago.",
    action: "dump",
    color: "from-amber-600 to-yellow-700",
    hoverColor: "hover:from-amber-500 hover:to-yellow-600",
  },
  {
    emoji: "❤️",
    character: "Tin Man",
    feeling: "I need to deal with feelings",
    subtext: "Bottled up emotions. Need to tell someone how I feel. Or process anger.",
    action: "heart",
    color: "from-rose-600 to-red-700",
    hoverColor: "hover:from-rose-500 hover:to-red-600",
  },
  {
    emoji: "🦁",
    character: "Lion",
    feeling: "I need to do something scary",
    subtext: "Ask for a raise. Make that phone call. Send that email. Be brave.",
    action: "courage",
    color: "from-orange-600 to-amber-700",
    hoverColor: "hover:from-orange-500 hover:to-amber-600",
  },
];

export function OzFocusHome({ userEmail }: OzFocusHomeProps) {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("See you on the road!");
    navigate("/");
  };

  const handleCharacterAction = (action: string) => {
    setSelectedState(action);
    
    // All paths lead to brain dump for now, but with different framing
    setTimeout(() => {
      navigate("/onboarding");
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background - Yellow Brick Road to Emerald City */}
      <div className="absolute inset-0 z-0">
        <img 
          src={emeraldRoadHero} 
          alt="Your path to the Emerald City" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
      </div>

      {/* Minimal header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <div className="text-white/60 text-sm">
          {userEmail}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/oz-engine")}>
              🧙 Oz Engine
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/projects")}>
              📁 Projects
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/vine-tracker")}>
              🍇 Vine Tracker
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/business-setup")}>
              🏢 Business Setup
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/tax-forms")}>
              📝 Tax Forms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/donations")}>
              🎁 Donations
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/pricing")}>
              💳 Pricing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {/* Emerald City in the distance */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">🏰</div>
          <p className="text-white/50 text-sm">Your Emerald City awaits</p>
        </motion.div>

        {/* You ARE Dorothy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 text-4xl mb-4">
            <span>👧</span>
            <span className="text-2xl">← that's you</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            You're Dorothy. How are you feeling?
          </h1>
          <p className="text-white/60">
            Which friend do you need right now?
          </p>
        </motion.div>

        {/* Character state buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-4"
        >
          {CHARACTER_STATES.map((state, index) => (
            <motion.button
              key={state.action}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleCharacterAction(state.action)}
              className={`w-full p-4 rounded-xl bg-gradient-to-r ${state.color} ${state.hoverColor} 
                text-left transition-all duration-300 transform hover:scale-[1.02] 
                shadow-lg hover:shadow-xl border border-white/10
                ${selectedState === state.action ? 'ring-2 ring-white scale-[1.02]' : ''}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{state.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{state.character}</span>
                    <Sparkles className="w-4 h-4 text-white/60" />
                  </div>
                  <p className="text-white font-medium">{state.feeling}</p>
                  <p className="text-white/70 text-sm mt-1">{state.subtext}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Alternative: Just check in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate("/projects")}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Or just check my projects →
          </button>
        </motion.div>
      </main>

      {/* Subtle footer */}
      <footer className="relative z-10 p-4 text-center">
        <p className="text-white/30 text-xs">
          The more you use this, the more you'll know which friend you need 🌟
        </p>
      </footer>
    </div>
  );
}

export default OzFocusHome;
