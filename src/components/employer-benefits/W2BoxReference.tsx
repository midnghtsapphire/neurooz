import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Info } from "lucide-react";

// W-2 Box 12 Codes (IRS standardized)
export const W2_BOX_12_CODES = [
  { code: "A", description: "Uncollected Social Security or RRTA tax on tips", taxable: true, category: "Taxes" },
  { code: "B", description: "Uncollected Medicare tax on tips", taxable: true, category: "Taxes" },
  { code: "C", description: "Taxable cost of group-term life insurance over $50,000", taxable: true, category: "Benefits" },
  { code: "D", description: "Elective deferrals to a 401(k) plan", taxable: false, category: "Retirement" },
  { code: "E", description: "Elective deferrals to a 403(b) plan", taxable: false, category: "Retirement" },
  { code: "F", description: "Elective deferrals to a 408(k)(6) SEP plan", taxable: false, category: "Retirement" },
  { code: "G", description: "Elective deferrals and employer contributions to a 457(b) plan", taxable: false, category: "Retirement" },
  { code: "H", description: "Elective deferrals to a 501(c)(18)(D) tax-exempt plan", taxable: false, category: "Retirement" },
  { code: "J", description: "Nontaxable sick pay", taxable: false, category: "Benefits" },
  { code: "K", description: "20% excise tax on excess golden parachute payments", taxable: true, category: "Taxes" },
  { code: "L", description: "Substantiated employee business expense reimbursements", taxable: false, category: "Reimbursements" },
  { code: "M", description: "Uncollected SS/RRTA tax on group-term life insurance over $50,000 (former employees)", taxable: true, category: "Taxes" },
  { code: "N", description: "Uncollected Medicare tax on group-term life insurance over $50,000 (former employees)", taxable: true, category: "Taxes" },
  { code: "P", description: "Excludable moving expense reimbursements (military only)", taxable: false, category: "Reimbursements" },
  { code: "Q", description: "Nontaxable combat pay", taxable: false, category: "Military" },
  { code: "R", description: "Employer contributions to an Archer MSA", taxable: false, category: "Healthcare" },
  { code: "S", description: "Employee salary reduction contributions to a SIMPLE IRA (408(p))", taxable: false, category: "Retirement" },
  { code: "T", description: "Adoption benefits", taxable: false, category: "Benefits" },
  { code: "V", description: "Income from exercise of nonstatutory stock options", taxable: true, category: "Compensation" },
  { code: "W", description: "Employer contributions to Health Savings Account (HSA)", taxable: false, category: "Healthcare" },
  { code: "Y", description: "Deferrals under Section 409A nonqualified deferred compensation plan", taxable: false, category: "Retirement" },
  { code: "Z", description: "Income under Section 409A on nonqualified deferred compensation plan", taxable: true, category: "Compensation" },
  { code: "AA", description: "Designated Roth contributions under a 401(k) plan", taxable: true, category: "Retirement" },
  { code: "BB", description: "Designated Roth contributions under a 403(b) plan", taxable: true, category: "Retirement" },
  { code: "DD", description: "Cost of employer-sponsored health coverage (informational only)", taxable: false, category: "Healthcare" },
  { code: "EE", description: "Designated Roth contributions under a governmental 457(b) plan", taxable: true, category: "Retirement" },
  { code: "FF", description: "Permitted benefits under a QSEHRA", taxable: false, category: "Healthcare" },
  { code: "GG", description: "Income from qualified equity grants under Section 83(i)", taxable: true, category: "Compensation" },
  { code: "HH", description: "Aggregate deferrals under Section 83(i) elections", taxable: false, category: "Compensation" },
];

// W-2 Box 14 Common Codes (Employer-specific, not standardized)
export const W2_BOX_14_CODES = [
  { code: "EDU", description: "Educational assistance (Section 127)", limit: 5250, taxable: false, category: "Education" },
  { code: "EDUC", description: "Educational assistance (Section 127)", limit: 5250, taxable: false, category: "Education" },
  { code: "SLRP", description: "Student loan repayment assistance", limit: 5250, taxable: false, category: "Education" },
  { code: "UNION", description: "Union dues", limit: null, taxable: false, category: "Deductions" },
  { code: "HEALTH", description: "Health insurance premiums (after-tax)", limit: null, taxable: false, category: "Healthcare" },
  { code: "DENTAL", description: "Dental insurance premiums", limit: null, taxable: false, category: "Healthcare" },
  { code: "VISION", description: "Vision insurance premiums", limit: null, taxable: false, category: "Healthcare" },
  { code: "SDI", description: "State Disability Insurance", limit: null, taxable: false, category: "State Taxes" },
  { code: "CASDI", description: "California State Disability Insurance", limit: null, taxable: false, category: "State Taxes" },
  { code: "NYSDI", description: "New York State Disability Insurance", limit: null, taxable: false, category: "State Taxes" },
  { code: "NJSDI", description: "New Jersey State Disability Insurance", limit: null, taxable: false, category: "State Taxes" },
  { code: "NJFLI", description: "New Jersey Family Leave Insurance", limit: null, taxable: false, category: "State Taxes" },
  { code: "NYPFL", description: "New York Paid Family Leave", limit: null, taxable: false, category: "State Taxes" },
  { code: "MAPFL", description: "Massachusetts Paid Family Leave", limit: null, taxable: false, category: "State Taxes" },
  { code: "WAPFL", description: "Washington Paid Family Leave", limit: null, taxable: false, category: "State Taxes" },
  { code: "CTPFL", description: "Connecticut Paid Family Leave", limit: null, taxable: false, category: "State Taxes" },
  { code: "UNIFORM", description: "Uniform/clothing allowance", limit: null, taxable: false, category: "Reimbursements" },
  { code: "TOOLS", description: "Tool allowance", limit: null, taxable: false, category: "Reimbursements" },
  { code: "CAR", description: "Car/auto allowance", limit: null, taxable: true, category: "Compensation" },
  { code: "MOVING", description: "Moving expenses (taxable)", limit: null, taxable: true, category: "Reimbursements" },
  { code: "LIFE", description: "Group-term life insurance (taxable portion)", limit: null, taxable: true, category: "Benefits" },
  { code: "GTL", description: "Group-term life insurance over $50,000", limit: null, taxable: true, category: "Benefits" },
  { code: "FSA", description: "Flexible Spending Account contributions", limit: 3050, taxable: false, category: "Healthcare" },
  { code: "DCFSA", description: "Dependent Care FSA contributions", limit: 5000, taxable: false, category: "Dependent Care" },
  { code: "HSA-EE", description: "Employee HSA contributions (payroll)", limit: 4150, taxable: false, category: "Healthcare" },
  { code: "PARKING", description: "Qualified parking benefits", limit: 315, taxable: false, category: "Benefits" },
  { code: "TRANSIT", description: "Qualified transit benefits", limit: 315, taxable: false, category: "Benefits" },
  { code: "TIPS", description: "Reported tips (informational)", limit: null, taxable: true, category: "Compensation" },
  { code: "BONUS", description: "Bonus payments (informational)", limit: null, taxable: true, category: "Compensation" },
  { code: "SEVER", description: "Severance pay", limit: null, taxable: true, category: "Compensation" },
  { code: "PTO", description: "Paid time off payout", limit: null, taxable: true, category: "Compensation" },
  { code: "CHARITY", description: "Charitable contributions (payroll deduction)", limit: null, taxable: false, category: "Deductions" },
  { code: "414H", description: "Government retirement contributions (Section 414(h))", limit: null, taxable: false, category: "Retirement" },
  { code: "ROTH IRA", description: "Roth IRA contributions via payroll", limit: 7000, taxable: true, category: "Retirement" },
  { code: "RSU", description: "Restricted Stock Units income", limit: null, taxable: true, category: "Compensation" },
  { code: "ESPP", description: "Employee Stock Purchase Plan", limit: null, taxable: true, category: "Compensation" },
];

// All W-2 Boxes
export const W2_BOXES = [
  { box: "1", name: "Wages, tips, other compensation", description: "Total taxable wages, tips, prizes, and other compensation. Excludes pre-tax deductions like 401(k).", taxable: true },
  { box: "2", name: "Federal income tax withheld", description: "Total federal income tax withheld from paychecks.", taxable: false },
  { box: "3", name: "Social Security wages", description: "Total wages subject to Social Security tax. Max $168,600 for 2024.", taxable: true },
  { box: "4", name: "Social Security tax withheld", description: "Social Security tax withheld (6.2% of Box 3).", taxable: false },
  { box: "5", name: "Medicare wages and tips", description: "Total wages subject to Medicare tax (no limit).", taxable: true },
  { box: "6", name: "Medicare tax withheld", description: "Medicare tax withheld (1.45% of Box 5, plus 0.9% Additional Medicare Tax if applicable).", taxable: false },
  { box: "7", name: "Social Security tips", description: "Tips reported to employer and subject to Social Security tax.", taxable: true },
  { box: "8", name: "Allocated tips", description: "Tips allocated by employer if reported tips are below threshold.", taxable: true },
  { box: "9", name: "Verification code", description: "Used for electronic filing verification (if present).", taxable: false },
  { box: "10", name: "Dependent care benefits", description: "Total dependent care benefits provided or paid. Up to $5,000 is excludable.", taxable: false },
  { box: "11", name: "Nonqualified plans", description: "Distributions from nonqualified deferred compensation plans.", taxable: true },
  { box: "12", name: "Codes (see Box 12 codes)", description: "Various compensation and benefit codes. Up to 4 items can be listed.", taxable: false },
  { box: "13", name: "Checkboxes", description: "Statutory employee, Retirement plan participant, Third-party sick pay.", taxable: false },
  { box: "14", name: "Other", description: "Employer-specific information like union dues, health insurance, education assistance, state taxes.", taxable: false },
];

// W-3 Boxes (Transmittal form totals)
export const W3_BOXES = [
  { box: "1", name: "Wages, tips, other compensation", description: "Sum of all W-2 Box 1 amounts" },
  { box: "2", name: "Federal income tax withheld", description: "Sum of all W-2 Box 2 amounts" },
  { box: "3", name: "Social Security wages", description: "Sum of all W-2 Box 3 amounts" },
  { box: "4", name: "Social Security tax withheld", description: "Sum of all W-2 Box 4 amounts" },
  { box: "5", name: "Medicare wages and tips", description: "Sum of all W-2 Box 5 amounts" },
  { box: "6", name: "Medicare tax withheld", description: "Sum of all W-2 Box 6 amounts" },
  { box: "7", name: "Social Security tips", description: "Sum of all W-2 Box 7 amounts" },
  { box: "8", name: "Allocated tips", description: "Sum of all W-2 Box 8 amounts" },
  { box: "10", name: "Dependent care benefits", description: "Sum of all W-2 Box 10 amounts" },
  { box: "11", name: "Nonqualified plans", description: "Sum of all W-2 Box 11 amounts" },
  { box: "12a", name: "Deferred compensation", description: "Sum of specific Box 12 codes (D, E, F, G, S)" },
];

export function W2BoxReference() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBox12 = W2_BOX_12_CODES.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBox14 = W2_BOX_14_CODES.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          W-2 & W-3 Box Reference
        </CardTitle>
        <CardDescription>
          Complete reference for all W-2 and W-3 box codes used by employers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search codes, descriptions, or categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="boxes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="boxes">All Boxes</TabsTrigger>
            <TabsTrigger value="box12">Box 12 Codes</TabsTrigger>
            <TabsTrigger value="box14">Box 14 Codes</TabsTrigger>
            <TabsTrigger value="w3">W-3 Form</TabsTrigger>
          </TabsList>

          {/* All W-2 Boxes */}
          <TabsContent value="boxes">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Box</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Taxable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {W2_BOXES.map((box) => (
                    <TableRow key={box.box}>
                      <TableCell className="font-mono font-bold">{box.box}</TableCell>
                      <TableCell className="font-medium">{box.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{box.description}</TableCell>
                      <TableCell>
                        <Badge variant={box.taxable ? "destructive" : "secondary"}>
                          {box.taxable ? "Yes" : "No/Varies"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Box 12 Codes */}
          <TabsContent value="box12">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="w-24">Taxable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBox12.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell className="font-mono font-bold text-primary">{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.taxable ? "destructive" : "default"}>
                          {item.taxable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Box 14 Codes */}
          <TabsContent value="box14">
            <Card className="mb-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium">Box 14 is not standardized</p>
                    <p className="mt-1">Employers can use any codes they choose. These are common codes, but your employer may use different abbreviations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="w-24">Limit</TableHead>
                    <TableHead className="w-24">Taxable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBox14.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell className="font-mono font-bold text-secondary">{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.limit ? `$${item.limit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.taxable ? "destructive" : "default"}>
                          {item.taxable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* W-3 Form */}
          <TabsContent value="w3">
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">W-3: Transmittal of Wage and Tax Statements</p>
                    <p className="mt-1 text-muted-foreground">
                      The W-3 is the summary form employers file with the SSA along with all employee W-2s. 
                      It contains totals of all W-2 amounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Box</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {W3_BOXES.map((box) => (
                    <TableRow key={box.box}>
                      <TableCell className="font-mono font-bold">{box.box}</TableCell>
                      <TableCell className="font-medium">{box.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{box.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Reference for Section 127 */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Section 127 Educational Assistance - Box 14 Reporting
            </h4>
            <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
              <li>• Up to $5,250 is <strong>excluded</strong> from Box 1 (not taxable)</li>
              <li>• Report in Box 14 with code like "EDU", "EDUC", or "SLRP"</li>
              <li>• Includes: tuition, fees, books, supplies, student loan payments</li>
              <li>• Amount over $5,250 must be included in Box 1 as taxable wages</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
