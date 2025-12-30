import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { W9FormData } from "@/lib/tax-form-schemas";
import { AddressFields } from "./AddressFields";

interface W9FormEditorProps {
  form: UseFormReturn<W9FormData>;
}

const TAX_CLASSIFICATIONS = [
  { value: "individual_sole_proprietor", label: "Individual/Sole proprietor or single-member LLC" },
  { value: "c_corporation", label: "C Corporation" },
  { value: "s_corporation", label: "S Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "trust_estate", label: "Trust/Estate" },
  { value: "llc_c", label: "LLC - C corporation" },
  { value: "llc_s", label: "LLC - S corporation" },
  { value: "llc_p", label: "LLC - Partnership" },
  { value: "other", label: "Other" },
];

export function W9FormEditor({ form }: W9FormEditorProps) {
  const tinType = form.watch("tinType");

  return (
    <div className="space-y-8">
      {/* Name and Business Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Name Information</CardTitle>
          <CardDescription>
            Enter your name as shown on your income tax return
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (Line 1)</FormLabel>
                <FormControl>
                  <Input placeholder="Name as shown on your income tax return" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name (Line 2 - Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Business name if different from above" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Disregarded entity name, if different from above
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Tax Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Federal Tax Classification (Line 3)</CardTitle>
          <CardDescription>
            Check the appropriate box for federal tax classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="taxClassification"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid gap-3"
                  >
                    {TAX_CLASSIFICATIONS.map((classification) => (
                      <div key={classification.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={classification.value} id={classification.value} />
                        <Label htmlFor={classification.value} className="font-normal cursor-pointer">
                          {classification.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Exemptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exemptions (Line 4 - Optional)</CardTitle>
          <CardDescription>
            Codes apply only to certain entities, not individuals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="exemptPayeeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exempt Payee Code</FormLabel>
                  <FormControl>
                    <Input placeholder="If applicable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatcaExemptionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FATCA Exemption Code</FormLabel>
                  <FormControl>
                    <Input placeholder="If applicable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address (Lines 5-6)</CardTitle>
          <CardDescription>
            Address where the requester should mail your information returns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressFields form={form} prefix="address" />
        </CardContent>
      </Card>

      {/* Account Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Numbers (Line 7 - Optional)</CardTitle>
          <CardDescription>
            List account numbers here if required by requester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="accountNumbers"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Account numbers (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Part I: Taxpayer Identification Number */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part I: Taxpayer Identification Number (TIN)</CardTitle>
          <CardDescription>
            Enter your TIN in the appropriate box
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="tinType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIN Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ssn" id="ssn" />
                      <Label htmlFor="ssn" className="font-normal cursor-pointer">
                        Social Security Number (SSN)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ein" id="ein" />
                      <Label htmlFor="ein" className="font-normal cursor-pointer">
                        Employer Identification Number (EIN)
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {tinType === "ssn" && (
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
          )}

          {tinType === "ein" && (
            <FormField
              control={form.control}
              name="ein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Identification Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="XX-XXXXXXX" 
                      maxLength={10}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Part II: Certification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Part II: Certification</CardTitle>
          <CardDescription>
            Under penalties of perjury, I certify that the information provided is correct
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground space-y-2">
            <p>By submitting this form, you certify that:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>The TIN shown is correct (or you are waiting for one to be issued)</li>
              <li>You are not subject to backup withholding</li>
              <li>You are a U.S. citizen or other U.S. person</li>
              <li>FATCA codes are correct (if any)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
