// Emerald Road OS Type Definitions

export type TravelerState = 'overloaded' | 'foggy' | 'exhausted' | 'numb' | 'ready';
export type Pace = 'gentle' | 'standard';
export type MetricType = 'energy' | 'signal' | 'control';

export interface TravelerProfile {
  id: string;
  name: string;
  timezone: string;
  currentState: TravelerState;
  pace: Pace;
  energy: number;
  signal: number;
  control: number;
  territoryUnlocked: {
    crossing: boolean;
    engineFields: boolean;
    ledgerDistrict: boolean;
    hearthlands: boolean;
    signalTowers: boolean;
  };
  completedQuestIds: string[];
  completedSteps: Record<string, string[]>; // questId -> completed step ids
  lastActiveISO: string;
  createdAt: string;
}

export interface QuestStep {
  id: string;
  label: string;
  instruction: string;
}

export interface QuestReward {
  metric: MetricType;
  amount: number;
}

export interface QuestUnlock {
  territory?: string;
  tool?: string;
}

export interface Quest {
  id: string;
  territory: string;
  nodeName: string;
  title: string;
  description: string;
  stabilizeStep: QuestStep;
  buildStep: QuestStep;
  expandStep: QuestStep;
  reward: QuestReward;
  unlocks?: QuestUnlock;
}

export interface Territory {
  id: string;
  name: string;
  theme: string;
  description: string;
  unlockKey: keyof TravelerProfile['territoryUnlocked'];
  quests: Quest[];
  comingSoon?: boolean;
}

export interface MentorQuote {
  mentor: 'Navigator' | 'Strategist' | 'Architect' | 'Guardian';
  domain: string;
  quote: string;
}

export const TRAVELER_STATES: { value: TravelerState; label: string; description: string }[] = [
  { value: 'overloaded', label: 'Overloaded', description: 'Too much input, too many demands' },
  { value: 'foggy', label: 'Foggy', description: 'Hard to think clearly, feels hazy' },
  { value: 'exhausted', label: 'Exhausted', description: 'Deeply tired, low reserves' },
  { value: 'numb', label: 'Numb', description: 'Disconnected, shut down' },
  { value: 'ready', label: 'Ready', description: 'Present and able to move forward' },
];
