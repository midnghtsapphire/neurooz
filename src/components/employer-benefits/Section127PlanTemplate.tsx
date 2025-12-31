import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Copy, Check, Building2 } from "lucide-react";
import { toast } from "sonner";

export function Section127PlanTemplate() {
  const [companyName, setCompanyName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [maxBenefit, setMaxBenefit] = useState("5250");
  const [copied, setCopied] = useState(false);

  const planDocument = `
SECTION 127 EDUCATIONAL ASSISTANCE PROGRAM

${companyName || "[COMPANY NAME]"}
Educational Assistance Plan

Effective Date: ${effectiveDate || "[DATE]"}

═══════════════════════════════════════════════════════════════

ARTICLE I - PURPOSE

This Educational Assistance Program (the "Plan") is established by ${companyName || "[COMPANY NAME]"} (the "Employer") pursuant to Section 127 of the Internal Revenue Code to provide educational assistance benefits to eligible employees on a tax-favored basis.

ARTICLE II - DEFINITIONS

2.1 "Educational Assistance" means:
    (a) Payment of expenses for education of the employee, including tuition, fees, books, supplies, and equipment
    (b) Payment toward principal or interest on qualified education loans of the employee
    (c) The provision of courses of instruction for the employee

2.2 "Eligible Employee" means any employee of the Employer who has completed at least [30/60/90] days of service.

2.3 "Plan Year" means the calendar year.

ARTICLE III - ELIGIBILITY

3.1 All employees meeting the definition of Eligible Employee are entitled to participate in this Plan.

3.2 The Plan does not discriminate in favor of employees who are highly compensated employees (as defined in Section 414(q) of the Code) or their dependents.

ARTICLE IV - BENEFITS

4.1 Maximum Annual Benefit: The maximum educational assistance that may be provided to any employee under this Plan is $${maxBenefit || "5,250"} per calendar year.

4.2 Qualifying Expenses include:
    • Tuition and fees for courses at accredited institutions
    • Books, supplies, and equipment required for courses
    • Student loan principal and interest payments (through December 31, 2025)

4.3 Non-Qualifying Expenses:
    • Meals, lodging, or transportation
    • Tools or supplies retained by employee after course completion
    • Courses involving sports, games, or hobbies (unless job-related)

ARTICLE V - ADMINISTRATION

5.1 The Employer shall administer this Plan and has full discretionary authority to:
    (a) Interpret the terms of the Plan
    (b) Determine eligibility for benefits
    (c) Establish procedures for claims and appeals

5.2 Employees must submit requests for educational assistance in writing, including:
    • Description of educational program or student loan information
    • Cost documentation
    • Expected completion date (if applicable)

ARTICLE VI - FUNDING

6.1 The Employer shall pay the cost of all benefits under this Plan directly or reimburse employees for qualified expenses.

6.2 Employees may not elect to receive cash in lieu of educational assistance.

ARTICLE VII - AMENDMENTS AND TERMINATION

7.1 The Employer reserves the right to amend, modify, or terminate this Plan at any time.

7.2 Amendment or termination shall not affect benefits already approved.

ARTICLE VIII - GENERAL PROVISIONS

8.1 This Plan is intended to qualify as an educational assistance program under Section 127 of the Internal Revenue Code.

8.2 Benefits under this Plan are not considered wages for purposes of federal income tax withholding.

8.3 No more than 5% of the amounts paid or incurred by the Employer for educational assistance during the year may be provided for the class of individuals who own more than 5% of the stock or capital/profits interest of the Employer.

═══════════════════════════════════════════════════════════════

ADOPTION

${companyName || "[COMPANY NAME]"} hereby adopts this Educational Assistance Program effective ${effectiveDate || "[DATE]"}.


_________________________________          _______________
Authorized Signature                        Date


_________________________________
Print Name and Title

═══════════════════════════════════════════════════════════════

REQUIRED DOCUMENTATION CHECKLIST:

□ Signed Plan Document (this document)
□ Employee Notification/Summary
□ Reimbursement Request Form
□ Record of Benefits Provided (per employee, per year)

TAX FILING REMINDERS:

• Exclude qualified benefits from employee W-2 Box 1
• May note benefits in W-2 Box 14 (optional)
• Deduct as business expense (wages/benefits)
• Keep records for 4+ years

═══════════════════════════════════════════════════════════════
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(planDocument);
    setCopied(true);
    toast.success("Plan document copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([planDocument], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Section-127-Plan-${companyName || "Template"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Plan document downloaded");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Section 127 Educational Assistance Plan Template
        </CardTitle>
        <CardDescription>
          Generate a compliant written plan document required by the IRS. Customize and download.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Company Name</Label>
            <Input
              placeholder="Your Business Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <Label>Effective Date</Label>
            <Input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Maximum Annual Benefit ($)</Label>
            <Input
              type="number"
              placeholder="5250"
              value={maxBenefit}
              onChange={(e) => setMaxBenefit(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">IRS max is $5,250</p>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div>
          <Label className="mb-2 block">Plan Document Preview</Label>
          <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs whitespace-pre-wrap border">
            {planDocument}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download as Text File
          </Button>
        </div>

        {/* Requirements Reminder */}
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">Requirements Reminder</p>
                <ul className="mt-2 space-y-1 text-amber-700 dark:text-amber-300">
                  <li>• Plan must be in writing (this document)</li>
                  <li>• Cannot discriminate in favor of highly compensated employees</li>
                  <li>• No more than 5% of benefits can go to 5%+ owners</li>
                  <li>• Employee cannot choose cash instead of education benefit</li>
                  <li>• Keep records of all payments made</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
