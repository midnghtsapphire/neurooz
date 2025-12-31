import { useMemo, useState, useEffect, useCallback } from "react";
import { useProjects, useActionItems } from "@/hooks/use-projects";
import { useBrainDumps } from "@/hooks/use-brain-dumps";

export type ProjectOrbit = 'planet' | 'moon' | 'probe' | 'archived';

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
  executiveLoad: number; // Dorothy's metric
  
  // Drift detection
  driftLevel: number; // 0-100
  isInVoid: boolean;
  lastActiveQuest: string | null;
  
  // Status
  status: 'stable' | 'elevated' | 'critical' | 'overload';
  statusMessage: string;
  
  // Character states
  tinManState: 'healthy' | 'stressed' | 'burnout';
  scarecrowState: 'sharp' | 'foggy' | 'scattered';
  lionState: 'brave' | 'anxious' | 'frozen';
  dorothyState: 'decisive' | 'wavering' | 'paralyzed';
  totoAlert: boolean;
  
  // Project orbits
  planetProject: string | null;
  moonProjects: string[];
  probeProjects: string[];
  archivedCount: number;
  canAddPlanet: boolean;
  canAddMoon: boolean;
  canAddProbe: boolean;
}

// Session storage for drift tracking
const DRIFT_STORAGE_KEY = 'oz-drift-state';

interface DriftState {
  lastQuestId: string | null;
  lastActiveTime: number;
  driftTriggeredAt: number | null;
}

function getDriftState(): DriftState {
  try {
    const stored = sessionStorage.getItem(DRIFT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { lastQuestId: null, lastActiveTime: Date.now(), driftTriggeredAt: null };
}

function setDriftState(state: DriftState) {
  try {
    sessionStorage.setItem(DRIFT_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useCognitiveLoad(): CognitiveLoad {
  const { data: projects = [] } = useProjects();
  const { data: actionItems = [] } = useActionItems();
  const { data: brainDumps = [] } = useBrainDumps();
  
  const [driftState, setDriftStateLocal] = useState<DriftState>(getDriftState);
  
  // Track activity to detect drift
  useEffect(() => {
    const handleActivity = () => {
      const newState = { ...driftState, lastActiveTime: Date.now() };
      setDriftStateLocal(newState);
      setDriftState(newState);
    };
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [driftState]);
  
  return useMemo(() => {
    const now = new Date();
    
    // Raw counts
    const openProjectsList = projects.filter(p => !p.is_completed);
    const openProjects = openProjectsList.length;
    const openTasks = actionItems.filter(a => !a.is_completed).length;
    const unprocessedDumps = brainDumps.filter(b => !b.ai_summary).length;
    const overdueTasks = actionItems.filter(a => 
      !a.is_completed && a.due_date && new Date(a.due_date) < now
    ).length;
    const blockedTasks = actionItems.filter(a => !a.is_completed && a.blocked_by).length;
    const setbackTasks = actionItems.filter(a => a.is_setback).length;
    
    // Project orbits (1 planet, 2 moons, 3 probes max)
    // Use project priority or order to categorize
    const sortedProjects = [...openProjectsList].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const planetProject = sortedProjects[0]?.id || null;
    const moonProjects = sortedProjects.slice(1, 3).map(p => p.id);
    const probeProjects = sortedProjects.slice(3, 6).map(p => p.id);
    const archivedCount = Math.max(0, openProjects - 6);
    
    const canAddPlanet = !planetProject;
    const canAddMoon = moonProjects.length < 2;
    const canAddProbe = probeProjects.length < 3;
    
    // Calculate RAM usage (weighted formula)
    const projectWeight = 15;
    const taskWeight = 3;
    const dumpWeight = 10;
    const overdueWeight = 8;
    
    let ramUsage = Math.min(100, 
      (openProjects * projectWeight) + 
      (openTasks * taskWeight) + 
      (unprocessedDumps * dumpWeight) +
      (overdueTasks * overdueWeight)
    );
    
    // Emotional load (Tin Man)
    const emotionalLoad = Math.min(100, 
      (setbackTasks * 20) + (blockedTasks * 15) + (overdueTasks * 10)
    );
    
    // Logic load (Scarecrow)
    const logicLoad = Math.min(100, 
      (openTasks * 5) + (unprocessedDumps * 15)
    );
    
    // Anxiety level (Lion)
    const anxietyLevel = Math.min(100, 
      (overdueTasks * 25) + (blockedTasks * 10) + (openProjects > 3 ? 20 : 0)
    );
    
    // Executive load (Dorothy) - decision fatigue from too many open choices
    const executiveLoad = Math.min(100,
      (openProjects * 10) + (openTasks > 10 ? 30 : openTasks * 3) + 
      (unprocessedDumps * 12) + (blockedTasks * 8)
    );
    
    // Drift detection - time since last activity + open loops growing
    const timeSinceActive = (Date.now() - driftState.lastActiveTime) / 1000 / 60; // minutes
    const driftFromInactivity = Math.min(50, timeSinceActive * 5); // 10 min = 50%
    const driftFromLoops = Math.min(50, openTasks * 2 + unprocessedDumps * 5);
    const driftLevel = Math.min(100, driftFromInactivity + driftFromLoops);
    const isInVoid = driftLevel >= 75;
    
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
    
    const dorothyState: CognitiveLoad['dorothyState'] = 
      executiveLoad >= 70 ? 'paralyzed' : executiveLoad >= 40 ? 'wavering' : 'decisive';
    
    // Toto alerts when any metric is critical
    const totoAlert = ramUsage >= 65 || emotionalLoad >= 60 || anxietyLevel >= 60 || driftLevel >= 60;
    
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
      executiveLoad,
      driftLevel,
      isInVoid,
      lastActiveQuest: driftState.lastQuestId,
      status,
      statusMessage,
      tinManState,
      scarecrowState,
      lionState,
      dorothyState,
      totoAlert,
      planetProject,
      moonProjects,
      probeProjects,
      archivedCount,
      canAddPlanet,
      canAddMoon,
      canAddProbe,
    };
  }, [projects, actionItems, brainDumps, driftState]);
}
