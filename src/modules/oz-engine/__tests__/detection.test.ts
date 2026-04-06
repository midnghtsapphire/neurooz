/**
 * Oz Engine™ — Cognitive Mode Detection Tests
 * Sprint 1 / S1-009: Vitest unit tests for mode detection
 *
 * Coverage targets:
 *   - All 7 time windows
 *   - Cognitive load override (high)
 *   - Cognitive load override (low)
 *   - Combined inputs
 *   - CSS data-mode attribute mapping
 *   - Default (no input) invocation
 */

import { describe, it, expect } from "vitest";
import { detectCognitiveMode, getCognitiveModeDataAttr } from "../detection";
import type { CognitiveMode } from "../types";

describe("detectCognitiveMode — time-of-day rules", () => {
  it("returns 'power' for early morning hours (05:00–08:59)", () => {
    for (const hour of [5, 6, 7, 8]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("power");
      expect(result.reason).toBe("time_early_morning_focus");
      expect(result.confidence).toBeGreaterThan(0.5);
    }
  });

  it("returns 'flow' for morning peak hours (09:00–11:59)", () => {
    for (const hour of [9, 10, 11]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("flow");
      expect(result.reason).toBe("time_morning_peak");
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    }
  });

  it("returns 'recovery' for midday rest hours (12:00–13:59)", () => {
    for (const hour of [12, 13]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("recovery");
      expect(result.reason).toBe("time_midday_rest");
    }
  });

  it("returns 'creative' for afternoon hours (14:00–17:59)", () => {
    for (const hour of [14, 15, 16, 17]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("creative");
      expect(result.reason).toBe("time_afternoon_creative");
    }
  });

  it("returns 'power' for evening hours (18:00–21:59)", () => {
    for (const hour of [18, 19, 20, 21]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("power");
      expect(result.reason).toBe("time_evening_executive");
    }
  });

  it("returns 'recovery' for late night hours (22:00–23:59)", () => {
    for (const hour of [22, 23]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("recovery");
      expect(result.reason).toBe("time_late_night_recovery");
    }
  });

  it("returns 'recovery' for early morning hours (00:00–04:59)", () => {
    for (const hour of [0, 1, 2, 3, 4]) {
      const result = detectCognitiveMode({ hourOfDay: hour });
      expect(result.mode, `hour ${hour}`).toBe("recovery");
      expect(result.reason).toBe("time_late_night_recovery");
    }
  });
});

describe("detectCognitiveMode — cognitive load overrides", () => {
  it("overrides time-based mode when cognitive load is very high (>= 85)", () => {
    // Even at 9am peak focus, high load → recovery
    const result = detectCognitiveMode({
      hourOfDay: 10,
      cognitiveLoadPercent: 90,
    });
    expect(result.mode).toBe("recovery");
    expect(result.reason).toBe("high_cognitive_load");
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("overrides time-based mode when cognitive load is very low (<= 15)", () => {
    // At midnight (recovery time), very low load → power
    const result = detectCognitiveMode({
      hourOfDay: 0,
      cognitiveLoadPercent: 5,
    });
    expect(result.mode).toBe("power");
    expect(result.reason).toBe("low_cognitive_load");
  });

  it("does NOT override at moderate load (16–84)", () => {
    const result = detectCognitiveMode({
      hourOfDay: 10,
      cognitiveLoadPercent: 50,
    });
    expect(result.mode).toBe("flow"); // time-based wins
  });

  it("applies override exactly at threshold 85", () => {
    const result = detectCognitiveMode({
      hourOfDay: 10,
      cognitiveLoadPercent: 85,
    });
    expect(result.mode).toBe("recovery");
  });

  it("does NOT override at load 84", () => {
    const result = detectCognitiveMode({
      hourOfDay: 10,
      cognitiveLoadPercent: 84,
    });
    expect(result.mode).toBe("flow");
  });

  it("applies low-load override exactly at threshold 15", () => {
    const result = detectCognitiveMode({
      hourOfDay: 23,
      cognitiveLoadPercent: 15,
    });
    expect(result.mode).toBe("power");
  });

  it("does NOT apply low-load override at 16", () => {
    const result = detectCognitiveMode({
      hourOfDay: 23,
      cognitiveLoadPercent: 16,
    });
    expect(result.mode).toBe("recovery"); // time-based wins
  });
});

describe("detectCognitiveMode — default invocation", () => {
  it("returns a valid CognitiveMode when called with no arguments", () => {
    const validModes: CognitiveMode[] = ["flow", "power", "recovery", "creative"];
    const result = detectCognitiveMode();
    expect(validModes).toContain(result.mode);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});

describe("getCognitiveModeDataAttr", () => {
  it("maps 'flow' to 'focus'", () => {
    expect(getCognitiveModeDataAttr("flow")).toBe("focus");
  });

  it("maps 'power' to 'executive'", () => {
    expect(getCognitiveModeDataAttr("power")).toBe("executive");
  });

  it("maps 'recovery' to 'rest'", () => {
    expect(getCognitiveModeDataAttr("recovery")).toBe("rest");
  });

  it("maps 'creative' to 'creative'", () => {
    expect(getCognitiveModeDataAttr("creative")).toBe("creative");
  });
});
