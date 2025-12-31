import { useMemo } from "react";
import { useCognitiveLoad } from "./use-cognitive-load";

export interface WizardMessage {
  text: string;
  tone: 'encouraging' | 'calming' | 'warning' | 'celebrating';
  category: 'greeting' | 'status' | 'intervention' | 'completion' | 'onboarding';
}

// Trauma-safe wizard phrases - never shaming, always redirecting
const WIZARD_GREETINGS = {
  stable: [
    "The city glows bright today. Ready for your next quest?",
    "Your RAM is stable. The tower sees great potential.",
    "Welcome back, traveler. The road awaits.",
  ],
  elevated: [
    "Clouds are gathering. Let's focus on what matters.",
    "The wind picks up. Stay on the yellow brick road.",
    "Your mind carries weight today. Let me help lighten it.",
  ],
  critical: [
    "Storm warnings in effect. Time to shelter some thoughts.",
    "The tower dims. Let's close some loops together.",
    "I sense turbulence. You're safe here.",
  ],
  overload: [
    "You've drifted far. Let's find our way back together.",
    "The tornado spins. But you are not lost.",
    "Gravity weakened. Let's stabilize.",
  ],
};

const COMPLETION_MESSAGES = [
  "A quest fulfilled! The city shines brighter.",
  "The yellow brick road extends. You've earned this step.",
  "One less open loop. Feel that relief.",
  "Victory! Your RAM thanks you.",
  "A task closes. Space opens. Well done.",
  "The Wizard sees your progress. The city celebrates.",
];

const ONBOARDING_MESSAGES = {
  tornado: "Something brilliant just landed in my world. Let's sort your storm.",
  sorting: "Your storm has shape. Let me show you what weighs the most.",
  firstCity: "Welcome to your Emerald City. These buildings are yours.",
  firstQuest: "Every journey starts with one step. Here's your first quest.",
  encouragement: "You are not broken. Your OS just needed a reboot.",
};

const INTERVENTION_REDIRECTS = {
  newProject: [
    "A new quest beckons. But first, let Toto sniff it out.",
    "Impulse detected. Is this a real path or a shiny distraction?",
    "The road forks. Let's choose wisely together.",
  ],
  overload: [
    "You've wandered far from the road. Let's pause.",
    "Your RAM overflows. Time to let something go.",
    "The storm clouds gather. But you're safe with me.",
  ],
  delay: [
    "This thought is captured. We'll revisit when the time is right.",
    "Saved for later. Focus on what's in front of you now.",
    "The Cosmic Library holds your idea. It won't be lost.",
  ],
};

export function useWizardDialogue() {
  const load = useCognitiveLoad();
  
  return useMemo(() => {
    const getGreeting = (): WizardMessage => {
      const messages = WIZARD_GREETINGS[load.status];
      const text = messages[Math.floor(Math.random() * messages.length)];
      return {
        text,
        tone: load.status === 'stable' ? 'encouraging' : 
              load.status === 'elevated' ? 'calming' : 'warning',
        category: 'greeting',
      };
    };
    
    const getCompletionMessage = (): WizardMessage => ({
      text: COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)],
      tone: 'celebrating',
      category: 'completion',
    });
    
    const getOnboardingMessage = (stage: keyof typeof ONBOARDING_MESSAGES): WizardMessage => ({
      text: ONBOARDING_MESSAGES[stage],
      tone: 'encouraging',
      category: 'onboarding',
    });
    
    const getInterventionMessage = (type: keyof typeof INTERVENTION_REDIRECTS): WizardMessage => {
      const messages = INTERVENTION_REDIRECTS[type];
      return {
        text: messages[Math.floor(Math.random() * messages.length)],
        tone: type === 'delay' ? 'calming' : 'warning',
        category: 'intervention',
      };
    };
    
    const getStatusMessage = (): WizardMessage => ({
      text: load.statusMessage.replace(/[⚠️🌪️☁️✨]/g, '').trim(),
      tone: load.status === 'stable' ? 'encouraging' : 
            load.status === 'elevated' ? 'calming' : 'warning',
      category: 'status',
    });
    
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
