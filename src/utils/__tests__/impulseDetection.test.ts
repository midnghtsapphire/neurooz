import { describe, it, expect } from "vitest";
import {
  calculateImpulseScore,
  analyzeImpulsePurchase,
  calculateTimeSinceMedication,
  isWithinMedicationWindow,
  calculateVelocityScore,
  getCharacterMessage,
  formatHoldDuration,
  calculateRemainingHoldTime,
  type TransactionData,
} from "../impulseDetection";

function tx(partial: Partial<TransactionData> = {}): TransactionData {
  return {
    amount: 50,
    category: "groceries",
    merchantName: "Local Market",
    timeOfDay: new Date("2026-08-08T10:00:00"), // Friday morning
    userId: "user-1",
    ...partial,
  };
}

describe("calculateImpulseScore", () => {
  it("returns a low score for a small daytime grocery purchase", () => {
    const score = calculateImpulseScore(tx());
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThan(0.3);
  });

  it("adds risk for high amounts and high-risk categories", () => {
    const score = calculateImpulseScore(
      tx({
        amount: 1200,
        category: "electronics",
        timeOfDay: new Date("2026-08-08T23:30:00"), // late night
      })
    );
    // 0.2+0.2+0.1 amount + 0.2 category + 0.15 late night = 0.85
    expect(score).toBeGreaterThanOrEqual(0.8);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("never exceeds 1.0 even when every risk factor fires", () => {
    const score = calculateImpulseScore(
      tx({
        amount: 5000,
        category: "shopping electronics gadgets",
        timeOfDay: new Date("2026-08-09T02:00:00"), // late night Sunday
      })
    );
    // amount tiers 0.5 + category 0.2 + late night 0.15 + weekend 0.05 = 0.9
    expect(score).toBeLessThanOrEqual(1);
    expect(score).toBeGreaterThanOrEqual(0.9);
  });

  it("adds a small lunch-break bump", () => {
    const baseline = calculateImpulseScore(tx({ timeOfDay: new Date("2026-08-08T10:00:00") }));
    const lunch = calculateImpulseScore(tx({ timeOfDay: new Date("2026-08-08T12:30:00") }));
    expect(lunch).toBeGreaterThan(baseline);
  });
});

describe("analyzeImpulsePurchase", () => {
  it("flags high-confidence impulses with bad_witch warning", () => {
    const analysis = analyzeImpulsePurchase(
      tx({
        amount: 1200,
        category: "electronics",
        timeOfDay: new Date("2026-08-08T23:00:00"),
      }),
      false,
      0.7
    );
    expect(analysis.isImpulse).toBe(true);
    expect(analysis.confidenceScore).toBeGreaterThanOrEqual(0.8);
    expect(analysis.characterWarning).toBe("bad_witch");
    expect(analysis.riskFactors.length).toBeGreaterThan(0);
    expect(analysis.recommendation.toLowerCase()).toContain("pause");
  });

  it("returns a thoughtful recommendation below threshold", () => {
    const analysis = analyzeImpulsePurchase(tx({ amount: 20, category: "groceries" }), true, 0.7);
    expect(analysis.isImpulse).toBe(false);
    expect(analysis.characterWarning).toBe("none");
    expect(analysis.recommendation.toLowerCase()).toContain("thoughtful");
  });

  it("records missing medication as a risk factor", () => {
    const analysis = analyzeImpulsePurchase(tx(), false, 0.99);
    expect(analysis.riskFactors.some((f) => f.toLowerCase().includes("medication"))).toBe(true);
  });
});

describe("medication window helpers", () => {
  it("returns null minutes when no medication time is logged", () => {
    expect(calculateTimeSinceMedication(null)).toBeNull();
    expect(isWithinMedicationWindow(null)).toBe(false);
  });

  it("detects being inside the optimal window", () => {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    expect(calculateTimeSinceMedication(thirtyMinsAgo)).toBeGreaterThanOrEqual(29);
    expect(isWithinMedicationWindow(thirtyMinsAgo, 4)).toBe(true);
  });

  it("detects being outside the optimal window", () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    expect(isWithinMedicationWindow(sixHoursAgo, 4)).toBe(false);
  });
});

describe("calculateVelocityScore", () => {
  it("returns 0 for an empty list", () => {
    expect(calculateVelocityScore([])).toBe(0);
  });

  it("normalizes rapid purchases toward 1.0", () => {
    const now = Date.now();
    const recent = Array.from({ length: 5 }, (_, i) =>
      tx({ timeOfDay: new Date(now - i * 60 * 1000) })
    );
    expect(calculateVelocityScore(recent, 60)).toBe(1);
  });
});

describe("getCharacterMessage", () => {
  it("maps bad_witch / scarecrow / none to distinct characters", () => {
    const base = {
      isImpulse: true,
      confidenceScore: 0.9,
      riskFactors: [],
      recommendation: "pause",
      characterWarning: "bad_witch" as const,
    };
    expect(getCharacterMessage(base).character).toBe("Bad Witch");
    expect(getCharacterMessage({ ...base, characterWarning: "scarecrow" }).character).toBe(
      "Scarecrow"
    );
    expect(getCharacterMessage({ ...base, characterWarning: "none", isImpulse: false }).character).toBe(
      "Glinda"
    );
  });
});

describe("hold helpers", () => {
  it("formats hold durations for minutes, hours, and the 24h special case", () => {
    expect(formatHoldDuration(0.5)).toMatch(/minute/);
    expect(formatHoldDuration(2)).toBe("2 hours");
    expect(formatHoldDuration(24)).toBe("24 hours (1 day)");
  });

  it("reports remaining hold time and expiry", () => {
    const future = new Date(Date.now() + 90 * 60 * 1000);
    const remaining = calculateRemainingHoldTime(future);
    expect(remaining.isExpired).toBe(false);
    expect(remaining.hours).toBe(1);
    expect(remaining.minutes).toBeGreaterThanOrEqual(29);

    const past = new Date(Date.now() - 1000);
    expect(calculateRemainingHoldTime(past).isExpired).toBe(true);
  });
});
