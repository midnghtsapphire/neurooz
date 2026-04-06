/**
 * Oz Engine™ Core Types
 * Standalone module - can be reused across applications
 */

// ============= Cognitive Modes =============
/**
 * Core Oz Engine cognitive modes.
 * - flow: deep, single-task vertical focus (maps to Focus in Urban Oz spec)
 * - power: high-capacity structured planning (maps to Executive in Urban Oz spec)
 * - recovery: ultra-simple, one thing only (maps to Rest in Urban Oz spec)
 * - creative: warm, energetic lateral thinking (Urban Oz spec Creative mode)
 */
export type CognitiveMode = "flow" | "power" | "recovery" | "creative";

/**
 * Human-readable names from the Urban Oz design spec.
 * Maps directly to UI CSS data-mode attributes.
 */
export type CognitiveModeLabel = "Focus" | "Executive" | "Rest" | "Creative";

/** Reason why a mode was auto-detected */
export type DetectionReason =
  | "time_morning_peak"
  | "time_afternoon_creative"
  | "time_midday_rest"
  | "time_evening_executive"
  | "time_late_night_recovery"
  | "time_early_morning_focus"
  | "high_cognitive_load"
  | "low_cognitive_load"
  | "manual";

export interface CognitiveModeDetectionInput {
  /** Current hour in local time (0–23). Defaults to new Date().getHours() */
  hourOfDay?: number;
  /** Current RAM/cognitive load percentage (0–100). Optional. */
  cognitiveLoadPercent?: number;
}

export interface CognitiveModeDetectionResult {
  mode: CognitiveMode;
  reason: DetectionReason;
  confidence: number; // 0–1
}

export interface CognitiveModeConfig {
  id: CognitiveMode;
  icon: string;
  label: string;
  description: string;
  color: string;
  bgClass: string;
  ringClass: string;
}

// ============= Neuro Profile =============
export interface NeuroProfile {
  id: string;
  userId?: string;
  primaryMode: CognitiveMode;
  sensoryPreferences: SensoryPreferences;
  accessibilityFlags: AccessibilityFlags;
  createdAt: string;
  updatedAt: string;
}

export interface SensoryPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  darkMode: boolean;
  quietMode: boolean;
}

export interface AccessibilityFlags {
  screenReader: boolean;
  keyboardNav: boolean;
  voiceControl: boolean;
  captions: boolean;
}

// ============= Learn System Types =============
export interface LearnMode {
  id: string;
  icon: string;
  title: string;
  purpose: string;
  features: string[];
  color: string;
}

export interface CharterPrinciple {
  icon: string;
  title: string;
  description: string;
}

export interface DictionaryEntry {
  term: string;
  definition: string;
  category: string;
}

export interface ViewHelp {
  title: string;
  subtitle: string;
  icon: string;
  warning?: string;
  bullets: string[];
  related?: string[];
}

export interface LearnData {
  meta: {
    product: string;
    engine: string;
    version: string;
  };
  nav: {
    id: string;
    label: string;
    icon: string;
    route: string;
  };
  learnHome: {
    title: string;
    subtitle: string;
    cards: Array<{
      label: string;
      route: string;
      icon: string;
      description: string;
    }>;
  };
  modes: Record<string, LearnMode>;
  charter: {
    title: string;
    subtitle: string;
    intro: string;
    principles: CharterPrinciple[];
  };
  dictionary: Record<string, Record<string, string>>;
  projectHelp: {
    views: Record<string, ViewHelp>;
    glossaryTips: Array<{ term: string; tip: string }>;
  };
  engine: {
    title: string;
    subtitle: string;
    stages: Array<{
      id: string;
      title: string;
      icon: string;
      description: string;
    }>;
  };
  nightWorkers: {
    title: string;
    subtitle: string;
    sections: Array<{
      title: string;
      content?: string;
      bullets?: string[];
    }>;
  };
  accessibility: {
    title: string;
    subtitle: string;
    sections: Array<{
      title: string;
      content?: string;
      tools?: Array<{
        name: string;
        description: string;
      }>;
    }>;
  };
}

// ============= Floating Button Types =============
export interface Position {
  x: number;
  y: number;
}

export interface DraggableButtonConfig {
  storageKey: string;
  defaultPosition?: Position;
  constraintsMargin?: string;
}
