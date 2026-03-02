import { Task } from "@/types/brainDump.types";

// Urgency/Importance matrix quadrants (Eisenhower Matrix)
export type TaskQuadrant =
  | "do_first"      // Urgent + Important
  | "schedule"      // Not Urgent + Important
  | "delegate"      // Urgent + Not Important
  | "eliminate";    // Not Urgent + Not Important

export function getTaskQuadrant(task: Task): TaskQuadrant {
  const isUrgent = isTaskUrgent(task);
  const isImportant = task.priority !== undefined && task.priority <= 2;

  if (isUrgent && isImportant) return "do_first";
  if (!isUrgent && isImportant) return "schedule";
  if (isUrgent && !isImportant) return "delegate";
  return "eliminate";
}

export function isTaskUrgent(task: Task): boolean {
  if (!task.due_date) return false;
  // Parse date-only strings as local midnight to avoid UTC offset issues
  const [year, month, day] = task.due_date.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day, 23, 59, 59); // end of due day
  const now = new Date();
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilDue <= 24;
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.due_date) return false;
  const [year, month, day] = task.due_date.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day, 23, 59, 59);
  const now = new Date();
  return dueDate < now && task.status !== "completed";
}

// Returns a Tailwind color class based on task properties
export function getTaskColorClass(task: Task): string {
  if (task.status === "completed") return "text-emerald-500";
  if (isTaskOverdue(task)) return "text-red-500";
  if (isTaskUrgent(task)) return "text-orange-500";
  if (task.priority === 1) return "text-purple-500";
  return "text-gray-600";
}

export function getTaskBorderClass(task: Task): string {
  if (task.status === "completed") return "border-emerald-300";
  if (isTaskOverdue(task)) return "border-red-400";
  if (isTaskUrgent(task)) return "border-orange-400";
  if (task.priority === 1) return "border-purple-400";
  return "border-gray-200";
}

// Format estimated time for display
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
}

// Format due date for display
export function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Get appropriate icon emoji for task
export function getTaskIcon(task: Task): string {
  if (task.status === "completed") return "✅";
  if (isTaskOverdue(task)) return "🔴";
  if (isTaskUrgent(task)) return "⚡";
  if (task.size === "big") return "🏋️";
  if (task.size === "small") return "🌱";
  return "📋";
}

// Sort tasks by priority for display
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;

    // Overdue tasks come first
    const aOverdue = isTaskOverdue(a);
    const bOverdue = isTaskOverdue(b);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then sort by priority number (lower = higher priority)
    const aPriority = a.priority ?? 99;
    const bPriority = b.priority ?? 99;
    return aPriority - bPriority;
  });
}
