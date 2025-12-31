import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Printer, Download, User, Building2, 
  DollarSign, AlertTriangle, CheckCircle2
} from "lucide-react";
import { useEmployerEducationBenefits } from "@/hooks/use-employer-education-benefits";

const currentYear = new Date().getFullYear();

interface W2FormData {
  // Employer info
  employerEIN: string;
  employerName: string;
  employerAddress: string;
  employerCity: string;
  employerState: string;
  employerZip: string;
  // Employee info
  employeeSSN: string;
  employeeName: string;
  employeeAddress: string;
  employeeCity: string;
  employeeState: string;
  employeeZip: string;
  // Wage boxes
  box1Wages: number;
  box2FedWithheld: number;
  box3SocialSecWages: number;
  box4SocialSecWithheld: number;
  box5MedicareWages: number;
  box6MedicareWithheld: number;
  box7SocialSecTips: number;
  box8AllocatedTips: number;
  box10DependentCareBenefits: number;
  box11NonqualifiedPlans: number;
  box12Codes: { code: string; amount: number }[];
  box13Statutory: boolean;
  box13Retirement: boolean;
  box13ThirdPartySick: boolean;
  box14Other: { description: string; amount: number }[];
  // State/local
  box15StateId: string;
  box16StateWages: number;
  box17StateWithheld: number;
  box18LocalWages: number;
  box19LocalWithheld: number;
  box20LocalityName: string;
}

const defaultW2Data: W2FormData = {
  employerEIN: "",
  employerName: "",
  employerAddress: "",
  employerCity: "",
  employerState: "",
  employerZip: "",
  employeeSSN: "",
  employeeName: "",
  employeeAddress: "",
  employeeCity: "",
  employeeState: "",
  employeeZip: "",
  box1Wages: 0,
  box2FedWithheld: 0,
  box3SocialSecWages: 0,
  box4SocialSecWithheld: 0,
  box5MedicareWages: 0,
  box6MedicareWithheld: 0,
  box7SocialSecTips: 0,
  box8AllocatedTips: 0,
  box10DependentCareBenefits: 0,
  box11NonqualifiedPlans: 0,
  box12Codes: [],
  box13Statutory: false,
  box13Retirement: false,
  box13ThirdPartySick: false,
  box14Other: [],
  box15StateId: "",
  box16StateWages: 0,
  box17StateWithheld: 0,
  box18LocalWages: 0,
  box19LocalWithheld: 0,
  box20LocalityName: "",
};

const BOX_12_CODES = [
  { code: "A", label: "Uncollected SS tax on tips" },
  { code: "B", label: "Uncollected Medicare tax on tips" },
  { code: "C", label: "Taxable cost of group-term life insurance over $50,000" },
  { code: "D", label: "401(k) deferrals" },
  { code: "E", label: "403(b) deferrals" },
  { code: "F", label: "408(k)(6) SEP deferrals" },
  { code: "G", label: "457(b) deferrals" },
  { code: "H", label: "501(c)(18)(D) deferrals" },
  { code: "J", label: "Nontaxable sick pay" },
  { code: "K", label: "20% excise tax on golden parachutes" },
  { code: "L", label: "Substantiated employee business expense reimbursements" },
  { code: "M", label: "Uncollected SS tax on group-term life insurance" },
  { code: "N", label: "Uncollected Medicare tax on group-term life insurance" },
  { code: "P", label: "Excludable moving expense reimbursements" },
  { code: "Q", label: "Nontaxable combat pay" },
  { code: "R", label: "Employer contributions to Archer MSA" },
  { code: "S", label: "408(p) SIMPLE deferrals" },
  { code: "T", label: "Adoption benefits" },
  { code: "V", label: "Income from exercise of nonstatutory stock options" },
  { code: "W", label: "Employer contributions to HSA" },
  { code: "Y", label: "Deferrals under 409A nonqualified deferred compensation plan" },
  { code: "Z", label: "Income under 409A" },
  { code: "AA", label: "Roth 401(k) contributions" },
  { code: "BB", label: "Roth 403(b) contributions" },
  { code: "DD", label: "Cost of employer-sponsored health coverage" },
  { code: "EE", label: "Roth 457(b) contributions" },
  { code: "FF", label: "Permitted benefits under qualified small employer HRA" },
  { code: "GG", label: "Income from qualified equity grants under 83(i)" },
  { code: "HH", label: "Aggregate deferrals under 83(i)" },
];

export function W2Generator() {
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [formData, setFormData] = useState<W2FormData>(defaultW2Data);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const { benefits, employeeTotals } = useEmployerEducationBenefits(selectedYear);
  
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 - i);
  const employees = Object.keys(employeeTotals);

  const handleSelectEmployee = (employeeName: string) => {
    setSelectedEmployee(employeeName);
    const employeeData = employeeTotals[employeeName];
    const employeeBenefits = benefits.filter(b => b.employee_name === employeeName);
    const email = employeeBenefits[0]?.employee_email || "";
    
    // Calculate education benefits for Box 14
    const educationBenefitTotal = Math.min(employeeData?.total || 0, 5250);
    const taxableExcess = Math.max((employeeData?.total || 0) - 5250, 0);
    
    setFormData(prev => ({
      ...prev,
      employeeName: employeeName,
      // Auto-populate Box 14 with education assistance
      box14Other: educationBenefitTotal > 0 ? [
        { description: "EDUC ASST", amount: educationBenefitTotal },
        ...(taxableExcess > 0 ? [{ description: "EDUC EXCESS (taxable)", amount: taxableExcess }] : []),
      ] : [],
    }));
  };

  const updateField = (field: keyof W2FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addBox12Code = () => {
    setFormData(prev => ({
      ...prev,
      box12Codes: [...prev.box12Codes, { code: "", amount: 0 }],
    }));
  };

  const updateBox12Code = (index: number, field: "code" | "amount", value: any) => {
    setFormData(prev => {
      const updated = [...prev.box12Codes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, box12Codes: updated };
    });
  };

  const removeBox12Code = (index: number) => {
    setFormData(prev => ({
      ...prev,
      box12Codes: prev.box12Codes.filter((_, i) => i !== index),
    }));
  };

  const addBox14Entry = () => {
    setFormData(prev => ({
      ...prev,
      box14Other: [...prev.box14Other, { description: "", amount: 0 }],
    }));
  };

  const updateBox14Entry = (index: number, field: "description" | "amount", value: any) => {
    setFormData(prev => {
      const updated = [...prev.box14Other];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, box14Other: updated };
    });
  };

  const removeBox14Entry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      box14Other: prev.box14Other.filter((_, i) => i !== index),
    }));
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>W-2 Form - ${formData.employeeName} - ${selectedYear}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .w2-form { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #000; }
                .cell { background: #fff; padding: 8px; min-height: 40px; }
                .cell-label { font-size: 10px; color: #666; }
                .cell-value { font-weight: bold; font-size: 14px; }
                .full-width { grid-column: span 2; }
                @media print { body { print-color-adjust: exact; } }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const formatSSN = (ssn: string) => {
    const cleaned = ssn.replace(/\D/g, "");
    if (cleaned.length >= 9) {
      return `XXX-XX-${cleaned.slice(-4)}`;
    }
    return ssn;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      {/* Employee Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Employee
          </CardTitle>
          <CardDescription>
            Choose an employee from your tracked education benefits to pre-populate W-2 data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Tax Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label>Employee (from Tracker)</Label>
              <Select value={selectedEmployee} onValueChange={handleSelectEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.length === 0 ? (
                    <SelectItem value="" disabled>No employees found for {selectedYear}</SelectItem>
                  ) : (
                    employees.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name} (${employeeTotals[name]?.total.toLocaleString()} education benefits)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedEmployee && employeeTotals[selectedEmployee] && (
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                {employeeTotals[selectedEmployee].overLimit ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">
                      <strong>{selectedEmployee}</strong> received ${employeeTotals[selectedEmployee].total.toLocaleString()} in education benefits. 
                      ${(employeeTotals[selectedEmployee].total - 5250).toLocaleString()} exceeds the $5,250 limit and must be included in Box 1 wages.
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>{selectedEmployee}</strong> received ${employeeTotals[selectedEmployee].total.toLocaleString()} in education benefits (within $5,250 limit - excluded from Box 1)
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* W-2 Form Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            W-2 Form Data
          </CardTitle>
          <CardDescription>
            Enter all W-2 information for the selected employee
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employer Information */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4" />
              Employer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Employer EIN (Box b)</Label>
                <Input
                  placeholder="XX-XXXXXXX"
                  value={formData.employerEIN}
                  onChange={(e) => updateField("employerEIN", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Employer Name (Box c)</Label>
                <Input
                  placeholder="Company Name"
                  value={formData.employerName}
                  onChange={(e) => updateField("employerName", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input
                  placeholder="Street Address"
                  value={formData.employerAddress}
                  onChange={(e) => updateField("employerAddress", e.target.value)}
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={formData.employerCity}
                  onChange={(e) => updateField("employerCity", e.target.value)}
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  maxLength={2}
                  value={formData.employerState}
                  onChange={(e) => updateField("employerState", e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input
                  value={formData.employerZip}
                  onChange={(e) => updateField("employerZip", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Employee Information */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>SSN (Box a) - Last 4 shown on preview</Label>
                <Input
                  type="password"
                  placeholder="XXX-XX-XXXX"
                  value={formData.employeeSSN}
                  onChange={(e) => updateField("employeeSSN", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Employee Name (Box e)</Label>
                <Input
                  placeholder="First Last"
                  value={formData.employeeName}
                  onChange={(e) => updateField("employeeName", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Address (Box f)</Label>
                <Input
                  placeholder="Street Address"
                  value={formData.employeeAddress}
                  onChange={(e) => updateField("employeeAddress", e.target.value)}
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={formData.employeeCity}
                  onChange={(e) => updateField("employeeCity", e.target.value)}
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  maxLength={2}
                  value={formData.employeeState}
                  onChange={(e) => updateField("employeeState", e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input
                  value={formData.employeeZip}
                  onChange={(e) => updateField("employeeZip", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Wage Boxes */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4" />
              Wage & Tax Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label>Box 1: Wages, tips, other</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box1Wages || ""}
                  onChange={(e) => updateField("box1Wages", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 2: Federal tax withheld</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box2FedWithheld || ""}
                  onChange={(e) => updateField("box2FedWithheld", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 3: Social security wages</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box3SocialSecWages || ""}
                  onChange={(e) => updateField("box3SocialSecWages", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 4: SS tax withheld</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box4SocialSecWithheld || ""}
                  onChange={(e) => updateField("box4SocialSecWithheld", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 5: Medicare wages</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box5MedicareWages || ""}
                  onChange={(e) => updateField("box5MedicareWages", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 6: Medicare tax withheld</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box6MedicareWithheld || ""}
                  onChange={(e) => updateField("box6MedicareWithheld", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 7: SS tips</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box7SocialSecTips || ""}
                  onChange={(e) => updateField("box7SocialSecTips", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 8: Allocated tips</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box8AllocatedTips || ""}
                  onChange={(e) => updateField("box8AllocatedTips", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 10: Dependent care benefits</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box10DependentCareBenefits || ""}
                  onChange={(e) => updateField("box10DependentCareBenefits", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 11: Nonqualified plans</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box11NonqualifiedPlans || ""}
                  onChange={(e) => updateField("box11NonqualifiedPlans", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Box 12 Codes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Box 12: Coded Benefits</h3>
              <Button variant="outline" size="sm" onClick={addBox12Code}>
                Add Code
              </Button>
            </div>
            {formData.box12Codes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Box 12 codes added</p>
            ) : (
              <div className="space-y-2">
                {formData.box12Codes.map((entry, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="w-40">
                      <Label>Code</Label>
                      <Select value={entry.code} onValueChange={(v) => updateBox12Code(index, "code", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {BOX_12_CODES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code} - {c.label.slice(0, 30)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={entry.amount || ""}
                        onChange={(e) => updateBox12Code(index, "amount", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBox12Code(index)}>
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Box 14 Other */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Box 14: Other (Education Benefits Auto-Populated)</h3>
              <Button variant="outline" size="sm" onClick={addBox14Entry}>
                Add Entry
              </Button>
            </div>
            {formData.box14Other.length === 0 ? (
              <p className="text-sm text-muted-foreground">No Box 14 entries</p>
            ) : (
              <div className="space-y-2">
                {formData.box14Other.map((entry, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Description</Label>
                      <Input
                        placeholder="e.g., EDUC ASST, SUI, SDI"
                        value={entry.description}
                        onChange={(e) => updateBox14Entry(index, "description", e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={entry.amount || ""}
                        onChange={(e) => updateBox14Entry(index, "amount", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBox14Entry(index)}>
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* State/Local */}
          <div>
            <h3 className="font-semibold mb-3">State & Local Taxes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label>Box 15: State/Employer ID</Label>
                <Input
                  value={formData.box15StateId}
                  onChange={(e) => updateField("box15StateId", e.target.value)}
                />
              </div>
              <div>
                <Label>Box 16: State wages</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box16StateWages || ""}
                  onChange={(e) => updateField("box16StateWages", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 17: State tax withheld</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box17StateWithheld || ""}
                  onChange={(e) => updateField("box17StateWithheld", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 18: Local wages</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box18LocalWages || ""}
                  onChange={(e) => updateField("box18LocalWages", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 19: Local tax withheld</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box19LocalWithheld || ""}
                  onChange={(e) => updateField("box19LocalWithheld", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Box 20: Locality name</Label>
                <Input
                  value={formData.box20LocalityName}
                  onChange={(e) => updateField("box20LocalityName", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
              {showPreview ? "Hide Preview" : "Preview W-2"}
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print W-2
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* W-2 Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>W-2 Preview</CardTitle>
            <CardDescription>Review before printing</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={printRef} className="bg-background border-2 border-foreground p-6 max-w-3xl mx-auto text-sm">
              <div className="text-center border-b-2 border-foreground pb-3 mb-4">
                <h2 className="text-lg font-bold">Form W-2 Wage and Tax Statement</h2>
                <p className="text-muted-foreground">Tax Year {selectedYear}</p>
                <p className="text-xs text-muted-foreground">Copy B - To Be Filed With Employee's FEDERAL Tax Return</p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-foreground/20">
                {/* Row 1 */}
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">a Employee's SSN</p>
                  <p className="font-mono">{formatSSN(formData.employeeSSN)}</p>
                </div>
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">b Employer ID number (EIN)</p>
                  <p className="font-mono">{formData.employerEIN}</p>
                </div>

                {/* Row 2 */}
                <div className="bg-background p-2 col-span-2">
                  <p className="text-xs text-muted-foreground">c Employer's name, address, and ZIP</p>
                  <p className="font-semibold">{formData.employerName}</p>
                  <p>{formData.employerAddress}</p>
                  <p>{formData.employerCity}, {formData.employerState} {formData.employerZip}</p>
                </div>

                {/* Row 3 - Wages */}
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">1 Wages, tips, other compensation</p>
                  <p className="font-bold text-lg">${formatCurrency(formData.box1Wages)}</p>
                </div>
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">2 Federal income tax withheld</p>
                  <p className="font-bold text-lg">${formatCurrency(formData.box2FedWithheld)}</p>
                </div>

                {/* Row 4 - SS */}
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">3 Social security wages</p>
                  <p>${formatCurrency(formData.box3SocialSecWages)}</p>
                </div>
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">4 Social security tax withheld</p>
                  <p>${formatCurrency(formData.box4SocialSecWithheld)}</p>
                </div>

                {/* Row 5 - Medicare */}
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">5 Medicare wages and tips</p>
                  <p>${formatCurrency(formData.box5MedicareWages)}</p>
                </div>
                <div className="bg-background p-2">
                  <p className="text-xs text-muted-foreground">6 Medicare tax withheld</p>
                  <p>${formatCurrency(formData.box6MedicareWithheld)}</p>
                </div>

                {/* Employee info */}
                <div className="bg-background p-2 col-span-2">
                  <p className="text-xs text-muted-foreground">e Employee's name</p>
                  <p className="font-semibold">{formData.employeeName}</p>
                </div>
                <div className="bg-background p-2 col-span-2">
                  <p className="text-xs text-muted-foreground">f Employee's address and ZIP</p>
                  <p>{formData.employeeAddress}</p>
                  <p>{formData.employeeCity}, {formData.employeeState} {formData.employeeZip}</p>
                </div>

                {/* Box 12 */}
                {formData.box12Codes.length > 0 && (
                  <div className="bg-background p-2 col-span-2">
                    <p className="text-xs text-muted-foreground">12 Coded Items</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.box12Codes.map((entry, i) => (
                        <Badge key={i} variant="outline">
                          {entry.code}: ${formatCurrency(entry.amount)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Box 14 */}
                {formData.box14Other.length > 0 && (
                  <div className="bg-background p-2 col-span-2">
                    <p className="text-xs text-muted-foreground">14 Other</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.box14Other.map((entry, i) => (
                        <Badge key={i} variant="secondary">
                          {entry.description}: ${formatCurrency(entry.amount)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* State/Local */}
                {(formData.box16StateWages > 0 || formData.box17StateWithheld > 0) && (
                  <>
                    <div className="bg-background p-2">
                      <p className="text-xs text-muted-foreground">15 State / Employer's state ID</p>
                      <p>{formData.box15StateId}</p>
                    </div>
                    <div className="bg-background p-2">
                      <p className="text-xs text-muted-foreground">16 State wages</p>
                      <p>${formatCurrency(formData.box16StateWages)}</p>
                    </div>
                    <div className="bg-background p-2">
                      <p className="text-xs text-muted-foreground">17 State income tax</p>
                      <p>${formatCurrency(formData.box17StateWithheld)}</p>
                    </div>
                    <div className="bg-background p-2">
                      <p className="text-xs text-muted-foreground">20 Locality</p>
                      <p>{formData.box20LocalityName}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
