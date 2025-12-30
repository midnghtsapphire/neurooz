import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { W4FormData } from "@/lib/tax-form-schemas";
import { AddressFields } from "./AddressFields";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

interface W4FormEditorProps {
  form: UseFormReturn<W4FormData>;
}

export function W4FormEditor({ form }: W4FormEditorProps) {
  const qualifyingChildren = form.watch("qualifyingChildren") || 0;
  const otherDependents = form.watch("otherDependents") || 0;
  const childTaxCredit = qualifyingChildren * 2000;
  const otherDependentCredit = otherDependents * 500;
  const totalDependentCredit = childTaxCredit + otherDependentCredit;

  return (
    <div className="space-y-8">
      {/* Step 1: Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 1: Personal Information</CardTitle>
          <CardDescription>
            Enter your name, address, Social Security number, and filing status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="middleInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>M.I.</FormLabel>
                  <FormControl>
                    <Input placeholder="A" maxLength={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SSN */}
          <FormField
            control={form.control}
            name="ssn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Security Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="XXX-XX-XXXX" 
                    maxLength={11}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <AddressFields form={form} prefix="address" />

          {/* Filing Status */}
          <FormField
            control={form.control}
            name="filingStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filing Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">
                      Single or Married filing separately
                    </SelectItem>
                    <SelectItem value="married_filing_jointly">
                      Married filing jointly or Qualifying surviving spouse
                    </SelectItem>
                    <SelectItem value="head_of_household">
                      Head of household
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Step 2: Multiple Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 2: Multiple Jobs or Spouse Works</CardTitle>
          <CardDescription>
            Complete this step if you (1) hold more than one job at a time, or (2) are married 
            filing jointly and your spouse also works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="multipleJobsOrSpouseWorks"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    Check here if you have more than one job or your spouse works
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    This will help calculate more accurate withholding
                  </p>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Step 3: Claim Dependents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 3: Claim Dependents</CardTitle>
          <CardDescription>
            If your total income will be $200,000 or less ($400,000 or less if married filing jointly)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="qualifyingChildren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifying Children under 17</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    × $2,000 = ${(field.value || 0) * 2000}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherDependents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Dependents</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    × $500 = ${(field.value || 0) * 500}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              Total Dependent Credit: <span className="text-primary">${totalDependentCredit.toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Other Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 4: Other Adjustments (Optional)</CardTitle>
          <CardDescription>
            Use this step to make additional adjustments to your withholding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="otherIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>4(a) Other Income</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      type="number" 
                      min={0}
                      className="pl-7"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Income from interest, dividends, retirement that is not from jobs
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deductions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>4(b) Deductions</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      type="number" 
                      min={0}
                      className="pl-7"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Amount that exceeds the standard deduction
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="extraWithholding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>4(c) Extra Withholding</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      type="number" 
                      min={0}
                      className="pl-7"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Extra amount you want withheld from each paycheck
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
