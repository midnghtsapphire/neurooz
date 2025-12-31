import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 1099-MISC Box reference with thresholds
const MISC_BOXES = [
  { box: 1, name: "Rents", threshold: 600 },
  { box: 2, name: "Royalties", threshold: 10 },
  { box: 3, name: "Other income", threshold: 600 },
  { box: 4, name: "Federal income tax withheld", threshold: null },
  { box: 5, name: "Fishing boat proceeds", threshold: null },
  { box: 6, name: "Medical and health care payments", threshold: 600 },
  { box: 7, name: "Payer made direct sales totaling $5,000+", threshold: 5000 },
  { box: 8, name: "Substitute payments in lieu of dividends", threshold: 10 },
  { box: 9, name: "Crop insurance proceeds", threshold: 600 },
  { box: 10, name: "Gross proceeds paid to attorney", threshold: 600 },
  { box: 11, name: "Fish purchased for resale", threshold: 600 },
  { box: 12, name: "Section 409A deferrals", threshold: null },
  { box: 14, name: "Excess golden parachute payments", threshold: null },
];

interface Form1099MISCTrackerProps {
  businessId?: string;
}

export function Form1099MISCTracker({ businessId }: Form1099MISCTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: "",
    box_number: 1,
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    description: "",
    payment_method: "check",
  });

  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["1099-misc-payments", businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("form_1099_misc_payments")
        .select("*")
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false });

      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addPayment = useMutation({
    mutationFn: async (payment: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("form_1099_misc_payments").insert({
        user_id: user.id,
        business_id: businessId || null,
        recipient_name: payment.recipient_name,
        box_number: payment.box_number,
        amount: parseFloat(payment.amount) || 0,
        payment_date: payment.payment_date,
        description: payment.description,
        payment_method: payment.payment_method,
        tax_year: new Date().getFullYear(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-misc-payments"] });
      toast.success("Payment recorded");
      setIsDialogOpen(false);
      setFormData({
        recipient_name: "",
        box_number: 1,
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        description: "",
        payment_method: "check",
      });
    },
    onError: (error) => toast.error(`Failed to add payment: ${error.message}`),
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("form_1099_misc_payments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-misc-payments"] });
      toast.success("Payment deleted");
    },
  });

  // Calculate totals by recipient and box
  const recipientTotals = payments.reduce((acc, p) => {
    const key = `${p.recipient_name}-${p.box_number}`;
    acc[key] = (acc[key] || 0) + (p.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const getBoxInfo = (boxNum: number) => MISC_BOXES.find(b => b.box === boxNum);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">1099-MISC Payments</h3>
          <p className="text-sm text-muted-foreground">Track miscellaneous income payments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Payment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record 1099-MISC Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Recipient Name</Label>
                <Input
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  placeholder="Enter recipient name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Box Number</Label>
                  <Select
                    value={formData.box_number.toString()}
                    onValueChange={(v) => setFormData({ ...formData, box_number: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MISC_BOXES.map((box) => (
                        <SelectItem key={box.box} value={box.box.toString()}>
                          Box {box.box}: {box.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(v) => setFormData({ ...formData, payment_method: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="ach">ACH/Direct Deposit</SelectItem>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => addPayment.mutate(formData)}
                disabled={!formData.recipient_name || !formData.amount || addPayment.isPending}
              >
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Threshold Warnings */}
      {Object.entries(recipientTotals).map(([key, total]) => {
        const [name, boxStr] = key.split("-");
        const boxNum = parseInt(boxStr);
        const boxInfo = getBoxInfo(boxNum);
        if (boxInfo?.threshold && total >= boxInfo.threshold) {
          return (
            <Card key={key} className="border-warning bg-warning/10">
              <CardContent className="py-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-sm">
                    {name}: ${total.toLocaleString()} in Box {boxNum} ({boxInfo.name})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Threshold: ${boxInfo.threshold.toLocaleString()} — 1099-MISC required
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No payments recorded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Box</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.recipient_name}</TableCell>
                    <TableCell>
                      Box {payment.box_number}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({getBoxInfo(payment.box_number)?.name})
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${(payment.amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePayment.mutate(payment.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
