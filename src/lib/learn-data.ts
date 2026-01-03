/**
 * The Oz Engine™ Field Guide - Master Learn Data
 * Single source of truth for all educational content
 */

export const learnData = {
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
    intro: "Emerald Road OS is built to protect people who are often harmed by traditional software: neurodivergent users, people with disabilities, trauma survivors, chronically ill users, caregivers, night workers, and anyone experiencing cognitive overload or fatigue.",
    principles: [
      {
        icon: "🧠",
        title: "Consent Comes First",
        description: "We never adapt your interface, collect behavioral signals, or change your experience without your permission. You are always in control of your mode, your data, and your boundaries.",
      },
      {
        icon: "🌿",
        title: "We Reduce Harm — Not Increase Pressure",
        description: "We do not use addictive dopamine loops, flashing urgency alerts, shame-based messaging, or overload-driven engagement tricks. Your well-being matters more than screen time.",
      },
      {
        icon: "🌙",
        title: "We Protect Fatigue, Trauma, and Sensory Sensitivity",
        description: "We provide quiet, low-motion, low-light, predictable interfaces for users with migraines, PTSD, autism, ADHD, chronic illness, and cognitive fatigue.",
      },
      {
        icon: "🛡",
        title: "We Never Diagnose or Label You",
        description: "The Oz Engine™ adapts to how your brain feels — not who you are. No medical labeling. No judgment. No assumptions.",
      },
      {
        icon: "🔐",
        title: "Your Data Is Minimal, Private, and Protected",
        description: "We only collect what is necessary to make your experience safer and easier. Your information is encrypted, never sold, and never shared without your consent.",
      },
      {
        icon: "🌱",
        title: "Recovery Is a Feature",
        description: "Rest days, low-energy days, flare days, and shutdown days are expected — not punished. We design for rest as much as productivity.",
      },
      {
        icon: "🤍",
        title: "You Are Welcome Here",
        description: "Your brain is not broken. Your needs are valid. You belong here exactly as you are.",
      },
    ],
  },

  dictionary: {
    Core: {
      Agile: "A way of building projects in small, flexible steps instead of one giant plan.",
      API: "A connector that lets different apps talk to each other.",
      Backlog: "A waiting list of tasks you haven't started yet.",
      Bandwidth: "How much mental or time capacity you have right now.",
      Blocker: "Something stopping you from moving forward.",
      Burndown: "A chart showing work left vs time remaining.",
      Deliverable: "Something you promised to finish and hand over.",
      Epic: "A big goal broken into smaller tasks.",
      Iterate: "To improve something by making small changes over time.",
      Kanban: "A visual board with columns showing task progress.",
      KPI: "Key Performance Indicator — a number that shows if something is working.",
      MVP: "Minimum Viable Product — the smallest version that works.",
      OKR: "Objectives and Key Results — a goal-setting framework.",
      Pivot: "Changing direction when something isn't working.",
      Roadmap: "A visual plan of what you'll build and when.",
      SaaS: "Software as a Service — online software you pay for monthly.",
      Scrum: "A way of working in short sprints with daily check-ins.",
      Sprint: "A short burst of focused work, usually 1-2 weeks.",
      Stakeholder: "Anyone affected by or invested in your project.",
      Standup: "A quick daily meeting to share progress and blockers.",
      Story: "A task described from the user's perspective.",
      Swimlane: "A horizontal row in a Kanban board grouping related tasks.",
      UI: "User Interface — what you see and click.",
      UX: "User Experience — how it feels to use something.",
      Velocity: "How fast a team completes work.",
      WIP: "Work In Progress — tasks you've started but not finished.",
    },
    Marketing: {
      A_B_Test: "Testing two versions to see which works better.",
      Bounce_Rate: "Percentage of visitors who leave immediately.",
      CAC: "Customer Acquisition Cost — what you pay to get one customer.",
      Churn: "When customers stop paying or using your product.",
      Conversion: "When someone does what you want (buys, signs up, etc).",
      CTA: "Call To Action — a button or link asking someone to do something.",
      Drip_Campaign: "Automated emails sent over time.",
      Engagement: "How much people interact with your content.",
      Funnel: "The journey from visitor to customer.",
      Impression: "One view of your content.",
      Landing_Page: "A focused page designed to get one action.",
      Lead: "Someone who might become a customer.",
      LTV: "Lifetime Value — total money a customer brings over time.",
      Nurture: "Building relationships with potential customers over time.",
      Organic: "Traffic or growth that happens without paid ads.",
      Paid_Media: "Advertising you pay for.",
      Retargeting: "Showing ads to people who already visited your site.",
      ROI: "Return On Investment — what you get back vs what you spent.",
      SEO: "Search Engine Optimization — getting found on Google.",
      Viral: "Content that spreads rapidly through sharing.",
    },
    AI: {
      Agent: "AI that can take actions, not just answer questions.",
      Embedding: "Converting text into numbers AI can understand.",
      Fine_tuning: "Training AI on your specific data.",
      Hallucination: "When AI makes up false information confidently.",
      LLM: "Large Language Model — AI trained on massive text data.",
      Model: "The trained AI system that generates responses.",
      Prompt: "What you type to ask AI something.",
      RAG: "Retrieval-Augmented Generation — AI that looks things up first.",
      Temperature: "How creative vs predictable AI responses are.",
      Token: "A chunk of text AI processes (roughly 4 characters).",
      Vector_Database: "Storage optimized for AI similarity searches.",
    },
    Accessibility: {
      Alt_Text: "Text description of an image for screen readers.",
      ARIA: "Labels that help screen readers understand web pages.",
      Assistive_Tech: "Tools like screen readers that help disabled users.",
      Captions: "Text showing what's being said in video/audio.",
      Color_Contrast: "How readable text is against its background.",
      Focus_Indicator: "The outline showing which element is selected.",
      Keyboard_Nav: "Using a website without a mouse.",
      Reduced_Motion: "Setting to minimize animations.",
      Screen_Reader: "Software that reads screen content aloud.",
      Skip_Link: "A hidden link to jump past navigation.",
      WCAG: "Web Content Accessibility Guidelines — the accessibility standard.",
    },
    Business: {
      ARR: "Annual Recurring Revenue — yearly subscription income.",
      Burn_Rate: "How fast you're spending money.",
      Cap_Table: "Document showing who owns what percentage of a company.",
      Cash_Flow: "Money coming in vs going out.",
      Equity: "Ownership stake in a company.",
      Exit: "Selling your company or going public.",
      Gross_Margin: "Revenue minus cost of goods sold.",
      IPO: "Initial Public Offering — becoming a public company.",
      MRR: "Monthly Recurring Revenue — monthly subscription income.",
      Net_Revenue: "Revenue after refunds and discounts.",
      P_L: "Profit and Loss statement.",
      Runway: "How long your money will last at current spending.",
      Seed_Round: "First major investment in a startup.",
      Series_A: "Second major investment round after seed.",
      Term_Sheet: "Document outlining investment terms.",
      Valuation: "What your company is worth.",
      Vesting: "Earning ownership over time.",
    },
    Creator: {
      Algorithm: "The invisible system deciding what people see.",
      Analytics: "Data about how your content performs.",
      Audience: "The people who follow and engage with you.",
      Brand_Deal: "Getting paid to promote a product.",
      Content_Calendar: "A schedule for what you'll post and when.",
      CPM: "Cost Per Mille — money per 1000 views.",
      Creator_Fund: "Platform payments to creators based on views.",
      Engagement_Rate: "Interactions divided by followers.",
      Evergreen: "Content that stays relevant over time.",
      Influencer: "Someone with audience influence.",
      Monetize: "Make money from your content or audience.",
      Niche: "Your specific topic or audience focus.",
      Platform: "Where you post content (YouTube, TikTok, etc).",
      Reach: "How many unique people see your content.",
      Sponsorship: "Brand paying you for promotion.",
      UGC: "User-Generated Content — content made by customers.",
    },
    Security: {
      Two_FA: "Two-Factor Authentication — extra login protection.",
      Breach: "When hackers access private data.",
      Encryption: "Scrambling data so only authorized people can read it.",
      Firewall: "System blocking unauthorized network access.",
      Malware: "Malicious software designed to harm.",
      Passkey: "Passwordless login using biometrics or device.",
      Phishing: "Fake messages trying to steal your info.",
      SSL_TLS: "Encryption for data traveling over the internet.",
      VPN: "Virtual Private Network — secure tunnel for internet traffic.",
      Zero_Trust: "Security model assuming nothing is automatically trusted.",
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
          "The setback matrix helps identify blocks.",
        ],
        related: ["modes.FlowForge", "modes.SoftReset", "dictionary.Kanban"],
      },
      power: {
        title: "Power Mode on Projects",
        subtitle: "High-capacity planning",
        icon: "⚡",
        warning: "Power Mode shows more information at once. If you feel foggy, switch back to Flow Mode.",
        bullets: [
          "Use Kanban for visual task management.",
          "Keep WIP limits to reduce overload.",
          "Access Road, Kanban, and List views.",
          "Project Items visible for full context.",
        ],
        related: ["modes.FocusFlow", "modes.NightWeave", "dictionary.Scrum"],
      },
      recovery: {
        title: "Recovery Mode on Projects",
        subtitle: "Only the next safe step",
        icon: "💚",
        bullets: [
          "Only your most critical task is visible.",
          "No backlog pressure.",
          "No metrics or scores.",
          "Rest is productive.",
        ],
        related: ["modes.SoftReset", "modes.LowEnergy"],
      },
      kanban: {
        title: "Kanban Board",
        subtitle: "Visual task columns",
        icon: "📋",
        warning: "Many cards visible at once. Use WIP limits or switch to Flow Mode if overwhelmed.",
        bullets: [
          "Drag tasks between columns.",
          "Todo → In Progress → Done flow.",
          "Color-coded by priority.",
          "Best for visual processors.",
        ],
        related: ["dictionary.Kanban", "dictionary.WIP", "dictionary.Swimlane"],
      },
      road: {
        title: "Yellow Brick Road",
        subtitle: "One step at a time",
        icon: "🛤️",
        bullets: [
          "Tasks displayed as a journey.",
          "Completion unlocks the next step.",
          "Gentler than traditional lists.",
          "Built for ADHD and fatigue.",
        ],
        related: ["modes.FlowForge", "modes.ClearPath"],
      },
      list: {
        title: "Simple List View",
        subtitle: "Traditional task list",
        icon: "📝",
        bullets: [
          "Compact, scannable format.",
          "Shows all tasks at once.",
          "Good for quick reviews.",
          "Switch to Road if overwhelmed.",
        ],
        related: ["modes.SoftReset", "dictionary.Backlog"],
      },
    },
    glossaryTips: [
      { term: "MVP", tip: "Start small — you can always add more later." },
      { term: "Backlog", tip: "It's okay to have a long backlog. It's not a failure list." },
      { term: "Sprint", tip: "Short bursts work better than marathon sessions." },
      { term: "Blocker", tip: "Name it. Then you can solve it." },
    ],
  },

  engine: {
    title: "How The Oz Engine™ Works",
    subtitle: "The invisible system protecting your brain",
    stages: [
      {
        id: "sense",
        title: "Sense",
        icon: "👁",
        description: "We observe signals — time of day, interaction patterns, environmental cues — without judgment.",
      },
      {
        id: "ask",
        title: "Ask",
        icon: "💬",
        description: "Before adapting, we ask permission. Your consent comes before our assumptions.",
      },
      {
        id: "morph",
        title: "Morph",
        icon: "🔄",
        description: "The interface transforms to match your current cognitive state — not a diagnosis, just what helps right now.",
      },
      {
        id: "protect",
        title: "Protect",
        icon: "🛡",
        description: "We filter overwhelm, reduce noise, and prevent harmful patterns from reaching you.",
      },
      {
        id: "remember",
        title: "Remember",
        icon: "🧠",
        description: "Your preferences persist. The system learns what works for you — locally, privately, always under your control.",
      },
    ],
  },

  nightWorkers: {
    title: "Night Workers & Creators",
    subtitle: "For vampires, insomniacs, and night owls",
    sections: [
      {
        title: "Why NightWeave Mode Exists",
        content: "Not everyone works 9-to-5. Shift workers, creators, parents of young children, and chronically ill users often work when the world sleeps. Traditional apps punish this with jarring brightness and daytime-centric scheduling.",
      },
      {
        title: "NightWeave Features",
        bullets: [
          "True black UI — OLED-friendly, migraine-safe",
          "Ember accents instead of harsh blues",
          "Nap-aware scheduling that respects split sleep",
          "No motion or flash",
          "Circadian-neutral notifications",
        ],
      },
      {
        title: "For Creators",
        content: "Creative work doesn't follow business hours. FlowForge mode creates a focus tunnel for deep work, with moon-cycle sprints and quiet rewards that don't break flow.",
      },
    ],
  },

  accessibilitySupport: {
    title: "Accessibility & Support",
    subtitle: "Tools and accommodations",
    sections: [
      {
        title: "Built-In Accommodations",
        bullets: [
          "Screen reader compatible (ARIA labels throughout)",
          "Keyboard navigation on all features",
          "Reduced motion mode",
          "High contrast options",
          "Large text and font scaling",
          "Color blind-friendly palettes",
        ],
      },
      {
        title: "Cognitive Accommodations",
        bullets: [
          "Plain language throughout",
          "Predictable layouts",
          "Undo without penalty",
          "Breadcrumb navigation",
          "Session memory and auto-resume",
        ],
      },
      {
        title: "Getting Help",
        content: "If you need additional accommodations not listed here, contact us. We actively work to improve access for everyone.",
      },
    ],
  },
} as const;

// Type exports
export type LearnData = typeof learnData;
export type CognitiveMode = keyof typeof learnData.modes;
export type DictionaryCategory = keyof typeof learnData.dictionary;

// Helper functions
export function searchDictionary(query: string): Array<{ category: string; term: string; definition: string }> {
  const results: Array<{ category: string; term: string; definition: string }> = [];
  const lowerQuery = query.toLowerCase();

  Object.entries(learnData.dictionary).forEach(([category, terms]) => {
    Object.entries(terms).forEach(([term, definition]) => {
      const displayTerm = term.replace(/_/g, " ");
      if (
        displayTerm.toLowerCase().includes(lowerQuery) ||
        definition.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ category, term: displayTerm, definition });
      }
    });
  });

  return results;
}

export function getTermDefinition(term: string): string | null {
  const normalizedTerm = term.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  
  for (const category of Object.values(learnData.dictionary)) {
    for (const [key, definition] of Object.entries(category)) {
      if (key.toLowerCase() === normalizedTerm.toLowerCase()) {
        return definition;
      }
    }
  }
  return null;
}

export function getViewHelp(viewKey: string) {
  return learnData.projectHelp.views[viewKey as keyof typeof learnData.projectHelp.views] || null;
}

export function getModeInfo(modeKey: string) {
  return learnData.modes[modeKey as keyof typeof learnData.modes] || null;
}
