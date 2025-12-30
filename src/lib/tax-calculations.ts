/**
 * Tax Calculation Utilities
 * Based on Amazon Vine 50/20/0 method and IRS guidelines
 */

// Current tax year rates
export const TAX_RATES = {
  year: 2024,
  selfEmploymentTax: 0.153, // 15.3% (12.4% Social Security + 2.9% Medicare)
  socialSecurityRate: 0.124,
  medicareRate: 0.029,
  qbiDeduction: 0.20, // 20% QBI deduction
  mileageRate: 0.67, // $0.67/mile for 2024, $0.70 for 2025
  mileageRate2025: 0.70,
  homeOfficeSimplifiedRate: 5, // $5 per sq ft
  homeOfficeMaxSqFt: 300,
  mealsDeductionRate: 0.50, // 50% deductible
  qbiIncomeThresholdSingle: 191950, // 2024 threshold
  qbiIncomeThresholdMarried: 383900,
};

// 50/20/0 Value Reduction Method for Amazon Vine
export const VALUE_REDUCTION_RATES = {
  brandName: 0.50, // Reduce to 50% (50% deduction)
  nonBrand: 0.20, // Reduce to 20% (80% deduction)
  brokenUseless: 0.00, // Reduce to 0% (100% deduction)
};

// Common business codes for product reviewers
export const BUSINESS_CODES = {
  "561990": "All Other Support Services",
  "711510": "Independent Artists, Writers, and Performers",
  "541990": "All Other Professional, Scientific, and Technical Services",
  "454110": "Electronic Shopping and Mail-Order Houses",
};

// Recommended business code for Vine
export const DEFAULT_BUSINESS_CODE = "561990";

// Default business name template
export const DEFAULT_BUSINESS_NAME_TEMPLATE = "Product Review Services";

export interface VineItem {
  id: string;
  name: string;
  etv: number; // Estimated Tax Value
  category: "brand" | "non_brand" | "broken";
  notes?: string;
}

export interface VineValueCalculation {
  totalEtv: number;
  brandItemsEtv: number;
  nonBrandItemsEtv: number;
  brokenItemsEtv: number;
  brandReduction: number;
  nonBrandReduction: number;
  brokenReduction: number;
  totalReduction: number;
  netTaxableValue: number;
}

/**
 * Calculate value reduction using the 50/20/0 method
 */
export function calculateVineValueReduction(
  brandItemsEtv: number,
  nonBrandItemsEtv: number,
  brokenItemsEtv: number
): VineValueCalculation {
  const totalEtv = brandItemsEtv + nonBrandItemsEtv + brokenItemsEtv;
  
  // Calculate reductions
  const brandReduction = brandItemsEtv * (1 - VALUE_REDUCTION_RATES.brandName);
  const nonBrandReduction = nonBrandItemsEtv * (1 - VALUE_REDUCTION_RATES.nonBrand);
  const brokenReduction = brokenItemsEtv * (1 - VALUE_REDUCTION_RATES.brokenUseless);
  
  const totalReduction = brandReduction + nonBrandReduction + brokenReduction;
  const netTaxableValue = totalEtv - totalReduction;
  
  return {
    totalEtv,
    brandItemsEtv,
    nonBrandItemsEtv,
    brokenItemsEtv,
    brandReduction,
    nonBrandReduction,
    brokenReduction,
    totalReduction,
    netTaxableValue,
  };
}

export interface TaxCalculation {
  grossIncome: number;
  totalExpenses: number;
  netProfit: number;
  selfEmploymentTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  qbiDeduction: number;
  taxableIncomeAfterQbi: number;
  estimatedIncomeTax: number;
  totalEstimatedTax: number;
}

/**
 * Calculate taxes on Schedule C income
 */
export function calculateScheduleCTaxes(
  netProfit: number,
  marginalTaxRate: number = 0.22, // Default 22% bracket
  isEligibleForQbi: boolean = true
): TaxCalculation {
  // Self-employment tax is on 92.35% of net profit
  const seNetEarnings = netProfit * 0.9235;
  const selfEmploymentTax = Math.max(0, seNetEarnings * TAX_RATES.selfEmploymentTax);
  const socialSecurityTax = Math.max(0, seNetEarnings * TAX_RATES.socialSecurityRate);
  const medicareTax = Math.max(0, seNetEarnings * TAX_RATES.medicareRate);
  
  // QBI deduction (20% of net profit)
  const qbiDeduction = isEligibleForQbi ? Math.max(0, netProfit * TAX_RATES.qbiDeduction) : 0;
  
  // Taxable income after QBI
  const taxableIncomeAfterQbi = Math.max(0, netProfit - qbiDeduction);
  
  // Estimated income tax
  const estimatedIncomeTax = taxableIncomeAfterQbi * marginalTaxRate;
  
  // Total estimated tax
  const totalEstimatedTax = selfEmploymentTax + estimatedIncomeTax;
  
  return {
    grossIncome: netProfit, // For display purposes
    totalExpenses: 0,
    netProfit,
    selfEmploymentTax,
    socialSecurityTax,
    medicareTax,
    qbiDeduction,
    taxableIncomeAfterQbi,
    estimatedIncomeTax,
    totalEstimatedTax,
  };
}

/**
 * Calculate mileage deduction
 */
export function calculateMileageDeduction(
  businessMiles: number,
  year: number = 2024
): number {
  const rate = year >= 2025 ? TAX_RATES.mileageRate2025 : TAX_RATES.mileageRate;
  return businessMiles * rate;
}

/**
 * Calculate home office deduction (simplified method)
 */
export function calculateHomeOfficeDeduction(
  squareFeet: number,
  useSimplifiedMethod: boolean = true
): number {
  if (useSimplifiedMethod) {
    const cappedSqFt = Math.min(squareFeet, TAX_RATES.homeOfficeMaxSqFt);
    return cappedSqFt * TAX_RATES.homeOfficeSimplifiedRate;
  }
  // For actual method, would need more inputs
  return 0;
}

/**
 * Calculate quarterly estimated tax payment
 */
export function calculateQuarterlyPayment(annualEstimatedTax: number): number {
  return annualEstimatedTax / 4;
}

/**
 * Get tax bracket rate based on income and filing status
 */
export function getTaxBracketRate(
  taxableIncome: number,
  filingStatus: "single" | "married_filing_jointly" | "head_of_household" = "single"
): number {
  // 2024 tax brackets
  const brackets = {
    single: [
      { max: 11600, rate: 0.10 },
      { max: 47150, rate: 0.12 },
      { max: 100525, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243725, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 },
    ],
    married_filing_jointly: [
      { max: 23200, rate: 0.10 },
      { max: 94300, rate: 0.12 },
      { max: 201050, rate: 0.22 },
      { max: 383900, rate: 0.24 },
      { max: 487450, rate: 0.32 },
      { max: 731200, rate: 0.35 },
      { max: Infinity, rate: 0.37 },
    ],
    head_of_household: [
      { max: 16550, rate: 0.10 },
      { max: 63100, rate: 0.12 },
      { max: 100500, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243700, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 },
    ],
  };

  const bracketList = brackets[filingStatus];
  for (const bracket of bracketList) {
    if (taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }
  return 0.37;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

// Quarterly payment due dates
export const QUARTERLY_DUE_DATES = {
  Q1: "April 15",
  Q2: "June 15",
  Q3: "September 15",
  Q4: "January 15 (next year)",
};

// Common other expense descriptions for Vine
export const VINE_OTHER_EXPENSE_TEMPLATES = [
  "Product value adjustment - 50/20/0 method (open box value reduction)",
  "Photography equipment for product reviews",
  "Storage solutions for product testing",
  "Photo editing software subscription",
  "Internet (business use portion)",
  "Shipping supplies for donations/returns",
];
