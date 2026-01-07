/**
 * Universal Inventory Import Validation & Parsing
 * Supports: Vine, Temu, Alibaba, custom bulk imports
 */

import { format, addMonths, parse, isValid, parseISO } from "date-fns";
import { TAX_YEAR_RULES, calculateMACRSDepreciation, getPropertyClassFromType, PROPERTY_CLASS_INFO } from "./depreciation-tables";

// Required fields for different compliance levels
export const COMPLIANCE_LEVELS = {
  minimal: {
    required: ['product_name'],
    description: 'Basic tracking only - no tax benefits',
    taxBenefits: false,
  },
  standard: {
    required: ['product_name', 'acquisition_date', 'cost_basis'],
    description: 'Standard deductions available',
    taxBenefits: true,
  },
  full: {
    required: ['product_name', 'acquisition_date', 'cost_basis', 'source', 'receipt_reference'],
    description: 'Full audit-ready documentation',
    taxBenefits: true,
  },
} as const;

export type ComplianceLevel = keyof typeof COMPLIANCE_LEVELS;

// Validation rules with IRS references
export const VALIDATION_RULES = {
  donation_holding_period: {
    months: 6,
    irs_reference: 'IRS Pub 526 - Long-term capital gain property',
    description: 'Property must be held >6 months for full FMV deduction',
  },
  section_179_limit: {
    amount: TAX_YEAR_RULES[2025]?.section179Limit || 2500000,
    irs_reference: 'IRC §179',
    description: 'Maximum Section 179 deduction for tax year',
  },
  bonus_depreciation: {
    percent: TAX_YEAR_RULES[2025]?.bonusDepreciationPercent || 100,
    irs_reference: 'IRC §168(k) - OBBBA 2025',
    description: 'Bonus depreciation rate for qualified property',
  },
  form_8283_threshold: {
    amount: 500,
    irs_reference: 'Form 8283 - Noncash Charitable Contributions',
    description: 'Donations over $500 require Form 8283',
  },
  appraisal_threshold: {
    amount: 5000,
    irs_reference: 'IRS Pub 561',
    description: 'Donations over $5,000 require qualified appraisal',
  },
};

export interface ImportField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'currency';
  required: boolean;
  tooltip: string;
  irsReference?: string;
  autoGenerate?: boolean;
}

// Field definitions with compliance tooltips
export const IMPORT_FIELDS: ImportField[] = [
  {
    name: 'product_name',
    label: 'Product Name',
    type: 'string',
    required: true,
    tooltip: 'Descriptive name for the item. Required for all imports.',
  },
  {
    name: 'acquisition_date',
    label: 'Acquisition Date',
    type: 'date',
    required: true,
    tooltip: 'Date you acquired/ordered the item. Critical for depreciation start and donation eligibility calculations.',
    irsReference: 'IRS Pub 946 - Placed in Service Date',
  },
  {
    name: 'cost_basis',
    label: 'Cost Basis / ETV',
    type: 'currency',
    required: true,
    tooltip: 'Your cost or Estimated Tax Value. This is your depreciable basis and affects donation valuation.',
    irsReference: 'IRS Pub 551 - Basis of Assets',
  },
  {
    name: 'source',
    label: 'Source',
    type: 'string',
    required: false,
    tooltip: 'Where you acquired this item (Amazon Vine, Temu, Alibaba, etc.). Helps with categorization.',
    autoGenerate: true,
  },
  {
    name: 'receipt_reference',
    label: 'Order/Receipt #',
    type: 'string',
    required: false,
    tooltip: 'Order number or receipt reference. Auto-generated if not provided.',
    autoGenerate: true,
  },
  {
    name: 'asin',
    label: 'ASIN/SKU',
    type: 'string',
    required: false,
    tooltip: 'Amazon ASIN or product SKU. Helps with identification but not required.',
    autoGenerate: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'string',
    required: false,
    tooltip: 'Product category (Electronics, Furniture, etc.). Affects depreciation class.',
    irsReference: 'IRS Pub 946 - Property Classes',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: false,
    tooltip: 'Number of units. Default is 1.',
  },
];

export interface ParsedInventoryItem {
  id: string; // Auto-generated internal ID
  product_name: string;
  acquisition_date: string;
  cost_basis: number;
  source: string;
  receipt_reference: string;
  asin: string | null;
  category: string | null;
  quantity: number;
  // Calculated fields
  donation_eligible_date: string;
  depreciation_class: string;
  first_year_depreciation: number;
  depreciated_value_year1: number;
  // Compliance
  compliance_level: ComplianceLevel;
  validation_warnings: ValidationWarning[];
  selected: boolean;
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  irsReference?: string;
}

/**
 * Generate a unique internal ID for items without order numbers
 */
export function generateInternalId(source: string, index: number): string {
  const timestamp = Date.now().toString(36);
  const sourceCode = source.substring(0, 3).toUpperCase();
  return `${sourceCode}-${timestamp}-${index.toString().padStart(4, '0')}`;
}

/**
 * Parse various date formats
 */
export function parseFlexibleDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  const formats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'M/d/yyyy',
    'yyyy/MM/dd',
    'dd-MM-yyyy',
    'MMM dd, yyyy',
    'MMMM dd, yyyy',
  ];
  
  for (const fmt of formats) {
    try {
      const parsed = parse(dateStr.trim(), fmt, new Date());
      if (isValid(parsed)) {
        return format(parsed, 'yyyy-MM-dd');
      }
    } catch {
      continue;
    }
  }
  
  // Try ISO parse as fallback
  try {
    const parsed = parseISO(dateStr.trim());
    if (isValid(parsed)) {
      return format(parsed, 'yyyy-MM-dd');
    }
  } catch {
    // Ignore
  }
  
  return null;
}

/**
 * Parse currency values from various formats
 */
export function parseCurrency(value: string | number): number {
  if (typeof value === 'number') return value;
  
  const cleaned = value
    .replace(/[^0-9.-]/g, '')
    .replace(/,/g, '');
  
  return parseFloat(cleaned) || 0;
}

/**
 * Detect source from content patterns
 */
export function detectSource(content: string): string {
  const lower = content.toLowerCase();
  
  if (lower.includes('vine') || lower.includes('amazon')) return 'Amazon Vine';
  if (lower.includes('temu')) return 'Temu';
  if (lower.includes('alibaba')) return 'Alibaba';
  if (lower.includes('aliexpress')) return 'AliExpress';
  if (lower.includes('walmart')) return 'Walmart';
  if (lower.includes('ebay')) return 'eBay';
  
  return 'Manual Import';
}

/**
 * Validate an item and return warnings
 */
export function validateItem(item: Partial<ParsedInventoryItem>): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  
  // Required field checks
  if (!item.product_name) {
    warnings.push({
      field: 'product_name',
      message: 'Product name is required',
      severity: 'error',
    });
  }
  
  if (!item.acquisition_date) {
    warnings.push({
      field: 'acquisition_date',
      message: 'Acquisition date required for depreciation calculations',
      severity: 'warning',
      irsReference: 'IRS Pub 946',
    });
  }
  
  if (!item.cost_basis || item.cost_basis <= 0) {
    warnings.push({
      field: 'cost_basis',
      message: 'Cost basis required for tax deductions',
      severity: 'warning',
      irsReference: 'IRS Pub 551',
    });
  }
  
  // Compliance checks
  if (item.cost_basis && item.cost_basis >= VALIDATION_RULES.form_8283_threshold.amount) {
    warnings.push({
      field: 'cost_basis',
      message: `Items over $${VALIDATION_RULES.form_8283_threshold.amount} require Form 8283 for donation`,
      severity: 'info',
      irsReference: VALIDATION_RULES.form_8283_threshold.irs_reference,
    });
  }
  
  if (item.cost_basis && item.cost_basis >= VALIDATION_RULES.appraisal_threshold.amount) {
    warnings.push({
      field: 'cost_basis',
      message: `Items over $${VALIDATION_RULES.appraisal_threshold.amount} require qualified appraisal`,
      severity: 'warning',
      irsReference: VALIDATION_RULES.appraisal_threshold.irs_reference,
    });
  }
  
  return warnings;
}

/**
 * Calculate depreciation values for an item
 */
export function calculateItemDepreciation(
  costBasis: number,
  category: string | null,
  acquisitionDate: string | null
): { depreciation_class: string; first_year_depreciation: number; depreciated_value_year1: number } {
  const propertyClass = getPropertyClassFromType(category || 'equipment');
  const classInfo = PROPERTY_CLASS_INFO[propertyClass];
  
  // Get purchase year
  const year = acquisitionDate ? new Date(acquisitionDate).getFullYear() : new Date().getFullYear();
  
  // Calculate with 100% bonus depreciation (OBBBA 2025)
  const schedule = calculateMACRSDepreciation(costBasis, year, {
    propertyClass,
    bonusDepreciationPercent: 100,
  });
  
  const firstYearDeduction = schedule[0]?.totalDeduction || costBasis;
  
  return {
    depreciation_class: classInfo.name,
    first_year_depreciation: firstYearDeduction,
    depreciated_value_year1: costBasis - firstYearDeduction,
  };
}

/**
 * Calculate donation eligible date
 */
export function calculateDonationDate(acquisitionDate: string): string {
  try {
    const date = parseISO(acquisitionDate);
    if (isValid(date)) {
      return format(addMonths(date, VALIDATION_RULES.donation_holding_period.months), 'yyyy-MM-dd');
    }
  } catch {
    // Ignore
  }
  return '';
}

/**
 * Determine compliance level based on filled fields
 */
export function determineComplianceLevel(item: Partial<ParsedInventoryItem>): ComplianceLevel {
  const hasMinimal = COMPLIANCE_LEVELS.minimal.required.every(f => 
    item[f as keyof ParsedInventoryItem]
  );
  
  const hasStandard = COMPLIANCE_LEVELS.standard.required.every(f => 
    item[f as keyof ParsedInventoryItem]
  );
  
  const hasFull = COMPLIANCE_LEVELS.full.required.every(f => 
    item[f as keyof ParsedInventoryItem]
  );
  
  if (hasFull) return 'full';
  if (hasStandard) return 'standard';
  if (hasMinimal) return 'minimal';
  return 'minimal';
}

/**
 * Parse Vine-specific content
 */
export function parseVineContent(text: string): Partial<ParsedInventoryItem>[] {
  const items: Partial<ParsedInventoryItem>[] = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    if (line.includes('Order Number') || line.includes('ASIN')) continue;
    
    const orderNumberMatch = line.match(/\d{3}[-‑]\d{7}[-‑]\d{7}/);
    const asinMatch = line.match(/B0[A-Z0-9]{8,10}/);
    const dateMatches = line.match(/\d{2}\/\d{2}\/\d{4}/g);
    const etvMatch = line.match(/(\d+\.?\d*)\s*$/);
    const orderTypeMatch = line.match(/\b(ORDER|CANCELLATION)\b/);
    
    if (asinMatch || orderNumberMatch) {
      const isCancelled = orderTypeMatch?.[0] === 'CANCELLATION';
      let etv = etvMatch ? parseFloat(etvMatch[1]) : 0;
      
      if (isCancelled || etv <= 0) continue;
      
      const orderDate = dateMatches?.[0] ? parseFlexibleDate(dateMatches[0]) : null;
      
      // Extract product name
      let productName = 'Unknown Product';
      if (asinMatch) {
        const asinIndex = line.indexOf(asinMatch[0]);
        const afterAsin = line.substring(asinIndex + asinMatch[0].length);
        const firstDateIndex = afterAsin.search(/\d{2}\/\d{2}\/\d{4}/);
        if (firstDateIndex !== -1) {
          productName = afterAsin.substring(0, firstDateIndex)
            .replace(/ORDER|CANCELLATION/g, '')
            .trim() || 'Unknown Product';
        }
      }
      
      items.push({
        product_name: productName,
        acquisition_date: orderDate || undefined,
        cost_basis: etv,
        source: 'Amazon Vine',
        receipt_reference: orderNumberMatch?.[0]?.replace(/‑/g, '-') || '',
        asin: asinMatch?.[0] || null,
      });
    }
  }
  
  return items;
}

/**
 * Parse generic tabular content (Excel/CSV style)
 */
export function parseTabularContent(text: string): Partial<ParsedInventoryItem>[] {
  const items: Partial<ParsedInventoryItem>[] = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  if (lines.length < 2) return items;
  
  // Try to detect header row
  const headerLine = lines[0].toLowerCase();
  const isTabSeparated = lines[0].includes('\t');
  const separator = isTabSeparated ? '\t' : /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
  
  const headers = (isTabSeparated ? lines[0].split('\t') : lines[0].split(separator as RegExp))
    .map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  
  // Map headers to our fields
  const fieldMap: Record<string, string> = {};
  
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (h.includes('name') || h.includes('product') || h.includes('item') || h.includes('description')) {
      fieldMap['product_name'] = i.toString();
    }
    if (h.includes('date') || h.includes('order') || h.includes('purchase') || h.includes('acquired')) {
      fieldMap['acquisition_date'] = i.toString();
    }
    if (h.includes('price') || h.includes('cost') || h.includes('etv') || h.includes('value') || h.includes('amount')) {
      fieldMap['cost_basis'] = i.toString();
    }
    if (h.includes('asin') || h.includes('sku') || h.includes('upc')) {
      fieldMap['asin'] = i.toString();
    }
    if (h.includes('order') && h.includes('number') || h.includes('receipt') || h.includes('reference')) {
      fieldMap['receipt_reference'] = i.toString();
    }
    if (h.includes('category') || h.includes('type')) {
      fieldMap['category'] = i.toString();
    }
    if (h.includes('quantity') || h.includes('qty')) {
      fieldMap['quantity'] = i.toString();
    }
  }
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = isTabSeparated 
      ? lines[i].split('\t') 
      : lines[i].split(separator as RegExp).map(v => v.replace(/^"|"$/g, ''));
    
    const item: Partial<ParsedInventoryItem> = {};
    
    for (const [field, idx] of Object.entries(fieldMap)) {
      const value = values[parseInt(idx)]?.trim();
      if (!value) continue;
      
      if (field === 'cost_basis') {
        item.cost_basis = parseCurrency(value);
      } else if (field === 'acquisition_date') {
        item.acquisition_date = parseFlexibleDate(value) || undefined;
      } else if (field === 'quantity') {
        item.quantity = parseInt(value) || 1;
      } else {
        (item as any)[field] = value;
      }
    }
    
    if (item.product_name || item.cost_basis) {
      items.push(item);
    }
  }
  
  return items;
}

/**
 * Main parsing function - auto-detects format
 */
export function parseInventoryContent(
  content: string, 
  sourceHint?: string
): ParsedInventoryItem[] {
  const detectedSource = sourceHint || detectSource(content);
  
  // Try different parsers
  let rawItems: Partial<ParsedInventoryItem>[] = [];
  
  if (detectedSource === 'Amazon Vine') {
    rawItems = parseVineContent(content);
  }
  
  // If Vine parsing didn't work or different source, try tabular
  if (rawItems.length === 0) {
    rawItems = parseTabularContent(content);
  }
  
  // Enrich and validate items
  const items: ParsedInventoryItem[] = rawItems.map((raw, index) => {
    const id = raw.receipt_reference || generateInternalId(detectedSource, index);
    const acquisitionDate = raw.acquisition_date || format(new Date(), 'yyyy-MM-dd');
    const costBasis = raw.cost_basis || 0;
    
    const depreciation = calculateItemDepreciation(
      costBasis,
      raw.category || null,
      acquisitionDate
    );
    
    const donationDate = calculateDonationDate(acquisitionDate);
    const warnings = validateItem(raw);
    const complianceLevel = determineComplianceLevel(raw);
    
    return {
      id,
      product_name: raw.product_name || 'Unknown Product',
      acquisition_date: acquisitionDate,
      cost_basis: costBasis,
      source: raw.source || detectedSource,
      receipt_reference: raw.receipt_reference || id,
      asin: raw.asin || null,
      category: raw.category || null,
      quantity: raw.quantity || 1,
      donation_eligible_date: donationDate,
      ...depreciation,
      compliance_level: complianceLevel,
      validation_warnings: warnings,
      selected: warnings.every(w => w.severity !== 'error'),
    };
  });
  
  // Deduplicate
  const unique = new Map<string, ParsedInventoryItem>();
  for (const item of items) {
    const key = item.asin || `${item.product_name}-${item.acquisition_date}`;
    if (!unique.has(key) || item.compliance_level === 'full') {
      unique.set(key, item);
    }
  }
  
  return Array.from(unique.values());
}
