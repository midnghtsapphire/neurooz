/**
 * Oz Engine™ - Cognitive Mode Hook
 * Standalone module - can be reused across applications
 */

import { useState, useEffect, useCallback } from "react";
import type { CognitiveMode } from "../types";
import { STORAGE_KEYS, DEFAULT_COGNITIVE_MODE } from "../constants";

export interface UseCognitiveModeReturn {
  mode: CognitiveMode;
  setMode: (mode: CognitiveMode) => void;
  hasConsentedToPowerMode: boolean;
  grantPowerModeConsent: () => void;
  revokePowerModeConsent: () => void;
  needsConsentForPowerMode: boolean;
}

export function useCognitiveMode(): UseCognitiveModeReturn {
  const [mode, setModeState] = useState<CognitiveMode>(() => {
    if (typeof window === "undefined") return DEFAULT_COGNITIVE_MODE;
    const stored = localStorage.getItem(STORAGE_KEYS.cognitiveMode);
    return (stored as CognitiveMode) || DEFAULT_COGNITIVE_MODE;
  });

  const [hasConsentedToPowerMode, setHasConsentedToPowerMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEYS.powerModeConsent) === "true";
  });

  const setMode = useCallback((newMode: CognitiveMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEYS.cognitiveMode, newMode);
  }, []);

  const grantPowerModeConsent = useCallback(() => {
    setHasConsentedToPowerMode(true);
    localStorage.setItem(STORAGE_KEYS.powerModeConsent, "true");
  }, []);

  const revokePowerModeConsent = useCallback(() => {
    setHasConsentedToPowerMode(false);
    localStorage.removeItem(STORAGE_KEYS.powerModeConsent);
  }, []);

  // If mode is power but consent was revoked, fall back to flow
  useEffect(() => {
    if (mode === "power" && !hasConsentedToPowerMode) {
      setMode(DEFAULT_COGNITIVE_MODE);
    }
  }, [mode, hasConsentedToPowerMode, setMode]);

  return {
    mode,
    setMode,
    hasConsentedToPowerMode,
    grantPowerModeConsent,
    revokePowerModeConsent,
    needsConsentForPowerMode: !hasConsentedToPowerMode,
  };
}
