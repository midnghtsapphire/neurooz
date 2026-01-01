import { Territory, Quest, MentorQuote } from '@/types/emerald-road';

// Territory I: The Crossing
const crossingQuests: Quest[] = [
  {
    id: 'c1-restore-signal',
    territory: 'crossing',
    nodeName: 'Grounding Node',
    title: 'Restore Signal',
    description: 'Reconnect your senses to the present moment.',
    stabilizeStep: {
      id: 'c1-stabilize',
      label: 'Stabilize',
      instruction: 'Take 5 slow, deep breaths. In through the nose, out through the mouth.',
    },
    buildStep: {
      id: 'c1-build',
      label: 'Build',
      instruction: 'Drink a full glass of water. Feel it move through you.',
    },
    expandStep: {
      id: 'c1-expand',
      label: 'Expand',
      instruction: 'Step outside or face direct sunlight for 60 seconds.',
    },
    reward: { metric: 'signal', amount: 5 },
  },
  {
    id: 'c2-restore-power',
    territory: 'crossing',
    nodeName: 'Body Power Node',
    title: 'Restore Power',
    description: 'Reactivate your physical foundation.',
    stabilizeStep: {
      id: 'c2-stabilize',
      label: 'Stabilize',
      instruction: 'Sit fully upright. Feet flat on the floor. Shoulders back.',
    },
    buildStep: {
      id: 'c2-build',
      label: 'Build',
      instruction: 'Stretch your arms overhead, then out to the sides. Hold each for 10 seconds.',
    },
    expandStep: {
      id: 'c2-expand',
      label: 'Expand',
      instruction: 'Walk for 3 minutes. Any pace. Just move.',
    },
    reward: { metric: 'energy', amount: 5 },
  },
  {
    id: 'c3-restore-control',
    territory: 'crossing',
    nodeName: 'Order Node',
    title: 'Restore Control',
    description: 'Create one point of order in your environment.',
    stabilizeStep: {
      id: 'c3-stabilize',
      label: 'Stabilize',
      instruction: 'Clear one surface completely. Desk, counter, or table.',
    },
    buildStep: {
      id: 'c3-build',
      label: 'Build',
      instruction: 'Put away 3 items that are out of place.',
    },
    expandStep: {
      id: 'c3-expand',
      label: 'Expand',
      instruction: 'Create one "safe space" — a chair, corner, or spot that feels calm.',
    },
    reward: { metric: 'control', amount: 5 },
    unlocks: { territory: 'engineFields' },
  },
];

// Territory II: Engine Fields
const engineFieldsQuests: Quest[] = [
  {
    id: 'e1-sleep-grid',
    territory: 'engineFields',
    nodeName: 'Sleep Grid',
    title: 'Restore Sleep',
    description: 'Begin rebuilding your sleep infrastructure.',
    stabilizeStep: {
      id: 'e1-stabilize',
      label: 'Stabilize',
      instruction: 'Dim all lights in your space for 10 minutes before bed.',
    },
    buildStep: {
      id: 'e1-build',
      label: 'Build',
      instruction: 'Set an alarm and create a 30-minute wind-down window.',
    },
    expandStep: {
      id: 'e1-expand',
      label: 'Expand',
      instruction: 'Put your phone on a charger away from your bed.',
    },
    reward: { metric: 'energy', amount: 7 },
  },
  {
    id: 'e2-fuel-station',
    territory: 'engineFields',
    nodeName: 'Fuel Station',
    title: 'Restore Fuel',
    description: 'Nourish your body with intention.',
    stabilizeStep: {
      id: 'e2-stabilize',
      label: 'Stabilize',
      instruction: 'Drink a full glass of water right now.',
    },
    buildStep: {
      id: 'e2-build',
      label: 'Build',
      instruction: 'Eat something with protein. Eggs, nuts, cheese, meat.',
    },
    expandStep: {
      id: 'e2-expand',
      label: 'Expand',
      instruction: 'Prep one healthy snack for later today.',
    },
    reward: { metric: 'energy', amount: 7 },
  },
  {
    id: 'e3-breath-loop',
    territory: 'engineFields',
    nodeName: 'Breath Loop',
    title: 'Restore Calm',
    description: 'Regulate your nervous system through breath.',
    stabilizeStep: {
      id: 'e3-stabilize',
      label: 'Stabilize',
      instruction: 'Practice 4-6 breathing for 2 minutes. Inhale 4 seconds, exhale 6 seconds.',
    },
    buildStep: {
      id: 'e3-build',
      label: 'Build',
      instruction: 'Listen to 3 minutes of calm audio or sit in silence.',
    },
    expandStep: {
      id: 'e3-expand',
      label: 'Expand',
      instruction: 'Write down one worry, then "park it" — set it aside for later.',
    },
    reward: { metric: 'signal', amount: 7 },
    unlocks: { territory: 'ledgerDistrict' },
  },
];

export const TERRITORIES: Territory[] = [
  {
    id: 'crossing',
    name: 'The Crossing',
    theme: 'Stabilization & Orientation',
    description: 'Every Traveler enters through The Crossing. This is where nervous systems calm, minds clear, and the road becomes visible.',
    unlockKey: 'crossing',
    quests: crossingQuests,
  },
  {
    id: 'engineFields',
    name: 'Engine Fields',
    theme: 'Power, Rhythm, Recovery',
    description: 'Rebuild your energy infrastructure. Sleep, fuel, and breath are the engines that power everything else.',
    unlockKey: 'engineFields',
    quests: engineFieldsQuests,
  },
  {
    id: 'ledgerDistrict',
    name: 'Ledger District',
    theme: 'Stability, Money, Work, Taxes',
    description: 'Build your financial foundation. Income, taxes, credit, and contracts live here.',
    unlockKey: 'ledgerDistrict',
    quests: [],
    comingSoon: true,
  },
  {
    id: 'hearthlands',
    name: 'Hearthlands',
    theme: 'Home & Order',
    description: 'Create sanctuary. Hygiene, food, tools, and calm spaces.',
    unlockKey: 'hearthlands',
    quests: [],
    comingSoon: true,
  },
  {
    id: 'signalTowers',
    name: 'Signal Towers',
    theme: 'Boundaries & Voice',
    description: 'Speak your truth. Boundaries, scripts, community, and protection.',
    unlockKey: 'signalTowers',
    quests: [],
    comingSoon: true,
  },
];

export const MENTOR_QUOTES: MentorQuote[] = [
  { mentor: 'Navigator', domain: 'Orientation', quote: 'Find your footing first. Then take the next step.' },
  { mentor: 'Strategist', domain: 'ADHD Clarity', quote: 'One node. One action. Then we move.' },
  { mentor: 'Architect', domain: 'Emotional Safety', quote: 'Safety first. Your system comes before your output.' },
  { mentor: 'Guardian', domain: 'Courage & Boundaries', quote: 'Small courage counts. Do the doable thing.' },
  { mentor: 'Navigator', domain: 'Orientation', quote: 'You are not behind. You are rebuilding.' },
  { mentor: 'Strategist', domain: 'ADHD Clarity', quote: 'Clarity comes from action, not from waiting.' },
  { mentor: 'Architect', domain: 'Emotional Safety', quote: 'Build the foundation. The structure follows.' },
  { mentor: 'Guardian', domain: 'Courage & Boundaries', quote: 'Protection is not weakness. It is wisdom.' },
];

export function getTerritory(id: string): Territory | undefined {
  return TERRITORIES.find(t => t.id === id);
}

export function getQuest(id: string): Quest | undefined {
  for (const territory of TERRITORIES) {
    const quest = territory.quests.find(q => q.id === id);
    if (quest) return quest;
  }
  return undefined;
}

export function getTerritoryQuests(territoryId: string): Quest[] {
  const territory = getTerritory(territoryId);
  return territory?.quests || [];
}
