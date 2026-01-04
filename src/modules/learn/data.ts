/**
 * Learn Module - Data & Utilities
 * Standalone module - can be reused across applications
 */

import type { LearnData, DictionaryEntry, ViewHelp } from "../oz-engine/types";

// ============= Learn Data (Single Source of Truth) =============
export const learnData: LearnData = {
  meta: {
    product: "Emerald Road OS",
    engine: "The Oz Engine™",
    version: "1.0",
  },

  nav: {
    id: "learn",
    label: "Learn",
    icon: "🧠",
    route: "/learn",
  },

  learnHome: {
    title: "The Oz Engine™ Field Guide",
    subtitle: "Understand your brain. Understand your tools.",
    cards: [
      { label: "Cognitive Modes", route: "modes", icon: "🧠", description: "How we adapt to your needs" },
      { label: "How The Oz Engine Works", route: "engine", icon: "⚙️", description: "The system behind the magic" },
      { label: "Tech Dictionary", route: "dictionary", icon: "📖", description: "Plain-English definitions" },
      { label: "Neuro Safety Charter", route: "charter", icon: "🛡", description: "Our promise to protect you" },
      { label: "Night Workers & Creators", route: "night", icon: "🦇", description: "For vampires and creatives" },
      { label: "Accessibility & Support", route: "accessibility", icon: "♿", description: "Tools and accommodations" },
    ],
  },

  modes: {
    FocusFlow: {
      id: "focusflow",
      icon: "⚡",
      title: "FocusFlow (ADHD)",
      purpose: "Protects focus, time blindness, and task paralysis.",
      features: ["One task at a time", "Micro-steps", "Loop breaker", "Time passage HUD"],
      color: "amber",
    },
    SensorySafe: {
      id: "sensorysafe",
      icon: "🧩",
      title: "SensorySafe (Autism)",
      purpose: "Predictable, sensory-safe UI.",
      features: ["No motion", "Stable layout", "Literal language", "Sensory load meter"],
      color: "blue",
    },
    ClearSight: {
      id: "clearsight",
      icon: "👁",
      title: "ClearSight (Vision)",
      purpose: "Low vision and migraine safety.",
      features: ["Large text", "High contrast", "No flash", "Voice navigation"],
      color: "purple",
    },
    QuietSignal: {
      id: "quietsignal",
      icon: "🦻",
      title: "QuietSignal (Hearing)",
      purpose: "Visual-first communication.",
      features: ["Always captions", "Visual alerts", "ASL avatar", "Tap to repeat"],
      color: "teal",
    },
    NightWeave: {
      id: "nightweave",
      icon: "🦇",
      title: "NightWeave (Vampire)",
      purpose: "Nocturnal and migraine-safe workspace.",
      features: ["True black UI", "Ember accents", "No motion", "Nap-aware scheduling"],
      color: "slate",
    },
    SafeHaven: {
      id: "safehaven",
      icon: "🛡",
      title: "SafeHaven (Trauma)",
      purpose: "Reduces panic, freeze, and pressure.",
      features: ["No red alerts", "Grounding tools", "Safe exit"],
      color: "green",
    },
    LowEnergy: {
      id: "lowenergy",
      icon: "🌿",
      title: "LowEnergy (Fatigue)",
      purpose: "For flare days and illness.",
      features: ["Auto simplify", "Voice-first", "Rest reminders"],
      color: "emerald",
    },
    ClearPath: {
      id: "clearpath",
      icon: "🌫",
      title: "ClearPath (Brain Fog)",
      purpose: "Memory-safe navigation.",
      features: ["Breadcrumb memory", "Auto resume", "No penalty undo"],
      color: "cyan",
    },
    SoftReset: {
      id: "softreset",
      icon: "🛌",
      title: "SoftReset (Recovery)",
      purpose: "For shutdown days.",
      features: ["Next safe step only", "No backlog", "No metrics"],
      color: "rose",
    },
    FlowForge: {
      id: "flowforge",
      icon: "🎧",
      title: "FlowForge (Creator)",
      purpose: "Creative focus tunnel.",
      features: ["Flow tunnel", "Moon-cycle sprints", "Quiet rewards"],
      color: "violet",
    },
  },

  charter: {
    title: "Neuro Safety Charter",
    subtitle: "We design for nervous systems — not just screens.",
    intro: "Emerald Road OS is built to protect people who are often harmed by traditional software.",
    principles: [
      {
        icon: "🧠",
        title: "Consent Comes First",
        description: "We never adapt your interface without permission.",
      },
      {
        icon: "🌿",
        title: "We Reduce Harm — Not Increase Pressure",
        description: "No addictive dopamine loops or shame-based messaging.",
      },
      {
        icon: "🌙",
        title: "We Protect Fatigue, Trauma, and Sensory Sensitivity",
        description: "Quiet, low-motion, predictable interfaces.",
      },
      {
        icon: "🛡",
        title: "We Never Diagnose or Label You",
        description: "The Oz Engine adapts to how your brain feels — not who you are.",
      },
      {
        icon: "🔐",
        title: "Your Data Is Minimal, Private, and Protected",
        description: "Encrypted, never sold, never shared without consent.",
      },
      {
        icon: "🌱",
        title: "Recovery Is a Feature",
        description: "Rest days are expected — not punished.",
      },
      {
        icon: "🤍",
        title: "You Are Welcome Here",
        description: "Your brain is not broken. You belong here.",
      },
    ],
  },

  dictionary: {
    Core: {
      Agile: "A way of building projects in small, flexible steps.",
      API: "A connector that lets different apps talk to each other.",
      Backlog: "A waiting list of tasks you haven't started yet.",
      Kanban: "A visual board with columns showing task progress.",
      MVP: "Minimum Viable Product — the smallest version that works.",
      Sprint: "A short burst of focused work, usually 1-2 weeks.",
      UI: "User Interface — what you see and click.",
      UX: "User Experience — how it feels to use something.",
    },
    Marketing: {
      CAC: "Customer Acquisition Cost — what you pay to get one customer.",
      Conversion: "When someone does what you want (buys, signs up, etc).",
      SEO: "Search Engine Optimization — getting found on Google.",
      Funnel: "The journey from visitor to customer.",
    },
    AI: {
      LLM: "Large Language Model — AI trained on massive text data.",
      Prompt: "What you type to ask AI something.",
      RAG: "Retrieval-Augmented Generation — AI that looks things up first.",
    },
    Accessibility: {
      Alt_Text: "Text description of an image for screen readers.",
      Screen_Reader: "Software that reads screen content aloud.",
      WCAG: "Web Content Accessibility Guidelines.",
    },
    Business: {
      MRR: "Monthly Recurring Revenue.",
      Runway: "How long your money will last at current spending.",
    },
    Creator: {
      Algorithm: "The invisible system deciding what people see.",
      Monetize: "Make money from your content or audience.",
    },
    Security: {
      Two_FA: "Two-Factor Authentication — extra login protection.",
      Encryption: "Scrambling data so only authorized people can read it.",
    },
  },

  projectHelp: {
    views: {
      flow: {
        title: "Flow Mode on Projects",
        subtitle: "Vertical focus, gentle pacing",
        icon: "🧠",
        bullets: [
          "Focus on one step at a time.",
          "Use the Yellow Brick Road to avoid overwhelm.",
          "Switch to Recovery Mode on flare days.",
        ],
        related: ["modes.FlowForge", "modes.SoftReset"],
      },
      power: {
        title: "Power Mode on Projects",
        subtitle: "High-capacity planning",
        icon: "⚡",
        warning: "Shows more information at once. Switch to Flow if foggy.",
        bullets: [
          "Use Kanban for visual task management.",
          "Keep WIP limits to reduce overload.",
          "Access all views: Road, Kanban, List.",
        ],
        related: ["modes.FocusFlow", "dictionary.Kanban"],
      },
      recovery: {
        title: "Recovery Mode on Projects",
        subtitle: "Only the next safe step",
        icon: "💚",
        bullets: [
          "Only your most critical task is visible.",
          "No backlog pressure.",
          "Rest is productive.",
        ],
        related: ["modes.SoftReset", "modes.LowEnergy"],
      },
      kanban: {
        title: "Kanban Board",
        subtitle: "Visual task columns",
        icon: "📋",
        warning: "Many cards visible at once.",
        bullets: [
          "Drag tasks between columns.",
          "Todo → In Progress → Done flow.",
        ],
        related: ["dictionary.Kanban"],
      },
      road: {
        title: "Yellow Brick Road",
        subtitle: "One step at a time",
        icon: "🛤️",
        bullets: [
          "Tasks displayed as a journey.",
          "Built for ADHD and fatigue.",
        ],
        related: ["modes.FlowForge"],
      },
      list: {
        title: "Simple List View",
        subtitle: "Traditional task list",
        icon: "📝",
        bullets: [
          "Compact, scannable format.",
          "Switch to Road if overwhelmed.",
        ],
        related: ["modes.SoftReset"],
      },
    },
    glossaryTips: [
      { term: "MVP", tip: "Start small — you can always add more later." },
      { term: "Backlog", tip: "It's okay to have a long backlog." },
      { term: "Sprint", tip: "Short bursts work better than marathons." },
      { term: "Blocker", tip: "Name it. Then you can solve it." },
    ],
  },

  engine: {
    title: "How The Oz Engine™ Works",
    subtitle: "The invisible system protecting your brain",
    stages: [
      { id: "sense", title: "Sense", icon: "👁", description: "Observe signals without judgment." },
      { id: "ask", title: "Ask", icon: "💬", description: "Ask permission before adapting." },
      { id: "morph", title: "Morph", icon: "🔄", description: "Transform to match your state." },
      { id: "protect", title: "Protect", icon: "🛡", description: "Filter overwhelm, reduce noise." },
      { id: "remember", title: "Remember", icon: "🧠", description: "Preferences persist locally." },
    ],
  },

  nightWorkers: {
    title: "Night Workers & Creators",
    subtitle: "For vampires, insomniacs, and night owls",
    sections: [
      {
        title: "Why NightWeave Mode Exists",
        content: "Some people work best after dark. We don't force daytime productivity.",
      },
      {
        title: "Features",
        bullets: ["True black UI", "Ember accents", "Nap-aware scheduling"],
      },
    ],
  },

  accessibility: {
    title: "Accessibility & Support",
    subtitle: "Tools and accommodations for everyone",
    sections: [
      {
        title: "Built-in Tools",
        tools: [
          { name: "Screen Reader Support", description: "Full ARIA labels." },
          { name: "Keyboard Navigation", description: "Use without a mouse." },
          { name: "Reduced Motion", description: "Disable animations." },
        ],
      },
    ],
  },
};

// ============= Utility Functions =============

/**
 * Search dictionary for matching terms
 */
export function searchDictionary(query: string): DictionaryEntry[] {
  const results: DictionaryEntry[] = [];
  const lowerQuery = query.toLowerCase();

  Object.entries(learnData.dictionary).forEach(([category, terms]) => {
    Object.entries(terms).forEach(([term, definition]) => {
      const termLower = term.toLowerCase().replace(/_/g, " ");
      const defLower = definition.toLowerCase();
      
      if (termLower.includes(lowerQuery) || defLower.includes(lowerQuery)) {
        results.push({
          term: term.replace(/_/g, " "),
          definition,
          category,
        });
      }
    });
  });

  return results;
}

/**
 * Get help content for a specific view
 */
export function getViewHelp(
  view: "flow" | "power" | "recovery" | "kanban" | "road" | "list"
): ViewHelp | null {
  return learnData.projectHelp.views[view] || null;
}

/**
 * Get a single dictionary definition
 */
export function getDefinition(term: string): string | null {
  for (const category of Object.values(learnData.dictionary)) {
    const normalizedTerm = term.replace(/ /g, "_");
    if (category[normalizedTerm]) {
      return category[normalizedTerm];
    }
    if (category[term]) {
      return category[term];
    }
  }
  return null;
}

/**
 * Get all modes as array
 */
export function getModesList() {
  return Object.entries(learnData.modes).map(([key, mode]) => ({
    key,
    ...mode,
  }));
}

/**
 * Get charter principles
 */
export function getCharterPrinciples() {
  return learnData.charter.principles;
}
