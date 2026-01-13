import { Task } from "@/types/brainDump.types";

// Points calculation based on task attributes
export function calculateTaskPoints(task: Task): number {
  let points = 0;

  // Base points by size
  const sizePoints = {
    small: 10,
    medium: 25,
    big: 50,
  };
  points += sizePoints[task.size || 'small'];

  // Priority multiplier
  if (task.priority) {
    const priorityMultiplier = {
      1: 2.0,  // Highest priority = 2x points
      2: 1.5,
      3: 1.2,
      4: 1.0,
      5: 0.8,  // Lowest priority = 0.8x points
    };
    points *= priorityMultiplier[task.priority as keyof typeof priorityMultiplier] || 1.0;
  }

  // Bonus for completing on time
  if (task.due_date && task.completion_date) {
    const dueDate = new Date(task.due_date);
    const completionDate = new Date(task.completion_date);
    if (completionDate <= dueDate) {
      points += 15; // On-time bonus
    }
  }

  // Bonus for completing early (within 24 hours of creation)
  if (task.completion_date) {
    const createdAt = new Date(task.created_at);
    const completedAt = new Date(task.completion_date);
    const hoursDiff = (completedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursDiff <= 24) {
      points += 10; // Quick completion bonus
    }
  }

  return Math.round(points);
}

// Calculate level from total points (square root formula for fair progression)
export function calculateLevel(totalPoints: number): number {
  return Math.floor(Math.sqrt(totalPoints / 100)) + 1;
}

// Calculate points needed for next level
export function pointsForNextLevel(currentLevel: number): number {
  return (currentLevel * currentLevel) * 100;
}

// Calculate points progress towards next level
export function levelProgress(totalPoints: number): {
  currentLevel: number;
  pointsInCurrentLevel: number;
  pointsNeededForNext: number;
  progressPercentage: number;
} {
  const currentLevel = calculateLevel(totalPoints);
  const pointsForCurrent = pointsForNextLevel(currentLevel - 1);
  const pointsForNext = pointsForNextLevel(currentLevel);
  const pointsInCurrentLevel = totalPoints - pointsForCurrent;
  const pointsNeededForNext = pointsForNext - pointsForCurrent;
  const progressPercentage = (pointsInCurrentLevel / pointsNeededForNext) * 100;

  return {
    currentLevel,
    pointsInCurrentLevel,
    pointsNeededForNext,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
  };
}

// Check if user should maintain streak (36-hour grace period for ADHD)
export function shouldMaintainStreak(lastActivityDate: string): boolean {
  const last = new Date(lastActivityDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 36; // 36-hour grace period
}

// Achievement definitions
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalPoints: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  shortListTasksCompleted: number;
  bigTasksCompleted: number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_steps',
    name: 'First Steps on the Yellow Brick Road',
    description: 'Complete your first task',
    icon: '👣',
    condition: (stats) => stats.tasksCompleted >= 1,
  },
  {
    id: 'dorothy_dedication',
    name: "Dorothy's Dedication",
    description: 'Complete 10 tasks',
    icon: '👧',
    condition: (stats) => stats.tasksCompleted >= 10,
  },
  {
    id: 'scarecrow_smarts',
    name: "Scarecrow's Smarts",
    description: 'Complete 5 big tasks',
    icon: '🧠',
    condition: (stats) => stats.bigTasksCompleted >= 5,
  },
  {
    id: 'tin_man_heart',
    name: "Tin Man's Heart",
    description: 'Maintain a 7-day streak',
    icon: '❤️',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'lion_courage',
    name: "Lion's Courage",
    description: 'Complete 50 tasks',
    icon: '🦁',
    condition: (stats) => stats.tasksCompleted >= 50,
  },
  {
    id: 'glinda_wisdom',
    name: "Glinda's Wisdom",
    description: 'Reach level 10',
    icon: '✨',
    condition: (stats) => calculateLevel(stats.totalPoints) >= 10,
  },
  {
    id: 'emerald_city',
    name: 'Reached the Emerald City',
    description: 'Complete 100 tasks',
    icon: '🏰',
    condition: (stats) => stats.tasksCompleted >= 100,
  },
  {
    id: 'tornado_power',
    name: 'Tornado Power',
    description: 'Maintain a 30-day streak',
    icon: '🌪️',
    condition: (stats) => stats.currentStreak >= 30,
  },
];

// Check which achievements user has unlocked
export function checkAchievements(stats: UserStats, currentAchievements: string[]): string[] {
  const newAchievements: string[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!currentAchievements.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement.id);
    }
  }
  
  return newAchievements;
}
