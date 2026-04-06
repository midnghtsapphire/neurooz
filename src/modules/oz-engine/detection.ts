/**
 * Oz Engine™ — Rule-Based Cognitive Mode Detection
 *
 * Pure functions for detecting the optimal cognitive mode.
 * No side effects, no hooks — safe to import in tests and server contexts.
 *
 * Detection axes:
 *   1. Time-of-day (primary signal)
 *   2. Cognitive load percentage (override signal)
 *
 * Time windows are based on typical ADHD neurobiology:
 *   - 05:00–08:59  Early morning — light executive warm-up → "power"
 *   - 09:00–11:59  Morning peak — best focus window → "flow"
 *   - 12:00–13:59  Post-lunch dip — recovery mode → "recovery"
 *   - 14:00–17:59  Afternoon energy — creative/lateral work → "creative"
 *   - 18:00–21:59  Evening wrap-up — structured review → "power"
 *   - 22:00–04:59  Late night / early hours — forced recovery → "recovery"
 *
 * References:
 *   - Urban Oz Theme Spec (docs/design/NEUROOZ_URBAN_OZ_THEME_SPEC.md)
 *   - NEUROOZ_SCRUM_BACKLOG S1-003 ticket
 */

import type {
  CognitiveMode,
  CognitiveModeDetectionInput,
  CognitiveModeDetectionResult,
  DetectionReason,
} from "./types";

/** Boundaries are [start, end) — end is exclusive. */
interface TimeWindow {
  start: number; // 0–23
  end: number;   // 1–24 (24 means midnight boundary wraps)
  mode: CognitiveMode;
  reason: DetectionReason;
  confidence: number;
}

const TIME_WINDOWS: TimeWindow[] = [
  { start: 5,  end: 9,  mode: "power",    reason: "time_early_morning_focus",   confidence: 0.75 },
  { start: 9,  end: 12, mode: "flow",     reason: "time_morning_peak",           confidence: 0.90 },
  { start: 12, end: 14, mode: "recovery", reason: "time_midday_rest",            confidence: 0.80 },
  { start: 14, end: 18, mode: "creative", reason: "time_afternoon_creative",     confidence: 0.80 },
  { start: 18, end: 22, mode: "power",    reason: "time_evening_executive",      confidence: 0.70 },
  // Late night / early morning (wraps midnight)
  { start: 22, end: 24, mode: "recovery", reason: "time_late_night_recovery",    confidence: 0.85 },
  { start: 0,  end: 5,  mode: "recovery", reason: "time_late_night_recovery",    confidence: 0.85 },
];

/**
 * Detect the recommended cognitive mode based on time-of-day and optionally
 * the current cognitive load.
 *
 * @param input - Detection inputs (all optional — defaults to current time)
 * @returns DetectionResult with mode, reason, and confidence
 *
 * @example
 * // Simple usage — uses current system time
 * const result = detectCognitiveMode();
 *
 * @example
 * // Override hour for testing
 * const result = detectCognitiveMode({ hourOfDay: 10 }); // { mode: "flow", ... }
 */
export function detectCognitiveMode(
  input: CognitiveModeDetectionInput = {}
): CognitiveModeDetectionResult {
  const hour =
    input.hourOfDay !== undefined
      ? input.hourOfDay
      : new Date().getHours();

  // Cognitive load override — if very high load, nudge toward recovery
  if (
    input.cognitiveLoadPercent !== undefined &&
    input.cognitiveLoadPercent >= 85
  ) {
    return {
      mode: "recovery",
      reason: "high_cognitive_load",
      confidence: 0.95,
    };
  }

  // Low load override — enable power/planning mode when brain is free
  if (
    input.cognitiveLoadPercent !== undefined &&
    input.cognitiveLoadPercent <= 15
  ) {
    return {
      mode: "power",
      reason: "low_cognitive_load",
      confidence: 0.70,
    };
  }

  const window = TIME_WINDOWS.find(
    (w) => hour >= w.start && hour < w.end
  );

  if (window) {
    return {
      mode: window.mode,
      reason: window.reason,
      confidence: window.confidence,
    };
  }

  // Fallback — should never reach here given exhaustive windows, but be safe
  return {
    mode: "flow",
    reason: "time_morning_peak",
    confidence: 0.5,
  };
}

/**
 * Get the CSS `data-mode` attribute value for a given CognitiveMode.
 * Maps internal mode keys to the theme spec's `[data-mode="..."]` selectors.
 *
 * Urban Oz Theme Spec CSS classes:
 *   - flow      → "focus"
 *   - power     → "executive"
 *   - recovery  → "rest"
 *   - creative  → "creative"
 */
export function getCognitiveModeDataAttr(mode: CognitiveMode): string {
  const map: Record<CognitiveMode, string> = {
    flow: "focus",
    power: "executive",
    recovery: "rest",
    creative: "creative",
  };
  return map[mode];
}
