// Dopamine Optimization Engine
// Variable reward scheduling optimized for ADHD brains

export type RewardType = 'micro' | 'milestone' | 'surprise' | 'streak';
export type CharacterType = 'oz' | 'dorothy' | 'scarecrow' | 'tin_man' | 'lion' | 'glinda' | 'toto' | 'tornado' | 'bad_witch';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'emerald';

export interface Reward {
  id?: string;
  rewardType: RewardType;
  rewardName: string;
  rewardDescription: string;
  pointsEarned: number;
  character: CharacterType;
  triggerAction: string;
  isSurprise: boolean;
}

export interface Achievement {
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementTier: AchievementTier;
  pointsValue: number;
  character: CharacterType;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}

export interface GamificationStatus {
  totalPoints: number;
  currentLevel: number;
  levelName: string;
  nextLevelPoints: number;
  actionsSinceLastReward: number;
  surpriseRewardEligible: boolean;
}

// Level progression system
const LEVELS = [
  { level: 1, name: 'Munchkin Traveler', pointsRequired: 0 },
  { level: 2, name: 'Yellow Brick Walker', pointsRequired: 100 },
  { level: 3, name: 'Road Explorer', pointsRequired: 250 },
  { level: 4, name: 'Territory Scout', pointsRequired: 500 },
  { level: 5, name: 'Oz Apprentice', pointsRequired: 1000 },
  { level: 6, name: 'Emerald Seeker', pointsRequired: 2000 },
  { level: 7, name: 'Guardian Trainee', pointsRequired: 3500 },
  { level: 8, name: 'Wisdom Keeper', pointsRequired: 5500 },
  { level: 9, name: 'Heart Champion', pointsRequired: 8000 },
  { level: 10, name: 'Courage Master', pointsRequired: 11000 },
  { level: 11, name: 'Emerald Knight', pointsRequired: 15000 },
  { level: 12, name: 'Oz Advisor', pointsRequired: 20000 },
  { level: 13, name: 'City Guardian', pointsRequired: 26000 },
  { level: 14, name: 'Emerald Sage', pointsRequired: 33000 },
  { level: 15, name: 'Oz Master', pointsRequired: 41000 },
  { level: 16, name: 'Legendary Traveler', pointsRequired: 50000 },
  { level: 17, name: 'Emerald Legend', pointsRequired: 60000 },
  { level: 18, name: 'Oz Wizard', pointsRequired: 72000 },
  { level: 19, name: 'Grand Wizard', pointsRequired: 86000 },
  { level: 20, name: 'Supreme Wizard of Oz', pointsRequired: 100000 },
];

export function calculateLevel(totalPoints: number): { level: number; levelName: string; nextLevelPoints: number } {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVELS[i].pointsRequired) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i]; // Stay at max level
      break;
    }
  }
  
  return {
    level: currentLevel.level,
    levelName: currentLevel.name,
    nextLevelPoints: nextLevel.pointsRequired,
  };
}

// Variable reward scheduling (prevents habituation)
export function shouldTriggerMicroReward(actionCount: number, lastRewardAction: number): boolean {
  const actionsSinceLastReward = actionCount - lastRewardAction;
  // Random interval between 3-7 actions (ADHD-optimized variability)
  const nextRewardThreshold = Math.floor(Math.random() * 5) + 3;
  return actionsSinceLastReward >= nextRewardThreshold;
}

export function shouldTriggerSurpriseReward(actionCount: number, lastSurpriseAction: number): boolean {
  const actionsSinceLastSurprise = actionCount - lastSurpriseAction;
  // 15% probability after at least 5 actions
  if (actionsSinceLastSurprise < 5) return false;
  return Math.random() < 0.15;
}

// Micro reward generator
export function generateMicroReward(action: string): Reward {
  const microRewards = [
    { name: 'Quick Win!', description: 'You\'re making progress!', points: 5, character: 'toto' as CharacterType },
    { name: 'Keep Going!', description: 'Every step counts!', points: 5, character: 'dorothy' as CharacterType },
    { name: 'Smart Move!', description: 'Your brain is working!', points: 10, character: 'scarecrow' as CharacterType },
    { name: 'Heartfelt Action!', description: 'You care about your future!', points: 10, character: 'tin_man' as CharacterType },
    { name: 'Brave Step!', description: 'Courage in action!', points: 10, character: 'lion' as CharacterType },
    { name: 'Wise Choice!', description: 'Glinda approves!', points: 15, character: 'glinda' as CharacterType },
  ];
  
  const reward = microRewards[Math.floor(Math.random() * microRewards.length)];
  
  return {
    rewardType: 'micro',
    rewardName: reward.name,
    rewardDescription: reward.description,
    pointsEarned: reward.points,
    character: reward.character,
    triggerAction: action,
    isSurprise: false,
  };
}

// Surprise reward generator (Oz appears!)
export function generateSurpriseReward(action: string): Reward {
  const surpriseRewards = [
    { name: '✨ Oz Appears! ✨', description: 'The Great Oz himself celebrates your progress!', points: 50 },
    { name: '🌟 Emerald Bonus! 🌟', description: 'A gift from the Emerald City!', points: 75 },
    { name: '🎉 Wizard\'s Gift! 🎉', description: 'Oz rewards your dedication!', points: 100 },
    { name: '💎 Rare Emerald! 💎', description: 'A precious emerald for your efforts!', points: 150 },
  ];
  
  const reward = surpriseRewards[Math.floor(Math.random() * surpriseRewards.length)];
  
  return {
    rewardType: 'surprise',
    rewardName: reward.name,
    rewardDescription: reward.description,
    pointsEarned: reward.points,
    character: 'oz',
    triggerAction: action,
    isSurprise: true,
  };
}

// Milestone reward generator
export function generateMilestoneReward(milestone: string, points: number, character: CharacterType): Reward {
  return {
    rewardType: 'milestone',
    rewardName: `🏆 ${milestone}`,
    rewardDescription: `You've reached an important milestone!`,
    pointsEarned: points,
    character,
    triggerAction: milestone,
    isSurprise: false,
  };
}

// Streak reward generator
export function generateStreakReward(streakType: string, streakCount: number): Reward {
  const streakNames: Record<string, string> = {
    daily_login: 'Login Streak',
    medication: 'Medication Streak',
    impulse_control: 'Impulse Control Streak',
    budget_check: 'Budget Check Streak',
  };
  
  const characters: CharacterType[] = ['lion', 'tin_man', 'scarecrow', 'glinda'];
  const character = characters[Math.floor(Math.random() * characters.length)];
  
  return {
    rewardType: 'streak',
    rewardName: `🔥 ${streakCount} Day ${streakNames[streakType] || 'Streak'}!`,
    rewardDescription: `You're on fire! ${streakCount} days in a row!`,
    pointsEarned: streakCount * 10,
    character,
    triggerAction: `${streakType}_streak_${streakCount}`,
    isSurprise: false,
  };
}

// Get character message for reward
export function getCharacterMessage(character: CharacterType, rewardType: RewardType): string {
  const messages: Record<CharacterType, Record<RewardType, string[]>> = {
    oz: {
      micro: ['The Great Oz sees your progress!', 'Excellent work, traveler!'],
      milestone: ['A magnificent achievement!', 'The Emerald City celebrates you!'],
      surprise: ['Behold! A gift from Oz!', 'The wizard rewards your dedication!'],
      streak: ['Your consistency impresses me!', 'Oz honors your commitment!'],
    },
    dorothy: {
      micro: ['You\'re finding your way!', 'One step closer to home!'],
      milestone: ['We did it together!', 'I\'m so proud of you!'],
      surprise: ['Look what we found!', 'This is amazing!'],
      streak: ['You\'re so reliable!', 'I can count on you!'],
    },
    scarecrow: {
      micro: ['That was smart!', 'Your brain is working!'],
      milestone: ['Brilliant thinking!', 'You\'ve learned so much!'],
      surprise: ['I didn\'t see that coming!', 'How clever!'],
      streak: ['Consistent wisdom!', 'Your mind is sharp!'],
    },
    tin_man: {
      micro: ['You have heart!', 'That was caring!'],
      milestone: ['Your heart is full!', 'So much compassion!'],
      surprise: ['My heart is glowing!', 'This warms my heart!'],
      streak: ['Your heart never quits!', 'Such dedication!'],
    },
    lion: {
      micro: ['Brave move!', 'That took courage!'],
      milestone: ['You\'re fearless!', 'True bravery!'],
      surprise: ['Roar! Amazing!', 'You\'re a hero!'],
      streak: ['Unstoppable courage!', 'You never give up!'],
    },
    glinda: {
      micro: ['Good choice, dear!', 'Wise decision!'],
      milestone: ['You\'ve grown so much!', 'I\'m proud of you!'],
      surprise: ['A magical gift!', 'You deserve this!'],
      streak: ['Your light shines bright!', 'Consistently wonderful!'],
    },
    toto: {
      micro: ['Woof! Good job!', 'Bark bark! Progress!'],
      milestone: ['Woof woof! Amazing!', 'Bark! You did it!'],
      surprise: ['*excited barking*', 'Woof! Surprise!'],
      streak: ['*happy tail wagging*', 'Bark bark! Keep going!'],
    },
    tornado: {
      micro: ['Whirlwind of progress!', 'Spinning forward!'],
      milestone: ['Storm of success!', 'Powerful achievement!'],
      surprise: ['Caught in a good way!', 'Swept up in victory!'],
      streak: ['Unstoppable force!', 'Momentum building!'],
    },
    bad_witch: {
      micro: ['Fine... you did okay.', 'Not bad, I suppose.'],
      milestone: ['Hmph. Impressive.', 'Even I must admit...'],
      surprise: ['What?! How did you...', 'This is... acceptable.'],
      streak: ['Your persistence annoys me!', 'Stop being so good!'],
    },
  };
  
  const characterMessages = messages[character][rewardType];
  return characterMessages[Math.floor(Math.random() * characterMessages.length)];
}

// Get emoji for reward tier
export function getTierEmoji(tier: AchievementTier): string {
  const emojis: Record<AchievementTier, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    emerald: '💎',
  };
  return emojis[tier];
}

// Get streak emoji
export function getStreakEmoji(streakCount: number): string {
  if (streakCount >= 30) return '🔥🔥🔥';
  if (streakCount >= 7) return '🔥🔥';
  return '🔥';
}
