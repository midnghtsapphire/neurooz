import { useMemo } from "react";

export interface QuestGravity {
  time: number;      // 1-10: Duration weight
  energy: number;    // 1-10: Cognitive load
  emotion: number;   // 1-10: Stress level
  meaning: number;   // 1-10: Personal importance
  reward: number;    // 1-10: Dopamine value
  totalMass: number; // Weighted sum
  visualMass: number; // 0-100 for display
}

export interface Quest {
  id: string;
  title: string;
  estimatedMinutes?: number;
  energyCost?: 'low' | 'medium' | 'high' | 'extreme';
  emotionalWeight?: 'light' | 'moderate' | 'heavy' | 'overwhelming';
  meaningLevel?: 'routine' | 'important' | 'critical' | 'life-changing';
  rewardType?: 'small' | 'medium' | 'large' | 'epic';
  isOverdue?: boolean;
  isPlanetQuest?: boolean;
}

// Weights for gravity calculation
const GRAVITY_WEIGHTS = {
  time: 1.0,
  energy: 1.5,
  emotion: 1.2,
  meaning: 2.0,
  reward: 1.3,
};

// Map string values to numeric scores
function mapEnergyCost(cost?: string): number {
  switch (cost) {
    case 'low': return 2;
    case 'medium': return 5;
    case 'high': return 8;
    case 'extreme': return 10;
    default: return 5;
  }
}

function mapEmotionalWeight(weight?: string): number {
  switch (weight) {
    case 'light': return 2;
    case 'moderate': return 5;
    case 'heavy': return 8;
    case 'overwhelming': return 10;
    default: return 4;
  }
}

function mapMeaningLevel(level?: string): number {
  switch (level) {
    case 'routine': return 3;
    case 'important': return 6;
    case 'critical': return 8;
    case 'life-changing': return 10;
    default: return 5;
  }
}

function mapRewardType(type?: string): number {
  switch (type) {
    case 'small': return 3;
    case 'medium': return 5;
    case 'large': return 8;
    case 'epic': return 10;
    default: return 5;
  }
}

function mapTimeToScore(minutes?: number): number {
  if (!minutes) return 5;
  if (minutes <= 5) return 2;
  if (minutes <= 15) return 4;
  if (minutes <= 30) return 6;
  if (minutes <= 60) return 8;
  return 10;
}

export function calculateQuestGravity(quest: Quest): QuestGravity {
  const time = mapTimeToScore(quest.estimatedMinutes);
  const energy = mapEnergyCost(quest.energyCost);
  const emotion = mapEmotionalWeight(quest.emotionalWeight);
  const meaning = mapMeaningLevel(quest.meaningLevel);
  const reward = mapRewardType(quest.rewardType);
  
  // Calculate weighted total mass
  let totalMass = 
    (time * GRAVITY_WEIGHTS.time) +
    (energy * GRAVITY_WEIGHTS.energy) +
    (emotion * GRAVITY_WEIGHTS.emotion) +
    (meaning * GRAVITY_WEIGHTS.meaning) +
    (reward * GRAVITY_WEIGHTS.reward);
  
  // Boost for overdue quests (they need more gravity to pull user back)
  if (quest.isOverdue) {
    totalMass *= 1.5;
  }
  
  // Major boost for planet quests
  if (quest.isPlanetQuest) {
    totalMass *= 2.0;
  }
  
  // Normalize to 0-100 for visual display
  // Max theoretical mass: 10 * (1 + 1.5 + 1.2 + 2 + 1.3) * 2 = 140
  const visualMass = Math.min(100, (totalMass / 140) * 100);
  
  return {
    time,
    energy,
    emotion,
    meaning,
    reward,
    totalMass,
    visualMass,
  };
}

export function useQuestGravity(quest: Quest): QuestGravity {
  return useMemo(() => calculateQuestGravity(quest), [quest]);
}

export function useQuestsGravity(quests: Quest[]): Map<string, QuestGravity> {
  return useMemo(() => {
    const gravityMap = new Map<string, QuestGravity>();
    for (const quest of quests) {
      gravityMap.set(quest.id, calculateQuestGravity(quest));
    }
    return gravityMap;
  }, [quests]);
}

// Calculate ambient novelty gravity (the pull of distractions)
export function useAmbientNoveltyGravity(
  tabCount: number,
  unprocessedIdeas: number,
  emotionalLoad: number
): number {
  return useMemo(() => {
    // Each tab adds pull
    const tabPull = tabCount * 3;
    // Unprocessed ideas add pull
    const ideaPull = unprocessedIdeas * 5;
    // High emotional load increases novelty seeking
    const emotionalPull = emotionalLoad * 0.3;
    
    return Math.min(100, tabPull + ideaPull + emotionalPull);
  }, [tabCount, unprocessedIdeas, emotionalLoad]);
}

// Check if quest gravity is strong enough to resist drift
export function useGravityCheck(
  questGravity: number,
  noveltyGravity: number
): { isStable: boolean; gravityRatio: number; recommendation: string } {
  return useMemo(() => {
    const gravityRatio = questGravity / Math.max(1, noveltyGravity);
    const isStable = gravityRatio >= 1;
    
    let recommendation = "";
    if (gravityRatio < 0.5) {
      recommendation = "Quest gravity critical. Consider increasing task importance or reducing distractions.";
    } else if (gravityRatio < 1) {
      recommendation = "Quest gravity weakening. Stay focused on your current mission.";
    } else if (gravityRatio < 2) {
      recommendation = "Gravity stable. You're in orbit.";
    } else {
      recommendation = "Strong gravitational lock. Excellent focus!";
    }
    
    return { isStable, gravityRatio, recommendation };
  }, [questGravity, noveltyGravity]);
}
