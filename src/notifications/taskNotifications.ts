import { Task } from "@/types/brainDump.types";
import { toast } from "@/hooks/use-toast";

// Celebration messages for task completion
const CELEBRATION_MESSAGES = [
  { title: "✅ Task Complete!", description: "Amazing! You're on the Yellow Brick Road! 🌈" },
  { title: "🎉 Done!", description: "Dorothy would be proud of you! 👧" },
  { title: "⭐ Nailed it!", description: "The Scarecrow says you're smart! 🧠" },
  { title: "🦁 Courageous!", description: "The Lion roars with pride!" },
  { title: "❤️ Wonderful!", description: "The Tin Man's heart is full! You did it!" },
  { title: "✨ Magical!", description: "Glinda says you're glowing! Keep it up!" },
  { title: "🌪️ Tornado Power!", description: "Nothing can stop you now!" },
];

// Streak milestone messages
const STREAK_MESSAGES: Record<number, { title: string; description: string }> = {
  3:  { title: "🔥 3-Day Streak!", description: "You're building momentum on the Yellow Brick Road!" },
  7:  { title: "🦁 7-Day Streak!", description: "A whole week! The Lion earned his courage!" },
  14: { title: "⭐ 2-Week Streak!", description: "Two weeks of consistency! Oz is impressed!" },
  30: { title: "🌪️ 30-Day Streak!", description: "Tornado Power activated! You're unstoppable!" },
  60: { title: "🏰 60-Day Streak!", description: "Reached the Emerald City! You're legendary!" },
};

export function celebrateTaskCompletion(task: Task): void {
  const message = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
  const pointsEarned = task.points_earned;

  toast({
    title: message.title,
    description: pointsEarned > 0
      ? `${message.description} (+${pointsEarned} pts)`
      : message.description,
  });
}

export function notifyStreakMilestone(streakDays: number): void {
  const milestone = STREAK_MESSAGES[streakDays];
  if (milestone) {
    toast({
      title: milestone.title,
      description: milestone.description,
    });
  }
}

export function notifyTaskReminder(task: Task, minutesBefore: number): void {
  const timeLabel = minutesBefore >= 60
    ? `${minutesBefore / 60} hour${minutesBefore / 60 > 1 ? "s" : ""}`
    : `${minutesBefore} minutes`;

  toast({
    title: `⏰ Reminder: ${task.title}`,
    description: `Starting in ${timeLabel}. Time to prepare!`,
  });
}

export function notifyShortListFull(): void {
  toast({
    title: "📋 Short List is Full!",
    description: "Complete or move a task before adding more. Keep it focused! 🎯",
    variant: "destructive",
  });
}

export function notifyRoutineComplete(routineName: string, streak: number): void {
  const streakText = streak > 1 ? ` (${streak}-day streak! 🔥)` : "";
  toast({
    title: `🎯 ${routineName} Complete!`,
    description: `Great consistency${streakText}`,
  });
}
