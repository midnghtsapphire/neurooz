import { useMemo } from "react";
import { useCognitiveLoad } from "./use-cognitive-load";

export interface WizardMessage {
  text: string;
  tone: 'neutral' | 'encouraging' | 'calming' | 'warning' | 'celebrating';
  category: 'greeting' | 'status' | 'intervention' | 'completion' | 'onboarding' | 'drift' | 'overload';
}

// Wizard personality: Calm, dry-witty, observant, protective, trauma-safe
// Speaks like an old world engineer-mage who has seen many storms

// Trauma-safe dialogue - never shaming, always using physics-based metaphors
const WIZARD_GREETINGS = {
  stable: [
    { text: "Your orbit is steady. The city hums with quiet power.", tone: 'neutral' as const },
    { text: "Gravity is holding. A good day for small victories.", tone: 'encouraging' as const },
    { text: "The engines are stable. What weight shall we move today?", tone: 'neutral' as const },
    { text: "Your core is centered. Even small steps add mass to momentum.", tone: 'encouraging' as const },
  ],
  elevated: [
    { text: "Your orbit is widening slightly. Nothing to fear—just physics.", tone: 'calming' as const },
    { text: "I sense growing weight. Let us redistribute before it compounds.", tone: 'neutral' as const },
    { text: "The load increases. Choose one thing to lighten.", tone: 'encouraging' as const },
    { text: "Pressure is rising in the system. This is data, not judgment.", tone: 'calming' as const },
  ],
  critical: [
    { text: "Gravity is weakening. We must stabilize your core.", tone: 'warning' as const },
    { text: "Too many open loops are draining power. Time to close some.", tone: 'warning' as const },
    { text: "The city lights flicker. You are not failing—you are overloaded.", tone: 'calming' as const },
    { text: "Your RAM is strained. This is not weakness. This is physics.", tone: 'calming' as const },
  ],
  overload: [
    { text: "System pause. You cannot pour from an empty vessel.", tone: 'calming' as const },
    { text: "All engines holding. No new weight until we redistribute.", tone: 'warning' as const },
    { text: "The grid is at capacity. Rest is not failure—it is maintenance.", tone: 'calming' as const },
    { text: "Your mind has reached its edge. We wait here together.", tone: 'calming' as const },
  ],
};

const COMPLETION_MESSAGES = [
  { text: "Mass shifted. Gravity restored. Well done.", tone: 'celebrating' as const },
  { text: "A loop closes. The city grows brighter.", tone: 'celebrating' as const },
  { text: "You moved weight today. That is not small.", tone: 'encouraging' as const },
  { text: "Another thread resolved. Your orbit stabilizes.", tone: 'celebrating' as const },
  { text: "The Wizard nods. Not because it was easy—because you did it anyway.", tone: 'celebrating' as const },
];

// 7-day bonding loop messages
const ONBOARDING_MESSAGES = {
  day1: {
    text: "Welcome, traveler. The storm brought you here. Now let us sort the wreckage and build something real.",
    tone: 'neutral' as const,
  },
  day2: {
    text: "I have watched your patterns. You drift at certain hours. You spark with certain triggers. This is not flaw—it is data.",
    tone: 'neutral' as const,
  },
  day3: {
    text: "Today you may feel the Void pull. When you drift beyond orbit, I will find you. No shame. Only re-centering.",
    tone: 'calming' as const,
  },
  day4: {
    text: "You carry a rare engine—one that burns bright but dangerous. Today I teach you to use it without torching your world.",
    tone: 'encouraging' as const,
  },
  day5: {
    text: "You are not alone inside yourself. The Tin Man processes your feelings. The Lion guards your courage. Toto watches the gates.",
    tone: 'encouraging' as const,
  },
  day6: {
    text: "Your city grows. Each closed loop adds a brick. Each completed quest lights a window. This is yours.",
    tone: 'celebrating' as const,
  },
  day7: {
    text: "This city is yours. It grows because you exist. Not because you are perfect—because you persist.",
    tone: 'celebrating' as const,
  },
  // Legacy keys for backwards compatibility
  tornado: {
    text: "Something brilliant just landed in my world. Let's sort your storm.",
    tone: 'encouraging' as const,
  },
  sorting: {
    text: "Your storm has shape. Let me show you what weighs the most.",
    tone: 'neutral' as const,
  },
  firstCity: {
    text: "Welcome to your Emerald City. These buildings are yours.",
    tone: 'encouraging' as const,
  },
  firstQuest: {
    text: "Every journey starts with one step. Here's your first quest.",
    tone: 'encouraging' as const,
  },
  encouragement: {
    text: "You are not broken. Your OS just needed a reboot.",
    tone: 'calming' as const,
  },
};

const INTERVENTION_REDIRECTS = {
  drift: {
    text: "You are outside planetary orbit. What were you building before you left?",
    tone: 'calming' as const,
  },
  impulse: {
    text: "Toto intercepts this impulse. Is it a real quest or a dopamine trap?",
    tone: 'neutral' as const,
  },
  anger: {
    text: "I sense fire in your engine. Shall we channel it into Battle Focus, or cool it first?",
    tone: 'neutral' as const,
  },
  fear: {
    text: "The Lion stirs. This path holds fear. Shall we face it, delay it, or dissolve it?",
    tone: 'calming' as const,
  },
  overwhelm: {
    text: "Too much weight on the grid. We pause. We breathe. We choose only one thing.",
    tone: 'calming' as const,
  },
  avoidance: {
    text: "You are circling something. The Scarecrow notices patterns. Shall we name the thing you're avoiding?",
    tone: 'neutral' as const,
  },
  newProject: {
    text: "A new quest beckons. But first, let Toto sniff it out. Is this a real path or a shiny distraction?",
    tone: 'neutral' as const,
  },
  overload: {
    text: "Your RAM overflows. We must let something go before adding more weight.",
    tone: 'warning' as const,
  },
  delay: {
    text: "This thought is captured. The Cosmic Library holds your idea. It won't be lost.",
    tone: 'calming' as const,
  },
};

// Trauma-safe substitutions for reference
export const TRAUMA_SAFE_PHRASES: Record<string, string> = {
  "You failed": "Gravity weakened.",
  "You're behind": "Your orbit widened.",
  "Focus": "Stabilize your core.",
  "Stop that": "That path has no oxygen.",
  "Try harder": "Shift mass toward what matters.",
  "You're distracted": "You've drifted from orbit.",
  "You're lazy": "Your engine is conserving power.",
  "You should have": "Next time, consider...",
  "Why didn't you": "What shifted the weight?",
  "You need to": "One option is to...",
};

export function useWizardDialogue() {
  const load = useCognitiveLoad();
  
  return useMemo(() => {
    const getGreeting = (): WizardMessage => {
      const messages = WIZARD_GREETINGS[load.status];
      const selected = messages[Math.floor(Math.random() * messages.length)];
      return {
        text: selected.text,
        tone: selected.tone,
        category: 'greeting',
      };
    };
    
    const getCompletionMessage = (): WizardMessage => {
      const selected = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
      return {
        text: selected.text,
        tone: selected.tone,
        category: 'completion',
      };
    };
    
    const getOnboardingMessage = (stage: keyof typeof ONBOARDING_MESSAGES): WizardMessage => {
      const message = ONBOARDING_MESSAGES[stage];
      return {
        text: message.text,
        tone: message.tone,
        category: 'onboarding',
      };
    };
    
    const getInterventionMessage = (type: keyof typeof INTERVENTION_REDIRECTS): WizardMessage => {
      const message = INTERVENTION_REDIRECTS[type];
      return {
        text: message.text,
        tone: message.tone,
        category: 'intervention',
      };
    };
    
    const getStatusMessage = (): WizardMessage => {
      const statusMessages: Record<string, { text: string; tone: WizardMessage['tone'] }> = {
        stable: { text: "Systems nominal. Proceed with intention.", tone: 'neutral' },
        elevated: { text: "Load increasing. Monitor your loops.", tone: 'warning' },
        critical: { text: "Approaching threshold. Consider closing something.", tone: 'warning' },
        overload: { text: "Capacity reached. New quests locked until stabilization.", tone: 'calming' },
      };
      const msg = statusMessages[load.status] || statusMessages.stable;
      return {
        text: msg.text,
        tone: msg.tone,
        category: 'status',
      };
    };
    
    return {
      getGreeting,
      getCompletionMessage,
      getOnboardingMessage,
      getInterventionMessage,
      getStatusMessage,
      load,
    };
  }, [load]);
}
