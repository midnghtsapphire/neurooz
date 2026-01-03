import { useState, useEffect } from "react";

export type NeuroProfile = 
  | "default"
  | "adhd"       // Focus, time blindness, task paralysis
  | "asd"        // Sensory safety, predictability
  | "hearing"    // Deaf/hard of hearing
  | "vision"     // Low vision, light sensitivity
  | "vampire"    // Nocturnal, migraines, fatigue
  | "trauma"     // PTSD, anxiety, hypervigilance
  | "fatigue"    // Chronic illness, CFS, long COVID
  | "fog"        // TBI, chemo fog, cognitive impairment
  | "anxiety"    // Panic, overwhelm, intrusive thoughts
  | "creator"    // Flow state, deep work
  | "recovery";  // Shutdown days, minimal

interface NeuroProfileSettings {
  profile: NeuroProfile;
  customizations: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReaderHints: boolean;
    captions: boolean;
    simplifiedUI: boolean;
    focusIndicators: boolean;
    longerTimeouts: boolean;
    vampireMode: boolean;
    noAnimations: boolean;
    nightAnchors: boolean;
    calmLanguage: boolean;
    noUrgency: boolean;
    voiceFirst: boolean;
    flowTunnel: boolean;
    memoryBreadcrumbs: boolean;
    groundingAnchors: boolean;
  };
}

const STORAGE_KEY = "neuro-profile-settings";

const PROFILE_DEFAULTS: Record<NeuroProfile, Partial<NeuroProfileSettings["customizations"]>> = {
  default: {},
  adhd: {
    simplifiedUI: true,
    longerTimeouts: true,
    memoryBreadcrumbs: true,
  },
  asd: {
    reducedMotion: true,
    noAnimations: true,
    simplifiedUI: true,
    focusIndicators: true,
    longerTimeouts: true,
  },
  hearing: {
    captions: true,
    focusIndicators: true,
  },
  vision: {
    highContrast: true,
    largeText: true,
    screenReaderHints: true,
    focusIndicators: true,
    voiceFirst: true,
  },
  vampire: {
    vampireMode: true,
    noAnimations: true,
    reducedMotion: true,
    simplifiedUI: true,
    nightAnchors: true,
    longerTimeouts: true,
  },
  trauma: {
    reducedMotion: true,
    noAnimations: true,
    calmLanguage: true,
    noUrgency: true,
    simplifiedUI: true,
    groundingAnchors: true,
  },
  fatigue: {
    simplifiedUI: true,
    longerTimeouts: true,
    voiceFirst: true,
    reducedMotion: true,
    memoryBreadcrumbs: true,
  },
  fog: {
    simplifiedUI: true,
    longerTimeouts: true,
    memoryBreadcrumbs: true,
    groundingAnchors: true,
    noAnimations: true,
  },
  anxiety: {
    reducedMotion: true,
    noAnimations: true,
    calmLanguage: true,
    noUrgency: true,
    groundingAnchors: true,
  },
  creator: {
    flowTunnel: true,
    nightAnchors: true,
  },
  recovery: {
    simplifiedUI: true,
    noUrgency: true,
    calmLanguage: true,
    reducedMotion: true,
    noAnimations: true,
  },
};

const defaultSettings: NeuroProfileSettings = {
  profile: "default",
  customizations: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderHints: false,
    captions: false,
    simplifiedUI: false,
    focusIndicators: false,
    longerTimeouts: false,
    vampireMode: false,
    noAnimations: false,
    nightAnchors: false,
    calmLanguage: false,
    noUrgency: false,
    voiceFirst: false,
    flowTunnel: false,
    memoryBreadcrumbs: false,
    groundingAnchors: false,
  },
};

export function useNeuroProfile() {
  const [settings, setSettings] = useState<NeuroProfileSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const { customizations } = settings;

    // Apply CSS classes based on customizations
    root.classList.toggle("reduce-motion", customizations.reducedMotion);
    root.classList.toggle("high-contrast", customizations.highContrast);
    root.classList.toggle("large-text", customizations.largeText);
    root.classList.toggle("screen-reader-optimized", customizations.screenReaderHints);
    root.classList.toggle("captions-enabled", customizations.captions);
    root.classList.toggle("simplified-ui", customizations.simplifiedUI);
    root.classList.toggle("focus-indicators", customizations.focusIndicators);
    root.classList.toggle("vampire-mode", customizations.vampireMode);
    root.classList.toggle("no-animations", customizations.noAnimations);
    root.classList.toggle("night-anchors", customizations.nightAnchors);
    root.classList.toggle("calm-language", customizations.calmLanguage);
    root.classList.toggle("no-urgency", customizations.noUrgency);
    root.classList.toggle("voice-first", customizations.voiceFirst);
    root.classList.toggle("flow-tunnel", customizations.flowTunnel);
    root.classList.toggle("memory-breadcrumbs", customizations.memoryBreadcrumbs);
    root.classList.toggle("grounding-anchors", customizations.groundingAnchors);

    // Persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setProfile = (profile: NeuroProfile) => {
    const profileDefaults = PROFILE_DEFAULTS[profile];
    setSettings({
      profile,
      customizations: {
        ...defaultSettings.customizations,
        ...profileDefaults,
      },
    });
  };

  const updateCustomization = <K extends keyof NeuroProfileSettings["customizations"]>(
    key: K,
    value: NeuroProfileSettings["customizations"][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [key]: value,
      },
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return {
    profile: settings.profile,
    customizations: settings.customizations,
    setProfile,
    updateCustomization,
    resetToDefaults,
  };
}

// Profile display info
export const NEURO_PROFILE_INFO: Record<NeuroProfile, { 
  label: string; 
  shortLabel: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
}> = {
  default: {
    label: "Standard",
    shortLabel: "STD",
    description: "Default settings for general use",
    icon: "⚙️",
    features: ["Full features", "Standard animations", "All notifications"],
    color: "from-slate-500 to-slate-600",
  },
  adhd: {
    label: "ADHD Mode",
    shortLabel: "ADHD",
    description: "For focus, time blindness, and task paralysis",
    icon: "⚡",
    features: ["One task per screen", "Time passage HUD", "Dopamine-safe rewards", "Chunked micro-steps"],
    color: "from-amber-500 to-orange-500",
  },
  asd: {
    label: "Autism Mode",
    shortLabel: "ASD",
    description: "For sensory safety and predictability",
    icon: "🧩",
    features: ["Stable layouts", "No motion", "Predictable navigation", "No surprise UI"],
    color: "from-blue-500 to-indigo-500",
  },
  hearing: {
    label: "Hearing Support",
    shortLabel: "DHH",
    description: "For Deaf and hard of hearing users",
    icon: "🦻",
    features: ["Always-on captions", "Visual alerts", "No audio-only content", "Tap-to-repeat"],
    color: "from-purple-500 to-violet-500",
  },
  vision: {
    label: "Vision Support",
    shortLabel: "LV",
    description: "For low vision, migraines, light sensitivity",
    icon: "👁️",
    features: ["Ultra large text", "High contrast", "Screen reader optimized", "Voice-first nav"],
    color: "from-cyan-500 to-teal-500",
  },
  vampire: {
    label: "Vampire Mode",
    shortLabel: "🦇",
    description: "For night brains, migraines, fatigue, nocturnal focus",
    icon: "🦇",
    features: ["True OLED black", "Ember accents", "Zero animation", "Vertical-only flow"],
    color: "from-red-900 to-black",
  },
  trauma: {
    label: "Trauma-Safe Mode",
    shortLabel: "PTSD",
    description: "For freeze, anxiety, hypervigilance",
    icon: "🛡️",
    features: ["No red alerts", "Calm language", "Safe exit button", "Grounding anchors"],
    color: "from-emerald-600 to-teal-700",
  },
  fatigue: {
    label: "Low Energy Mode",
    shortLabel: "CFS",
    description: "For chronic illness, long COVID, autoimmune, caregiving",
    icon: "🌿",
    features: ["Auto simplify", "Voice-first", "Rest reminders", "Resume later"],
    color: "from-green-500 to-emerald-600",
  },
  fog: {
    label: "Brain Fog Mode",
    shortLabel: "FOG",
    description: "For TBI, chemo fog, cognitive impairment",
    icon: "🌫️",
    features: ["One-step flow", "Memory breadcrumbs", "No penalty undo", "Progress anchors"],
    color: "from-gray-400 to-slate-500",
  },
  anxiety: {
    label: "Calm Mode",
    shortLabel: "CALM",
    description: "For overwhelm, panic, intrusive thoughts",
    icon: "🌙",
    features: ["No urgency cues", "Gentle pacing", "Breathing prompts", "Soft colors"],
    color: "from-indigo-400 to-purple-500",
  },
  creator: {
    label: "Creator Mode",
    shortLabel: "FLOW",
    description: "For artists, writers, night builders",
    icon: "🎧",
    features: ["Flow tunnel", "No notifications", "Sanctuary workspace", "Moon-cycle planning"],
    color: "from-rose-500 to-pink-600",
  },
  recovery: {
    label: "Recovery Mode",
    shortLabel: "REST",
    description: "For shutdown days when you need gentleness",
    icon: "🛌",
    features: ["Only next step", "No backlog visible", "No metrics", "Gentle encouragement"],
    color: "from-violet-400 to-purple-500",
  },
};
