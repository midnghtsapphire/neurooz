import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScheduleCData } from "@/lib/tax-form-schemas";
import { 
  calculateVineValueReduction, 
  calculateScheduleCTaxes, 
  calculateMileageDeduction,
  calculateHomeOfficeDeduction,
  calculateQuarterlyPayment,
  getTaxBracketRate,
  formatCurrency,
  formatPercentage,
  TAX_RATES,
  BUSINESS_CODES,
  QUARTERLY_DUE_DATES,
} from "@/lib/tax-calculations";
import { Calculator, Info, Lightbulb, DollarSign, TrendingDown, FileText } from "lucide-react";

interface ScheduleCFormEditorProps {
  form: UseFormReturn<ScheduleCData>;
}

function CurrencyInput({ 
  value, 
  onChange, 
  placeholder = "0.00",
  disabled = false,
}: { 
  value: number; 
  onChange: (val: number) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
      <Input 
        type="number" 
        min={0}
        step="0.01"
        className="pl-7"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

export function ScheduleCFormEditor({ form }: ScheduleCFormEditorProps) {
  const values = form.watch();
  
  // Calculate Vine value reduction
  const vineCalc = calculateVineValueReduction(
    values.brandItemsEtv || 0,
    values.nonBrandItemsEtv || 0,
    values.brokenItemsEtv || 0
  );
  
  // Auto-update vineValueAdjustment when ETV values change
  useEffect(() => {
    if (values.isVineIncome) {
      form.setValue("vineValueAdjustment", vineCalc.totalReduction);
    }
  }, [values.brandItemsEtv, values.nonBrandItemsEtv, values.brokenItemsEtv, values.isVineIncome, vineCalc.totalReduction, form]);
  
  // Calculate mileage deduction
  const mileageDeduction = calculateMileageDeduction(values.vehicleBusinessMiles || 0);
  
  useEffect(() => {
    form.setValue("mileageDeduction", mileageDeduction);
    form.setValue("carAndTruck", mileageDeduction);
  }, [values.vehicleBusinessMiles, mileageDeduction, form]);
  
  // Calculate home office deduction
  const homeOfficeDeduction = values.useHomeOffice 
    ? calculateHomeOfficeDeduction(values.homeOfficeSquareFeet || 0)
    : 0;
  
  useEffect(() => {
    form.setValue("homeOfficeDeduction", homeOfficeDeduction);
  }, [values.useHomeOffice, values.homeOfficeSquareFeet, homeOfficeDeduction, form]);
  
  // Calculate totals
  const grossReceipts = values.grossReceipts || 0;
  const returns = values.returns || 0;
  const costOfGoodsSold = values.costOfGoodsSold || 0;
  const grossIncome = grossReceipts - returns - costOfGoodsSold;
  
  // Total all expenses including auto-calculated ones
  const totalExpenses = (
    (values.advertising || 0) +
    (values.carAndTruck || 0) +
    (values.commissions || 0) +
    (values.contractLabor || 0) +
    (values.depreciation || 0) +
    (values.insurance || 0) +
    (values.interest || 0) +
    (values.legal || 0) +
    (values.officeExpense || 0) +
    (values.rent || 0) +
    (values.repairs || 0) +
    (values.supplies || 0) +
    (values.taxes || 0) +
    (values.travel || 0) +
    (values.meals || 0) * TAX_RATES.mealsDeductionRate + // 50% deductible
    (values.utilities || 0) +
    (values.wages || 0) +
    (values.otherExpenses || 0) +
    (values.vineValueAdjustment || 0) + // Vine 50/20/0 deduction
    homeOfficeDeduction
  );
  
  const netProfit = grossIncome - totalExpenses;
  
  // Get tax bracket based on filing status
  const marginalRate = getTaxBracketRate(
    netProfit + (values.estimatedOtherIncome || 0),
    values.filingStatus || "single"
  );
  
  // Calculate taxes with QBI
  const taxCalc = calculateScheduleCTaxes(
    netProfit,
    marginalRate,
    values.claimQbiDeduction
  );
  
  const quarterlyPayment = calculateQuarterlyPayment(taxCalc.totalEstimatedTax);

  return (
    <div className="space-y-8">
      {/* Helpful Info Banner */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-medium text-primary">Amazon Vine Tax Guide</p>
              <p className="text-sm text-muted-foreground">
                This form includes the 50/20/0 method for reducing your taxable ETV. Brand items reduce to 50%, 
                non-brand to 20%, and broken/useless items to 0%. Enter your ETV breakdown below for automatic calculations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Principal business or profession, including product or service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Review Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="principalBusinessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Business Code (NAICS)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(BUSINESS_CODES).map(([code, description]) => (
                        <SelectItem key={code} value={code}>
                          {code} - {description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    561990 is recommended for product testing/reviews
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="accountingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accounting Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="accrual">Accrual</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Used for tax bracket and QBI eligibility calculations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Part I: Income */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Part I: Income
          </CardTitle>
          <CardDescription>
            Report your gross receipts (1099-NEC ETV) and calculate gross income
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="grossReceipts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 1: Gross Receipts or Sales (1099-NEC Amount)</FormLabel>
                <FormControl>
                  <CurrencyInput 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Enter the total ETV from your Amazon Vine 1099-NEC
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="returns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line 2: Returns and Allowances</FormLabel>
                  <FormControl>
                    <CurrencyInput 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="costOfGoodsSold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line 4: Cost of Goods Sold</FormLabel>
                  <FormControl>
                    <CurrencyInput 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">
              Gross Income (Line 5): <span className="text-primary text-lg">{formatCurrency(grossIncome)}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Amazon Vine 50/20/0 Calculator */}
      <Card className="border-secondary">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-secondary" />
            Amazon Vine 50/20/0 Value Reduction Calculator
            <Badge variant="secondary">Auto-Calculate</Badge>
          </CardTitle>
          <CardDescription>
            Break down your ETV by item category to calculate the allowable deduction
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <FormField
            control={form.control}
            name="isVineIncome"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Vine 50/20/0 Method</FormLabel>
                  <FormDescription>
                    Calculate value reduction for products received for review
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {values.isVineIncome && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="brandItemsEtv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Brand Name Items ETV
                        <Badge variant="outline" className="text-xs">50% value</Badge>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput 
                          value={field.value} 
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Deduction: {formatCurrency(vineCalc.brandReduction)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nonBrandItemsEtv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Non-Brand Items ETV
                        <Badge variant="outline" className="text-xs">20% value</Badge>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput 
                          value={field.value} 
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Deduction: {formatCurrency(vineCalc.nonBrandReduction)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brokenItemsEtv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Broken/Useless Items ETV
                        <Badge variant="outline" className="text-xs">0% value</Badge>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput 
                          value={field.value} 
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Deduction: {formatCurrency(vineCalc.brokenReduction)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-secondary/10 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total ETV:</span>
                  <span className="font-medium">{formatCurrency(vineCalc.totalEtv)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Total Value Reduction (Deduction):</span>
                  <span className="font-bold">-{formatCurrency(vineCalc.totalReduction)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Net Taxable Value:</span>
                  <span className="text-primary">{formatCurrency(vineCalc.netTaxableValue)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  This deduction will be reported as "Other Expenses" on Line 27 with the description: 
                  "Product value adjustment - 50/20/0 method (open box value reduction after product testing)"
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Part II: Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Part II: Expenses
          </CardTitle>
          <CardDescription>
            Deductible business expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "advertising", label: "Line 8: Advertising" },
              { name: "commissions", label: "Line 10: Commissions and Fees" },
              { name: "contractLabor", label: "Line 11: Contract Labor" },
              { name: "depreciation", label: "Line 13: Depreciation" },
              { name: "insurance", label: "Line 15: Insurance" },
              { name: "interest", label: "Line 16: Interest" },
              { name: "legal", label: "Line 17: Legal and Professional" },
              { name: "officeExpense", label: "Line 18: Office Expense", hint: "Photography equipment, props, backdrops" },
              { name: "rent", label: "Line 20: Rent" },
              { name: "repairs", label: "Line 21: Repairs and Maintenance" },
              { name: "supplies", label: "Line 22: Supplies" },
              { name: "taxes", label: "Line 23: Taxes and Licenses" },
              { name: "travel", label: "Line 24: Travel" },
              { name: "meals", label: "Line 24b: Meals (50% deductible)" },
              { name: "utilities", label: "Line 25: Utilities", hint: "Include portion of internet" },
              { name: "wages", label: "Line 26: Wages" },
            ].map((expense) => (
              <FormField
                key={expense.name}
                control={form.control}
                name={expense.name as keyof ScheduleCData}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{expense.label}</FormLabel>
                    <FormControl>
                      <CurrencyInput 
                        value={field.value as number} 
                        onChange={field.onChange}
                      />
                    </FormControl>
                    {(expense as { hint?: string }).hint && (
                      <FormDescription>{(expense as { hint?: string }).hint}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <FormField
            control={form.control}
            name="otherExpenses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 27: Other Expenses</FormLabel>
                <FormControl>
                  <CurrencyInput 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {values.isVineIncome && (
                    <span className="text-green-600">
                      + {formatCurrency(values.vineValueAdjustment || 0)} (Vine 50/20/0 adjustment added automatically)
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otherExpensesDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of Other Expenses</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe other expenses..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm">
              Total Expenses (Line 28): <span className="font-medium">{formatCurrency(totalExpenses)}</span>
            </p>
            {values.isVineIncome && (
              <p className="text-xs text-muted-foreground">
                Includes Vine 50/20/0 adjustment: {formatCurrency(values.vineValueAdjustment || 0)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Home Office Deduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Home Office Deduction (Simplified Method)</CardTitle>
          <CardDescription>
            $5 per square foot, up to 300 sq ft (max $1,500)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="useHomeOffice"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Claim Home Office Deduction</FormLabel>
                  <FormDescription>
                    Do you have a dedicated space for product testing?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {values.useHomeOffice && (
            <FormField
              control={form.control}
              name="homeOfficeSquareFeet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Feet of Home Office</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      max={300}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Deduction: {formatCurrency(homeOfficeDeduction)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part IV: Vehicle Information</CardTitle>
          <CardDescription>
            Standard mileage rate: {formatCurrency(TAX_RATES.mileageRate)}/mile (2024)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="vehicleMiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Miles Driven</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleBusinessMiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Miles</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Deduction: {formatCurrency(mileageDeduction)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* QBI Deduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">QBI Deduction (Form 8995)</CardTitle>
          <CardDescription>
            Qualified Business Income deduction - 20% of net profit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="claimQbiDeduction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Claim QBI Deduction</FormLabel>
                  <FormDescription>
                    Available if total taxable income is under ${TAX_RATES.qbiIncomeThresholdSingle.toLocaleString()} (single)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedOtherIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Other Income (W-2, etc.)</FormLabel>
                <FormControl>
                  <CurrencyInput 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  For accurate tax bracket calculation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Net Profit Summary */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-lg">Net Profit or (Loss)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-primary/10 rounded-lg text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Line 31: Net Profit or (Loss)</p>
            <p className={`text-4xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
              {formatCurrency(netProfit)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tax Summary */}
      <Card className="border-secondary bg-secondary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-secondary" />
            Estimated Tax Summary
            <Badge variant="secondary">Auto-Calculated</Badge>
          </CardTitle>
          <CardDescription>
            Based on your net profit and filing status ({values.filingStatus?.replace(/_/g, " ")})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Self-Employment Tax (15.3%)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Social Security (12.4%):</span>
                  <span>{formatCurrency(taxCalc.socialSecurityTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medicare (2.9%):</span>
                  <span>{formatCurrency(taxCalc.medicareTax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total SE Tax:</span>
                  <span>{formatCurrency(taxCalc.selfEmploymentTax)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Income Tax</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Net Profit:</span>
                  <span>{formatCurrency(netProfit)}</span>
                </div>
                {values.claimQbiDeduction && (
                  <div className="flex justify-between text-green-600">
                    <span>QBI Deduction (20%):</span>
                    <span>-{formatCurrency(taxCalc.qbiDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxable Amount:</span>
                  <span>{formatCurrency(taxCalc.taxableIncomeAfterQbi)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Rate ({formatPercentage(marginalRate)}):</span>
                  <span>{formatCurrency(taxCalc.estimatedIncomeTax)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 bg-background rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Estimated Annual Tax:</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(taxCalc.totalEstimatedTax)}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Quarterly Payment (if required):</span>
              <span className="font-medium">{formatCurrency(quarterlyPayment)}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">Quarterly Due Dates:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(QUARTERLY_DUE_DATES).map(([quarter, date]) => (
                <div key={quarter} className="flex justify-between">
                  <span>{quarter}:</span>
                  <span>{date}</span>
                </div>
              ))}
            </div>
          </div>

          {values.isVineIncome && (
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                💰 Savings with 50/20/0 Method
              </p>
              <p className="text-sm text-muted-foreground">
                By using the 50/20/0 method, your value adjustment of {formatCurrency(vineCalc.totalReduction)} reduces 
                your taxable income significantly. This saves you approximately{" "}
                <span className="font-bold text-green-600">
                  {formatCurrency(vineCalc.totalReduction * (TAX_RATES.selfEmploymentTax + marginalRate))}
                </span>{" "}
                in combined taxes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
