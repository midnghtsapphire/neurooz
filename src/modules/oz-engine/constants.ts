/**
 * Oz Engine™ Constants
 * Standalone module - can be reused across applications
 */

import type { CognitiveMode, CognitiveModeConfig } from "./types";

// ============= Cognitive Mode Configuration =============
export const COGNITIVE_MODES: Record<CognitiveMode, CognitiveModeConfig> = {
  flow: {
    id: "flow",
    icon: "🧠",
    label: "Flow",
    description: "Brain-safe vertical focus",
    color: "emerald",
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    ringClass: "ring-emerald-500",
  },
  power: {
    id: "power",
    icon: "⚡",
    label: "Power",
    description: "High-capacity Kanban planning",
    color: "amber",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    ringClass: "ring-amber-500",
  },
  recovery: {
    id: "recovery",
    icon: "💚",
    label: "Recovery",
    description: "Ultra-simple, one thing only",
    color: "rose",
    bgClass: "bg-rose-100 dark:bg-rose-900/30",
    ringClass: "ring-rose-500",
  },
};

// ============= Storage Keys =============
export const STORAGE_KEYS = {
  cognitiveMode: "oz-cognitive-mode",
  powerModeConsent: "oz-power-mode-consent",
  introSeen: "oz-intro-seen",
  neuroProfile: "oz-neuro-profile",
  accessibility: "oz-accessibility-settings",
} as const;

// ============= Default Values =============
export const DEFAULT_COGNITIVE_MODE: CognitiveMode = "flow";

export const DEFAULT_SENSORY_PREFERENCES = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  darkMode: false,
  quietMode: false,
};

export const DEFAULT_ACCESSIBILITY_FLAGS = {
  screenReader: false,
  keyboardNav: false,
  voiceControl: false,
  captions: false,
};
