import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form1099NECData } from "@/lib/tax-form-schemas";
import { AddressFields } from "./AddressFields";

interface Form1099NECEditorProps {
  form: UseFormReturn<Form1099NECData>;
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

export function Form1099NECEditor({ form }: Form1099NECEditorProps) {
  return (
    <div className="space-y-8">
      {/* Payer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payer Information</CardTitle>
          <CardDescription>
            Information about the business that paid you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="payerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Business name that paid you" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AddressFields form={form} prefix="payerAddress" />

          <FormField
            control={form.control}
            name="payerTIN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payer TIN (EIN)</FormLabel>
                <FormControl>
                  <Input placeholder="XX-XXXXXXX" maxLength={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payer Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="(XXX) XXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Recipient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recipient Information (You)</CardTitle>
          <CardDescription>
            Your information as the person who received the payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AddressFields form={form} prefix="recipientAddress" />

          <FormField
            control={form.control}
            name="recipientTIN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient TIN (SSN or EIN)</FormLabel>
                <FormControl>
                  <Input placeholder="XXX-XX-XXXX or XX-XXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="If assigned by payer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Information</CardTitle>
          <CardDescription>
            Amounts paid and taxes withheld
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="nonemployeeCompensation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box 1: Nonemployee Compensation</FormLabel>
                <FormControl>
                  <CurrencyInput 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Total payments of $600 or more for services as a nonemployee
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="federalTaxWithheld"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box 4: Federal Income Tax Withheld</FormLabel>
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
        </CardContent>
      </Card>

      {/* State Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">State Tax Information</CardTitle>
          <CardDescription>
            Complete if state tax was withheld
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Box 6: State</FormLabel>
                  <FormControl>
                    <Input placeholder="CO" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statePayerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State Payer Number</FormLabel>
                  <FormControl>
                    <Input placeholder="State ID number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="stateIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Box 7: State Income</FormLabel>
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
              name="stateTaxWithheld"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Box 5: State Tax Withheld</FormLabel>
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
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-lg">1099-NEC Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">Total Compensation</p>
              <p className="text-xl font-bold text-primary">
                ${(form.watch("nonemployeeCompensation") || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">Federal Tax Withheld</p>
              <p className="text-xl font-bold">
                ${(form.watch("federalTaxWithheld") || 0).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            This income is subject to self-employment tax unless you are an employee who received a W-2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
