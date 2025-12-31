import { useState, useEffect, useCallback } from "react";

interface OnboardingState {
  hasSeenTornado: boolean;
  hasCompletedDump: boolean;
  hasSeenCity: boolean;
  hasAcceptedFirstQuest: boolean;
  hasCompletedFirstQuest: boolean;
  firstDumpContent: string | null;
}

const STORAGE_KEY = 'oz-onboarding-state';

const DEFAULT_STATE: OnboardingState = {
  hasSeenTornado: false,
  hasCompletedDump: false,
  hasSeenCity: false,
  hasAcceptedFirstQuest: false,
  hasCompletedFirstQuest: false,
  firstDumpContent: null,
};

export function useOzOnboarding() {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });
  
  const [showTornadoEntry, setShowTornadoEntry] = useState(false);
  const [showQuestCompletion, setShowQuestCompletion] = useState(false);
  
  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  // Check if should show tornado on first visit
  useEffect(() => {
    if (!state.hasSeenTornado) {
      // Small delay before starting tornado
      const timer = setTimeout(() => setShowTornadoEntry(true), 500);
      return () => clearTimeout(timer);
    }
  }, [state.hasSeenTornado]);
  
  const completeTornado = useCallback((dumpContent: string) => {
    setState(prev => ({
      ...prev,
      hasSeenTornado: true,
      hasCompletedDump: true,
      firstDumpContent: dumpContent,
    }));
    setShowTornadoEntry(false);
  }, []);
  
  const skipTornado = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasSeenTornado: true,
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
  
  const resetOnboarding = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  const isNewUser = !state.hasSeenTornado;
  const needsFirstQuest = state.hasSeenTornado && !state.hasCompletedFirstQuest;
  
  return {
    state,
    showTornadoEntry,
    showQuestCompletion,
    isNewUser,
    needsFirstQuest,
    completeTornado,
    skipTornado,
    markCitySeen,
    acceptFirstQuest,
    completeFirstQuest,
    dismissQuestCompletion,
    resetOnboarding,
  };
}
