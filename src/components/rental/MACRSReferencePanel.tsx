import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info, Calculator, DollarSign, Percent, Zap } from "lucide-react";
import { 
  MACRS_5_YEAR, 
  MACRS_7_YEAR, 
  MACRS_3_YEAR,
  MACRS_10_YEAR,
  TAX_YEAR_RULES,
  PROPERTY_CLASS_INFO,
  calculateMACRSDepreciation,
  calculateSection179FullExpense,
} from "@/lib/depreciation-tables";

interface MACRSReferencePanelProps {
  showExamples?: boolean;
}

// Sample calculations from user's Vine setup
const VINE_EXAMPLE_ASSETS = [
  { name: 'Tractor', cost: 50000, propertyClass: '7-year' as const, description: 'Farm/rental machinery' },
  { name: 'Telescope', cost: 20000, propertyClass: '5-year' as const, description: 'Scientific equipment' },
  { name: 'Snacks/Equipment', cost: 10000, propertyClass: '5-year' as const, description: 'Vending-related items' },
];

export function MACRSReferencePanel({ showExamples = true }: MACRSReferencePanelProps) {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  // Calculate example schedules
  const tractorSchedule = calculateMACRSDepreciation(50000, 2025, { propertyClass: '7-year' });
  const telescopeSchedule = calculateMACRSDepreciation(20000, 2025, { propertyClass: '5-year' });
  const snacksSchedule = calculateMACRSDepreciation(10000, 2025, { propertyClass: '5-year' });
  
  // Combined totals by year
  const combinedByYear = new Map<number, number>();
  let totalOriginal = 80000;
  
  [...tractorSchedule, ...telescopeSchedule, ...snacksSchedule].forEach(entry => {
    const current = combinedByYear.get(entry.year) || 0;
    combinedByYear.set(entry.year, current + entry.totalDeduction);
  });

  return (
    <div className="space-y-6">
      {/* Tax Year Rules Card */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-accent" />
            2025 Tax Year Rules (OBBBA)
          </CardTitle>
          <CardDescription>
            One Big Beautiful Bill Act restored 100% bonus depreciation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background/50 rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground">Section 179 Limit</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(TAX_YEAR_RULES[2025].section179Limit)}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground">Phase-out Starts</p>
              <p className="text-xl font-bold">{formatCurrency(TAX_YEAR_RULES[2025].section179PhaseoutStart)}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground">Bonus Depreciation</p>
              <p className="text-xl font-bold text-emerald-500">{TAX_YEAR_RULES[2025].bonusDepreciationPercent}%</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 mt-1">
                Restored via OBBBA
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="options" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="options">Deduction Options</TabsTrigger>
          <TabsTrigger value="macrs-tables">MACRS Tables</TabsTrigger>
          <TabsTrigger value="property-classes">Property Classes</TabsTrigger>
          {showExamples && <TabsTrigger value="vine-example">Vine Example</TabsTrigger>}
        </TabsList>

        {/* Option 1, 2, 3 Cards */}
        <TabsContent value="options" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Option 1: Section 179 */}
            <Card className="border-emerald-500/30">
              <CardHeader className="pb-2">
                <Badge className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Option 1
                </Badge>
                <CardTitle className="text-lg">Full Section 179</CardTitle>
                <CardDescription>Immediate 100% expense</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p><strong>Year 1 Deduction:</strong> Full basis (up to $2.5M)</p>
                  <p><strong>Remaining Basis:</strong> $0</p>
                  <p><strong>Best For:</strong> High ETV years, maximizing current deductions</p>
                </div>
                <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/20">
                  <p className="text-xs text-muted-foreground">Example: $80,000 ETV</p>
                  <p className="font-bold text-emerald-600">Tax Savings: ~$29,600</p>
                  <p className="text-xs text-muted-foreground">(at 37% federal rate)</p>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: Bonus Depreciation */}
            <Card className="border-blue-500/30">
              <CardHeader className="pb-2">
                <Badge className="w-fit bg-blue-500/10 text-blue-600 border-blue-500/20">
                  Option 2
                </Badge>
                <CardTitle className="text-lg">100% Bonus</CardTitle>
                <CardDescription>Full deduction Year 1</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p><strong>Year 1 Deduction:</strong> 100% of basis</p>
                  <p><strong>After Section 179:</strong> Applies to remainder</p>
                  <p><strong>Best For:</strong> Combining with partial 179</p>
                </div>
                <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-xs text-muted-foreground">Combined Example</p>
                  <p className="text-sm">$50K Section 179 + $30K Bonus</p>
                  <p className="font-bold text-blue-600">= $80,000 Year 1</p>
                </div>
              </CardContent>
            </Card>

            {/* Option 3: Regular MACRS */}
            <Card className="border-purple-500/30">
              <CardHeader className="pb-2">
                <Badge className="w-fit bg-purple-500/10 text-purple-600 border-purple-500/20">
                  Option 3
                </Badge>
                <CardTitle className="text-lg">Regular MACRS</CardTitle>
                <CardDescription>Spread over useful life</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p><strong>5-Year Property:</strong> 6 tax years</p>
                  <p><strong>7-Year Property:</strong> 8 tax years</p>
                  <p><strong>Best For:</strong> Steady offsets over time</p>
                </div>
                <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-xs text-muted-foreground">Half-Year Convention</p>
                  <p className="text-sm">GDS, 200% Declining Balance</p>
                  <p className="text-xs">Switches to straight-line</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MACRS Tables */}
        <TabsContent value="macrs-tables" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* 5-Year Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  5-Year Property MACRS
                </CardTitle>
                <CardDescription>Computers, vehicles, telescopes, vending equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">$20,000 Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MACRS_5_YEAR.map((rate, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-right font-mono">{formatPercent(rate)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(20000 * rate / 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(20000)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 7-Year Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-purple-500" />
                  7-Year Property MACRS
                </CardTitle>
                <CardDescription>Tractors, farm machinery, office furniture</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">$50,000 Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MACRS_7_YEAR.map((rate, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-right font-mono">{formatPercent(rate)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(50000 * rate / 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(50000)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Property Classes */}
        <TabsContent value="property-classes" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(PROPERTY_CLASS_INFO).map(([key, info]) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{info.name}</Badge>
                        <span className="text-sm text-muted-foreground">{info.description}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 pt-2">
                        <p className="text-sm font-medium mb-2">Examples:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {info.examples.map((example, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vine Example with Combined Schedule */}
        {showExamples && (
          <TabsContent value="vine-example" className="space-y-4 mt-4">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  Vine Rental Setup: $80,000 Total Basis
                </CardTitle>
                <CardDescription>
                  Sample MACRS depreciation (no Section 179 or Bonus elected)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Asset breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  {VINE_EXAMPLE_ASSETS.map((asset) => (
                    <div key={asset.name} className="bg-muted/30 rounded-lg p-3 border">
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-xl font-bold">{formatCurrency(asset.cost)}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {asset.propertyClass}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Combined Schedule Table */}
                <div>
                  <h4 className="font-semibold mb-3">Combined Depreciation Schedule</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">Total Deduction</TableHead>
                        <TableHead className="text-right">Cumulative</TableHead>
                        <TableHead className="text-right">Book Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        let cumulative = 0;
                        const sortedYears = Array.from(combinedByYear.entries()).sort((a, b) => a[0] - b[0]);
                        return sortedYears.map(([year, amount]) => {
                          cumulative += amount;
                          return (
                            <TableRow key={year}>
                              <TableCell>{year}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(amount)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(cumulative)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(totalOriginal - cumulative)}
                              </TableCell>
                            </TableRow>
                          );
                        });
                      })()}
                    </TableBody>
                  </Table>
                </div>

                {/* Individual Asset Details */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tractor">
                    <AccordionTrigger>
                      Tractor ($50,000, 7-Year Property)
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Deduction</TableHead>
                            <TableHead className="text-right">Cumulative</TableHead>
                            <TableHead className="text-right">Book Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tractorSchedule.map((entry) => (
                            <TableRow key={entry.year}>
                              <TableCell>{entry.year}</TableCell>
                              <TableCell className="text-right font-mono">
                                {formatPercent(entry.depreciationPercent)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.depreciationAmount)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.cumulativeDepreciation)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.endingBookValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="telescope">
                    <AccordionTrigger>
                      Telescope ($20,000, 5-Year Property)
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Deduction</TableHead>
                            <TableHead className="text-right">Cumulative</TableHead>
                            <TableHead className="text-right">Book Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {telescopeSchedule.map((entry) => (
                            <TableRow key={entry.year}>
                              <TableCell>{entry.year}</TableCell>
                              <TableCell className="text-right font-mono">
                                {formatPercent(entry.depreciationPercent)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.depreciationAmount)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.cumulativeDepreciation)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.endingBookValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="snacks">
                    <AccordionTrigger>
                      Snacks/Equipment ($10,000, 5-Year Property)
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Deduction</TableHead>
                            <TableHead className="text-right">Cumulative</TableHead>
                            <TableHead className="text-right">Book Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {snacksSchedule.map((entry) => (
                            <TableRow key={entry.year}>
                              <TableCell>{entry.year}</TableCell>
                              <TableCell className="text-right font-mono">
                                {formatPercent(entry.depreciationPercent)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.depreciationAmount)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.cumulativeDepreciation)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(entry.endingBookValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Key Notes */}
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Key Notes for Your Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• <strong>Grouping Like Products:</strong> Depreciate similar items together based on age/condition</p>
                    <p>• <strong>SSDI Impact:</strong> These are passive deductions—flow via K-1 without creating SGA</p>
                    <p>• <strong>Reporting:</strong> Form 4562 for elections/depreciation; attach to LLC's 1065</p>
                    <p>• <strong>QBI:</strong> 20% deduction may apply to remaining net rental income</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
