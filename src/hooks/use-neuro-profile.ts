import { useState, useEffect } from "react";

export type NeuroProfile = 
  | "default"
  | "adhd"
  | "asd"      // Autism Spectrum
  | "hearing"  // Hearing impaired
  | "vision";  // Vision impaired

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
  };
}

const STORAGE_KEY = "neuro-profile-settings";

const PROFILE_DEFAULTS: Record<NeuroProfile, Partial<NeuroProfileSettings["customizations"]>> = {
  default: {},
  adhd: {
    reducedMotion: false, // Movement can help ADHD
    simplifiedUI: true,
    longerTimeouts: true,
  },
  asd: {
    reducedMotion: true,
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

    // Persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setProfile = (profile: NeuroProfile) => {
    const profileDefaults = PROFILE_DEFAULTS[profile];
    setSettings(prev => ({
      profile,
      customizations: {
        ...defaultSettings.customizations,
        ...profileDefaults,
        // Keep any manual overrides the user made
      },
    }));
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
}> = {
  default: {
    label: "Standard",
    shortLabel: "STD",
    description: "Default settings",
    icon: "⚙️",
  },
  adhd: {
    label: "ADHD-Friendly",
    shortLabel: "ADHD",
    description: "Simplified UI, longer timeouts, movement allowed",
    icon: "⚡",
  },
  asd: {
    label: "ASD-Friendly",
    shortLabel: "ASD",
    description: "Reduced motion, predictable layout, clear focus",
    icon: "🧩",
  },
  hearing: {
    label: "Hearing Support",
    shortLabel: "DHH",
    description: "Visual cues, captions enabled, no audio-only content",
    icon: "👂",
  },
  vision: {
    label: "Vision Support",
    shortLabel: "LV",
    description: "High contrast, large text, screen reader optimized",
    icon: "👁️",
  },
};
