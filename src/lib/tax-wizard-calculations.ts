// TaxWizard Pro - Auto-Calculation Functions
import { TAX_CONSTANTS_2026 } from './tax-wizard-forms';

export interface TaxWizardData {
  [fieldId: string]: string | number | undefined;
}

// Calculate taxable portion of Social Security (0-85%)
export function calculateTaxableSS(data: TaxWizardData): number {
  const ssBenefits = Number(data.line_6a_ss_benefits) || 0;
  const agi = Number(data.line_11_agi) || 0;
  const filingStatus = data.filing_status as string || 'single';
  
  if (ssBenefits === 0) return 0;
  
  // Combined income = AGI + nontaxable interest + half of SS
  const halfSS = ssBenefits / 2;
  const nontaxableInterest = 0; // Could add this field
  const combinedIncome = agi + nontaxableInterest + halfSS;
  
  const threshold1 = filingStatus === 'married_filing_jointly' ? 32000 : 25000;
  const threshold2 = filingStatus === 'married_filing_jointly' ? 44000 : 34000;
  
  if (combinedIncome <= threshold1) {
    return 0;
  } else if (combinedIncome <= threshold2) {
    // 50% of excess over threshold1, up to 50% of benefits
    const taxable = Math.min(
      (combinedIncome - threshold1) * 0.5,
      ssBenefits * 0.5
    );
    return Math.round(taxable * 100) / 100;
  } else {
    // Up to 85% taxable
    const base = Math.min((threshold2 - threshold1) * 0.5, ssBenefits * 0.5);
    const additional = (combinedIncome - threshold2) * 0.85;
    const taxable = Math.min(base + additional, ssBenefits * 0.85);
    return Math.round(taxable * 100) / 100;
  }
}

// Calculate AGI
export function calculateAGI(data: TaxWizardData): number {
  const wages = Number(data.line_1_wages) || 0;
  const interest = Number(data.line_2b_taxable_interest) || 0;
  const dividends = Number(data.line_3b_dividends) || 0;
  const ira = Number(data.line_4b_ira_taxable) || 0;
  const pensions = Number(data.line_5b_pensions_taxable) || 0;
  const ssTaxable = Number(data.line_6b_ss_taxable) || 0;
  const capitalGains = Number(data.line_7_capital_gains) || 0;
  const otherIncome = Number(data.line_8_other_income) || 0;
  const scheduleEIncome = Number(data.schedule_e_total) || 0;
  
  // Adjustments (simplified - could add more)
  const halfSETax = Number(data.line_13_deductible_se) || 0;
  
  return wages + interest + dividends + ira + pensions + ssTaxable + 
         capitalGains + otherIncome + scheduleEIncome - halfSETax;
}

// Calculate QBI deduction (20% of qualifying business income)
export function calculateQBI(data: TaxWizardData): number {
  const qbi = Number(data.line_17_v_qbi) || 0;
  const taxableIncome = Number(data.line_15_taxable_income) || 0;
  const filingStatus = data.filing_status as string || 'single';
  
  if (qbi <= 0) return 0;
  
  const threshold = filingStatus === 'married_filing_jointly' 
    ? TAX_CONSTANTS_2026.qbiThresholdMFJ 
    : TAX_CONSTANTS_2026.qbiThresholdSingle;
  
  const phaseOutRange = filingStatus === 'married_filing_jointly' ? 100000 : 50000;
  
  // Full deduction if below threshold
  if (taxableIncome <= threshold) {
    return Math.round(qbi * TAX_CONSTANTS_2026.qbiDeductionRate * 100) / 100;
  }
  
  // Phase-out calculation
  const excessIncome = taxableIncome - threshold;
  if (excessIncome >= phaseOutRange) {
    return 0; // Fully phased out
  }
  
  const phaseOutPercent = excessIncome / phaseOutRange;
  const reducedRate = TAX_CONSTANTS_2026.qbiDeductionRate * (1 - phaseOutPercent);
  
  return Math.round(qbi * reducedRate * 100) / 100;
}

// Calculate taxable income
export function calculateTaxableIncome(data: TaxWizardData): number {
  const agi = Number(data.line_11_agi) || calculateAGI(data);
  const standardDeduction = Number(data.line_12_standard_deduction) || TAX_CONSTANTS_2026.standardDeductionSingle;
  const qbiDeduction = Number(data.line_14_qbi_deduction) || 0;
  
  return Math.max(0, agi - standardDeduction - qbiDeduction);
}

// Calculate federal income tax from brackets (2026 projected)
export function calculateTax(data: TaxWizardData): number {
  const taxableIncome = Number(data.line_15_taxable_income) || calculateTaxableIncome(data);
  const filingStatus = data.filing_status as string || 'single';
  
  // 2026 tax brackets (projected, indexed for inflation)
  const brackets = filingStatus === 'married_filing_jointly' ? [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ] : [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ];
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return Math.round(tax * 100) / 100;
}

// Calculate total tax (including SE tax)
export function calculateTotalTax(data: TaxWizardData): number {
  const incomeTax = Number(data.line_16_tax) || calculateTax(data);
  const seTax = Number(data.line_12_se_tax) || 0;
  
  return incomeTax + seTax;
}

// Calculate refund or amount owed
export function calculateRefundOwed(data: TaxWizardData): number {
  const totalTax = Number(data.line_24_total_tax) || calculateTotalTax(data);
  const withheld = Number(data.line_25_withheld) || 0;
  
  return withheld - totalTax; // Positive = refund, Negative = owed
}

// Calculate gross profit for Form 1065
export function calculateGrossProfit(data: TaxWizardData): number {
  const grossReceipts = Number(data.line_1a_gross_receipts) || 0;
  const cogs = Number(data.line_2_cost_of_goods) || 0;
  
  return grossReceipts - cogs;
}

// Calculate ordinary income for Form 1065
export function calculateOrdinaryIncome(data: TaxWizardData): number {
  const grossProfit = Number(data.line_3_gross_profit) || calculateGrossProfit(data);
  const otherIncome = Number(data.line_4_ordinary_income) || 0;
  
  // Deductions
  const salaries = Number(data.line_9_salaries) || 0;
  const guaranteed = Number(data.line_10_guaranteed_payments) || 0;
  const repairs = Number(data.line_12_repairs) || 0;
  const badDebts = Number(data.line_13_bad_debts) || 0;
  const rent = Number(data.line_14_rent) || 0;
  const taxes = Number(data.line_15_taxes) || 0;
  const depreciation = Number(data.line_16a_depreciation) || 0;
  const benefits = Number(data.line_18_employee_benefits) || 0;
  const other = Number(data.line_20_other_deductions) || 0;
  
  const totalDeductions = salaries + guaranteed + repairs + badDebts + 
                          rent + taxes + depreciation + benefits + other;
  
  return grossProfit + otherIncome - totalDeductions;
}

// Calculate Section 179 deduction
export function calculateSection179(data: TaxWizardData): number {
  const totalCost = Number(data.line_2_total_cost) || 0;
  const maxDeduction = TAX_CONSTANTS_2026.section179Limit;
  const threshold = TAX_CONSTANTS_2026.section179PhaseOut;
  
  if (totalCost <= 0) return 0;
  
  // Phase-out: reduce dollar-for-dollar above threshold
  const phaseOutReduction = Math.max(0, totalCost - threshold);
  const tentative = Math.min(totalCost, maxDeduction) - phaseOutReduction;
  
  return Math.max(0, tentative);
}

// Calculate Schedule E total
export function calculateScheduleETotal(data: TaxWizardData): number {
  const passiveIncome = Number(data.line_28_passive_income) || 0;
  const nonpassiveIncome = Number(data.line_28_nonpassive_income) || 0;
  const rentalIncome = Number(data.line_28_rental) || 0;
  
  return passiveIncome + nonpassiveIncome + rentalIncome;
}

// Calculate SE tax base (92.35% of net profit)
export function calculateSEBase(data: TaxWizardData): number {
  const netProfit = Number(data.line_3_combined_profit) || Number(data.line_2_se_profit) || 0;
  return Math.round(netProfit * 0.9235 * 100) / 100;
}

// Calculate self-employment tax
export function calculateSETax(data: TaxWizardData): number {
  const seBase = Number(data.line_4_se_earnings) || calculateSEBase(data);
  
  if (seBase < 400) return 0;
  
  // Social Security portion (12.4%) caps at wage base
  const ssTaxable = Math.min(seBase, TAX_CONSTANTS_2026.socialSecurityWageBase);
  const ssTax = ssTaxable * 0.124;
  
  // Medicare portion (2.9%) - no cap
  const medicareTax = seBase * 0.029;
  
  // Additional Medicare (0.9%) above threshold
  const additionalMedicareThreshold = 200000; // Single
  const additionalMedicare = seBase > additionalMedicareThreshold 
    ? (seBase - additionalMedicareThreshold) * 0.009 
    : 0;
  
  return Math.round((ssTax + medicareTax + additionalMedicare) * 100) / 100;
}

// Calculate deductible portion of SE tax (half)
export function calculateDeductibleSE(data: TaxWizardData): number {
  const seTax = Number(data.line_12_se_tax) || calculateSETax(data);
  return Math.round(seTax * 0.5 * 100) / 100;
}

// Combined SE profit calculation
export function calculateCombinedSE(data: TaxWizardData): number {
  const seProfit = Number(data.line_2_se_profit) || 0;
  // Could add Schedule C profit here
  return seProfit;
}

// SSDI Safeguard: Check if any entries suggest active involvement
export interface SSDISafeguardResult {
  isAtRisk: boolean;
  warnings: string[];
  riskLevel: 'none' | 'low' | 'medium' | 'high';
}

export function checkSSDISafeguards(data: TaxWizardData, isPassiveOwner: boolean): SSDISafeguardResult {
  const warnings: string[] = [];
  
  if (!isPassiveOwner) {
    return { isAtRisk: false, warnings: [], riskLevel: 'none' };
  }
  
  // Check for wages that might exceed SGA
  const monthlyWages = (Number(data.line_1_wages) || 0) / 12;
  if (monthlyWages > TAX_CONSTANTS_2026.sgaMonthlyLimit) {
    warnings.push(`⚠️ Monthly wages ($${monthlyWages.toFixed(0)}) exceed SGA limit ($${TAX_CONSTANTS_2026.sgaMonthlyLimit}). This may affect your SSDI benefits.`);
  }
  
  // Check for guaranteed payments for services
  if (Number(data.line_4a_guaranteed_services) > 0) {
    warnings.push(`🚨 You have guaranteed payments for SERVICES ($${data.line_4a_guaranteed_services}). This indicates active work and likely counts toward SGA!`);
  }
  
  // Check for nonpassive income on Schedule E
  if (Number(data.line_28_nonpassive_income) > 0) {
    warnings.push(`🚨 You have NONPASSIVE income on Schedule E ($${data.line_28_nonpassive_income}). This indicates material participation!`);
  }
  
  // Check for SE earnings (should be $0 for passive)
  if (Number(data.line_14_se_earnings) > 0) {
    warnings.push(`🚨 You have self-employment earnings ($${data.line_14_se_earnings}). As a passive owner, this should be $0.`);
  }
  
  // Check if marked as active partner
  if (data.is_passive === 'no') {
    warnings.push(`🚨 You're marked as an ACTIVE partner. SSDI recipients should maintain PASSIVE status.`);
  }
  
  // Determine risk level
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (warnings.some(w => w.includes('🚨'))) {
    riskLevel = 'high';
  } else if (warnings.some(w => w.includes('⚠️'))) {
    riskLevel = 'medium';
  } else if (warnings.length > 0) {
    riskLevel = 'low';
  }
  
  return {
    isAtRisk: warnings.length > 0,
    warnings,
    riskLevel,
  };
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Get calculation function by name
export function getCalculationFn(name: string): ((data: TaxWizardData) => number) | undefined {
  const fns: Record<string, (data: TaxWizardData) => number> = {
    calculateTaxableSS,
    calculateAGI,
    calculateQBI,
    calculateTaxableIncome,
    calculateTax,
    calculateTotalTax,
    calculateRefundOwed,
    calculateGrossProfit,
    calculateOrdinaryIncome,
    calculateSection179,
    calculateScheduleETotal,
    calculateSEBase,
    calculateSETax,
    calculateDeductibleSE,
    calculateCombinedSE,
  };
  
  return fns[name];
}
