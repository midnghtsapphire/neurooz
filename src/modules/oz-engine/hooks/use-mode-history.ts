/**
 * Oz Engine™ — Mode History Hook
 * Tracks cognitive mode changes over time using localStorage.
 * Drives the Cognitive Growth Dashboard (S1-005).
 *
 * Storage format: array of { mode, startedAt, endedAt? } entries.
 * Capped at HISTORY_LIMIT entries to prevent unbounded storage growth.
 */

import { useState, useCallback, useEffect } from "react";
import type { CognitiveMode } from "../types";

export interface ModeHistoryEntry {
  mode: CognitiveMode;
  /** ISO timestamp when this mode started */
  startedAt: string;
  /** ISO timestamp when this mode ended (null if still active) */
  endedAt: string | null;
}

/** Summary aggregated per mode */
export interface ModeTimeSummary {
  mode: CognitiveMode;
  /** Total minutes in this mode across all recorded history */
  totalMinutes: number;
  /** Number of times this mode was active */
  sessionCount: number;
  /** Percentage of total tracked time */
  percentOfTime: number;
}

const STORAGE_KEY = "oz-mode-history";
const HISTORY_LIMIT = 200;

function loadHistory(): ModeHistoryEntry[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ModeHistoryEntry[];
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveHistory(history: ModeHistoryEntry[]): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore quota errors
  }
}

/**
 * Pure helper — does NOT use React state, safe for unit tests.
 */
export function computeModeTimeSummary(
  history: ModeHistoryEntry[]
): ModeTimeSummary[] {
  const now = new Date().toISOString();
  const modeMap: Record<CognitiveMode, { totalMs: number; count: number }> = {
    flow: { totalMs: 0, count: 0 },
    power: { totalMs: 0, count: 0 },
    recovery: { totalMs: 0, count: 0 },
    creative: { totalMs: 0, count: 0 },
  };

  let totalMs = 0;

  for (const entry of history) {
    const startMs = new Date(entry.startedAt).getTime();
    const endMs = new Date(entry.endedAt ?? now).getTime();
    const durationMs = Math.max(0, endMs - startMs);

    modeMap[entry.mode].totalMs += durationMs;
    modeMap[entry.mode].count += 1;
    totalMs += durationMs;
  }

  return (Object.keys(modeMap) as CognitiveMode[]).map((mode) => ({
    mode,
    totalMinutes: Math.round(modeMap[mode].totalMs / 60_000),
    sessionCount: modeMap[mode].count,
    percentOfTime:
      totalMs > 0
        ? Math.round((modeMap[mode].totalMs / totalMs) * 100)
        : 0,
  }));
}

/**
 * Hook that records mode transitions and surfaces history + summary.
 *
 * @param currentMode — the currently active CognitiveMode
 */
export function useModeHistory(currentMode: CognitiveMode) {
  const [history, setHistory] = useState<ModeHistoryEntry[]>(loadHistory);

  // When currentMode changes, close the previous entry and open a new one
  useEffect(() => {
    setHistory((prev) => {
      const now = new Date().toISOString();

      // Close any open entry
      const closed = prev.map((entry) =>
        entry.endedAt === null ? { ...entry, endedAt: now } : entry
      );

      // Only append if mode actually changed from last recorded mode
      const lastClosed = closed[closed.length - 1];
      if (lastClosed && lastClosed.mode === currentMode) {
        // Same mode — just reopen it
        const updated = [...closed.slice(0, -1), { ...lastClosed, endedAt: null }];
        const trimmed = updated.slice(-HISTORY_LIMIT);
        saveHistory(trimmed);
        return trimmed;
      }

      const newEntry: ModeHistoryEntry = {
        mode: currentMode,
        startedAt: now,
        endedAt: null,
      };

      const updated = [...closed, newEntry].slice(-HISTORY_LIMIT);
      saveHistory(updated);
      return updated;
    });
  }, [currentMode]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistory([]);
  }, []);

  const summary = computeModeTimeSummary(history);

  return { history, summary, clearHistory };
}
