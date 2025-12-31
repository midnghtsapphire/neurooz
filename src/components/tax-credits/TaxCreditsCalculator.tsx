import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, DollarSign, Users, Home, Car, GraduationCap, 
  Heart, Zap, CheckCircle2, XCircle, AlertTriangle, Info
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CreditResult {
  name: string;
  maxAmount: number;
  estimatedAmount: number;
  eligible: boolean;
  phaseOutApplied: boolean;
  reason?: string;
  category: string;
  icon: React.ReactNode;
}

interface CalculatorInputs {
  filingStatus: string;
  agi: number;
  earnedIncome: number;
  childrenUnder6: number;
  children6to16: number;
  dependentsForCare: number;
  childCareExpenses: number;
  collegeStudents: number;
  tuitionPaid: number;
  retirementContributions: number;
  purchasedNewEV: boolean;
  evPrice: number;
  evMSRPLimit: boolean;
  purchasedUsedEV: boolean;
  usedEVPrice: number;
  solarInstalled: boolean;
  solarCost: number;
  homeImprovements: boolean;
  heatPumpInstalled: boolean;
  homeImprovementCost: number;
  hasHealthInsurance: boolean;
  marketplacePremiums: number;
  isSmallBusinessOwner: boolean;
  hiredTargetedEmployees: boolean;
  researchExpenses: number;
}

const FILING_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "mfj", label: "Married Filing Jointly" },
  { value: "mfs", label: "Married Filing Separately" },
  { value: "hoh", label: "Head of Household" },
];

export function TaxCreditsCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    filingStatus: "single",
    agi: 0,
    earnedIncome: 0,
    childrenUnder6: 0,
    children6to16: 0,
    dependentsForCare: 0,
    childCareExpenses: 0,
    collegeStudents: 0,
    tuitionPaid: 0,
    retirementContributions: 0,
    purchasedNewEV: false,
    evPrice: 0,
    evMSRPLimit: true,
    purchasedUsedEV: false,
    usedEVPrice: 0,
    solarInstalled: false,
    solarCost: 0,
    homeImprovements: false,
    heatPumpInstalled: false,
    homeImprovementCost: 0,
    hasHealthInsurance: false,
    marketplacePremiums: 0,
    isSmallBusinessOwner: false,
    hiredTargetedEmployees: false,
    researchExpenses: 0,
  });

  const [showResults, setShowResults] = useState(false);

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const credits = useMemo((): CreditResult[] => {
    const results: CreditResult[] = [];
    const isMFJ = inputs.filingStatus === "mfj";
    const isMFS = inputs.filingStatus === "mfs";
    const totalChildren = inputs.childrenUnder6 + inputs.children6to16;

    // Child Tax Credit
    const ctcPhaseOutStart = isMFJ ? 400000 : 200000;
    const ctcReduction = Math.max(0, Math.floor((inputs.agi - ctcPhaseOutStart) / 1000) * 50);
    const ctcMaxPerChild = 2000;
    const ctcMax = totalChildren * ctcMaxPerChild;
    const ctcAmount = Math.max(0, ctcMax - ctcReduction);
    results.push({
      name: "Child Tax Credit",
      maxAmount: ctcMax,
      estimatedAmount: ctcAmount,
      eligible: totalChildren > 0 && ctcAmount > 0,
      phaseOutApplied: ctcReduction > 0,
      reason: totalChildren === 0 ? "No qualifying children" : ctcAmount === 0 ? "Income exceeds limit" : undefined,
      category: "Family",
      icon: <Users className="h-4 w-4" />,
    });

    // Earned Income Tax Credit
    const eitcLimits: Record<number, { max: number; incomeLimit: number }> = {
      0: { max: 632, incomeLimit: isMFJ ? 24210 : 17640 },
      1: { max: 4213, incomeLimit: isMFJ ? 53120 : 46560 },
      2: { max: 6960, incomeLimit: isMFJ ? 59478 : 52918 },
      3: { max: 7830, incomeLimit: isMFJ ? 63698 : 57414 },
    };
    const eitcKey = Math.min(totalChildren, 3) as 0 | 1 | 2 | 3;
    const eitcData = eitcLimits[eitcKey];
    const eitcEligible = inputs.earnedIncome > 0 && inputs.agi <= eitcData.incomeLimit;
    const eitcAmount = eitcEligible ? Math.min(eitcData.max, eitcData.max * (1 - inputs.agi / eitcData.incomeLimit)) : 0;
    results.push({
      name: "Earned Income Tax Credit",
      maxAmount: eitcData.max,
      estimatedAmount: Math.round(eitcAmount),
      eligible: eitcEligible,
      phaseOutApplied: eitcAmount < eitcData.max && eitcAmount > 0,
      reason: !eitcEligible ? (inputs.earnedIncome === 0 ? "No earned income" : "Income exceeds limit") : undefined,
      category: "Family",
      icon: <Heart className="h-4 w-4" />,
    });

    // Child and Dependent Care Credit
    const careExpenseLimit = inputs.dependentsForCare >= 2 ? 6000 : 3000;
    const qualifiedCareExpenses = Math.min(inputs.childCareExpenses, careExpenseLimit);
    const careRate = inputs.agi <= 15000 ? 0.35 : Math.max(0.2, 0.35 - Math.floor((inputs.agi - 15000) / 2000) * 0.01);
    const careCreditAmount = Math.round(qualifiedCareExpenses * careRate);
    results.push({
      name: "Child and Dependent Care Credit",
      maxAmount: Math.round(careExpenseLimit * 0.35),
      estimatedAmount: careCreditAmount,
      eligible: inputs.dependentsForCare > 0 && inputs.childCareExpenses > 0,
      phaseOutApplied: careRate < 0.35,
      reason: inputs.dependentsForCare === 0 ? "No dependents for care" : inputs.childCareExpenses === 0 ? "No care expenses" : undefined,
      category: "Family",
      icon: <Users className="h-4 w-4" />,
    });

    // American Opportunity Tax Credit
    const aotcPhaseOutStart = isMFJ ? 160000 : 80000;
    const aotcPhaseOutEnd = isMFJ ? 180000 : 90000;
    const aotcMaxPerStudent = 2500;
    const aotcMax = inputs.collegeStudents * aotcMaxPerStudent;
    let aotcAmount = aotcMax;
    if (inputs.agi > aotcPhaseOutStart) {
      const reduction = Math.min(1, (inputs.agi - aotcPhaseOutStart) / (aotcPhaseOutEnd - aotcPhaseOutStart));
      aotcAmount = Math.round(aotcMax * (1 - reduction));
    }
    results.push({
      name: "American Opportunity Tax Credit",
      maxAmount: aotcMax,
      estimatedAmount: aotcAmount,
      eligible: inputs.collegeStudents > 0 && aotcAmount > 0 && !isMFS,
      phaseOutApplied: aotcAmount < aotcMax,
      reason: isMFS ? "Not available for MFS" : inputs.collegeStudents === 0 ? "No eligible students" : aotcAmount === 0 ? "Income exceeds limit" : undefined,
      category: "Education",
      icon: <GraduationCap className="h-4 w-4" />,
    });

    // Lifetime Learning Credit
    const llcPhaseOutStart = isMFJ ? 160000 : 80000;
    const llcPhaseOutEnd = isMFJ ? 180000 : 90000;
    const llcMax = Math.min(2000, inputs.tuitionPaid * 0.2);
    let llcAmount = llcMax;
    if (inputs.agi > llcPhaseOutStart) {
      const reduction = Math.min(1, (inputs.agi - llcPhaseOutStart) / (llcPhaseOutEnd - llcPhaseOutStart));
      llcAmount = Math.round(llcMax * (1 - reduction));
    }
    results.push({
      name: "Lifetime Learning Credit",
      maxAmount: 2000,
      estimatedAmount: llcAmount,
      eligible: inputs.tuitionPaid > 0 && llcAmount > 0 && !isMFS,
      phaseOutApplied: llcAmount < llcMax,
      reason: isMFS ? "Not available for MFS" : inputs.tuitionPaid === 0 ? "No tuition expenses" : llcAmount === 0 ? "Income exceeds limit" : undefined,
      category: "Education",
      icon: <GraduationCap className="h-4 w-4" />,
    });

    // Saver's Credit
    const saverLimits = {
      single: { tier1: 23000, tier2: 25000, tier3: 38250 },
      mfj: { tier1: 46000, tier2: 50000, tier3: 76500 },
      hoh: { tier1: 34500, tier2: 37500, tier3: 57375 },
      mfs: { tier1: 23000, tier2: 25000, tier3: 38250 },
    };
    const saverLimit = saverLimits[inputs.filingStatus as keyof typeof saverLimits];
    let saverRate = 0;
    if (inputs.agi <= saverLimit.tier1) saverRate = 0.5;
    else if (inputs.agi <= saverLimit.tier2) saverRate = 0.2;
    else if (inputs.agi <= saverLimit.tier3) saverRate = 0.1;
    const saverContribution = Math.min(inputs.retirementContributions, isMFJ ? 4000 : 2000);
    const saverAmount = Math.round(saverContribution * saverRate);
    results.push({
      name: "Saver's Credit",
      maxAmount: isMFJ ? 2000 : 1000,
      estimatedAmount: saverAmount,
      eligible: inputs.retirementContributions > 0 && saverRate > 0,
      phaseOutApplied: saverRate < 0.5 && saverRate > 0,
      reason: inputs.retirementContributions === 0 ? "No retirement contributions" : saverRate === 0 ? "Income exceeds limit" : undefined,
      category: "Retirement",
      icon: <DollarSign className="h-4 w-4" />,
    });

    // Clean Vehicle Credit (New EV)
    const evIncomeLimit = isMFJ ? 300000 : 150000;
    const evEligible = inputs.purchasedNewEV && inputs.agi <= evIncomeLimit && inputs.evMSRPLimit;
    results.push({
      name: "Clean Vehicle Credit (New EV)",
      maxAmount: 7500,
      estimatedAmount: evEligible ? 7500 : 0,
      eligible: evEligible,
      phaseOutApplied: false,
      reason: !inputs.purchasedNewEV ? "No new EV purchased" : inputs.agi > evIncomeLimit ? "Income exceeds limit" : !inputs.evMSRPLimit ? "MSRP exceeds limit" : undefined,
      category: "Clean Energy",
      icon: <Car className="h-4 w-4" />,
    });

    // Used Clean Vehicle Credit
    const usedEVIncomeLimit = isMFJ ? 150000 : 75000;
    const usedEVEligible = inputs.purchasedUsedEV && inputs.agi <= usedEVIncomeLimit && inputs.usedEVPrice <= 25000;
    const usedEVAmount = usedEVEligible ? Math.min(4000, inputs.usedEVPrice * 0.3) : 0;
    results.push({
      name: "Used Clean Vehicle Credit",
      maxAmount: 4000,
      estimatedAmount: Math.round(usedEVAmount),
      eligible: usedEVEligible,
      phaseOutApplied: false,
      reason: !inputs.purchasedUsedEV ? "No used EV purchased" : inputs.agi > usedEVIncomeLimit ? "Income exceeds limit" : inputs.usedEVPrice > 25000 ? "Price exceeds $25,000 limit" : undefined,
      category: "Clean Energy",
      icon: <Car className="h-4 w-4" />,
    });

    // Residential Clean Energy Credit (Solar)
    const solarAmount = inputs.solarInstalled ? Math.round(inputs.solarCost * 0.3) : 0;
    results.push({
      name: "Residential Clean Energy Credit",
      maxAmount: inputs.solarCost ? Math.round(inputs.solarCost * 0.3) : 0,
      estimatedAmount: solarAmount,
      eligible: inputs.solarInstalled && inputs.solarCost > 0,
      phaseOutApplied: false,
      reason: !inputs.solarInstalled ? "No solar/clean energy installed" : undefined,
      category: "Clean Energy",
      icon: <Zap className="h-4 w-4" />,
    });

    // Energy Efficient Home Improvement Credit
    const homeImpMax = inputs.heatPumpInstalled ? 3200 : 1200;
    const homeImpAmount = inputs.homeImprovements ? Math.min(homeImpMax, inputs.homeImprovementCost * 0.3) : 0;
    results.push({
      name: "Energy Efficient Home Improvement Credit",
      maxAmount: homeImpMax,
      estimatedAmount: Math.round(homeImpAmount),
      eligible: inputs.homeImprovements && inputs.homeImprovementCost > 0,
      phaseOutApplied: false,
      reason: !inputs.homeImprovements ? "No qualifying improvements" : undefined,
      category: "Clean Energy",
      icon: <Home className="h-4 w-4" />,
    });

    // Work Opportunity Tax Credit (Business)
    if (inputs.isSmallBusinessOwner) {
      results.push({
        name: "Work Opportunity Tax Credit",
        maxAmount: 9600,
        estimatedAmount: inputs.hiredTargetedEmployees ? 2400 : 0,
        eligible: inputs.hiredTargetedEmployees,
        phaseOutApplied: false,
        reason: !inputs.hiredTargetedEmployees ? "No targeted employees hired" : undefined,
        category: "Business",
        icon: <Calculator className="h-4 w-4" />,
      });

      // R&D Credit
      const rdCredit = inputs.researchExpenses > 0 ? Math.round(inputs.researchExpenses * 0.14) : 0;
      results.push({
        name: "R&D Tax Credit (Simplified)",
        maxAmount: inputs.researchExpenses ? Math.round(inputs.researchExpenses * 0.2) : 0,
        estimatedAmount: rdCredit,
        eligible: inputs.researchExpenses > 0,
        phaseOutApplied: false,
        reason: inputs.researchExpenses === 0 ? "No qualified research expenses" : undefined,
        category: "Business",
        icon: <Calculator className="h-4 w-4" />,
      });
    }

    return results;
  }, [inputs]);

  const totalEligibleCredits = credits.filter((c) => c.eligible).reduce((sum, c) => sum + c.estimatedAmount, 0);
  const eligibleCount = credits.filter((c) => c.eligible).length;

  const categories = [...new Set(credits.map((c) => c.category))];

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tax Credits Calculator
          </CardTitle>
          <CardDescription>
            Enter your information to see which tax credits you may qualify for in 2024
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filing Status & Income */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Income & Filing Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Filing Status</Label>
                <Select value={inputs.filingStatus} onValueChange={(v) => updateInput("filingStatus", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILING_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Adjusted Gross Income (AGI)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={inputs.agi || ""}
                  onChange={(e) => updateInput("agi", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Earned Income (Wages)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={inputs.earnedIncome || ""}
                  onChange={(e) => updateInput("earnedIncome", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Family */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Family & Dependents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Children Under 6</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.childrenUnder6}
                  onChange={(e) => updateInput("childrenUnder6", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Children 6-17</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.children6to16}
                  onChange={(e) => updateInput("children6to16", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Dependents Needing Care</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.dependentsForCare}
                  onChange={(e) => updateInput("dependentsForCare", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Child Care Expenses</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={inputs.childCareExpenses || ""}
                  onChange={(e) => updateInput("childCareExpenses", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Education */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>College Students (First 4 Years)</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.collegeStudents}
                  onChange={(e) => updateInput("collegeStudents", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Tuition Paid</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={inputs.tuitionPaid || ""}
                  onChange={(e) => updateInput("tuitionPaid", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Retirement Contributions</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={inputs.retirementContributions || ""}
                  onChange={(e) => updateInput("retirementContributions", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Clean Energy */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Clean Energy & Vehicles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Purchased New Electric Vehicle</Label>
                  <Switch
                    checked={inputs.purchasedNewEV}
                    onCheckedChange={(v) => updateInput("purchasedNewEV", v)}
                  />
                </div>
                {inputs.purchasedNewEV && (
                  <>
                    <div>
                      <Label className="text-xs">EV Purchase Price</Label>
                      <Input
                        type="number"
                        value={inputs.evPrice || ""}
                        onChange={(e) => updateInput("evPrice", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">MSRP Under $55K (cars) / $80K (SUVs)</Label>
                      <Switch
                        checked={inputs.evMSRPLimit}
                        onCheckedChange={(v) => updateInput("evMSRPLimit", v)}
                      />
                    </div>
                  </>
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Purchased Used Electric Vehicle</Label>
                  <Switch
                    checked={inputs.purchasedUsedEV}
                    onCheckedChange={(v) => updateInput("purchasedUsedEV", v)}
                  />
                </div>
                {inputs.purchasedUsedEV && (
                  <div>
                    <Label className="text-xs">Used EV Purchase Price</Label>
                    <Input
                      type="number"
                      value={inputs.usedEVPrice || ""}
                      onChange={(e) => updateInput("usedEVPrice", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Installed Solar/Wind/Battery</Label>
                  <Switch
                    checked={inputs.solarInstalled}
                    onCheckedChange={(v) => updateInput("solarInstalled", v)}
                  />
                </div>
                {inputs.solarInstalled && (
                  <div>
                    <Label className="text-xs">Total Installation Cost</Label>
                    <Input
                      type="number"
                      value={inputs.solarCost || ""}
                      onChange={(e) => updateInput("solarCost", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Home Energy Improvements</Label>
                  <Switch
                    checked={inputs.homeImprovements}
                    onCheckedChange={(v) => updateInput("homeImprovements", v)}
                  />
                </div>
                {inputs.homeImprovements && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Includes Heat Pump</Label>
                      <Switch
                        checked={inputs.heatPumpInstalled}
                        onCheckedChange={(v) => updateInput("heatPumpInstalled", v)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Total Improvement Cost</Label>
                      <Input
                        type="number"
                        value={inputs.homeImprovementCost || ""}
                        onChange={(e) => updateInput("homeImprovementCost", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>

          <Separator />

          {/* Business */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Business Credits (Optional)
                </span>
                <Info className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Are you a small business owner?</Label>
                <Switch
                  checked={inputs.isSmallBusinessOwner}
                  onCheckedChange={(v) => updateInput("isSmallBusinessOwner", v)}
                />
              </div>
              {inputs.isSmallBusinessOwner && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Hired targeted employees (veterans, etc.)</Label>
                    <Switch
                      checked={inputs.hiredTargetedEmployees}
                      onCheckedChange={(v) => updateInput("hiredTargetedEmployees", v)}
                    />
                  </div>
                  <div>
                    <Label>Qualified Research Expenses</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={inputs.researchExpenses || ""}
                      onChange={(e) => updateInput("researchExpenses", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Button onClick={() => setShowResults(true)} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate My Credits
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Estimated Total Tax Credits
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You may qualify for {eligibleCount} credit{eligibleCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300">
                    ${totalEligibleCredits.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">potential savings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits by Category */}
          {categories.map((category) => {
            const categoryCredits = credits.filter((c) => c.category === category);
            const hasEligible = categoryCredits.some((c) => c.eligible);

            return (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {categoryCredits[0]?.icon}
                    {category} Credits
                    {hasEligible && (
                      <Badge variant="default" className="ml-2">
                        Eligible
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryCredits.map((credit) => (
                    <div
                      key={credit.name}
                      className={`p-4 rounded-lg border ${
                        credit.eligible
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                          : "bg-muted/50 border-muted"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {credit.eligible ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <h4 className="font-medium">{credit.name}</h4>
                            {credit.phaseOutApplied && (
                              <Badge variant="outline" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Phase-out applied
                              </Badge>
                            )}
                          </div>
                          {credit.reason && (
                            <p className="text-sm text-muted-foreground mt-1 ml-6">{credit.reason}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {credit.eligible ? (
                            <>
                              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                ${credit.estimatedAmount.toLocaleString()}
                              </p>
                              {credit.estimatedAmount < credit.maxAmount && credit.maxAmount > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  of ${credit.maxAmount.toLocaleString()} max
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-muted-foreground">$0</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium">Disclaimer</p>
                  <p className="mt-1">
                    This calculator provides estimates based on 2024 tax law. Actual credits depend on your complete tax situation. 
                    Consult a tax professional for personalized advice. Some credits have additional requirements not captured here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
