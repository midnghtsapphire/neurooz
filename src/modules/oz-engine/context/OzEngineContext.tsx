/**
 * Oz Engine™ - Context Provider
 * Standalone module - provides centralized state management
 */

import { createContext, useContext, ReactNode } from "react";
import { useCognitiveMode } from "../hooks/use-cognitive-mode";
import type { CognitiveMode } from "../types";

interface OzEngineContextValue {
  // Cognitive Mode
  cognitiveMode: CognitiveMode;
  setCognitiveMode: (mode: CognitiveMode) => void;
  hasConsentedToPowerMode: boolean;
  grantPowerModeConsent: () => void;
  revokePowerModeConsent: () => void;
  needsConsentForPowerMode: boolean;
}

const OzEngineContext = createContext<OzEngineContextValue | null>(null);

export interface OzEngineProviderProps {
  children: ReactNode;
}

export function OzEngineProvider({ children }: OzEngineProviderProps) {
  const {
    mode: cognitiveMode,
    setMode: setCognitiveMode,
    hasConsentedToPowerMode,
    grantPowerModeConsent,
    revokePowerModeConsent,
    needsConsentForPowerMode,
  } = useCognitiveMode();

  const value: OzEngineContextValue = {
    cognitiveMode,
    setCognitiveMode,
    hasConsentedToPowerMode,
    grantPowerModeConsent,
    revokePowerModeConsent,
    needsConsentForPowerMode,
  };

  return (
    <OzEngineContext.Provider value={value}>
      {children}
    </OzEngineContext.Provider>
  );
}

export function useOzEngine(): OzEngineContextValue {
  const context = useContext(OzEngineContext);
  if (!context) {
    throw new Error("useOzEngine must be used within an OzEngineProvider");
  }
  return context;
}

// Optional: hook that doesn't throw if used outside provider
export function useOzEngineOptional(): OzEngineContextValue | null {
  return useContext(OzEngineContext);
}
