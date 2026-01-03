import { useState, useEffect, useCallback } from "react";
import type { CognitiveMode } from "@/components/neuro/CognitiveModeSwitcher";

const STORAGE_KEY = "oz-cognitive-mode";
const CONSENT_KEY = "oz-power-mode-consent";

export function useCognitiveMode() {
  const [mode, setModeState] = useState<CognitiveMode>(() => {
    if (typeof window === "undefined") return "flow";
    const stored = localStorage.getItem(STORAGE_KEY);
    // Default to flow mode (brain-safe)
    return (stored as CognitiveMode) || "flow";
  });

  const [hasConsentedToPowerMode, setHasConsentedToPowerMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(CONSENT_KEY) === "true";
  });

  const setMode = useCallback((newMode: CognitiveMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const grantPowerModeConsent = useCallback(() => {
    setHasConsentedToPowerMode(true);
    localStorage.setItem(CONSENT_KEY, "true");
  }, []);

  const revokePowerModeConsent = useCallback(() => {
    setHasConsentedToPowerMode(false);
    localStorage.removeItem(CONSENT_KEY);
  }, []);

  // If mode is power but consent was revoked, fall back to flow
  useEffect(() => {
    if (mode === "power" && !hasConsentedToPowerMode) {
      setMode("flow");
    }
  }, [mode, hasConsentedToPowerMode, setMode]);

  return {
    mode,
    setMode,
    hasConsentedToPowerMode,
    grantPowerModeConsent,
    revokePowerModeConsent,
    // Helper to check if we need to show consent dialog
    needsConsentForPowerMode: !hasConsentedToPowerMode,
  };
}
