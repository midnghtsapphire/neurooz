import { useState, useEffect, useCallback, useMemo } from "react";

interface OnboardingState {
  hasSeenTornado: boolean;
  hasCompletedDump: boolean;
  hasSeenCity: boolean;
  hasAcceptedFirstQuest: boolean;
  hasCompletedFirstQuest: boolean;
  firstDumpContent: string | null;
  firstVisitDate: string | null;
  currentDay: number;
  unlockedFeatures: {
    voidEvent: boolean;
    controlledBurn: boolean;
    emotionalRouting: boolean;
    cityExpansion: boolean;
    identityLock: boolean;
  };
}

const STORAGE_KEY = 'oz-onboarding-state';

const DEFAULT_STATE: OnboardingState = {
  hasSeenTornado: false,
  hasCompletedDump: false,
  hasSeenCity: false,
  hasAcceptedFirstQuest: false,
  hasCompletedFirstQuest: false,
  firstDumpContent: null,
  firstVisitDate: null,
  currentDay: 1,
  unlockedFeatures: {
    voidEvent: false,
    controlledBurn: false,
    emotionalRouting: false,
    cityExpansion: false,
    identityLock: false,
  },
};

// Calculate which day of the 7-day loop we're on
function calculateCurrentDay(firstVisitDate: string | null): number {
  if (!firstVisitDate) return 1;
  
  const start = new Date(firstVisitDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Cap at day 7, then cycle or stay at 7
  return Math.min(diffDays, 7);
}

// Determine unlocked features based on day
function getUnlockedFeatures(day: number): OnboardingState['unlockedFeatures'] {
  return {
    voidEvent: day >= 3,        // Day 3: First Void Event
    controlledBurn: day >= 4,   // Day 4: Controlled Burn unlocked
    emotionalRouting: day >= 5, // Day 5: Tin Man, Lion, Toto introduced
    cityExpansion: day >= 6,    // Day 6: City upgrade system
    identityLock: day >= 7,     // Day 7: Identity lock moment
  };
}

export function useOzOnboarding() {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Recalculate current day and unlocked features
        const currentDay = calculateCurrentDay(parsed.firstVisitDate);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          currentDay,
          unlockedFeatures: getUnlockedFeatures(currentDay),
        };
      }
      return DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });
  
  const [showTornadoEntry, setShowTornadoEntry] = useState(false);
  const [showQuestCompletion, setShowQuestCompletion] = useState(false);
  const [showDayMessage, setShowDayMessage] = useState(false);
  
  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  // Check if should show tornado on first visit
  useEffect(() => {
    if (!state.hasSeenTornado) {
      const timer = setTimeout(() => setShowTornadoEntry(true), 500);
      return () => clearTimeout(timer);
    }
  }, [state.hasSeenTornado]);
  
  // Check for day transitions and show day message
  useEffect(() => {
    if (state.hasSeenTornado && state.currentDay > 1) {
      // Show day-specific message on return visits
      setShowDayMessage(true);
      const timer = setTimeout(() => setShowDayMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state.hasSeenTornado, state.currentDay]);
  
  const completeTornado = useCallback((dumpContent: string) => {
    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      hasSeenTornado: true,
      hasCompletedDump: true,
      firstDumpContent: dumpContent,
      firstVisitDate: prev.firstVisitDate || now,
      currentDay: 1,
      unlockedFeatures: getUnlockedFeatures(1),
    }));
    setShowTornadoEntry(false);
  }, []);
  
  const skipTornado = useCallback(() => {
    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      hasSeenTornado: true,
      firstVisitDate: prev.firstVisitDate || now,
      currentDay: 1,
      unlockedFeatures: getUnlockedFeatures(1),
    }));
    setShowTornadoEntry(false);
  }, []);
  
  const markCitySeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenCity: true }));
  }, []);
  
  const acceptFirstQuest = useCallback(() => {
    setState(prev => ({ ...prev, hasAcceptedFirstQuest: true }));
  }, []);
  
  const completeFirstQuest = useCallback(() => {
    setState(prev => ({ ...prev, hasCompletedFirstQuest: true }));
    setShowQuestCompletion(true);
  }, []);
  
  const dismissQuestCompletion = useCallback(() => {
    setShowQuestCompletion(false);
  }, []);
  
  const dismissDayMessage = useCallback(() => {
    setShowDayMessage(false);
  }, []);
  
  const resetOnboarding = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  // Advance to a specific day (for dev/testing)
  const advanceToDay = useCallback((day: number) => {
    const targetDay = Math.min(Math.max(day, 1), 7);
    setState(prev => ({
      ...prev,
      currentDay: targetDay,
      unlockedFeatures: getUnlockedFeatures(targetDay),
    }));
  }, []);
  
  const isNewUser = !state.hasSeenTornado;
  const needsFirstQuest = state.hasSeenTornado && !state.hasCompletedFirstQuest;
  
  // Get the onboarding day key for wizard messages
  const dayKey = useMemo(() => {
    return `day${state.currentDay}` as 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'day7';
  }, [state.currentDay]);
  
  return {
    state,
    showTornadoEntry,
    showQuestCompletion,
    showDayMessage,
    isNewUser,
    needsFirstQuest,
    dayKey,
    completeTornado,
    skipTornado,
    markCitySeen,
    acceptFirstQuest,
    completeFirstQuest,
    dismissQuestCompletion,
    dismissDayMessage,
    resetOnboarding,
    advanceToDay,
  };
}
