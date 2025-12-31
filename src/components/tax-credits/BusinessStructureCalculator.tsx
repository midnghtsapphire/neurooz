import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Calculator, 
  Building2, 
  User, 
  Users, 
  Briefcase, 
  Building,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Heart,
  Home,
  Landmark,
  FileText
} from "lucide-react";
import { formatCurrency, formatPercentage, getTaxBracketRate, TAX_RATES } from "@/lib/tax-calculations";

type FilingStatus = "single" | "married_filing_jointly" | "head_of_household";
type BusinessStructure = "sole_proprietor" | "single_member_llc" | "llc_s_corp" | "partnership" | "c_corp";

interface CalculatorInputs {
  grossRevenue: number;
  businessExpenses: number;
  filingStatus: FilingStatus;
  otherIncome: number;
  // Schedule A inputs
  medicalExpenses: number;
  stateLocalTaxes: number;
  mortgageInterest: number;
  charitableDonations: number;
  // S-Corp specific
  reasonableSalary: number;
  // Partnership specific
  ownershipPercentage: number;
}

interface StructureResult {
  structure: BusinessStructure;
  label: string;
  icon: React.ReactNode;
  netProfit: number;
  selfEmploymentTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  qbiDeduction: number;
  incomeTax: number;
  corporateTax: number;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
  notes: string[];
  warnings: string[];
  recommended: boolean;
}

// 2024 Standard deductions
const STANDARD_DEDUCTIONS = {
  single: 14600,
  married_filing_jointly: 29200,
  head_of_household: 21900,
};

// SALT cap
const SALT_CAP = 10000;

// Medical expense threshold (7.5% of AGI)
const MEDICAL_THRESHOLD_RATE = 0.075;

// C-Corp tax rate
const C_CORP_TAX_RATE = 0.21;

// Social Security wage base for 2024
const SS_WAGE_BASE = 168600;

export function BusinessStructureCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    grossRevenue: 80000,
    businessExpenses: 15000,
    filingStatus: "single",
    otherIncome: 0,
    medicalExpenses: 0,
    stateLocalTaxes: 8000,
    mortgageInterest: 12000,
    charitableDonations: 2000,
    reasonableSalary: 50000,
    ownershipPercentage: 100,
  });
  
  const [showResults, setShowResults] = useState(false);
  const [useItemized, setUseItemized] = useState(false);

  const updateInput = (key: keyof CalculatorInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Calculate Schedule A itemized deductions
  const calculateItemizedDeductions = (agi: number): number => {
    // Medical: only amount exceeding 7.5% of AGI
    const medicalDeductible = Math.max(0, inputs.medicalExpenses - (agi * MEDICAL_THRESHOLD_RATE));
    
    // SALT capped at $10,000
    const saltDeductible = Math.min(inputs.stateLocalTaxes, SALT_CAP);
    
    // Mortgage interest (simplified - full amount)
    const mortgageDeductible = inputs.mortgageInterest;
    
    // Charitable (simplified - up to 60% of AGI for cash)
    const charityLimit = agi * 0.60;
    const charityDeductible = Math.min(inputs.charitableDonations, charityLimit);
    
    return medicalDeductible + saltDeductible + mortgageDeductible + charityDeductible;
  };

  const results = useMemo((): StructureResult[] => {
    const netProfit = inputs.grossRevenue - inputs.businessExpenses;
    const partnershipShare = netProfit * (inputs.ownershipPercentage / 100);
    
    const structures: StructureResult[] = [];
    
    // Helper function to calculate SE tax
    const calcSETax = (earnings: number) => {
      const seNetEarnings = earnings * 0.9235;
      const ssTax = Math.min(seNetEarnings, SS_WAGE_BASE) * TAX_RATES.socialSecurityRate;
      const medicareTax = seNetEarnings * TAX_RATES.medicareRate;
      return {
        total: ssTax + medicareTax,
        ss: ssTax,
        medicare: medicareTax,
      };
    };
    
    // Helper to get deduction (standard vs itemized)
    const getDeduction = (agi: number) => {
      const itemized = calculateItemizedDeductions(agi);
      const standard = STANDARD_DEDUCTIONS[inputs.filingStatus];
      if (useItemized) {
        return { amount: itemized, type: 'itemized' as const };
      }
      return itemized > standard 
        ? { amount: itemized, type: 'itemized' as const }
        : { amount: standard, type: 'standard' as const };
    };
    
    // 1. SOLE PROPRIETOR
    const sp_seTax = calcSETax(netProfit);
    const sp_seDeduction = sp_seTax.total / 2; // Deductible half of SE tax
    const sp_agi = netProfit + inputs.otherIncome - sp_seDeduction;
    const sp_qbi = netProfit * TAX_RATES.qbiDeduction;
    const sp_deduction = getDeduction(sp_agi);
    const sp_taxableIncome = Math.max(0, sp_agi - sp_deduction.amount - sp_qbi);
    const sp_taxRate = getTaxBracketRate(sp_taxableIncome, inputs.filingStatus);
    const sp_incomeTax = sp_taxableIncome * sp_taxRate;
    
    structures.push({
      structure: "sole_proprietor",
      label: "Sole Proprietor",
      icon: <User className="h-5 w-5" />,
      netProfit,
      selfEmploymentTax: sp_seTax.total,
      socialSecurityTax: sp_seTax.ss,
      medicareTax: sp_seTax.medicare,
      qbiDeduction: sp_qbi,
      incomeTax: sp_incomeTax,
      corporateTax: 0,
      totalTax: sp_seTax.total + sp_incomeTax,
      takeHome: netProfit - sp_seTax.total - sp_incomeTax,
      effectiveRate: (sp_seTax.total + sp_incomeTax) / netProfit,
      notes: [
        "Simplest structure - file Schedule C",
        `Using ${sp_deduction.type} deduction: ${formatCurrency(sp_deduction.amount)}`,
        `20% QBI deduction saves ${formatCurrency(sp_qbi * sp_taxRate)}`,
        "All profit subject to 15.3% SE tax",
      ],
      warnings: netProfit > 60000 ? ["Consider S-Corp election for SE tax savings"] : [],
      recommended: netProfit < 50000,
    });
    
    // 2. SINGLE-MEMBER LLC (Same tax treatment as Sole Prop)
    structures.push({
      ...structures[0],
      structure: "single_member_llc",
      label: "Single-Member LLC",
      icon: <Building2 className="h-5 w-5" />,
      notes: [
        "Disregarded entity - same taxes as Sole Prop",
        "Provides liability protection",
        `Using ${sp_deduction.type} deduction: ${formatCurrency(sp_deduction.amount)}`,
        "May have state filing fees ($50-$800/year)",
      ],
      warnings: netProfit > 60000 
        ? ["Consider S-Corp election to reduce SE tax"] 
        : [],
      recommended: netProfit >= 30000 && netProfit < 60000,
    });
    
    // 3. LLC TAXED AS S-CORP
    const reasonableSalary = Math.min(inputs.reasonableSalary, netProfit * 0.7);
    const distributions = Math.max(0, netProfit - reasonableSalary);
    
    // Payroll taxes on salary only (employer + employee)
    const scorp_ssTaxEmployee = Math.min(reasonableSalary, SS_WAGE_BASE) * (TAX_RATES.socialSecurityRate / 2);
    const scorp_ssTaxEmployer = Math.min(reasonableSalary, SS_WAGE_BASE) * (TAX_RATES.socialSecurityRate / 2);
    const scorp_medicareTaxEmployee = reasonableSalary * (TAX_RATES.medicareRate / 2);
    const scorp_medicareTaxEmployer = reasonableSalary * (TAX_RATES.medicareRate / 2);
    const scorp_totalPayrollTax = scorp_ssTaxEmployee + scorp_ssTaxEmployer + scorp_medicareTaxEmployee + scorp_medicareTaxEmployer;
    
    // QBI on distributions only (salary not eligible)
    const scorp_qbi = distributions * TAX_RATES.qbiDeduction;
    
    // Income tax on salary + distributions
    const scorp_agi = reasonableSalary + distributions + inputs.otherIncome;
    const scorp_deduction = getDeduction(scorp_agi);
    const scorp_taxableIncome = Math.max(0, scorp_agi - scorp_deduction.amount - scorp_qbi);
    const scorp_taxRate = getTaxBracketRate(scorp_taxableIncome, inputs.filingStatus);
    const scorp_incomeTax = scorp_taxableIncome * scorp_taxRate;
    
    // S-Corp costs
    const scorp_adminCosts = 2000; // Payroll service, tax prep, etc.
    
    const scorp_totalTax = scorp_totalPayrollTax + scorp_incomeTax + scorp_adminCosts;
    const scorp_savings = (sp_seTax.total + sp_incomeTax) - scorp_totalTax;
    
    structures.push({
      structure: "llc_s_corp",
      label: "LLC taxed as S-Corp",
      icon: <Briefcase className="h-5 w-5" />,
      netProfit,
      selfEmploymentTax: scorp_totalPayrollTax,
      socialSecurityTax: scorp_ssTaxEmployee + scorp_ssTaxEmployer,
      medicareTax: scorp_medicareTaxEmployee + scorp_medicareTaxEmployer,
      qbiDeduction: scorp_qbi,
      incomeTax: scorp_incomeTax,
      corporateTax: 0,
      totalTax: scorp_totalTax,
      takeHome: netProfit - scorp_totalTax,
      effectiveRate: scorp_totalTax / netProfit,
      notes: [
        `Reasonable salary: ${formatCurrency(reasonableSalary)}`,
        `Tax-free distributions: ${formatCurrency(distributions)}`,
        `SE tax savings: ${formatCurrency(Math.max(0, sp_seTax.total - scorp_totalPayrollTax))}`,
        `Admin costs included: ~${formatCurrency(scorp_adminCosts)}/year`,
        scorp_savings > 0 ? `Net savings vs Sole Prop: ${formatCurrency(scorp_savings)}` : "",
      ].filter(Boolean),
      warnings: [
        reasonableSalary < netProfit * 0.4 ? "IRS may challenge salary as too low" : "",
        netProfit < 50000 ? "Admin costs may outweigh tax savings" : "",
      ].filter(Boolean),
      recommended: netProfit >= 60000,
    });
    
    // 4. PARTNERSHIP (Multi-member LLC)
    const partner_seTax = calcSETax(partnershipShare);
    const partner_seDeduction = partner_seTax.total / 2;
    const partner_agi = partnershipShare + inputs.otherIncome - partner_seDeduction;
    const partner_qbi = partnershipShare * TAX_RATES.qbiDeduction;
    const partner_deduction = getDeduction(partner_agi);
    const partner_taxableIncome = Math.max(0, partner_agi - partner_deduction.amount - partner_qbi);
    const partner_taxRate = getTaxBracketRate(partner_taxableIncome, inputs.filingStatus);
    const partner_incomeTax = partner_taxableIncome * partner_taxRate;
    
    structures.push({
      structure: "partnership",
      label: "Partnership",
      icon: <Users className="h-5 w-5" />,
      netProfit: partnershipShare,
      selfEmploymentTax: partner_seTax.total,
      socialSecurityTax: partner_seTax.ss,
      medicareTax: partner_seTax.medicare,
      qbiDeduction: partner_qbi,
      incomeTax: partner_incomeTax,
      corporateTax: 0,
      totalTax: partner_seTax.total + partner_incomeTax,
      takeHome: partnershipShare - partner_seTax.total - partner_incomeTax,
      effectiveRate: (partner_seTax.total + partner_incomeTax) / partnershipShare,
      notes: [
        `Your ${inputs.ownershipPercentage}% share: ${formatCurrency(partnershipShare)}`,
        "K-1 pass-through taxation",
        `QBI deduction on your share: ${formatCurrency(partner_qbi)}`,
        "Partnership files Form 1065",
      ],
      warnings: inputs.ownershipPercentage < 50 
        ? ["Limited control with minority ownership"] 
        : [],
      recommended: false,
    });
    
    // 5. C-CORPORATION
    const ccorp_corpTax = netProfit * C_CORP_TAX_RATE;
    const ccorp_afterTax = netProfit - ccorp_corpTax;
    
    // If taking salary
    const ccorp_salary = Math.min(inputs.reasonableSalary, netProfit);
    const ccorp_ssTax = Math.min(ccorp_salary, SS_WAGE_BASE) * TAX_RATES.socialSecurityRate;
    const ccorp_medicareTax = ccorp_salary * TAX_RATES.medicareRate;
    const ccorp_payrollTax = ccorp_ssTax + ccorp_medicareTax;
    
    // Corporate profit after salary expense
    const ccorp_corpProfit = netProfit - ccorp_salary;
    const ccorp_corpTaxActual = ccorp_corpProfit * C_CORP_TAX_RATE;
    
    // Dividend tax on distributions (qualified dividends at 15%)
    const ccorp_dividends = ccorp_corpProfit - ccorp_corpTaxActual;
    const ccorp_dividendTax = ccorp_dividends * 0.15;
    
    // Personal income tax on salary
    const ccorp_agi = ccorp_salary + inputs.otherIncome;
    const ccorp_deduction = getDeduction(ccorp_agi);
    const ccorp_taxableIncome = Math.max(0, ccorp_agi - ccorp_deduction.amount);
    const ccorp_taxRate = getTaxBracketRate(ccorp_taxableIncome, inputs.filingStatus);
    const ccorp_incomeTax = ccorp_taxableIncome * ccorp_taxRate;
    
    const ccorp_totalTax = ccorp_payrollTax + ccorp_corpTaxActual + ccorp_dividendTax + ccorp_incomeTax;
    
    structures.push({
      structure: "c_corp",
      label: "C Corporation",
      icon: <Building className="h-5 w-5" />,
      netProfit,
      selfEmploymentTax: ccorp_payrollTax,
      socialSecurityTax: ccorp_ssTax,
      medicareTax: ccorp_medicareTax,
      qbiDeduction: 0,
      incomeTax: ccorp_incomeTax,
      corporateTax: ccorp_corpTaxActual + ccorp_dividendTax,
      totalTax: ccorp_totalTax,
      takeHome: netProfit - ccorp_totalTax,
      effectiveRate: ccorp_totalTax / netProfit,
      notes: [
        "21% flat corporate tax rate",
        "Double taxation on dividends",
        `Corporate tax: ${formatCurrency(ccorp_corpTaxActual)}`,
        `Dividend tax (15%): ${formatCurrency(ccorp_dividendTax)}`,
        "No QBI deduction available",
      ],
      warnings: [
        "Double taxation reduces take-home",
        "Complex compliance requirements",
        "Not recommended for most small businesses",
      ],
      recommended: false,
    });
    
    return structures;
  }, [inputs, useItemized]);

  const bestOption = useMemo(() => {
    return results.reduce((best, current) => 
      current.totalTax < best.totalTax ? current : best
    );
  }, [results]);

  const itemizedTotal = useMemo(() => {
    const agi = inputs.grossRevenue - inputs.businessExpenses + inputs.otherIncome;
    return calculateItemizedDeductions(agi);
  }, [inputs]);

  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Business Structure Tax Comparison
          </CardTitle>
          <CardDescription>
            Compare SE tax + itemized deductions across all 5 business structures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="income" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="income">Income & Business</TabsTrigger>
              <TabsTrigger value="schedule-a">Schedule A</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="income" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="grossRevenue">Gross Business Revenue</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="grossRevenue"
                      type="number"
                      value={inputs.grossRevenue}
                      onChange={(e) => updateInput("grossRevenue", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessExpenses">Business Expenses</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessExpenses"
                      type="number"
                      value={inputs.businessExpenses}
                      onChange={(e) => updateInput("businessExpenses", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select 
                    value={inputs.filingStatus}
                    onValueChange={(v) => updateInput("filingStatus", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherIncome">Other Income (W-2, etc.)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otherIncome"
                      type="number"
                      value={inputs.otherIncome}
                      onChange={(e) => updateInput("otherIncome", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Net Business Profit</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(inputs.grossRevenue - inputs.businessExpenses)}
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule-a" className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <Label>Force Itemized Deductions</Label>
                  <p className="text-xs text-muted-foreground">
                    Standard: {formatCurrency(standardDeduction)} | Itemized: {formatCurrency(itemizedTotal)}
                  </p>
                </div>
                <Switch
                  checked={useItemized}
                  onCheckedChange={setUseItemized}
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="medicalExpenses" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Medical Expenses
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="medicalExpenses"
                      type="number"
                      value={inputs.medicalExpenses}
                      onChange={(e) => updateInput("medicalExpenses", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only amounts exceeding 7.5% of AGI are deductible
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stateLocalTaxes" className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-blue-500" />
                    State & Local Taxes (SALT)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="stateLocalTaxes"
                      type="number"
                      value={inputs.stateLocalTaxes}
                      onChange={(e) => updateInput("stateLocalTaxes", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Capped at $10,000 (income + property taxes)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mortgageInterest" className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-green-500" />
                    Mortgage Interest
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mortgageInterest"
                      type="number"
                      value={inputs.mortgageInterest}
                      onChange={(e) => updateInput("mortgageInterest", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deductible on loans up to $750K
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="charitableDonations" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    Charitable Donations
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="charitableDonations"
                      type="number"
                      value={inputs.charitableDonations}
                      onChange={(e) => updateInput("charitableDonations", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cash: up to 60% of AGI, Property: varies
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Medical (above 7.5% AGI)</span>
                  <span>{formatCurrency(Math.max(0, inputs.medicalExpenses - ((inputs.grossRevenue - inputs.businessExpenses + inputs.otherIncome) * 0.075)))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SALT (capped at $10K)</span>
                  <span>{formatCurrency(Math.min(inputs.stateLocalTaxes, SALT_CAP))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mortgage Interest</span>
                  <span>{formatCurrency(inputs.mortgageInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Charitable Donations</span>
                  <span>{formatCurrency(inputs.charitableDonations)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Itemized</span>
                  <span className={itemizedTotal > standardDeduction ? "text-green-600" : ""}>
                    {formatCurrency(itemizedTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Standard Deduction</span>
                  <span>{formatCurrency(standardDeduction)}</span>
                </div>
                {itemizedTotal > standardDeduction && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Itemizing saves {formatCurrency(itemizedTotal - standardDeduction)}
                  </Badge>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reasonableSalary">
                    S-Corp Reasonable Salary
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reasonableSalary"
                      type="number"
                      value={inputs.reasonableSalary}
                      onChange={(e) => updateInput("reasonableSalary", Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    IRS requires "reasonable" compensation for services
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownershipPercentage">
                    Partnership Ownership %
                  </Label>
                  <Input
                    id="ownershipPercentage"
                    type="number"
                    min={1}
                    max={100}
                    value={inputs.ownershipPercentage}
                    onChange={(e) => updateInput("ownershipPercentage", Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your share of partnership profits
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
                <h4 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  S-Corp Salary Guidelines
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1">
                  <li>• Typically 40-60% of net profit</li>
                  <li>• Must be comparable to industry standards</li>
                  <li>• Too low = IRS scrutiny, too high = wasted SE tax savings</li>
                  <li>• Factor in your actual duties and time spent</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button onClick={() => setShowResults(true)} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate All Structures
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showResults && (
        <>
          {/* Best Option Highlight */}
          <Card className="border-green-500 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                Recommended: {bestOption.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tax</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(bestOption.totalTax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Take Home</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(bestOption.takeHome)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Effective Rate</p>
                  <p className="text-xl font-bold">
                    {formatPercentage(bestOption.effectiveRate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SE Tax</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(bestOption.selfEmploymentTax)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* All Structures Comparison */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <Card 
                key={result.structure}
                className={result.structure === bestOption.structure ? "ring-2 ring-green-500" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {result.icon}
                      {result.label}
                    </CardTitle>
                    {result.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Net Profit</span>
                      <span>{formatCurrency(result.netProfit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SE/Payroll Tax</span>
                      <span className="text-red-600">-{formatCurrency(result.selfEmploymentTax)}</span>
                    </div>
                    <div className="flex justify-between text-sm pl-4 text-xs">
                      <span className="text-muted-foreground">Social Security</span>
                      <span>-{formatCurrency(result.socialSecurityTax)}</span>
                    </div>
                    <div className="flex justify-between text-sm pl-4 text-xs">
                      <span className="text-muted-foreground">Medicare</span>
                      <span>-{formatCurrency(result.medicareTax)}</span>
                    </div>
                    {result.qbiDeduction > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">QBI Deduction</span>
                        <span className="text-green-600">{formatCurrency(result.qbiDeduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Income Tax</span>
                      <span className="text-red-600">-{formatCurrency(result.incomeTax)}</span>
                    </div>
                    {result.corporateTax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Corp/Dividend Tax</span>
                        <span className="text-red-600">-{formatCurrency(result.corporateTax)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Tax</span>
                      <span className="text-red-600">{formatCurrency(result.totalTax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Take Home</span>
                      <span className="text-green-600">{formatCurrency(result.takeHome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Effective Rate</span>
                      <span>{formatPercentage(result.effectiveRate)}</span>
                    </div>
                  </div>
                  
                  {result.notes.length > 0 && (
                    <div className="space-y-1">
                      {result.notes.map((note, i) => (
                        <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                          {note}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {result.warnings.length > 0 && (
                    <div className="space-y-1">
                      {result.warnings.map((warning, i) => (
                        <p key={i} className="text-xs text-amber-600 flex items-start gap-1">
                          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {result.structure !== bestOption.structure && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {formatCurrency(result.totalTax - bestOption.totalTax)} more than {bestOption.label}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Key Percentages Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Tax Percentages Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">15.3%</p>
                  <p className="text-sm text-muted-foreground">Self-Employment Tax</p>
                  <p className="text-xs">12.4% SS + 2.9% Medicare</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">20%</p>
                  <p className="text-sm text-muted-foreground">QBI Deduction</p>
                  <p className="text-xs">Pass-through income deduction</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">21%</p>
                  <p className="text-sm text-muted-foreground">C-Corp Tax Rate</p>
                  <p className="text-xs">Flat federal rate</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">7.5%</p>
                  <p className="text-sm text-muted-foreground">Medical Threshold</p>
                  <p className="text-xs">% of AGI before deducting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
