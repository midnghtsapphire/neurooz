/**
 * Oz Engine™ — Mode History Tests
 * Sprint 1 / S1-005: Tests for computeModeTimeSummary and useModeHistory
 */

import { describe, it, expect } from "vitest";
import { computeModeTimeSummary } from "../hooks/use-mode-history";
import type { ModeHistoryEntry } from "../hooks/use-mode-history";

function makeEntry(
  mode: "flow" | "power" | "recovery" | "creative",
  startMinsAgo: number,
  endMinsAgo: number | null
): ModeHistoryEntry {
  const now = Date.now();
  return {
    mode,
    startedAt: new Date(now - startMinsAgo * 60_000).toISOString(),
    endedAt:
      endMinsAgo === null
        ? null
        : new Date(now - endMinsAgo * 60_000).toISOString(),
  };
}

describe("computeModeTimeSummary", () => {
  it("returns zero totals for empty history", () => {
    const summary = computeModeTimeSummary([]);
    expect(summary).toHaveLength(4); // one entry per mode
    summary.forEach((s) => {
      expect(s.totalMinutes).toBe(0);
      expect(s.sessionCount).toBe(0);
      expect(s.percentOfTime).toBe(0);
    });
  });

  it("counts a single closed flow session", () => {
    const history: ModeHistoryEntry[] = [makeEntry("flow", 60, 0)];
    const summary = computeModeTimeSummary(history);
    const flow = summary.find((s) => s.mode === "flow")!;
    expect(flow.totalMinutes).toBe(60);
    expect(flow.sessionCount).toBe(1);
    expect(flow.percentOfTime).toBe(100);
  });

  it("handles an open (still-active) entry using current time", () => {
    // Started 30 minutes ago, still active
    const history: ModeHistoryEntry[] = [makeEntry("creative", 30, null)];
    const summary = computeModeTimeSummary(history);
    const creative = summary.find((s) => s.mode === "creative")!;
    // Should be approximately 30 minutes (allow 1 min tolerance for test timing)
    expect(creative.totalMinutes).toBeGreaterThanOrEqual(29);
    expect(creative.totalMinutes).toBeLessThanOrEqual(31);
    expect(creative.sessionCount).toBe(1);
    expect(creative.percentOfTime).toBe(100);
  });

  it("correctly splits time across two modes", () => {
    const history: ModeHistoryEntry[] = [
      makeEntry("flow", 120, 60),   // 60 min of flow
      makeEntry("power", 60, 0),    // 60 min of power
    ];
    const summary = computeModeTimeSummary(history);
    const flow = summary.find((s) => s.mode === "flow")!;
    const power = summary.find((s) => s.mode === "power")!;
    expect(flow.totalMinutes).toBe(60);
    expect(power.totalMinutes).toBe(60);
    expect(flow.percentOfTime).toBe(50);
    expect(power.percentOfTime).toBe(50);
  });

  it("aggregates multiple sessions of the same mode", () => {
    const history: ModeHistoryEntry[] = [
      makeEntry("recovery", 180, 150), // 30 min
      makeEntry("recovery", 120, 60),  // 60 min
    ];
    const summary = computeModeTimeSummary(history);
    const rec = summary.find((s) => s.mode === "recovery")!;
    expect(rec.totalMinutes).toBe(90);
    expect(rec.sessionCount).toBe(2);
  });

  it("ignores zero-duration entries", () => {
    const now = new Date().toISOString();
    const zeroEntry: ModeHistoryEntry = {
      mode: "flow",
      startedAt: now,
      endedAt: now,
    };
    const summary = computeModeTimeSummary([zeroEntry]);
    const flow = summary.find((s) => s.mode === "flow")!;
    expect(flow.totalMinutes).toBe(0);
    expect(flow.percentOfTime).toBe(0);
  });

  it("returns all 4 cognitive modes in result", () => {
    const summary = computeModeTimeSummary([makeEntry("flow", 60, 0)]);
    const modes = summary.map((s) => s.mode).sort();
    expect(modes).toEqual(["creative", "flow", "power", "recovery"]);
  });

  it("percentages sum to 100 for multi-mode history", () => {
    const history: ModeHistoryEntry[] = [
      makeEntry("flow", 240, 180),     // 60 min
      makeEntry("creative", 180, 120), // 60 min
      makeEntry("power", 120, 60),     // 60 min
      makeEntry("recovery", 60, 0),    // 60 min
    ];
    const summary = computeModeTimeSummary(history);
    const total = summary.reduce((s, m) => s + m.percentOfTime, 0);
    // Due to rounding, allow ±2
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });
});
