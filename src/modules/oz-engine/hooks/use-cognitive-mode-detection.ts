/**
 * Oz Engine™ — useCognitiveModeDetection hook
 *
 * Wraps the pure detectCognitiveMode function in a React hook.
 * Re-evaluates every minute so the suggestion stays fresh throughout the day.
 */

import { useState, useEffect } from "react";
import { detectCognitiveMode } from "../detection";
import type {
  CognitiveModeDetectionInput,
  CognitiveModeDetectionResult,
} from "../types";

const REFRESH_INTERVAL_MS = 60_000; // re-evaluate every minute

/**
 * Returns the auto-detected cognitive mode recommendation.
 * Updates automatically as the hour changes.
 *
 * @param input - Optional overrides (e.g. pass current cognitiveLoadPercent)
 *
 * @example
 * const { mode, reason, confidence } = useCognitiveModeDetection();
 * // mode: "flow" at 9am, "creative" at 3pm, "recovery" at midnight
 *
 * @example
 * // Pass cognitive load for load-aware detection
 * const { ramUsage } = useCognitiveLoad();
 * const { mode } = useCognitiveModeDetection({ cognitiveLoadPercent: ramUsage });
 */
export function useCognitiveModeDetection(
  input: Omit<CognitiveModeDetectionInput, "hourOfDay"> = {}
): CognitiveModeDetectionResult {
  const [result, setResult] = useState<CognitiveModeDetectionResult>(() =>
    detectCognitiveMode(input)
  );

  useEffect(() => {
    // Refresh on input change
    setResult(detectCognitiveMode(input));

    // Also refresh every minute in case the hour changes
    const timer = setInterval(() => {
      setResult(detectCognitiveMode(input));
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.cognitiveLoadPercent]);

  return result;
}
