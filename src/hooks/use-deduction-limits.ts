import { useMemo } from "react";
import { useTaxDeductionRules } from "./use-tax-deduction-rules";
import { useDonations } from "./use-donations";

export interface DeductionWarning {
  id: string;
  category: string;
  deductionName: string;
  currentAmount: number;
  maxAmount: number | null;
  percentageUsed: number;
  status: "safe" | "approaching" | "at_limit" | "over_limit" | "over_with_proof";
  canBeIncreased: boolean;
  increaseConditions: string[] | null;
  proofRequired: string[] | null;
  hasRequiredProof: boolean;
  message: string;
}

export interface DeductionSummary {
  totalClaimed: number;
  totalLimits: number;
  warnings: DeductionWarning[];
  criticalWarnings: DeductionWarning[];
  proofReminders: DeductionWarning[];
}

// Threshold percentages for warnings
const APPROACHING_THRESHOLD = 0.75; // 75%
const AT_LIMIT_THRESHOLD = 0.95; // 95%

export function useDeductionLimits(taxYear: number = 2024, userAGI: number = 100000) {
  const { data: rules } = useTaxDeductionRules(taxYear);
  const { data: donations } = useDonations(taxYear);

  const summary = useMemo(() => {
    if (!rules) {
      return {
        totalClaimed: 0,
        totalLimits: 0,
        warnings: [],
        criticalWarnings: [],
        proofReminders: [],
      };
    }

    const warnings: DeductionWarning[] = [];

    // Calculate donation totals
    const totalDonations = donations?.reduce((sum, d) => sum + (d.fair_market_value || 0), 0) || 0;
    const cashDonations = donations?.filter(d => d.valuation_method === "cash")?.reduce((sum, d) => sum + (d.fair_market_value || 0), 0) || 0;
    const propertyDonations = totalDonations - cashDonations;

    // Check donation limits (AGI-based)
    const cashDonationLimit = userAGI * 0.60; // 60% of AGI for cash
    const propertyDonationLimit = userAGI * 0.30; // 30% of AGI for property

    // Cash donations check
    if (cashDonations > 0 || cashDonationLimit > 0) {
      const cashPercentage = cashDonationLimit > 0 ? (cashDonations / cashDonationLimit) * 100 : 0;
      const cashStatus = getStatus(cashDonations, cashDonationLimit, false);
      
      if (cashPercentage >= APPROACHING_THRESHOLD * 100) {
        warnings.push({
          id: "cash-donations",
          category: "donations",
          deductionName: "Cash Donations",
          currentAmount: cashDonations,
          maxAmount: cashDonationLimit,
          percentageUsed: cashPercentage,
          status: cashStatus,
          canBeIncreased: true,
          increaseConditions: ["Excess carries forward 5 years"],
          proofRequired: ["Bank statements", "Charity receipts", "Written acknowledgment for $250+"],
          hasRequiredProof: false,
          message: getMessage(cashStatus, "Cash Donations", cashPercentage, true),
        });
      }
    }

    // Property donations check
    if (propertyDonations > 0) {
      const propPercentage = propertyDonationLimit > 0 ? (propertyDonations / propertyDonationLimit) * 100 : 0;
      const propStatus = getStatus(propertyDonations, propertyDonationLimit, false);
      
      if (propPercentage >= APPROACHING_THRESHOLD * 100) {
        warnings.push({
          id: "property-donations",
          category: "donations",
          deductionName: "Property Donations",
          currentAmount: propertyDonations,
          maxAmount: propertyDonationLimit,
          percentageUsed: propPercentage,
          status: propStatus,
          canBeIncreased: true,
          increaseConditions: ["Excess carries forward 5 years", "Can elect reduced deduction for 50% limit"],
          proofRequired: ["Form 8283 for $500+", "Qualified appraisal for $5,000+", "Holding period documentation"],
          hasRequiredProof: false,
          message: getMessage(propStatus, "Property Donations", propPercentage, true),
        });
      }
    }

    // Check Form 8283 requirements
    const donations500Plus = donations?.filter(d => (d.fair_market_value || 0) >= 500) || [];
    const donations5000Plus = donations?.filter(d => (d.fair_market_value || 0) > 5000) || [];
    const missingAppraisals = donations5000Plus.filter(d => !d.appraiser_name);
    const missingAcknowledgments = donations?.filter(d => (d.fair_market_value || 0) >= 250 && !d.acknowledgment_received) || [];

    if (donations500Plus.length > 0) {
      warnings.push({
        id: "form-8283-required",
        category: "donations",
        deductionName: "Form 8283 Required",
        currentAmount: donations500Plus.reduce((sum, d) => sum + (d.fair_market_value || 0), 0),
        maxAmount: null,
        percentageUsed: 100,
        status: "approaching",
        canBeIncreased: false,
        increaseConditions: null,
        proofRequired: ["Completed Form 8283 Section A or B", "Donee acknowledgment"],
        hasRequiredProof: false,
        message: `${donations500Plus.length} donation(s) require Form 8283 filing`,
      });
    }

    if (missingAppraisals.length > 0) {
      warnings.push({
        id: "appraisal-required",
        category: "donations",
        deductionName: "Qualified Appraisal Required",
        currentAmount: missingAppraisals.reduce((sum, d) => sum + (d.fair_market_value || 0), 0),
        maxAmount: null,
        percentageUsed: 100,
        status: "over_limit",
        canBeIncreased: false,
        increaseConditions: null,
        proofRequired: ["Qualified appraisal by certified appraiser", "Appraisal must be within 60 days of donation"],
        hasRequiredProof: false,
        message: `${missingAppraisals.length} donation(s) over $5,000 need qualified appraisal - DEDUCTION AT RISK`,
      });
    }

    if (missingAcknowledgments.length > 0) {
      warnings.push({
        id: "acknowledgment-required",
        category: "donations",
        deductionName: "Written Acknowledgment Required",
        currentAmount: missingAcknowledgments.reduce((sum, d) => sum + (d.fair_market_value || 0), 0),
        maxAmount: null,
        percentageUsed: 100,
        status: "approaching",
        canBeIncreased: false,
        increaseConditions: null,
        proofRequired: ["Written acknowledgment from charity stating no goods/services received"],
        hasRequiredProof: false,
        message: `${missingAcknowledgments.length} donation(s) $250+ missing charity acknowledgment`,
      });
    }

    // Check fixed-amount limits from rules
    rules.forEach(rule => {
      if (rule.max_amount && rule.proof_required && rule.proof_required.length > 0) {
        // This is a rule with both a limit and proof requirements - add as reminder
        warnings.push({
          id: `rule-${rule.id}`,
          category: rule.category,
          deductionName: rule.deduction_name,
          currentAmount: 0, // Would need actual tracking to know
          maxAmount: rule.max_amount,
          percentageUsed: 0,
          status: "safe",
          canBeIncreased: rule.can_be_increased,
          increaseConditions: rule.increase_conditions,
          proofRequired: rule.proof_required,
          hasRequiredProof: false,
          message: `Max: $${rule.max_amount.toLocaleString()}${rule.can_be_increased ? " (can be increased with documentation)" : ""}`,
        });
      }
    });

    const criticalWarnings = warnings.filter(w => 
      w.status === "over_limit" || w.status === "at_limit"
    );

    const proofReminders = warnings.filter(w => 
      w.proofRequired && w.proofRequired.length > 0 && !w.hasRequiredProof
    );

    const totalClaimed = totalDonations; // Add other deduction types as they're tracked
    const totalLimits = cashDonationLimit + propertyDonationLimit;

    return {
      totalClaimed,
      totalLimits,
      warnings: warnings.sort((a, b) => b.percentageUsed - a.percentageUsed),
      criticalWarnings,
      proofReminders,
    };
  }, [rules, donations, userAGI]);

  return summary;
}

function getStatus(
  current: number, 
  max: number | null, 
  hasProof: boolean
): DeductionWarning["status"] {
  if (!max || max === 0) return "safe";
  
  const percentage = current / max;
  
  if (percentage > 1) {
    return hasProof ? "over_with_proof" : "over_limit";
  }
  if (percentage >= AT_LIMIT_THRESHOLD) return "at_limit";
  if (percentage >= APPROACHING_THRESHOLD) return "approaching";
  return "safe";
}

function getMessage(
  status: DeductionWarning["status"],
  name: string,
  percentage: number,
  canCarryForward: boolean
): string {
  switch (status) {
    case "over_limit":
      return `${name} exceeds limit! ${canCarryForward ? "Excess will carry forward to next year." : "Deduction may be disallowed."}`;
    case "over_with_proof":
      return `${name} exceeds standard limit but you have documentation for increased limit.`;
    case "at_limit":
      return `${name} at ${percentage.toFixed(0)}% of limit. Review before adding more.`;
    case "approaching":
      return `${name} at ${percentage.toFixed(0)}% of limit. Plan remaining deductions carefully.`;
    default:
      return `${name} within limits.`;
  }
}

// Get status color for UI
export function getStatusColor(status: DeductionWarning["status"]): string {
  switch (status) {
    case "over_limit":
      return "text-destructive";
    case "over_with_proof":
      return "text-amber-600";
    case "at_limit":
      return "text-amber-500";
    case "approaching":
      return "text-yellow-600";
    default:
      return "text-muted-foreground";
  }
}

export function getStatusBadgeVariant(status: DeductionWarning["status"]): "destructive" | "outline" | "secondary" | "default" {
  switch (status) {
    case "over_limit":
      return "destructive";
    case "over_with_proof":
    case "at_limit":
      return "outline";
    case "approaching":
      return "secondary";
    default:
      return "default";
  }
}
