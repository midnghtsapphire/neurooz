import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, Plus, Trash2, AlertTriangle, CheckCircle2, 
  DollarSign, Users, FileText
} from "lucide-react";
import { useEmployerEducationBenefits } from "@/hooks/use-employer-education-benefits";
import { format } from "date-fns";

const PAYMENT_TYPES = [
  { value: "tuition", label: "Tuition & Fees" },
  { value: "student_loan", label: "Student Loan Payment" },
  { value: "books", label: "Books & Supplies" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other Education Expense" },
];

const currentYear = new Date().getFullYear();

export function EmployerEducationTracker() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { benefits, isLoading, addBenefit, deleteBenefit, employeeTotals, totalPaid } = useEmployerEducationBenefits(selectedYear);

  const [newBenefit, setNewBenefit] = useState({
    employee_name: "",
    employee_email: "",
    payment_date: new Date().toISOString().split("T")[0],
    amount: 0,
    payment_type: "tuition",
    description: "",
    tax_year: currentYear,
    documentation_notes: "",
    is_student_loan_payment: false,
  });

  const handleSubmit = () => {
    if (!newBenefit.employee_name || newBenefit.amount <= 0) {
      return;
    }
    addBenefit.mutate({
      ...newBenefit,
      is_student_loan_payment: newBenefit.payment_type === "student_loan",
    });
    setDialogOpen(false);
    setNewBenefit({
      employee_name: "",
      employee_email: "",
      payment_date: new Date().toISOString().split("T")[0],
      amount: 0,
      payment_type: "tuition",
      description: "",
      tax_year: currentYear,
      documentation_notes: "",
      is_student_loan_payment: false,
    });
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid ({selectedYear})</p>
                <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees Benefited</p>
                <p className="text-2xl font-bold">{Object.keys(employeeTotals).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payments Recorded</p>
                <p className="text-2xl font-bold">{benefits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Limits Summary */}
      {Object.keys(employeeTotals).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Employee Totals (Tax Year {selectedYear})</CardTitle>
            <CardDescription>Track against the $5,250 annual limit per employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(employeeTotals).map(([name, data]) => (
                <div 
                  key={name}
                  className={`p-3 rounded-lg border ${
                    data.overLimit 
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" 
                      : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{name}</span>
                    {data.overLimit ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className={`text-lg font-bold ${data.overLimit ? "text-red-600" : "text-green-600"}`}>
                    ${data.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.overLimit 
                      ? `$${(data.total - 5250).toLocaleString()} over limit (taxable)` 
                      : `$${(5250 - data.total).toLocaleString()} remaining`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tracker */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education Benefit Payments
              </CardTitle>
              <CardDescription>
                Track all educational assistance and student loan payments to employees
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Record Education Benefit Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Employee Name *</Label>
                        <Input
                          placeholder="John Smith"
                          value={newBenefit.employee_name}
                          onChange={(e) => setNewBenefit({ ...newBenefit, employee_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Employee Email</Label>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          value={newBenefit.employee_email}
                          onChange={(e) => setNewBenefit({ ...newBenefit, employee_email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Payment Date *</Label>
                        <Input
                          type="date"
                          value={newBenefit.payment_date}
                          onChange={(e) => setNewBenefit({ ...newBenefit, payment_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Amount *</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newBenefit.amount || ""}
                          onChange={(e) => setNewBenefit({ ...newBenefit, amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label>Payment Type</Label>
                        <Select 
                          value={newBenefit.payment_type} 
                          onValueChange={(v) => setNewBenefit({ ...newBenefit, payment_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Input
                        placeholder="e.g., Spring semester tuition, Navient loan payment"
                        value={newBenefit.description}
                        onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Documentation Notes</Label>
                      <Textarea
                        placeholder="e.g., Invoice #12345, Check #789, Direct payment confirmation"
                        value={newBenefit.documentation_notes}
                        onChange={(e) => setNewBenefit({ ...newBenefit, documentation_notes: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmit} 
                      className="w-full"
                      disabled={!newBenefit.employee_name || newBenefit.amount <= 0}
                    >
                      Record Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : benefits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No education benefits recorded for {selectedYear}</p>
              <p className="text-sm">Click "Add Payment" to record a payment</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell>{format(new Date(benefit.payment_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{benefit.employee_name}</p>
                          {benefit.employee_email && (
                            <p className="text-xs text-muted-foreground">{benefit.employee_email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={benefit.is_student_loan_payment ? "secondary" : "outline"}>
                          {PAYMENT_TYPES.find((t) => t.value === benefit.payment_type)?.label || benefit.payment_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {benefit.description || "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(benefit.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBenefit.mutate(benefit.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Reminder */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Tax Filing Reminders</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• <strong>W-2 Box 1:</strong> Exclude benefits up to $5,250 per employee</li>
                <li>• <strong>W-2 Box 14:</strong> Optionally note the benefit amount (informational)</li>
                <li>• <strong>Business Deduction:</strong> Deduct total as employee benefit expense</li>
                <li>• <strong>Over $5,250:</strong> Any excess is taxable wages for the employee</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
