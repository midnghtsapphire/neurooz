import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, DollarSign, AlertTriangle, Info, Building2, 
  CreditCard, PiggyBank, Users
} from "lucide-react";

interface Form1099BoxReferenceProps {
  formType?: string;
}

// 1099-NEC boxes
const NEC_BOXES = [
  { box: "1", name: "Nonemployee Compensation", threshold: 600, description: "Payments to contractors, freelancers, self-employed individuals for services. Most common box.", required: true },
  { box: "2", name: "Payer Direct Sales", threshold: 5000, description: "Check if payer made direct sales of $5,000+ of consumer products for resale", required: false },
  { box: "4", name: "Federal Income Tax Withheld", threshold: null, description: "Backup withholding (24%) if recipient didn't provide TIN", required: false },
  { box: "5", name: "State Tax Withheld", threshold: null, description: "State income tax withheld, if any", required: false },
  { box: "6", name: "State/Payer's State No.", threshold: null, description: "State ID number of payer", required: false },
  { box: "7", name: "State Income", threshold: null, description: "State taxable income", required: false },
];

// 1099-MISC boxes
const MISC_BOXES = [
  { box: "1", name: "Rents", threshold: 600, description: "Payments for renting office space, equipment, vehicles, land, etc.", required: true },
  { box: "2", name: "Royalties", threshold: 10, description: "Payments for natural resources extraction, intellectual property royalties", required: true },
  { box: "3", name: "Other Income", threshold: 600, description: "Prizes, awards, punitive damages, other taxable income not elsewhere classified", required: true },
  { box: "4", name: "Federal Tax Withheld", threshold: null, description: "Backup withholding at 24%", required: false },
  { box: "5", name: "Fishing Boat Proceeds", threshold: null, description: "Crew member's share from boat operator", required: false },
  { box: "6", name: "Medical/Health Care Payments", threshold: 600, description: "Payments to physicians, medical corps for services (not employee wages)", required: true },
  { box: "7", name: "Payer Direct Sales", threshold: 5000, description: "Consumer products sold for resale", required: false },
  { box: "8", name: "Substitute Payments in Lieu of Dividends", threshold: 10, description: "Related to securities loans", required: true },
  { box: "9", name: "Crop Insurance Proceeds", threshold: 600, description: "Payments from crop insurance", required: true },
  { box: "10", name: "Gross Proceeds to Attorney", threshold: 600, description: "Payments to attorneys for legal services (even if corporation)", required: true },
  { box: "11", name: "Fish Purchased for Resale", threshold: 600, description: "Cash payments for fish purchase", required: true },
  { box: "12", name: "Section 409A Deferrals", threshold: null, description: "Deferred compensation under nonqualified plans", required: false },
  { box: "14", name: "Excess Golden Parachute", threshold: null, description: "Excess golden parachute payments", required: false },
  { box: "15a", name: "Section 409A Income", threshold: null, description: "Income from nonqualified deferred compensation", required: false },
];

// 1099-K boxes
const K_BOXES = [
  { box: "1a", name: "Gross Amount", threshold: 600, description: "Total gross payment amount (2024+: $600 threshold, previously $20,000)", required: true, note: "Threshold changed from $20,000/200 transactions to $600 in 2024" },
  { box: "1b", name: "Card Not Present Transactions", threshold: null, description: "Subset of Box 1a for online/phone transactions", required: false },
  { box: "2", name: "Merchant Category Code", threshold: null, description: "MCC describing type of business", required: false },
  { box: "3", name: "Number of Payment Transactions", threshold: null, description: "Count of reportable transactions", required: false },
  { box: "4", name: "Federal Tax Withheld", threshold: null, description: "Backup withholding if applicable", required: false },
  { box: "5a-5l", name: "Monthly Gross Amounts", threshold: null, description: "Breakdown by month (Jan-Dec)", required: false },
  { box: "6", name: "State ID", threshold: null, description: "State identification number", required: false },
  { box: "7", name: "State Income", threshold: null, description: "State taxable income", required: false },
  { box: "8", name: "State Tax Withheld", threshold: null, description: "State income tax withheld", required: false },
];

// 1099-INT boxes
const INT_BOXES = [
  { box: "1", name: "Interest Income", threshold: 10, description: "Total taxable interest paid", required: true },
  { box: "2", name: "Early Withdrawal Penalty", threshold: null, description: "Penalty for early CD withdrawal - deductible", required: false },
  { box: "3", name: "Interest on U.S. Savings Bonds/Treasury", threshold: null, description: "May be excludable for education expenses", required: false },
  { box: "4", name: "Federal Tax Withheld", threshold: null, description: "Backup withholding", required: false },
  { box: "5", name: "Investment Expenses", threshold: null, description: "Share of investment expenses (limited deductibility)", required: false },
  { box: "6", name: "Foreign Tax Paid", threshold: null, description: "May be eligible for foreign tax credit", required: false },
  { box: "8", name: "Tax-Exempt Interest", threshold: 10, description: "Municipal bond interest - still reportable but not taxable federally", required: true },
  { box: "9", name: "Private Activity Bond Interest", threshold: null, description: "Subject to AMT", required: false },
  { box: "10", name: "Market Discount", threshold: null, description: "Accrued market discount on bonds", required: false },
  { box: "11", name: "Bond Premium", threshold: null, description: "Amortizable bond premium", required: false },
  { box: "12", name: "Bond Premium on Treasury", threshold: null, description: "Premium on U.S. Treasury bonds", required: false },
  { box: "13", name: "Bond Premium on Tax-Exempt", threshold: null, description: "Premium on tax-exempt bonds", required: false },
];

// 1099-DIV boxes
const DIV_BOXES = [
  { box: "1a", name: "Total Ordinary Dividends", threshold: 10, description: "All ordinary dividends (includes qualified)", required: true },
  { box: "1b", name: "Qualified Dividends", threshold: null, description: "Subset of 1a eligible for lower capital gains rates", required: false, note: "Taxed at 0%, 15%, or 20% based on income" },
  { box: "2a", name: "Total Capital Gain Distributions", threshold: null, description: "Long-term capital gains from mutual funds", required: false },
  { box: "2b", name: "Unrecaptured Section 1250 Gain", threshold: null, description: "Depreciation recapture on real estate - taxed at 25% max", required: false },
  { box: "2c", name: "Section 1202 Gain", threshold: null, description: "Qualified small business stock gain exclusion", required: false },
  { box: "2d", name: "Collectibles (28%) Gain", threshold: null, description: "Gains from collectibles - taxed at 28% max", required: false },
  { box: "2e", name: "Section 897 Ordinary Dividends", threshold: null, description: "FIRPTA gain from REIT sales", required: false },
  { box: "2f", name: "Section 897 Capital Gain", threshold: null, description: "FIRPTA capital gain", required: false },
  { box: "3", name: "Nondividend Distributions", threshold: null, description: "Return of capital - reduces basis, not currently taxable", required: false },
  { box: "4", name: "Federal Tax Withheld", threshold: null, description: "Backup withholding", required: false },
  { box: "5", name: "Section 199A Dividends", threshold: null, description: "REIT dividends eligible for 20% QBI deduction", required: false, note: "Important for pass-through deduction" },
  { box: "6", name: "Investment Expenses", threshold: null, description: "Share of expenses (limited deductibility)", required: false },
  { box: "7", name: "Foreign Tax Paid", threshold: null, description: "May be eligible for foreign tax credit", required: false },
  { box: "9", name: "Cash Liquidation Distributions", threshold: null, description: "From liquidating corporation", required: false },
  { box: "10", name: "Noncash Liquidation Distributions", threshold: null, description: "FMV of property in liquidation", required: false },
  { box: "11", name: "FATCA Filing Required", threshold: null, description: "Foreign account reporting indicator", required: false },
  { box: "12", name: "Exempt-Interest Dividends", threshold: null, description: "Tax-exempt from mutual funds", required: false },
  { box: "13", name: "State Tax Withheld", threshold: null, description: "State income tax withheld", required: false },
];

export function Form1099BoxReference({ formType }: Form1099BoxReferenceProps) {
  const [activeTab, setActiveTab] = useState(formType || "all");

  const renderBoxTable = (boxes: Array<{ box: string; name: string; threshold: number | null; description: string; required: boolean; note?: string }>, formName: string) => (
    <div className="space-y-3">
      {boxes.map((box) => (
        <div 
          key={box.box}
          className={`p-4 rounded-lg border ${box.required ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={box.required ? "default" : "outline"} className="font-mono">
                Box {box.box}
              </Badge>
              <span className="font-semibold">{box.name}</span>
            </div>
            {box.threshold && (
              <Badge variant="secondary" className="text-xs">
                ${box.threshold.toLocaleString()} threshold
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{box.description}</p>
          {box.note && (
            <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>{box.note}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (formType) {
    // Show only specific form
    let boxes: typeof NEC_BOXES;
    let formName: string;
    
    switch (formType) {
      case "1099-NEC": boxes = NEC_BOXES; formName = "1099-NEC"; break;
      case "1099-MISC": boxes = MISC_BOXES; formName = "1099-MISC"; break;
      case "1099-K": boxes = K_BOXES; formName = "1099-K"; break;
      case "1099-INT": boxes = INT_BOXES; formName = "1099-INT"; break;
      case "1099-DIV": boxes = DIV_BOXES; formName = "1099-DIV"; break;
      default: boxes = NEC_BOXES; formName = "1099-NEC";
    }
    
    return renderBoxTable(boxes, formName);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          1099 Form Box Reference Guide
        </CardTitle>
        <CardDescription>
          Complete reference for all 1099 form boxes, thresholds, and requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="1099-NEC" className="gap-1">
              <Users className="h-3 w-3" />
              NEC
            </TabsTrigger>
            <TabsTrigger value="1099-MISC" className="gap-1">
              <DollarSign className="h-3 w-3" />
              MISC
            </TabsTrigger>
            <TabsTrigger value="1099-K" className="gap-1">
              <CreditCard className="h-3 w-3" />
              K
            </TabsTrigger>
            <TabsTrigger value="1099-INT" className="gap-1">
              <PiggyBank className="h-3 w-3" />
              INT
            </TabsTrigger>
            <TabsTrigger value="1099-DIV" className="gap-1">
              <Building2 className="h-3 w-3" />
              DIV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="1099-NEC">
            <div className="mb-4 p-3 rounded-lg bg-muted">
              <h3 className="font-semibold">1099-NEC: Nonemployee Compensation</h3>
              <p className="text-sm text-muted-foreground">
                For payments to contractors, freelancers, and self-employed individuals. 
                Replaced Box 7 of 1099-MISC starting in 2020.
              </p>
              <div className="mt-2 text-xs">
                <strong>Due:</strong> Jan 31 to recipient & IRS (paper) | Mar 31 (e-file)
              </div>
            </div>
            {renderBoxTable(NEC_BOXES, "1099-NEC")}
          </TabsContent>

          <TabsContent value="1099-MISC">
            <div className="mb-4 p-3 rounded-lg bg-muted">
              <h3 className="font-semibold">1099-MISC: Miscellaneous Income</h3>
              <p className="text-sm text-muted-foreground">
                For rents, royalties, prizes, awards, medical payments, and other miscellaneous income.
                No longer used for nonemployee compensation (use 1099-NEC).
              </p>
              <div className="mt-2 text-xs">
                <strong>Due:</strong> Jan 31 to recipient | Feb 28 paper / Mar 31 e-file to IRS
              </div>
            </div>
            {renderBoxTable(MISC_BOXES, "1099-MISC")}
          </TabsContent>

          <TabsContent value="1099-K">
            <div className="mb-4 p-3 rounded-lg bg-muted">
              <h3 className="font-semibold">1099-K: Payment Card and Third Party Network Transactions</h3>
              <p className="text-sm text-muted-foreground">
                Issued by payment processors (Stripe, PayPal, Square, Venmo, etc.) for gross payment volume.
              </p>
              <div className="mt-2 flex items-start gap-2 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>2024 threshold:</strong> $600 (reduced from $20,000/200 transactions). 
                  Gross receipts - you can deduct expenses on Schedule C.
                </span>
              </div>
            </div>
            {renderBoxTable(K_BOXES, "1099-K")}
          </TabsContent>

          <TabsContent value="1099-INT">
            <div className="mb-4 p-3 rounded-lg bg-muted">
              <h3 className="font-semibold">1099-INT: Interest Income</h3>
              <p className="text-sm text-muted-foreground">
                Reports interest earned from banks, brokerage accounts, bonds, CDs, and other interest-bearing accounts.
              </p>
              <div className="mt-2 text-xs">
                <strong>Threshold:</strong> $10 for most interest | <strong>Due:</strong> Jan 31 to recipient
              </div>
            </div>
            {renderBoxTable(INT_BOXES, "1099-INT")}
          </TabsContent>

          <TabsContent value="1099-DIV">
            <div className="mb-4 p-3 rounded-lg bg-muted">
              <h3 className="font-semibold">1099-DIV: Dividends and Distributions</h3>
              <p className="text-sm text-muted-foreground">
                Reports dividends from stocks, mutual funds, REITs, and capital gain distributions.
              </p>
              <div className="mt-2 text-xs">
                <strong>Threshold:</strong> $10 for dividends | <strong>Key:</strong> Box 1b (qualified) taxed at capital gains rates
              </div>
            </div>
            {renderBoxTable(DIV_BOXES, "1099-DIV")}
          </TabsContent>
        </Tabs>

        {/* Filing Requirements Summary */}
        <div className="mt-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-200">Important Filing Notes</p>
              <ul className="mt-2 space-y-1 text-amber-700 dark:text-amber-300">
                <li>• <strong>Corporations:</strong> Generally exempt from 1099-NEC/MISC (except attorneys, medical payments)</li>
                <li>• <strong>W-9:</strong> Collect before payment to avoid 24% backup withholding</li>
                <li>• <strong>Penalties:</strong> $60-$310 per form for late/incorrect filing (2024)</li>
                <li>• <strong>State filing:</strong> Many states require separate filing or participate in Combined Federal/State Program</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
