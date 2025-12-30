import { z } from "zod";

// Common field schemas
const ssnSchema = z.string()
  .regex(/^\d{3}-?\d{2}-?\d{4}$/, "SSN must be in format XXX-XX-XXXX or XXXXXXXXX")
  .transform(val => val.replace(/-/g, ""));

const einSchema = z.string()
  .regex(/^\d{2}-?\d{7}$/, "EIN must be in format XX-XXXXXXX")
  .transform(val => val.replace(/-/g, ""));

const zipSchema = z.string()
  .regex(/^\d{5}(-\d{4})?$/, "ZIP must be 5 digits or ZIP+4 format");

const stateSchema = z.string().length(2, "Use 2-letter state code");

const addressSchema = z.object({
  street: z.string().min(1, "Address is required").max(100),
  apt: z.string().max(50).optional(),
  city: z.string().min(1, "City is required").max(50),
  state: stateSchema,
  zip: zipSchema,
});

// W-4 Form Schema (Employee's Withholding Certificate)
export const w4Schema = z.object({
  // Step 1: Personal Information
  firstName: z.string().min(1, "First name is required").max(50),
  middleInitial: z.string().max(1).optional(),
  lastName: z.string().min(1, "Last name is required").max(50),
  ssn: ssnSchema,
  address: addressSchema,
  
  // Filing Status
  filingStatus: z.enum(["single", "married_filing_jointly", "head_of_household"], {
    required_error: "Filing status is required",
  }),
  
  // Step 2: Multiple Jobs or Spouse Works
  multipleJobsOrSpouseWorks: z.boolean().default(false),
  
  // Step 3: Claim Dependents
  qualifyingChildren: z.number().min(0).max(20).default(0),
  otherDependents: z.number().min(0).max(20).default(0),
  
  // Step 4: Other Adjustments
  otherIncome: z.number().min(0).default(0),
  deductions: z.number().min(0).default(0),
  extraWithholding: z.number().min(0).default(0),
  
  // Signature
  signatureDate: z.string().optional(),
});

export type W4FormData = z.infer<typeof w4Schema>;

// W-9 Form Schema (Request for Taxpayer Identification Number)
export const w9Schema = z.object({
  // Line 1: Name
  name: z.string().min(1, "Name is required").max(100),
  
  // Line 2: Business name (if different)
  businessName: z.string().max(100).optional(),
  
  // Line 3: Federal tax classification
  taxClassification: z.enum([
    "individual_sole_proprietor",
    "c_corporation",
    "s_corporation",
    "partnership",
    "trust_estate",
    "llc_c",
    "llc_s",
    "llc_p",
    "other",
  ], {
    required_error: "Tax classification is required",
  }),
  otherClassification: z.string().max(50).optional(),
  
  // Line 4: Exemptions (optional)
  exemptPayeeCode: z.string().max(10).optional(),
  fatcaExemptionCode: z.string().max(10).optional(),
  
  // Lines 5-6: Address
  address: addressSchema,
  
  // Line 7: Account numbers (optional)
  accountNumbers: z.string().max(100).optional(),
  
  // Part I: Taxpayer Identification Number
  tinType: z.enum(["ssn", "ein"], {
    required_error: "TIN type is required",
  }),
  ssn: z.string().optional(),
  ein: z.string().optional(),
  
  // Part II: Certification
  certificationDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.tinType === "ssn") {
      return /^\d{3}-?\d{2}-?\d{4}$/.test(data.ssn || "");
    } else {
      return /^\d{2}-?\d{7}$/.test(data.ein || "");
    }
  },
  {
    message: "Valid SSN or EIN is required based on TIN type",
    path: ["ssn"],
  }
);

export type W9FormData = z.infer<typeof w9Schema>;

// 1099-NEC Form Schema (Nonemployee Compensation)
export const form1099NECSchema = z.object({
  // Payer information
  payerName: z.string().min(1, "Payer name is required").max(100),
  payerAddress: addressSchema,
  payerTIN: einSchema,
  payerPhone: z.string().max(20).optional(),
  
  // Recipient information
  recipientName: z.string().min(1, "Recipient name is required").max(100),
  recipientAddress: addressSchema,
  recipientTIN: z.string().min(1, "Recipient TIN is required"),
  
  // Account number
  accountNumber: z.string().max(50).optional(),
  
  // Box 1: Nonemployee compensation
  nonemployeeCompensation: z.number().min(0, "Amount must be positive"),
  
  // Box 4: Federal income tax withheld
  federalTaxWithheld: z.number().min(0).default(0),
  
  // Box 5-7: State tax info
  stateTaxWithheld: z.number().min(0).default(0),
  state: stateSchema.optional(),
  statePayerNumber: z.string().max(20).optional(),
  stateIncome: z.number().min(0).default(0),
});

export type Form1099NECData = z.infer<typeof form1099NECSchema>;

// Schedule C Form Schema (Profit or Loss From Business) - Enhanced for Amazon Vine
export const scheduleCSchema = z.object({
  // Business Info
  businessName: z.string().min(1, "Business name is required").max(100),
  principalBusinessCode: z.string().max(10).optional(),
  businessAddress: addressSchema.optional(),
  accountingMethod: z.enum(["cash", "accrual", "other"]).default("cash"),
  filingStatus: z.enum(["single", "married_filing_jointly", "head_of_household"]).default("single"),
  
  // Part I: Income
  grossReceipts: z.number().min(0, "Enter gross receipts"),
  returns: z.number().min(0).default(0),
  costOfGoodsSold: z.number().min(0).default(0),
  
  // Amazon Vine 50/20/0 Method Fields
  isVineIncome: z.boolean().default(true),
  brandItemsEtv: z.number().min(0).default(0),
  nonBrandItemsEtv: z.number().min(0).default(0),
  brokenItemsEtv: z.number().min(0).default(0),
  vineValueAdjustment: z.number().min(0).default(0), // Auto-calculated
  
  // Part II: Expenses (simplified)
  advertising: z.number().min(0).default(0),
  carAndTruck: z.number().min(0).default(0),
  commissions: z.number().min(0).default(0),
  contractLabor: z.number().min(0).default(0),
  depreciation: z.number().min(0).default(0),
  insurance: z.number().min(0).default(0),
  interest: z.number().min(0).default(0),
  legal: z.number().min(0).default(0),
  officeExpense: z.number().min(0).default(0),
  rent: z.number().min(0).default(0),
  repairs: z.number().min(0).default(0),
  supplies: z.number().min(0).default(0),
  taxes: z.number().min(0).default(0),
  travel: z.number().min(0).default(0),
  meals: z.number().min(0).default(0),
  utilities: z.number().min(0).default(0),
  wages: z.number().min(0).default(0),
  otherExpenses: z.number().min(0).default(0),
  otherExpensesDescription: z.string().max(500).optional(),
  
  // Home Office
  useHomeOffice: z.boolean().default(false),
  homeOfficeSquareFeet: z.number().min(0).max(300).default(0),
  homeOfficeDeduction: z.number().min(0).default(0), // Auto-calculated
  
  // Vehicle info
  vehicleMiles: z.number().min(0).default(0),
  vehicleBusinessMiles: z.number().min(0).default(0),
  mileageDeduction: z.number().min(0).default(0), // Auto-calculated
  
  // QBI Deduction
  claimQbiDeduction: z.boolean().default(true),
  estimatedOtherIncome: z.number().min(0).default(0), // For QBI eligibility calculation
});

export type ScheduleCData = z.infer<typeof scheduleCSchema>;

// Form type to schema mapping
export const formSchemas = {
  "W-4": w4Schema,
  "W-9": w9Schema,
  "1099-NEC": form1099NECSchema,
  "Schedule C": scheduleCSchema,
} as const;

export type TaxFormType = keyof typeof formSchemas;

// Default values for each form
export const formDefaults: Record<TaxFormType, unknown> = {
  "W-4": {
    firstName: "",
    lastName: "",
    middleInitial: "",
    ssn: "",
    address: { street: "", apt: "", city: "", state: "", zip: "" },
    filingStatus: "single",
    multipleJobsOrSpouseWorks: false,
    qualifyingChildren: 0,
    otherDependents: 0,
    otherIncome: 0,
    deductions: 0,
    extraWithholding: 0,
  },
  "W-9": {
    name: "",
    businessName: "",
    taxClassification: "individual_sole_proprietor",
    address: { street: "", apt: "", city: "", state: "", zip: "" },
    tinType: "ssn",
    ssn: "",
    ein: "",
  },
  "1099-NEC": {
    payerName: "",
    payerAddress: { street: "", apt: "", city: "", state: "", zip: "" },
    payerTIN: "",
    recipientName: "",
    recipientAddress: { street: "", apt: "", city: "", state: "", zip: "" },
    recipientTIN: "",
    nonemployeeCompensation: 0,
    federalTaxWithheld: 0,
    stateTaxWithheld: 0,
    stateIncome: 0,
  },
  "Schedule C": {
    businessName: "Product Review Services",
    principalBusinessCode: "561990",
    accountingMethod: "cash",
    filingStatus: "single",
    grossReceipts: 0,
    returns: 0,
    costOfGoodsSold: 0,
    // Vine 50/20/0 fields
    isVineIncome: true,
    brandItemsEtv: 0,
    nonBrandItemsEtv: 0,
    brokenItemsEtv: 0,
    vineValueAdjustment: 0,
    // Expenses
    advertising: 0,
    carAndTruck: 0,
    commissions: 0,
    contractLabor: 0,
    depreciation: 0,
    insurance: 0,
    interest: 0,
    legal: 0,
    officeExpense: 0,
    rent: 0,
    repairs: 0,
    supplies: 0,
    taxes: 0,
    travel: 0,
    meals: 0,
    utilities: 0,
    wages: 0,
    otherExpenses: 0,
    otherExpensesDescription: "Product value adjustment - 50/20/0 method (open box value reduction after product testing)",
    // Home office
    useHomeOffice: false,
    homeOfficeSquareFeet: 0,
    homeOfficeDeduction: 0,
    // Vehicle
    vehicleMiles: 0,
    vehicleBusinessMiles: 0,
    mileageDeduction: 0,
    // QBI
    claimQbiDeduction: true,
    estimatedOtherIncome: 0,
  },
};
