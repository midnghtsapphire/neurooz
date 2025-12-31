import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, Plus, Trash2, AlertTriangle, CheckCircle2, 
  DollarSign, FileText, Printer
} from "lucide-react";
import { use1099NECPayments, use1099Recipients } from "@/hooks/use-businesses-extended";
import { format } from "date-fns";

const PAYMENT_METHODS = [
  { value: "check", label: "Check" },
  { value: "ach", label: "ACH/Direct Deposit" },
  { value: "cash", label: "Cash" },
  { value: "venmo", label: "Venmo" },
  { value: "paypal", label: "PayPal" },
  { value: "zelle", label: "Zelle" },
  { value: "wire", label: "Wire Transfer" },
  { value: "other", label: "Other" },
];

const currentYear = new Date().getFullYear();

interface Form1099NECTrackerProps {
  businessId: string;
}

export function Form1099NECTracker({ businessId }: Form1099NECTrackerProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  
  const { 
    payments, isLoading, addPayment, deletePayment, 
    recipientTotals, totalPaid, recipientsNeeding1099 
  } = use1099NECPayments(businessId, selectedYear);
  
  const { recipients, addRecipient } = use1099Recipients(businessId);

  const [newPayment, setNewPayment] = useState({
    recipient_id: "",
    recipient_name: "",
    payment_date: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
    payment_method: "check",
    check_number: "",
    tax_year: currentYear,
  });

  const [newRecipient, setNewRecipient] = useState({
    recipient_name: "",
    recipient_type: "individual",
    tin: "",
    tin_type: "ssn",
    address_line1: "",
    city: "",
    state: "",
    zip: "",
    email: "",
  });

  const handleSubmitPayment = () => {
    if (!newPayment.recipient_name || newPayment.amount <= 0) return;
    
    addPayment.mutate({
      ...newPayment,
      business_id: businessId,
    });
    
    setDialogOpen(false);
    setNewPayment({
      recipient_id: "",
      recipient_name: "",
      payment_date: new Date().toISOString().split("T")[0],
      amount: 0,
      description: "",
      payment_method: "check",
      check_number: "",
      tax_year: currentYear,
    });
  };

  const handleSubmitRecipient = () => {
    if (!newRecipient.recipient_name) return;
    
    addRecipient.mutate({
      ...newRecipient,
      business_id: businessId,
    });
    
    setRecipientDialogOpen(false);
    setNewRecipient({
      recipient_name: "",
      recipient_type: "individual",
      tin: "",
      tin_type: "ssn",
      address_line1: "",
      city: "",
      state: "",
      zip: "",
      email: "",
    });
  };

  const handleSelectRecipient = (recipientId: string) => {
    const recipient = recipients.find(r => r.id === recipientId);
    if (recipient) {
      setNewPayment(prev => ({
        ...prev,
        recipient_id: recipientId,
        recipient_name: recipient.recipient_name,
      }));
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-muted-foreground">Total Recipients</p>
                <p className="text-2xl font-bold">{Object.keys(recipientTotals).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Need 1099 (≥$600)</p>
                <p className="text-2xl font-bold">{recipientsNeeding1099}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Under Threshold</p>
                <p className="text-2xl font-bold">
                  {Object.keys(recipientTotals).length - recipientsNeeding1099}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recipient Totals */}
      {Object.keys(recipientTotals).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contractor Totals (Tax Year {selectedYear})</CardTitle>
            <CardDescription>1099-NEC required for payments ≥$600 per recipient</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(recipientTotals).map(([name, data]) => (
                <div 
                  key={name}
                  className={`p-3 rounded-lg border ${
                    data.needs1099 
                      ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800" 
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{name}</span>
                    {data.needs1099 ? (
                      <Badge variant="destructive" className="ml-2">1099 Required</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2">Under $600</Badge>
                    )}
                  </div>
                  <p className={`text-lg font-bold ${data.needs1099 ? "text-amber-600" : ""}`}>
                    ${data.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.count} payment{data.count !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                1099-NEC Payments
              </CardTitle>
              <CardDescription>
                Track all payments to contractors and independent contractors
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
              
              <Dialog open={recipientDialogOpen} onOpenChange={setRecipientDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Recipient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add 1099 Recipient</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Recipient Name *</Label>
                        <Input
                          placeholder="John Smith or ABC Consulting LLC"
                          value={newRecipient.recipient_name}
                          onChange={(e) => setNewRecipient({ ...newRecipient, recipient_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select 
                          value={newRecipient.recipient_type} 
                          onValueChange={(v) => setNewRecipient({ ...newRecipient, recipient_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="business">Business/Corp</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>TIN Type</Label>
                        <Select 
                          value={newRecipient.tin_type} 
                          onValueChange={(v) => setNewRecipient({ ...newRecipient, tin_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ssn">SSN</SelectItem>
                            <SelectItem value="ein">EIN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>SSN/EIN (optional)</Label>
                        <Input
                          type="password"
                          placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                          value={newRecipient.tin}
                          onChange={(e) => setNewRecipient({ ...newRecipient, tin: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Address</Label>
                        <Input
                          placeholder="Street Address"
                          value={newRecipient.address_line1}
                          onChange={(e) => setNewRecipient({ ...newRecipient, address_line1: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={newRecipient.city}
                          onChange={(e) => setNewRecipient({ ...newRecipient, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          maxLength={2}
                          value={newRecipient.state}
                          onChange={(e) => setNewRecipient({ ...newRecipient, state: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div>
                        <Label>ZIP</Label>
                        <Input
                          value={newRecipient.zip}
                          onChange={(e) => setNewRecipient({ ...newRecipient, zip: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newRecipient.email}
                          onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSubmitRecipient} 
                      className="w-full"
                      disabled={!newRecipient.recipient_name}
                    >
                      Add Recipient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Record Contractor Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {recipients.length > 0 && (
                        <div className="col-span-2">
                          <Label>Select Saved Recipient</Label>
                          <Select 
                            value={newPayment.recipient_id} 
                            onValueChange={handleSelectRecipient}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose recipient..." />
                            </SelectTrigger>
                            <SelectContent>
                              {recipients.map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.recipient_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="col-span-2">
                        <Label>Recipient Name *</Label>
                        <Input
                          placeholder="John Smith"
                          value={newPayment.recipient_name}
                          onChange={(e) => setNewPayment({ ...newPayment, recipient_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Payment Date *</Label>
                        <Input
                          type="date"
                          value={newPayment.payment_date}
                          onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Amount *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newPayment.amount || ""}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label>Payment Method</Label>
                        <Select 
                          value={newPayment.payment_method} 
                          onValueChange={(v) => setNewPayment({ ...newPayment, payment_method: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_METHODS.map((m) => (
                              <SelectItem key={m.value} value={m.value}>
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Check Number</Label>
                        <Input
                          placeholder="Optional"
                          value={newPayment.check_number}
                          onChange={(e) => setNewPayment({ ...newPayment, check_number: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="e.g., Web development services, Consulting Q1"
                        value={newPayment.description}
                        onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitPayment} 
                      className="w-full"
                      disabled={!newPayment.recipient_name || newPayment.amount <= 0}
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
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No payments recorded for {selectedYear}</p>
              <p className="text-sm">Click "Record Payment" to add a contractor payment</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.payment_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.recipient_name}</p>
                          {payment.check_number && (
                            <p className="text-xs text-muted-foreground">Check #{payment.check_number}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {PAYMENT_METHODS.find((m) => m.value === payment.payment_method)?.label || payment.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {payment.description || "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(payment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePayment.mutate(payment.id)}
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

      {/* 1099-NEC Box Reference */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">1099-NEC Form Boxes</p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
                <div>
                  <strong>Box 1:</strong> Nonemployee compensation ($600+ threshold)
                </div>
                <div>
                  <strong>Box 2:</strong> Payer made direct sales ≥$5,000 (checkbox)
                </div>
                <div>
                  <strong>Box 4:</strong> Federal income tax withheld
                </div>
                <div>
                  <strong>Box 5-7:</strong> State tax information
                </div>
              </div>
              <p className="mt-2 text-xs">
                <strong>Due dates:</strong> To recipient by Jan 31 | To IRS by Jan 31 (paper) or Mar 31 (e-file)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
