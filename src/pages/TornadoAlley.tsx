/**
 * ============================================================
 * TORNADO ALLEY - The Overwhelm Recovery Zone
 * ============================================================
 * 
 * CONCEPT:
 * When users feel overwhelmed, they come to Tornado Alley.
 * The metaphor: You're in the storm, but we guide you to the calm center.
 * 
 * SECTIONS:
 * 1. Brain Dump - Externalize swirling thoughts (implemented)
 * 2. Eye of the Tornado - Calming tools refuge (ASMR, vagus nerve, breathing)
 * 
 * FUTURE EXPANSION IDEAS:
 * - ASMR audio player with curated calming sounds
 * - Vagus nerve stimulation exercises (cold water, humming, etc.)
 * - Guided breathing exercises with visual pacer
 * - Grounding techniques (5-4-3-2-1 sensory exercise)
 * - Emergency contacts / support resources
 * - Progress tracking for overwhelm episodes
 * 
 * The Eye of the Tornado is the quiet center WITHIN the chaos.
 * Users acknowledge they're in the storm but find refuge.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Wind, 
  Eye,
  Waves,
  Music,
  Heart,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { BrainDumpCard } from "@/components/TornadoAlley/BrainDumpCard";
import { AwarenessImage } from "@/components/TornadoAlley/AwarenessImage";
import tornadoAlleyImg from "@/assets/tornado-alley.png";

/**
 * Eye of the Tornado Tools
 * These are placeholders for future calming tools.
 * Each tool should help the user find calm within the chaos.
 */
const eyeOfStormTools = [
  {
    id: "breathing",
    title: "Breathing Pacer",
    description: "Follow the visual guide to slow your breathing",
    icon: Wind,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    // TODO: Implement breathing exercise component
    implemented: false
  },
  {
    id: "asmr",
    title: "Calming Sounds",
    description: "ASMR and ambient audio for nervous system regulation",
    icon: Music,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    // TODO: Implement audio player with ASMR/ambient tracks
    implemented: false
  },
  {
    id: "vagus",
    title: "Vagus Nerve Reset",
    description: "Simple exercises to activate your calming response",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    // TODO: Implement vagus nerve exercise guide
    implemented: false
  },
  {
    id: "grounding",
    title: "5-4-3-2-1 Grounding",
    description: "Sensory awareness to bring you back to the present",
    icon: Waves,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    // TODO: Implement grounding exercise walkthrough
    implemented: false
  }
];

export default function TornadoAlley() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"hub" | "brain-dump" | "eye">("hub");

  // Handle completion of brain dump
  const handleBrainDumpComplete = (items: any[]) => {
    console.log("Brain dump complete with items:", items);
    // TODO: Save items to database/projects
    setActiveSection("hub");
  };

  // Hub view - entry point to Tornado Alley
  if (activeSection === "hub") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="p-4 border-b border-border/30">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={tornadoAlleyImg} 
                alt="Tornado Alley" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">Tornado Alley</h1>
                <p className="text-sm text-muted-foreground">Your overwhelm recovery zone</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
              <CardContent className="p-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Feeling overwhelmed? You're in the right place. Tornado Alley is where the chaos meets calm. 
                  <span className="text-foreground font-medium"> Dump your thoughts, then find the Eye of the Tornado.</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Brain Dump Section - Image forward, text below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow group overflow-hidden"
              onClick={() => setActiveSection("brain-dump")}
            >
              {/* Large hero image - prominent and clear */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img 
                  src={tornadoAlleyImg} 
                  alt="Tornado Alley - Brain Dump" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle gradient overlay at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Sparkle indicator */}
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
                </div>
              </div>

              {/* Text content below the image */}
              <CardContent className="pt-4 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">Brain Dump</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Get everything out of your head — voice, text, or files. 
                  We'll help you organize the chaos into actionable projects.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Eye of the Tornado Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-sky-500/20 overflow-hidden">
              {/* Awareness Image - rotates subtly, tracks if user notices */}
              <AwarenessImage 
                location="tornado_alley_eye"
                caption="Sometimes we're so overwhelmed we don't notice what's right in front of us..."
              />
              
              <CardHeader className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-sky-500/10">
                    <Eye className="w-8 h-8 text-sky-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Eye of the Tornado</CardTitle>
                    <CardDescription className="text-base">
                      The quiet center — tools to calm your nervous system
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eyeOfStormTools.map((tool) => (
                    <div 
                      key={tool.id}
                      className={`p-4 rounded-xl border ${tool.bgColor} border-white/5 ${
                        tool.implemented 
                          ? "cursor-pointer hover:border-white/20 transition-all" 
                          : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <tool.icon className={`w-6 h-6 ${tool.color} shrink-0 mt-0.5`} />
                        <div>
                          <h3 className="font-medium text-foreground">{tool.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                          {!tool.implemented && (
                            <span className="text-xs text-muted-foreground/60 mt-2 block italic">
                              Coming soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // Brain Dump active view
  if (activeSection === "brain-dump") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <header className="p-4 border-b border-border/30">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveSection("hub")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold">Brain Dump</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <BrainDumpCard onComplete={handleBrainDumpComplete} />
        </main>
      </div>
    );
  }

  return null;
}
