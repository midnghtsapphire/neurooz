import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const QUICK_PROMPTS = [
  { emoji: "🌪️", text: "I'm overwhelmed", action: "dump" },
  { emoji: "📋", text: "What should I do next?", action: "next" },
  { emoji: "✅", text: "I finished something", action: "complete" },
];

export function OzFocusHome({ userEmail }: OzFocusHomeProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("See you soon!");
    navigate("/");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "dump":
        navigate("/onboarding");
        break;
      case "next":
        navigate("/projects");
        break;
      case "complete":
        navigate("/projects");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between p-4">
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
            <DropdownMenuItem onClick={() => navigate("/projects")}>
              📁 Projects
            </DropdownMenuItem>
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
            <DropdownMenuItem onClick={() => navigate("/subscriptions")}>
              📦 Subscriptions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main centered content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 -mt-16">
        {/* Toto greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="text-7xl mb-6">🐕</div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            Hey there, Dorothy
          </h1>
          <p className="text-white/60 text-lg">
            What&apos;s on your mind?
          </p>
        </motion.div>

        {/* Main action - Brain Dump */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md mb-8"
        >
          <Button
            onClick={() => navigate("/onboarding")}
            size="lg"
            className="w-full h-16 text-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50"
          >
            <Brain className="w-6 h-6 mr-3" />
            Brain Dump
          </Button>
          <p className="text-center text-white/40 text-sm mt-3">
            Just let it out. The Wizard will help organize it.
          </p>
        </motion.div>

        {/* Quick prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {QUICK_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(prompt.action)}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm transition-all"
            >
              {prompt.emoji} {prompt.text}
            </button>
          ))}
        </motion.div>
      </main>

      {/* Subtle footer hint */}
      <footer className="p-4 text-center">
        <p className="text-white/30 text-xs">
          Tap the menu for more tools when you need them
        </p>
      </footer>
    </div>
  );
}

export default OzFocusHome;
