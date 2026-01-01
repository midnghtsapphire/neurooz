// TaxWizard Pro - Form Field Definitions
// Each field includes: explanation, limits, validation, SSDI implications

export type UserProfile = 'passive_owner' | 'active_manager' | 'joint_business';

export interface FormFieldDef {
  id: string;
  name: string;
  line?: string;
  type: 'text' | 'number' | 'currency' | 'percentage' | 'select' | 'date' | 'ssn' | 'ein' | 'calculated';
  explanation: string;
  maxLimit?: number;
  maxDescription?: string;
  threshold?: { value: number; warning: string };
  ssdiWarning?: string;
  example?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  calculateFrom?: string[];
  calculationFn?: string; // Name of calculation function
  defaultValue?: string | number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface TaxFormDef {
  id: string;
  name: string;
  fullName: string;
  description: string;
  applicableTo: UserProfile[];
  estimatedMinutes: number;
  sections: {
    id: string;
    title: string;
    description?: string;
    fields: FormFieldDef[];
  }[];
  attachments?: string[];
}

// 2026 Tax Year Constants
export const TAX_CONSTANTS_2026 = {
  standardDeductionSingle: 14600,
  standardDeductionMFJ: 29200,
  standardDeductionHOH: 21900,
  section179Limit: 1290000, // ~$1.29M for 2026 (indexed)
  section179PhaseOut: 3220000,
  qbiDeductionRate: 0.20, // 20% QBI deduction
  qbiThresholdSingle: 191950,
  qbiThresholdMFJ: 383900,
  sgaMonthlyLimit: 1620, // SSDI SGA limit 2026
  twpMonthlyLimit: 1110, // Trial Work Period
  selfEmploymentTaxRate: 0.153,
  socialSecurityWageBase: 168600,
  mileageRate: 0.67,
  ssTaxableThresholdSingle: 25000,
  ssTaxableThresholdMFJ: 32000,
  maxSsTaxablePercent: 0.85,
};

// Filing Status Options
export const FILING_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_filing_jointly', label: 'Married Filing Jointly' },
  { value: 'married_filing_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
  { value: 'qualifying_widow', label: 'Qualifying Surviving Spouse' },
];

// Form 1040 Definition
export const FORM_1040: TaxFormDef = {
  id: 'form_1040',
  name: 'Form 1040',
  fullName: 'U.S. Individual Income Tax Return',
  description: 'Reports all income and deductions. For SSDI users, focus on passive income lines to avoid SGA flags.',
  applicableTo: ['passive_owner', 'active_manager'],
  estimatedMinutes: 45,
  sections: [
    {
      id: 'filing_info',
      title: 'Filing Information',
      fields: [
        {
          id: 'filing_status',
          name: 'Filing Status',
          type: 'select',
          options: FILING_STATUS_OPTIONS,
          explanation: 'Your filing status affects your standard deduction and tax brackets. Single filers get ~$14,600 deduction in 2026.',
          example: 'Single if not married',
          required: true,
        },
        {
          id: 'first_name',
          name: 'First Name',
          type: 'text',
          explanation: 'Your legal first name as shown on your Social Security card.',
          required: true,
        },
        {
          id: 'last_name',
          name: 'Last Name',
          type: 'text',
          explanation: 'Your legal last name as shown on your Social Security card.',
          required: true,
        },
        {
          id: 'ssn',
          name: 'Social Security Number',
          type: 'ssn',
          explanation: 'Your 9-digit SSN. This identifies you to the IRS.',
          required: true,
          validation: { pattern: '^\\d{3}-?\\d{2}-?\\d{4}$', message: 'Enter valid SSN (XXX-XX-XXXX)' },
        },
      ],
    },
    {
      id: 'income',
      title: 'Income',
      description: 'Report all sources of income. SSDI recipients: passive income here is safe.',
      fields: [
        {
          id: 'line_1_wages',
          name: 'Wages, Salaries, Tips',
          line: 'Line 1',
          type: 'currency',
          explanation: 'Total W-2 wages from all jobs (e.g., Home Depot). Attach all W-2 forms.',
          example: '$45,000 from employment',
          ssdiWarning: 'High wages may trigger SGA review. Keep under $1,620/month if receiving SSDI.',
          threshold: { value: TAX_CONSTANTS_2026.sgaMonthlyLimit * 12, warning: 'Annual wages exceed SGA limit - may affect SSDI benefits' },
        },
        {
          id: 'line_2b_taxable_interest',
          name: 'Taxable Interest',
          line: 'Line 2b',
          type: 'currency',
          explanation: 'Interest from bank accounts, CDs, bonds. This is passive income - safe for SSDI.',
          example: '$250 from savings account',
        },
        {
          id: 'line_3b_dividends',
          name: 'Ordinary Dividends',
          line: 'Line 3b',
          type: 'currency',
          explanation: 'Dividends from stocks and mutual funds. Passive income - no SSDI impact.',
          example: '$500 from investments',
        },
        {
          id: 'line_4b_ira_taxable',
          name: 'IRA Distributions (Taxable)',
          line: 'Line 4b',
          type: 'currency',
          explanation: 'Taxable portion of IRA withdrawals. Early withdrawal penalties may apply if under 59½.',
        },
        {
          id: 'line_5b_pensions_taxable',
          name: 'Pensions and Annuities (Taxable)',
          line: 'Line 5b',
          type: 'currency',
          explanation: 'Taxable portion of pension/annuity payments. Passive income.',
        },
        {
          id: 'line_6a_ss_benefits',
          name: 'Social Security Benefits (Total)',
          line: 'Line 6a',
          type: 'currency',
          explanation: 'Enter your TOTAL SSDI benefits from SSA-1099 Box 5 (~$40,800). Full amount goes here; taxable portion calculated on Line 6b.',
          example: '$40,800 annual SSDI',
          defaultValue: 0,
        },
        {
          id: 'line_6b_ss_taxable',
          name: 'Taxable Social Security',
          line: 'Line 6b',
          type: 'calculated',
          explanation: 'Auto-calculated: 0-85% of benefits are taxable based on your combined income (AGI + nontaxable interest + half of SS benefits). If combined income exceeds $34k single, up to 85% is taxable.',
          calculationFn: 'calculateTaxableSS',
          calculateFrom: ['line_6a_ss_benefits', 'line_11_agi'],
          maxDescription: 'Maximum 85% of benefits if combined income >$34k (single)',
        },
        {
          id: 'line_7_capital_gains',
          name: 'Capital Gain or Loss',
          line: 'Line 7',
          type: 'currency',
          explanation: 'Net gain/loss from Schedule D (sales of stocks, property). Enter as negative for losses.',
          maxLimit: -3000,
          maxDescription: 'Maximum capital loss deduction: $3,000/year. Excess carries forward.',
        },
        {
          id: 'line_8_other_income',
          name: 'Other Income',
          line: 'Line 8',
          type: 'currency',
          explanation: 'Miscellaneous income: 1099-NEC (Z-Trip, Rover), gambling, etc. Self-employment income here.',
          ssdiWarning: 'Self-employment income from active work may count toward SGA.',
        },
      ],
    },
    {
      id: 'adjustments',
      title: 'Adjustments to Income',
      fields: [
        {
          id: 'line_11_agi',
          name: 'Adjusted Gross Income (AGI)',
          line: 'Line 11',
          type: 'calculated',
          explanation: 'Auto-calculated: Total income minus above-the-line deductions (educator expenses, HSA, etc.).',
          calculationFn: 'calculateAGI',
        },
        {
          id: 'line_12_standard_deduction',
          name: 'Standard Deduction',
          line: 'Line 12',
          type: 'currency',
          explanation: 'Use standard deduction (~$14,600 single) OR itemize if your deductions exceed this amount (medical, charity, mortgage interest).',
          defaultValue: TAX_CONSTANTS_2026.standardDeductionSingle,
          maxDescription: 'Standard: $14,600 (single), $29,200 (MFJ), $21,900 (HOH)',
        },
        {
          id: 'line_14_qbi_deduction',
          name: 'Qualified Business Income Deduction',
          line: 'Line 14',
          type: 'calculated',
          explanation: 'Auto-calculated: Up to 20% of qualifying business income from K-1s. Full deduction if income under $191,950 (single).',
          calculationFn: 'calculateQBI',
          maxDescription: 'Phase-out begins at $191,950 (single) / $383,900 (MFJ)',
        },
        {
          id: 'line_15_taxable_income',
          name: 'Taxable Income',
          line: 'Line 15',
          type: 'calculated',
          explanation: 'Auto-calculated: AGI minus deductions. This is what you pay taxes on.',
          calculationFn: 'calculateTaxableIncome',
        },
      ],
    },
    {
      id: 'tax_payments',
      title: 'Tax and Payments',
      fields: [
        {
          id: 'line_16_tax',
          name: 'Tax',
          line: 'Line 16',
          type: 'calculated',
          explanation: 'Auto-calculated from tax tables based on taxable income and filing status.',
          calculationFn: 'calculateTax',
        },
        {
          id: 'line_24_total_tax',
          name: 'Total Tax',
          line: 'Line 24',
          type: 'calculated',
          explanation: 'Total tax including self-employment tax, additional taxes.',
          calculationFn: 'calculateTotalTax',
        },
        {
          id: 'line_25_withheld',
          name: 'Federal Tax Withheld',
          line: 'Line 25',
          type: 'currency',
          explanation: 'Total taxes already withheld from W-2s and 1099s. Add all amounts.',
        },
        {
          id: 'line_33_refund_owed',
          name: 'Refund or Amount Owed',
          line: 'Line 33/37',
          type: 'calculated',
          explanation: 'Auto-calculated: Withheld - Total Tax = Refund (positive) or Owed (negative).',
          calculationFn: 'calculateRefundOwed',
        },
      ],
    },
  ],
  attachments: ['Schedule 1', 'Schedule 2', 'Schedule 3', 'All W-2s', 'All 1099s'],
};

// SSA-1099 Definition
export const FORM_SSA_1099: TaxFormDef = {
  id: 'ssa_1099',
  name: 'SSA-1099',
  fullName: 'Social Security Benefit Statement',
  description: 'Reports your SSDI/Social Security benefits. This form is provided by SSA - enter the values as shown.',
  applicableTo: ['passive_owner'],
  estimatedMinutes: 5,
  sections: [
    {
      id: 'benefits',
      title: 'Benefit Information',
      fields: [
        {
          id: 'box_1_name',
          name: 'Beneficiary Name',
          line: 'Box 1',
          type: 'text',
          explanation: 'Your name as shown on the SSA-1099. Must match your tax return.',
          required: true,
        },
        {
          id: 'box_2_ssn',
          name: 'Beneficiary SSN',
          line: 'Box 2',
          type: 'ssn',
          explanation: 'Your Social Security number.',
          required: true,
        },
        {
          id: 'box_3_benefits_paid',
          name: 'Benefits Paid',
          line: 'Box 3',
          type: 'currency',
          explanation: 'Total SSDI benefits paid before deductions (~$40,800). This is your gross benefit amount.',
          example: '$40,800 annual SSDI',
          required: true,
        },
        {
          id: 'box_5_net_benefits',
          name: 'Net Benefits',
          line: 'Box 5',
          type: 'currency',
          explanation: 'Benefits after Medicare Part B deductions. This goes on Form 1040 Line 6a.',
          example: '$38,500 after Medicare',
          required: true,
        },
        {
          id: 'box_6_voluntary_withholding',
          name: 'Voluntary Federal Tax Withholding',
          line: 'Box 6',
          type: 'currency',
          explanation: 'If you elected to have taxes withheld from benefits. This is optional.',
          defaultValue: 0,
        },
      ],
    },
  ],
};

// Form 1065 Definition
export const FORM_1065: TaxFormDef = {
  id: 'form_1065',
  name: 'Form 1065',
  fullName: 'U.S. Return of Partnership Income',
  description: 'For LLC/partnership business returns. Income passes through to K-1s for each member.',
  applicableTo: ['joint_business'],
  estimatedMinutes: 60,
  sections: [
    {
      id: 'entity_info',
      title: 'Partnership Information',
      fields: [
        {
          id: 'business_name',
          name: 'Partnership Name',
          type: 'text',
          explanation: 'Legal name of the LLC (e.g., TruthSlayer LLC, Front Range Rentals LLC).',
          required: true,
        },
        {
          id: 'ein',
          name: 'Employer Identification Number',
          type: 'ein',
          explanation: 'Your 9-digit EIN from the IRS. Required for all business entities.',
          required: true,
          validation: { pattern: '^\\d{2}-?\\d{7}$', message: 'Enter valid EIN (XX-XXXXXXX)' },
        },
        {
          id: 'business_address',
          name: 'Business Address',
          type: 'text',
          explanation: 'Principal place of business address.',
          required: true,
        },
        {
          id: 'business_activity',
          name: 'Principal Business Activity',
          type: 'text',
          explanation: 'Describe main business (e.g., "Product Reviews", "Personal Property Rental").',
          example: 'Product Testing & Reviews',
          required: true,
        },
        {
          id: 'business_code',
          name: 'Business Code',
          type: 'text',
          explanation: 'NAICS code for your business type. 711510 for writers/authors, 532289 for rental.',
          example: '711510 (Independent Artists/Writers)',
        },
      ],
    },
    {
      id: 'income',
      title: 'Income',
      fields: [
        {
          id: 'line_1a_gross_receipts',
          name: 'Gross Receipts or Sales',
          line: 'Line 1a',
          type: 'currency',
          explanation: 'Total business revenue: Vine ETV + rental income + affiliate commissions + any sales.',
          example: '$85,000 total (Vine + Rentals + Affiliates)',
          required: true,
        },
        {
          id: 'line_2_cost_of_goods',
          name: 'Cost of Goods Sold',
          line: 'Line 2',
          type: 'currency',
          explanation: 'From Schedule A: Cost of inventory sold. For Vine, typically minimal (items received free).',
          example: '$2,000 for purchased inventory',
        },
        {
          id: 'line_3_gross_profit',
          name: 'Gross Profit',
          line: 'Line 3',
          type: 'calculated',
          explanation: 'Auto-calculated: Line 1a minus Line 2.',
          calculationFn: 'calculateGrossProfit',
        },
        {
          id: 'line_4_ordinary_income',
          name: 'Ordinary Income from Other Sources',
          line: 'Line 4',
          type: 'currency',
          explanation: 'Other business income not from main operations.',
        },
      ],
    },
    {
      id: 'deductions',
      title: 'Deductions',
      description: 'Business expenses reduce taxable income passed to K-1s.',
      fields: [
        {
          id: 'line_9_salaries',
          name: 'Salaries and Wages',
          line: 'Line 9',
          type: 'currency',
          explanation: 'Wages paid to employees (not partners). Include daughters W-2 wages if employed.',
          ssdiWarning: 'If you receive wages here, it may indicate active work - verify passive status.',
        },
        {
          id: 'line_10_guaranteed_payments',
          name: 'Guaranteed Payments to Partners',
          line: 'Line 10',
          type: 'currency',
          explanation: 'Fixed payments to partners for services/capital. The active manager portion goes here.',
          example: '$24,000 to managing member',
          ssdiWarning: 'Guaranteed payments to YOU (passive owner) could indicate active involvement.',
        },
        {
          id: 'line_12_repairs',
          name: 'Repairs and Maintenance',
          line: 'Line 12',
          type: 'currency',
          explanation: 'Costs to repair business equipment (bounce houses, tech gear, etc.).',
        },
        {
          id: 'line_13_bad_debts',
          name: 'Bad Debts',
          line: 'Line 13',
          type: 'currency',
          explanation: 'Uncollectible accounts from customers.',
        },
        {
          id: 'line_14_rent',
          name: 'Rent',
          line: 'Line 14',
          type: 'currency',
          explanation: 'Rent for business property, storage units, office space.',
          example: '$3,600 for storage unit',
        },
        {
          id: 'line_15_taxes',
          name: 'Taxes and Licenses',
          line: 'Line 15',
          type: 'currency',
          explanation: 'Business licenses, state taxes, property taxes on business assets.',
        },
        {
          id: 'line_16a_depreciation',
          name: 'Depreciation',
          line: 'Line 16a',
          type: 'currency',
          explanation: 'From Form 4562. Section 179 + bonus depreciation for business equipment.',
          maxLimit: TAX_CONSTANTS_2026.section179Limit,
          maxDescription: `Section 179 max: $${TAX_CONSTANTS_2026.section179Limit.toLocaleString()}. Phase-out begins at $${TAX_CONSTANTS_2026.section179PhaseOut.toLocaleString()} total property.`,
        },
        {
          id: 'line_18_employee_benefits',
          name: 'Employee Benefit Programs',
          line: 'Line 18',
          type: 'currency',
          explanation: 'Health insurance, retirement contributions for employees.',
        },
        {
          id: 'line_20_other_deductions',
          name: 'Other Deductions',
          line: 'Line 20',
          type: 'currency',
          explanation: 'Supplies, mileage, internet, phone, professional services, insurance.',
          example: '$15,000 (supplies, mileage, home office)',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Summary',
      fields: [
        {
          id: 'line_22_ordinary_income_loss',
          name: 'Ordinary Business Income (Loss)',
          line: 'Line 22',
          type: 'calculated',
          explanation: 'Auto-calculated: This amount passes through to each partners K-1 based on ownership %.',
          calculationFn: 'calculateOrdinaryIncome',
        },
      ],
    },
  ],
  attachments: ['Schedule B', 'Schedule K', 'Schedule K-1 (for each partner)', 'Schedule L', 'Schedule M-1', 'Schedule M-2', 'Form 4562'],
};

// Schedule K-1 Definition
export const SCHEDULE_K1: TaxFormDef = {
  id: 'schedule_k1',
  name: 'Schedule K-1',
  fullName: 'Partner\'s Share of Income, Deductions, Credits',
  description: 'Generated for each LLC member. Shows your share of business income/loss based on ownership percentage.',
  applicableTo: ['passive_owner', 'active_manager'],
  estimatedMinutes: 20,
  sections: [
    {
      id: 'partner_info',
      title: 'Part II - Partner Information',
      fields: [
        {
          id: 'partner_name',
          name: 'Partner Name',
          type: 'text',
          explanation: 'Name of partner receiving this K-1.',
          required: true,
        },
        {
          id: 'partner_ssn',
          name: 'Partner SSN/TIN',
          type: 'ssn',
          explanation: 'Social Security Number or Tax ID of partner.',
          required: true,
        },
        {
          id: 'partner_type',
          name: 'Partner Type',
          type: 'select',
          options: [
            { value: 'general', label: 'General Partner' },
            { value: 'limited', label: 'Limited Partner' },
            { value: 'llc_member', label: 'LLC Member' },
          ],
          explanation: 'Type of partner. LLC members are typically treated as general partners unless limited.',
          ssdiWarning: 'General partners may be presumed active. Limited partners are presumed passive.',
        },
        {
          id: 'ownership_percentage',
          name: 'Profit/Loss Sharing Percentage',
          type: 'percentage',
          explanation: 'Your ownership share (e.g., 60% passive owner, 40% active manager).',
          example: '60% for passive owner',
          required: true,
          validation: { min: 0, max: 100, message: 'Enter percentage between 0-100' },
        },
        {
          id: 'is_passive',
          name: 'Passive Activity?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes - Passive (no material participation)' },
            { value: 'no', label: 'No - Active (materially participates)' },
          ],
          explanation: 'CRITICAL for SSDI: Passive means you do NOT materially participate (work <100 hrs/year OR not the most work done).',
          ssdiWarning: 'Selecting "Active" may indicate SGA for SSDI purposes. SSDI recipients should be PASSIVE.',
        },
      ],
    },
    {
      id: 'income_loss',
      title: 'Part III - Partner\'s Share of Current Year Income',
      fields: [
        {
          id: 'line_1_ordinary_income',
          name: 'Ordinary Business Income (Loss)',
          line: 'Line 1',
          type: 'currency',
          explanation: 'Your share of business ordinary income/loss (e.g., 60% × business income). Losses can offset other income.',
          example: '-$15,000 (60% of $25k loss)',
          ssdiWarning: 'As passive owner, this income does NOT count toward SGA even if positive.',
        },
        {
          id: 'line_2_net_rental_real_estate',
          name: 'Net Rental Real Estate Income (Loss)',
          line: 'Line 2',
          type: 'currency',
          explanation: 'Your share of real estate rental income. Typically passive.',
        },
        {
          id: 'line_3_other_net_rental',
          name: 'Other Net Rental Income (Loss)',
          line: 'Line 3',
          type: 'currency',
          explanation: 'Personal property rental income (bounce houses, equipment). Passive income.',
          example: '$8,000 (60% of rental profits)',
        },
        {
          id: 'line_4a_guaranteed_services',
          name: 'Guaranteed Payments for Services',
          line: 'Line 4a',
          type: 'currency',
          explanation: 'Fixed payments for your SERVICES to the partnership.',
          ssdiWarning: 'DANGER: If you receive guaranteed payments for services, this indicates ACTIVE work and counts toward SGA!',
        },
        {
          id: 'line_4b_guaranteed_capital',
          name: 'Guaranteed Payments for Capital',
          line: 'Line 4b',
          type: 'currency',
          explanation: 'Fixed payments for your CAPITAL contribution. This is passive and SSDI-safe.',
        },
        {
          id: 'line_5_interest',
          name: 'Interest Income',
          line: 'Line 5',
          type: 'currency',
          explanation: 'Your share of partnership interest income. Passive.',
        },
      ],
    },
    {
      id: 'deductions',
      title: 'Deductions',
      fields: [
        {
          id: 'line_13_other_deductions',
          name: 'Other Deductions',
          line: 'Line 13',
          type: 'currency',
          explanation: 'Your share of pass-through deductions (expenses, depreciation adjustments).',
          example: '$30,000 (60% share)',
        },
      ],
    },
    {
      id: 'self_employment',
      title: 'Self-Employment',
      fields: [
        {
          id: 'line_14_se_earnings',
          name: 'Self-Employment Earnings (Loss)',
          line: 'Line 14',
          type: 'currency',
          explanation: 'For ACTIVE partners: SE earnings subject to 15.3% SE tax. For PASSIVE partners: should be $0.',
          ssdiWarning: 'PASSIVE OWNER: This should be $0. If there is an amount here, it suggests active involvement - verify!',
          defaultValue: 0,
        },
      ],
    },
    {
      id: 'qbi_info',
      title: 'Section 199A (QBI) Information',
      fields: [
        {
          id: 'line_17_v_qbi',
          name: 'Section 199A QBI',
          line: 'Line 17 Code V',
          type: 'currency',
          explanation: 'Your share of Qualified Business Income for the 20% deduction. Based on ordinary income minus guaranteed payments.',
          example: '$12,000 QBI eligible',
        },
        {
          id: 'line_17_ubia',
          name: 'UBIA (Unadjusted Basis Immediately After Acquisition)',
          line: 'Line 17 Code V/Line 20 Code Z',
          type: 'currency',
          explanation: 'Original cost basis of business assets. Used to calculate QBI limit (2.5% of UBIA or 50% of wages).',
          example: '$80,000 UBIA (original equipment cost)',
        },
        {
          id: 'line_17_sstb',
          name: 'Is this a Specified Service Trade or Business (SSTB)?',
          line: 'Line 17',
          type: 'select',
          options: [
            { value: 'no', label: 'No - Full QBI eligible' },
            { value: 'yes', label: 'Yes - QBI limited at higher incomes' },
          ],
          explanation: 'SSTBs (health, law, consulting, etc.) have QBI phase-outs. Product reviews/rentals are NOT SSTBs.',
        },
      ],
    },
  ],
};

// Form 4562 Definition
export const FORM_4562: TaxFormDef = {
  id: 'form_4562',
  name: 'Form 4562',
  fullName: 'Depreciation and Amortization',
  description: 'Write off business equipment costs. Section 179 allows immediate expensing up to $1.29M (2026).',
  applicableTo: ['joint_business'],
  estimatedMinutes: 25,
  sections: [
    {
      id: 'section_179',
      title: 'Part I - Section 179 Election',
      description: 'Immediately expense qualifying business equipment instead of depreciating over years.',
      fields: [
        {
          id: 'line_1_max_deduction',
          name: 'Maximum Section 179 Deduction',
          line: 'Line 1',
          type: 'currency',
          explanation: 'Maximum allowed deduction for 2026. Auto-populated.',
          defaultValue: TAX_CONSTANTS_2026.section179Limit,
          maxLimit: TAX_CONSTANTS_2026.section179Limit,
          maxDescription: `2026 limit: $${TAX_CONSTANTS_2026.section179Limit.toLocaleString()}`,
        },
        {
          id: 'line_2_total_cost',
          name: 'Total Cost of Section 179 Property',
          line: 'Line 2',
          type: 'currency',
          explanation: 'Total cost of all equipment you want to expense under Section 179.',
          required: true,
        },
        {
          id: 'line_3_threshold',
          name: 'Threshold Amount',
          line: 'Line 3',
          type: 'currency',
          explanation: 'Phase-out threshold. Deduction reduces dollar-for-dollar above this.',
          defaultValue: TAX_CONSTANTS_2026.section179PhaseOut,
        },
        {
          id: 'line_5_tentative_deduction',
          name: 'Tentative Deduction',
          line: 'Line 5',
          type: 'calculated',
          explanation: 'Auto-calculated: Lesser of Line 1 or Line 2, minus any phase-out reduction.',
          calculationFn: 'calculateSection179',
        },
        {
          id: 'line_6_assets_list',
          name: 'Listed Property',
          line: 'Line 6',
          type: 'text',
          explanation: 'List each asset: "Bounce House - $2,000", "Camera Equipment - $3,500", etc.',
          example: 'Computer $1,200; Bounce House $2,000; Camera $3,500',
        },
      ],
    },
    {
      id: 'bonus_depreciation',
      title: 'Part II - Bonus Depreciation',
      fields: [
        {
          id: 'line_14_bonus_property',
          name: 'Qualified Property for Bonus Depreciation',
          line: 'Line 14',
          type: 'currency',
          explanation: '60% bonus depreciation available for 2026 on qualifying new property (phasing down from 100%).',
          maxDescription: '60% bonus depreciation rate for 2026',
        },
      ],
    },
    {
      id: 'macrs',
      title: 'Part III - MACRS Depreciation',
      description: 'For property not fully expensed under Section 179 or bonus.',
      fields: [
        {
          id: 'line_17_macrs_3year',
          name: '3-Year Property',
          line: 'Line 17a',
          type: 'currency',
          explanation: 'Depreciation for 3-year assets (software, some equipment).',
        },
        {
          id: 'line_17_macrs_5year',
          name: '5-Year Property',
          line: 'Line 17b',
          type: 'currency',
          explanation: 'Depreciation for 5-year assets (computers, vehicles, most business equipment like bounce houses).',
        },
        {
          id: 'line_17_macrs_7year',
          name: '7-Year Property',
          line: 'Line 17c',
          type: 'currency',
          explanation: 'Depreciation for 7-year assets (office furniture, some equipment).',
        },
      ],
    },
  ],
};

// Schedule E Definition
export const SCHEDULE_E: TaxFormDef = {
  id: 'schedule_e',
  name: 'Schedule E',
  fullName: 'Supplemental Income and Loss',
  description: 'Reports K-1 pass-through income/loss on your personal return. This is where SSDI-safe passive income flows.',
  applicableTo: ['passive_owner', 'active_manager'],
  estimatedMinutes: 15,
  sections: [
    {
      id: 'partnership_income',
      title: 'Part II - Income or Loss from Partnerships and S Corporations',
      fields: [
        {
          id: 'line_28_partnership_name',
          name: 'Partnership Name',
          line: 'Line 28 Col A',
          type: 'text',
          explanation: 'Name of each LLC/partnership (TruthSlayer LLC, Front Range Rentals).',
          required: true,
        },
        {
          id: 'line_28_passive_income',
          name: 'Passive Income (Loss)',
          line: 'Line 28 Col g',
          type: 'currency',
          explanation: 'Your share of PASSIVE business income/loss from K-1 Line 1. For SSDI: This is SAFE income.',
          example: '-$15,000 passive loss',
          ssdiWarning: 'Confirm this is marked PASSIVE. Passive income does NOT count toward SGA.',
        },
        {
          id: 'line_28_nonpassive_income',
          name: 'Nonpassive Income (Loss)',
          line: 'Line 28 Col h/j',
          type: 'currency',
          explanation: 'Your share of ACTIVE/nonpassive business income from K-1. For SSDI recipients: This should be $0.',
          ssdiWarning: 'DANGER: Nonpassive income indicates material participation and MAY count toward SGA!',
          defaultValue: 0,
        },
      ],
    },
    {
      id: 'rental_income',
      title: 'Rental Income',
      fields: [
        {
          id: 'line_28_rental',
          name: 'Net Rental Income',
          line: 'Line 28 (rental)',
          type: 'currency',
          explanation: 'Your share of rental income from K-1 Line 3. Equipment/personal property rental is passive.',
          example: '$8,000 from bounce house rentals',
        },
      ],
    },
    {
      id: 'totals',
      title: 'Totals',
      fields: [
        {
          id: 'line_41_total_partnership',
          name: 'Total Partnership/S Corp Income (Loss)',
          line: 'Line 41',
          type: 'calculated',
          explanation: 'Auto-calculated: Sum of all passive/nonpassive income minus losses.',
          calculationFn: 'calculateScheduleETotal',
        },
        {
          id: 'line_43_total_estate_trust',
          name: 'Total Income (Loss) to 1040',
          line: 'Line 43',
          type: 'calculated',
          explanation: 'Total flows to Form 1040 Schedule 1.',
          calculationFn: 'calculateScheduleETotal',
        },
      ],
    },
  ],
};

// Schedule SE Definition  
export const SCHEDULE_SE: TaxFormDef = {
  id: 'schedule_se',
  name: 'Schedule SE',
  fullName: 'Self-Employment Tax',
  description: 'Calculates 15.3% SE tax for ACTIVE partners. PASSIVE SSDI owners should NOT have SE tax.',
  applicableTo: ['active_manager'],
  estimatedMinutes: 10,
  sections: [
    {
      id: 'se_calculation',
      title: 'Self-Employment Tax Calculation',
      fields: [
        {
          id: 'line_2_se_profit',
          name: 'Net Profit from Self-Employment',
          line: 'Line 2',
          type: 'currency',
          explanation: 'From K-1 Line 14 (SE earnings) plus any Schedule C profit.',
          required: true,
          threshold: { value: 400, warning: 'SE tax only applies if net profit exceeds $400' },
        },
        {
          id: 'line_3_combined_profit',
          name: 'Combined SE Profit',
          line: 'Line 3',
          type: 'calculated',
          explanation: 'Auto-calculated: Combined profit from all self-employment.',
          calculationFn: 'calculateCombinedSE',
        },
        {
          id: 'line_4_se_earnings',
          name: 'SE Earnings (92.35% of profit)',
          line: 'Line 4',
          type: 'calculated',
          explanation: 'Auto-calculated: 92.35% of Line 3. This is the SE tax base.',
          calculationFn: 'calculateSEBase',
        },
        {
          id: 'line_12_se_tax',
          name: 'Self-Employment Tax',
          line: 'Line 12',
          type: 'calculated',
          explanation: 'Auto-calculated: 15.3% of SE earnings (12.4% Social Security + 2.9% Medicare).',
          calculationFn: 'calculateSETax',
          maxDescription: `Social Security portion caps at $${TAX_CONSTANTS_2026.socialSecurityWageBase.toLocaleString()} wage base`,
        },
        {
          id: 'line_13_deductible_se',
          name: 'Deductible Portion of SE Tax',
          line: 'Line 13',
          type: 'calculated',
          explanation: 'Auto-calculated: Half of SE tax is deductible on Schedule 1.',
          calculationFn: 'calculateDeductibleSE',
        },
      ],
    },
  ],
};

// All forms collection
export const ALL_TAX_FORMS: TaxFormDef[] = [
  FORM_1040,
  FORM_SSA_1099,
  FORM_1065,
  SCHEDULE_K1,
  FORM_4562,
  SCHEDULE_E,
  SCHEDULE_SE,
];

// Get forms applicable to a user profile
export function getFormsForProfile(profile: UserProfile): TaxFormDef[] {
  return ALL_TAX_FORMS.filter(form => form.applicableTo.includes(profile));
}

// Calculate estimated total time for all forms
export function getTotalEstimatedTime(forms: TaxFormDef[]): number {
  return forms.reduce((sum, form) => sum + form.estimatedMinutes, 0);
}
