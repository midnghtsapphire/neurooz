import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface AccessibilitySettings {
  reducedMotion: boolean;
  focusMode: boolean;
  highContrast: boolean;
  showTimeEstimates: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "accessibility-settings";

const getSystemPreferences = (): Partial<AccessibilitySettings> => {
  if (typeof window === "undefined") return {};
  
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    highContrast: window.matchMedia("(prefers-contrast: more)").matches,
  };
};

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  focusMode: false,
  highContrast: false,
  showTimeEstimates: true,
  largeText: false,
  screenReaderOptimized: false,
};

const loadSettings = (): AccessibilitySettings => {
  if (typeof window === "undefined") return defaultSettings;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemPrefs = getSystemPreferences();
  
  if (saved) {
    try {
      return { ...defaultSettings, ...systemPrefs, ...JSON.parse(saved) };
    } catch {
      return { ...defaultSettings, ...systemPrefs };
    }
  }
  
  return { ...defaultSettings, ...systemPrefs };
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  // Listen for system preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastQuery = window.matchMedia("(prefers-contrast: more)");

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener("change", handleMotionChange);
    contrastQuery.addEventListener("change", handleContrastChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      contrastQuery.removeEventListener("change", handleContrastChange);
    };
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    
    // Focus mode
    if (settings.focusMode) {
      root.classList.add("focus-mode");
    } else {
      root.classList.remove("focus-mode");
    }
    
    // Large text
    if (settings.largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetToDefaults = () => {
    const systemPrefs = getSystemPreferences();
    setSettings({ ...defaultSettings, ...systemPrefs });
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, toggleSetting, resetToDefaults }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

// Time estimate data for wizard steps
export const STEP_TIME_ESTIMATES: Record<string, { minutes: number; label: string }> = {
  "entity-type": { minutes: 2, label: "~2 min" },
  "basic-info": { minutes: 1, label: "~1 min" },
  "ein": { minutes: 1, label: "~1 min" },
  "ownership": { minutes: 3, label: "~3 min" },
  "address": { minutes: 1, label: "~1 min" },
  "review": { minutes: 2, label: "~2 min" },
};
