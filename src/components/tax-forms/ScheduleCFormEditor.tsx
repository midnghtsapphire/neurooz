import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScheduleCData } from "@/lib/tax-form-schemas";
import { AddressFields } from "./AddressFields";

interface ScheduleCFormEditorProps {
  form: UseFormReturn<ScheduleCData>;
}

function CurrencyInput({ 
  value, 
  onChange, 
  placeholder = "0.00" 
}: { 
  value: number; 
  onChange: (val: number) => void;
  placeholder?: string;
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
      />
    </div>
  );
}

export function ScheduleCFormEditor({ form }: ScheduleCFormEditorProps) {
  const values = form.watch();
  
  // Calculate totals
  const grossReceipts = values.grossReceipts || 0;
  const returns = values.returns || 0;
  const costOfGoodsSold = values.costOfGoodsSold || 0;
  const grossIncome = grossReceipts - returns - costOfGoodsSold;
  
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
    (values.meals || 0) +
    (values.utilities || 0) +
    (values.wages || 0) +
    (values.otherExpenses || 0)
  );
  
  const netProfit = grossIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Information</CardTitle>
          <CardDescription>
            Principal business or profession, including product or service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Business Name" {...field} />
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
                <FormControl>
                  <Input placeholder="e.g., 454110 for e-commerce" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  For product testing/reviews, common codes: 541990 (Other professional services)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </CardContent>
      </Card>

      {/* Part I: Income */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part I: Income</CardTitle>
          <CardDescription>
            Report your gross receipts and calculate gross income
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="grossReceipts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 1: Gross Receipts or Sales</FormLabel>
                <FormControl>
                  <CurrencyInput 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  For Vine: Include ETV (Estimated Tax Value) of products received
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">
              Gross Income (Line 5): <span className="text-primary">${grossIncome.toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Part II: Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part II: Expenses</CardTitle>
          <CardDescription>
            Deductible business expenses - for Vine, this includes the 50/20/0 method deductions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "advertising", label: "Line 8: Advertising" },
              { name: "carAndTruck", label: "Line 9: Car and Truck Expenses" },
              { name: "commissions", label: "Line 10: Commissions and Fees" },
              { name: "contractLabor", label: "Line 11: Contract Labor" },
              { name: "depreciation", label: "Line 13: Depreciation" },
              { name: "insurance", label: "Line 15: Insurance" },
              { name: "interest", label: "Line 16: Interest" },
              { name: "legal", label: "Line 17: Legal and Professional" },
              { name: "officeExpense", label: "Line 18: Office Expense" },
              { name: "rent", label: "Line 20: Rent" },
              { name: "repairs", label: "Line 21: Repairs and Maintenance" },
              { name: "supplies", label: "Line 22: Supplies" },
              { name: "taxes", label: "Line 23: Taxes and Licenses" },
              { name: "travel", label: "Line 24: Travel" },
              { name: "meals", label: "Line 24b: Meals (50% deductible)" },
              { name: "utilities", label: "Line 25: Utilities" },
              { name: "wages", label: "Line 26: Wages" },
              { name: "otherExpenses", label: "Line 27: Other Expenses" },
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <FormField
            control={form.control}
            name="otherExpensesDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of Other Expenses</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe other expenses..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm">
              Total Expenses (Line 28): <span className="font-medium">${totalExpenses.toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Net Profit Summary */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-lg">Net Profit or (Loss)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Line 31: Net Profit or (Loss)</p>
            <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
              ${netProfit.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This amount is subject to self-employment tax (15.3%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part IV: Vehicle Information</CardTitle>
          <CardDescription>
            If you claimed car or truck expenses above
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
                  <p className="text-xs text-muted-foreground">
                    2024 rate: $0.67/mile
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
