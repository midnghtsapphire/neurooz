/**
 * Oz Engine™ Core Types
 * Standalone module - can be reused across applications
 */

// ============= Cognitive Modes =============
export type CognitiveMode = "flow" | "power" | "recovery";

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
