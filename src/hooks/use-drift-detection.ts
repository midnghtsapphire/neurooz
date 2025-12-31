import { useState, useEffect, useCallback, useMemo } from "react";

export interface DriftSignals {
  timeBleed: boolean;       // > X minutes without quest progress
  tabCascade: boolean;      // +N new tabs/apps opened
  ideaStorm: boolean;       // Brain dump entries accelerating  
  emotionalSpike: boolean;  // Erratic switching/activity
  loopExpansion: boolean;   // Open loops increasing instead of shrinking
}

export interface DriftState {
  signals: DriftSignals;
  activeSignalCount: number;
  isVoidTriggered: boolean;
  driftLevel: number;
  lastQuestProgress: number;
  tabCount: number;
  previousLoopCount: number;
}

const DRIFT_STORAGE_KEY = 'oz-drift-detection';
const TIME_BLEED_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes without progress
const TAB_CASCADE_THRESHOLD = 3; // 3+ new tabs triggers cascade

interface StoredDriftState {
  lastQuestProgress: number;
  tabCount: number;
  previousLoopCount: number;
  ideaEntriesLastMinute: number[];
  activityPattern: number[];
}

function getStoredState(): StoredDriftState {
  try {
    const stored = sessionStorage.getItem(DRIFT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    lastQuestProgress: Date.now(),
    tabCount: 1,
    previousLoopCount: 0,
    ideaEntriesLastMinute: [],
    activityPattern: [],
  };
}

function setStoredState(state: StoredDriftState) {
  try {
    sessionStorage.setItem(DRIFT_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useDriftDetection(
  openLoops: number,
  brainDumpCount: number
): DriftState {
  const [stored, setStored] = useState<StoredDriftState>(getStoredState);
  
  // Track quest progress
  const markQuestProgress = useCallback(() => {
    const newState = { ...stored, lastQuestProgress: Date.now() };
    setStored(newState);
    setStoredState(newState);
  }, [stored]);
  
  // Track tab changes (simulated - in real app would use visibility API)
  const incrementTabCount = useCallback(() => {
    const newState = { ...stored, tabCount: stored.tabCount + 1 };
    setStored(newState);
    setStoredState(newState);
  }, [stored]);
  
  // Track activity patterns for emotional spike detection
  useEffect(() => {
    const handleActivity = () => {
      const now = Date.now();
      const recentActivity = stored.activityPattern.filter(t => now - t < 60000);
      recentActivity.push(now);
      
      const newState = { ...stored, activityPattern: recentActivity.slice(-20) };
      setStored(newState);
      setStoredState(newState);
    };
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [stored]);
  
  // Track idea entries for idea storm detection
  useEffect(() => {
    const now = Date.now();
    const recentEntries = stored.ideaEntriesLastMinute.filter(t => now - t < 60000);
    
    // If brain dump count increased, record the timestamp
    if (brainDumpCount > 0) {
      const newEntries = [...recentEntries];
      // Add entry if count changed (simplified detection)
      if (newEntries.length < brainDumpCount) {
        newEntries.push(now);
      }
      
      if (JSON.stringify(newEntries) !== JSON.stringify(stored.ideaEntriesLastMinute)) {
        const newState = { ...stored, ideaEntriesLastMinute: newEntries };
        setStored(newState);
        setStoredState(newState);
      }
    }
  }, [brainDumpCount, stored]);
  
  // Calculate signals
  const signals = useMemo((): DriftSignals => {
    const now = Date.now();
    
    // Time bleed: no quest progress for threshold time
    const timeBleed = (now - stored.lastQuestProgress) > TIME_BLEED_THRESHOLD_MS;
    
    // Tab cascade: opened many tabs recently
    const tabCascade = stored.tabCount > TAB_CASCADE_THRESHOLD;
    
    // Idea storm: brain dump entries accelerating (3+ in last minute)
    const recentIdeas = stored.ideaEntriesLastMinute.filter(t => now - t < 60000);
    const ideaStorm = recentIdeas.length >= 3;
    
    // Emotional spike: erratic activity (high variance in timing)
    const recentActivity = stored.activityPattern.filter(t => now - t < 60000);
    let emotionalSpike = false;
    if (recentActivity.length >= 5) {
      const gaps = [];
      for (let i = 1; i < recentActivity.length; i++) {
        gaps.push(recentActivity[i] - recentActivity[i - 1]);
      }
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
      // High variance indicates erratic behavior
      emotionalSpike = variance > 10000000; // ~3 second variance
    }
    
    // Loop expansion: open loops growing instead of shrinking
    const loopExpansion = openLoops > stored.previousLoopCount && stored.previousLoopCount > 0;
    
    return {
      timeBleed,
      tabCascade,
      ideaStorm,
      emotionalSpike,
      loopExpansion,
    };
  }, [stored, openLoops]);
  
  // Track previous loop count
  useEffect(() => {
    if (openLoops !== stored.previousLoopCount) {
      const newState = { ...stored, previousLoopCount: openLoops };
      setStored(newState);
      setStoredState(newState);
    }
  }, [openLoops, stored]);
  
  // Count active signals
  const activeSignalCount = useMemo(() => {
    return Object.values(signals).filter(Boolean).length;
  }, [signals]);
  
  // Void triggered when 3+ signals active
  const isVoidTriggered = activeSignalCount >= 3;
  
  // Calculate drift level (0-100)
  const driftLevel = useMemo(() => {
    let level = 0;
    if (signals.timeBleed) level += 25;
    if (signals.tabCascade) level += 20;
    if (signals.ideaStorm) level += 20;
    if (signals.emotionalSpike) level += 20;
    if (signals.loopExpansion) level += 15;
    return Math.min(100, level);
  }, [signals]);
  
  return {
    signals,
    activeSignalCount,
    isVoidTriggered,
    driftLevel,
    lastQuestProgress: stored.lastQuestProgress,
    tabCount: stored.tabCount,
    previousLoopCount: stored.previousLoopCount,
  };
}

// Hook to mark quest progress from anywhere
export function useMarkQuestProgress() {
  return useCallback(() => {
    const stored = getStoredState();
    stored.lastQuestProgress = Date.now();
    setStoredState(stored);
  }, []);
}

// Hook to reset drift state
export function useResetDrift() {
  return useCallback(() => {
    setStoredState({
      lastQuestProgress: Date.now(),
      tabCount: 1,
      previousLoopCount: 0,
      ideaEntriesLastMinute: [],
      activityPattern: [],
    });
  }, []);
}
