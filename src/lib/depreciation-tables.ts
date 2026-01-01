/**
 * IRS MACRS Depreciation Tables (Pub 946)
 * Using GDS (General Depreciation System), 200% declining balance
 * Half-year convention
 */

// 5-Year Property MACRS Percentages (computers, office equipment, vehicles, scientific equipment)
export const MACRS_5_YEAR = [20.00, 32.00, 19.20, 11.52, 11.52, 5.76];

// 7-Year Property MACRS Percentages (office furniture, farm equipment, tractors)
export const MACRS_7_YEAR = [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46];

// 3-Year Property MACRS Percentages (special tools, some manufacturing equipment)
export const MACRS_3_YEAR = [33.33, 44.45, 14.81, 7.41];

// 10-Year Property MACRS Percentages (boats, single-purpose agricultural structures)
export const MACRS_10_YEAR = [10.00, 18.00, 14.40, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28];

// 15-Year Property MACRS Percentages (improvements, land improvements)
export const MACRS_15_YEAR = [5.00, 9.50, 8.55, 7.70, 6.93, 6.23, 5.90, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 2.95];

export interface DepreciationOptions {
  section179Amount: number;
  bonusDepreciationPercent: number;
  useHalfYearConvention: boolean;
  propertyClass: '3-year' | '5-year' | '7-year' | '10-year' | '15-year';
}

export interface YearlyDepreciationResult {
  year: number;
  depreciationPercent: number;
  depreciationAmount: number;
  cumulativeDepreciation: number;
  endingBookValue: number;
  section179Amount: number;
  bonusAmount: number;
  totalDeduction: number;
}

// Tax year rules for bonus depreciation and Section 179
export const TAX_YEAR_RULES = {
  2025: {
    section179Limit: 2500000,      // OBBBA expanded limit
    section179PhaseoutStart: 4000000,
    bonusDepreciationPercent: 100, // Restored via OBBBA for assets after Jan 19, 2025
    bonusDescription: '100% Bonus (OBBBA restored)',
  },
  2024: {
    section179Limit: 1220000,
    section179PhaseoutStart: 3050000,
    bonusDepreciationPercent: 60,
    bonusDescription: '60% Bonus',
  },
  2026: {
    section179Limit: 2500000,      // Assuming continuation
    section179PhaseoutStart: 4000000,
    bonusDepreciationPercent: 20,
    bonusDescription: '20% Bonus (scheduled)',
  },
  2027: {
    section179Limit: 2500000,
    section179PhaseoutStart: 4000000,
    bonusDepreciationPercent: 0,
    bonusDescription: 'No Bonus (scheduled phase-out)',
  },
};

export function getMACRSTable(propertyClass: string): number[] {
  switch (propertyClass) {
    case '3-year':
      return MACRS_3_YEAR;
    case '5-year':
      return MACRS_5_YEAR;
    case '7-year':
      return MACRS_7_YEAR;
    case '10-year':
      return MACRS_10_YEAR;
    case '15-year':
      return MACRS_15_YEAR;
    default:
      return MACRS_5_YEAR;
  }
}

export function getPropertyClassFromType(assetType: string): '3-year' | '5-year' | '7-year' | '10-year' | '15-year' {
  const type = assetType.toLowerCase();
  
  // 7-year property
  if (type.includes('tractor') || type.includes('farm') || type.includes('furniture') || 
      type.includes('machinery') || type.includes('appliance')) {
    return '7-year';
  }
  
  // 5-year property
  if (type.includes('computer') || type.includes('telescope') || type.includes('vehicle') || 
      type.includes('equipment') || type.includes('snack') || type.includes('vending') ||
      type.includes('electronics')) {
    return '5-year';
  }
  
  // Default to 5-year
  return '5-year';
}

/**
 * Calculate complete depreciation schedule with Section 179 and Bonus Depreciation
 */
export function calculateMACRSDepreciation(
  originalCost: number,
  purchaseYear: number,
  options: Partial<DepreciationOptions> = {}
): YearlyDepreciationResult[] {
  const {
    section179Amount = 0,
    bonusDepreciationPercent = 0,
    propertyClass = '5-year',
  } = options;

  const results: YearlyDepreciationResult[] = [];
  const macrsTable = getMACRSTable(propertyClass);
  
  // Calculate basis after Section 179
  const basisAfter179 = originalCost - section179Amount;
  
  // Calculate bonus depreciation on remaining basis
  const bonusAmount = basisAfter179 * (bonusDepreciationPercent / 100);
  
  // Remaining basis for regular MACRS
  const macrsDepreciableBasis = basisAfter179 - bonusAmount;
  
  let cumulativeDepreciation = 0;
  
  for (let i = 0; i < macrsTable.length; i++) {
    const year = purchaseYear + i;
    const percent = macrsTable[i];
    const regularDepreciation = (macrsDepreciableBasis * percent) / 100;
    
    // First year includes Section 179 and bonus
    const yearSection179 = i === 0 ? section179Amount : 0;
    const yearBonus = i === 0 ? bonusAmount : 0;
    const totalDeduction = regularDepreciation + yearSection179 + yearBonus;
    
    cumulativeDepreciation += totalDeduction;
    const endingBookValue = Math.max(0, originalCost - cumulativeDepreciation);
    
    results.push({
      year,
      depreciationPercent: percent,
      depreciationAmount: regularDepreciation,
      cumulativeDepreciation,
      endingBookValue,
      section179Amount: yearSection179,
      bonusAmount: yearBonus,
      totalDeduction,
    });
    
    if (endingBookValue <= 0) break;
  }
  
  return results;
}

/**
 * Calculate Section 179 full expensing
 */
export function calculateSection179FullExpense(
  originalCost: number,
  purchaseYear: number,
  taxYear: number = 2025
): YearlyDepreciationResult[] {
  const rules = TAX_YEAR_RULES[taxYear as keyof typeof TAX_YEAR_RULES] || TAX_YEAR_RULES[2025];
  const deductibleAmount = Math.min(originalCost, rules.section179Limit);
  
  return [{
    year: purchaseYear,
    depreciationPercent: 100,
    depreciationAmount: 0,
    cumulativeDepreciation: deductibleAmount,
    endingBookValue: originalCost - deductibleAmount,
    section179Amount: deductibleAmount,
    bonusAmount: 0,
    totalDeduction: deductibleAmount,
  }];
}

/**
 * Calculate 100% Bonus Depreciation (full deduction in Year 1)
 */
export function calculateBonusDepreciation(
  originalCost: number,
  purchaseYear: number,
  bonusPercent: number = 100
): YearlyDepreciationResult[] {
  const bonusAmount = originalCost * (bonusPercent / 100);
  
  return [{
    year: purchaseYear,
    depreciationPercent: bonusPercent,
    depreciationAmount: 0,
    cumulativeDepreciation: bonusAmount,
    endingBookValue: originalCost - bonusAmount,
    section179Amount: 0,
    bonusAmount: bonusAmount,
    totalDeduction: bonusAmount,
  }];
}

/**
 * Calculate combined depreciation for multiple assets
 */
export function calculateCombinedDepreciation(
  assets: Array<{
    name: string;
    cost: number;
    purchaseYear: number;
    propertyClass: '5-year' | '7-year';
    section179?: number;
    bonusPercent?: number;
  }>
): {
  byAsset: Map<string, YearlyDepreciationResult[]>;
  combined: Map<number, { totalDepreciation: number; totalCumulative: number; totalBookValue: number }>;
} {
  const byAsset = new Map<string, YearlyDepreciationResult[]>();
  const combined = new Map<number, { totalDepreciation: number; totalCumulative: number; totalBookValue: number }>();
  
  let totalOriginalCost = 0;
  
  for (const asset of assets) {
    totalOriginalCost += asset.cost;
    
    const schedule = calculateMACRSDepreciation(asset.cost, asset.purchaseYear, {
      propertyClass: asset.propertyClass,
      section179Amount: asset.section179 || 0,
      bonusDepreciationPercent: asset.bonusPercent || 0,
    });
    
    byAsset.set(asset.name, schedule);
    
    // Aggregate by year
    for (const entry of schedule) {
      const existing = combined.get(entry.year) || { totalDepreciation: 0, totalCumulative: 0, totalBookValue: 0 };
      existing.totalDepreciation += entry.totalDeduction;
      combined.set(entry.year, existing);
    }
  }
  
  // Calculate running cumulative and book value
  let runningCumulative = 0;
  const sortedYears = Array.from(combined.keys()).sort((a, b) => a - b);
  
  for (const year of sortedYears) {
    const entry = combined.get(year)!;
    runningCumulative += entry.totalDepreciation;
    entry.totalCumulative = runningCumulative;
    entry.totalBookValue = totalOriginalCost - runningCumulative;
  }
  
  return { byAsset, combined };
}

// Property class descriptions for UI
export const PROPERTY_CLASS_INFO = {
  '3-year': {
    name: '3-Year Property',
    description: 'Special tools, certain manufacturing equipment',
    examples: ['Tractor units for over-the-road use', 'Race horses over 2 years old'],
  },
  '5-year': {
    name: '5-Year Property',
    description: 'Computers, office equipment, vehicles, scientific equipment',
    examples: ['Computers', 'Printers', 'Telescopes', 'Automobiles', 'Light trucks', 'Vending equipment'],
  },
  '7-year': {
    name: '7-Year Property',
    description: 'Office furniture, agricultural machinery, appliances',
    examples: ['Tractors', 'Farm equipment', 'Office furniture', 'Kitchen appliances', 'Air fryers'],
  },
  '10-year': {
    name: '10-Year Property',
    description: 'Vessels, single-purpose agricultural structures',
    examples: ['Boats', 'Barges', 'Fruit-bearing trees'],
  },
  '15-year': {
    name: '15-Year Property',
    description: 'Land improvements, retail motor fuel outlets',
    examples: ['Fences', 'Roads', 'Bridges', 'Landscaping'],
  },
};
