import { useMemo } from "react";
import { useProjects, useActionItems } from "@/hooks/use-projects";
import { useBrainDumps } from "@/hooks/use-brain-dumps";

export interface CognitiveLoad {
  // Raw counts
  openProjects: number;
  openTasks: number;
  unprocessedDumps: number;
  overdueTasks: number;
  blockedTasks: number;
  setbackTasks: number;
  
  // Calculated metrics (0-100)
  ramUsage: number;
  emotionalLoad: number;
  logicLoad: number;
  anxietyLevel: number;
  
  // Status
  status: 'stable' | 'elevated' | 'critical' | 'overload';
  statusMessage: string;
  
  // Character states
  tinManState: 'healthy' | 'stressed' | 'burnout';
  scarecrowState: 'sharp' | 'foggy' | 'scattered';
  lionState: 'brave' | 'anxious' | 'frozen';
  totoAlert: boolean;
}

export function useCognitiveLoad(): CognitiveLoad {
  const { data: projects = [] } = useProjects();
  const { data: actionItems = [] } = useActionItems();
  const { data: brainDumps = [] } = useBrainDumps();
  
  return useMemo(() => {
    const now = new Date();
    
    // Raw counts
    const openProjects = projects.filter(p => !p.is_completed).length;
    const openTasks = actionItems.filter(a => !a.is_completed).length;
    const unprocessedDumps = brainDumps.filter(b => !b.ai_summary).length;
    const overdueTasks = actionItems.filter(a => 
      !a.is_completed && a.due_date && new Date(a.due_date) < now
    ).length;
    const blockedTasks = actionItems.filter(a => !a.is_completed && a.blocked_by).length;
    const setbackTasks = actionItems.filter(a => a.is_setback).length;
    
    // Calculate RAM usage (weighted formula)
    const projectWeight = 15; // Each open project = 15% RAM
    const taskWeight = 3; // Each open task = 3% RAM
    const dumpWeight = 10; // Each unprocessed dump = 10% RAM
    const overdueWeight = 8; // Each overdue = 8% extra
    
    let ramUsage = Math.min(100, 
      (openProjects * projectWeight) + 
      (openTasks * taskWeight) + 
      (unprocessedDumps * dumpWeight) +
      (overdueTasks * overdueWeight)
    );
    
    // Emotional load (Tin Man) - setbacks and blocks cause emotional strain
    const emotionalLoad = Math.min(100, 
      (setbackTasks * 20) + (blockedTasks * 15) + (overdueTasks * 10)
    );
    
    // Logic load (Scarecrow) - too many open items scatter thinking
    const logicLoad = Math.min(100, 
      (openTasks * 5) + (unprocessedDumps * 15)
    );
    
    // Anxiety level (Lion) - overdue and blocked items cause fear
    const anxietyLevel = Math.min(100, 
      (overdueTasks * 25) + (blockedTasks * 10) + (openProjects > 3 ? 20 : 0)
    );
    
    // Determine overall status
    let status: CognitiveLoad['status'];
    let statusMessage: string;
    
    if (ramUsage >= 85) {
      status = 'overload';
      statusMessage = "⚠️ Emerald City power grid critical! Pausing non-essential quests.";
    } else if (ramUsage >= 65) {
      status = 'critical';
      statusMessage = "🌪️ Storm approaching the city. Consider closing some loops.";
    } else if (ramUsage >= 40) {
      status = 'elevated';
      statusMessage = "☁️ Clouds gathering. Stay focused on current quests.";
    } else {
      status = 'stable';
      statusMessage = "✨ Emerald City is glowing bright. All systems optimal.";
    }
    
    // Character states
    const tinManState: CognitiveLoad['tinManState'] = 
      emotionalLoad >= 70 ? 'burnout' : emotionalLoad >= 40 ? 'stressed' : 'healthy';
    
    const scarecrowState: CognitiveLoad['scarecrowState'] = 
      logicLoad >= 70 ? 'scattered' : logicLoad >= 40 ? 'foggy' : 'sharp';
    
    const lionState: CognitiveLoad['lionState'] = 
      anxietyLevel >= 70 ? 'frozen' : anxietyLevel >= 40 ? 'anxious' : 'brave';
    
    // Toto alerts when any metric is critical
    const totoAlert = ramUsage >= 65 || emotionalLoad >= 60 || anxietyLevel >= 60;
    
    return {
      openProjects,
      openTasks,
      unprocessedDumps,
      overdueTasks,
      blockedTasks,
      setbackTasks,
      ramUsage,
      emotionalLoad,
      logicLoad,
      anxietyLevel,
      status,
      statusMessage,
      tinManState,
      scarecrowState,
      lionState,
      totoAlert,
    };
  }, [projects, actionItems, brainDumps]);
}
