/**
 * Oz Engine™ - Context Provider
 * Standalone module - provides centralized state management.
 * Now includes auto-detection recommendation and mode history tracking.
 */

import { createContext, useContext, ReactNode } from "react";
import { useCognitiveMode } from "../hooks/use-cognitive-mode";
import { useCognitiveModeDetection } from "../hooks/use-cognitive-mode-detection";
import { useModeHistory } from "../hooks/use-mode-history";
import type { CognitiveMode, CognitiveModeDetectionResult } from "../types";
import type { ModeHistoryEntry, ModeTimeSummary } from "../hooks/use-mode-history";

interface OzEngineContextValue {
  // Cognitive Mode (manual selection)
  cognitiveMode: CognitiveMode;
  setCognitiveMode: (mode: CognitiveMode) => void;
  hasConsentedToPowerMode: boolean;
  grantPowerModeConsent: () => void;
  revokePowerModeConsent: () => void;
  needsConsentForPowerMode: boolean;

  // Auto-detection suggestion
  detectedMode: CognitiveModeDetectionResult;

  // Mode history + summary (for Cognitive Growth Dashboard)
  modeHistory: ModeHistoryEntry[];
  modeSummary: ModeTimeSummary[];
  clearModeHistory: () => void;
}

const OzEngineContext = createContext<OzEngineContextValue | null>(null);

export interface OzEngineProviderProps {
  children: ReactNode;
  /** Cognitive load percent (0–100) to feed into auto-detection */
  cognitiveLoadPercent?: number;
}

export function OzEngineProvider({ children, cognitiveLoadPercent }: OzEngineProviderProps) {
  const {
    mode: cognitiveMode,
    setMode: setCognitiveMode,
    hasConsentedToPowerMode,
    grantPowerModeConsent,
    revokePowerModeConsent,
    needsConsentForPowerMode,
  } = useCognitiveMode();

  const detectedMode = useCognitiveModeDetection(cognitiveLoadPercent);

  const { history: modeHistory, summary: modeSummary, clearHistory: clearModeHistory } =
    useModeHistory(cognitiveMode);

  const value: OzEngineContextValue = {
    cognitiveMode,
    setCognitiveMode,
    hasConsentedToPowerMode,
    grantPowerModeConsent,
    revokePowerModeConsent,
    needsConsentForPowerMode,
    detectedMode,
    modeHistory,
    modeSummary,
    clearModeHistory,
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
