/**
 * Oz Engine™ — useCognitiveModeDetection hook
 *
 * Wraps the pure detectCognitiveMode function in a React hook.
 * Re-evaluates every minute so the suggestion stays fresh throughout the day.
 */

import { useState, useEffect } from "react";
import { detectCognitiveMode } from "../detection";
import type { CognitiveModeDetectionResult } from "../types";

const REFRESH_INTERVAL_MS = 60_000; // re-evaluate every minute

/**
 * Returns the auto-detected cognitive mode recommendation.
 * Updates automatically as the hour changes.
 *
 * @param cognitiveLoadPercent - Optional cognitive load (0–100) to override time-based detection
 *
 * @example
 * const { mode, reason, confidence } = useCognitiveModeDetection();
 * // mode: "flow" at 9am, "creative" at 3pm, "recovery" at midnight
 *
 * @example
 * // Pass cognitive load for load-aware detection
 * const { ramUsage } = useCognitiveLoad();
 * const { mode } = useCognitiveModeDetection(ramUsage);
 */
export function useCognitiveModeDetection(
  cognitiveLoadPercent?: number
): CognitiveModeDetectionResult {
  const [result, setResult] = useState<CognitiveModeDetectionResult>(() =>
    detectCognitiveMode({ cognitiveLoadPercent })
  );

  useEffect(() => {
    setResult(detectCognitiveMode({ cognitiveLoadPercent }));

    const timer = setInterval(() => {
      setResult(detectCognitiveMode({ cognitiveLoadPercent }));
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [cognitiveLoadPercent]);

  return result;
}
