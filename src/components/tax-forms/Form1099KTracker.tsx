import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Info, CreditCard, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface Form1099KTrackerProps {
  businessId?: string;
}

export function Form1099KTracker({ businessId }: Form1099KTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    payer_name: "",
    payer_tin: "",
    gross_amount: "",
    payment_card_transactions: "",
    third_party_network_transactions: "",
    card_not_present: "",
    federal_withheld: "",
    state_withheld: "",
    state_income: "",
    state_id: "",
    // Monthly amounts
    january_amount: "",
    february_amount: "",
    march_amount: "",
    april_amount: "",
    may_amount: "",
    june_amount: "",
    july_amount: "",
    august_amount: "",
    september_amount: "",
    october_amount: "",
    november_amount: "",
    december_amount: "",
  });

  const queryClient = useQueryClient();

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["1099-k-received", businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("form_1099_k_received")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addForm = useMutation({
    mutationFn: async (form: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("form_1099_k_received").insert({
        user_id: user.id,
        business_id: businessId || null,
        payer_name: form.payer_name,
        payer_tin: form.payer_tin || null,
        gross_amount: parseFloat(form.gross_amount) || 0,
        payment_card_transactions: parseFloat(form.payment_card_transactions) || 0,
        third_party_network_transactions: parseFloat(form.third_party_network_transactions) || 0,
        card_not_present: parseFloat(form.card_not_present) || 0,
        federal_withheld: parseFloat(form.federal_withheld) || 0,
        state_withheld: parseFloat(form.state_withheld) || 0,
        state_income: parseFloat(form.state_income) || 0,
        state_id: form.state_id || null,
        january_amount: parseFloat(form.january_amount) || 0,
        february_amount: parseFloat(form.february_amount) || 0,
        march_amount: parseFloat(form.march_amount) || 0,
        april_amount: parseFloat(form.april_amount) || 0,
        may_amount: parseFloat(form.may_amount) || 0,
        june_amount: parseFloat(form.june_amount) || 0,
        july_amount: parseFloat(form.july_amount) || 0,
        august_amount: parseFloat(form.august_amount) || 0,
        september_amount: parseFloat(form.september_amount) || 0,
        october_amount: parseFloat(form.october_amount) || 0,
        november_amount: parseFloat(form.november_amount) || 0,
        december_amount: parseFloat(form.december_amount) || 0,
        tax_year: new Date().getFullYear(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-k-received"] });
      toast.success("1099-K recorded");
      setIsDialogOpen(false);
      // Reset form
      setFormData({
        payer_name: "",
        payer_tin: "",
        gross_amount: "",
        payment_card_transactions: "",
        third_party_network_transactions: "",
        card_not_present: "",
        federal_withheld: "",
        state_withheld: "",
        state_income: "",
        state_id: "",
        january_amount: "",
        february_amount: "",
        march_amount: "",
        april_amount: "",
        may_amount: "",
        june_amount: "",
        july_amount: "",
        august_amount: "",
        september_amount: "",
        october_amount: "",
        november_amount: "",
        december_amount: "",
      });
    },
    onError: (error) => toast.error(`Failed to add form: ${error.message}`),
  });

  const deleteForm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("form_1099_k_received").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-k-received"] });
      toast.success("Form deleted");
    },
  });

  const totalGross = forms.reduce((sum, f) => sum + (f.gross_amount || 0), 0);
  const totalWithheld = forms.reduce((sum, f) => sum + (f.federal_withheld || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">1099-K Received</h3>
          <p className="text-sm text-muted-foreground">Track payment card and third-party network income</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add 1099-K</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record 1099-K Received</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
                <TabsTrigger value="withholding">Withholding</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payer Name (PSE)</Label>
                    <Input
                      value={formData.payer_name}
                      onChange={(e) => setFormData({ ...formData, payer_name: e.target.value })}
                      placeholder="e.g., PayPal, Stripe, Square"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payer TIN</Label>
                    <Input
                      value={formData.payer_tin}
                      onChange={(e) => setFormData({ ...formData, payer_tin: e.target.value })}
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Box 1a: Gross Amount</Label>
                  <Input
                    type="number"
                    value={formData.gross_amount}
                    onChange={(e) => setFormData({ ...formData, gross_amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Box 1b: Card Not Present</Label>
                    <Input
                      type="number"
                      value={formData.card_not_present}
                      onChange={(e) => setFormData({ ...formData, card_not_present: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Box 2: Payment Card Transactions</Label>
                    <Input
                      type="number"
                      value={formData.payment_card_transactions}
                      onChange={(e) => setFormData({ ...formData, payment_card_transactions: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Box 3: Third Party Network Transactions</Label>
                  <Input
                    type="number"
                    value={formData.third_party_network_transactions}
                    onChange={(e) => setFormData({ ...formData, third_party_network_transactions: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">Monthly gross amounts (Boxes 5a-5l)</p>
                <div className="grid grid-cols-3 gap-3">
                  {MONTHS.map((month, idx) => {
                    const key = `${month.toLowerCase()}_amount` as keyof typeof formData;
                    return (
                      <div key={month} className="space-y-1">
                        <Label className="text-xs">{month}</Label>
                        <Input
                          type="number"
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          placeholder="0.00"
                          className="h-8 text-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="withholding" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Box 4: Federal Income Tax Withheld</Label>
                    <Input
                      type="number"
                      value={formData.federal_withheld}
                      onChange={(e) => setFormData({ ...formData, federal_withheld: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State ID</Label>
                    <Input
                      value={formData.state_id}
                      onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                      placeholder="e.g., GA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Box 6: State Income</Label>
                    <Input
                      type="number"
                      value={formData.state_income}
                      onChange={(e) => setFormData({ ...formData, state_income: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Box 7: State Tax Withheld</Label>
                    <Input
                      type="number"
                      value={formData.state_withheld}
                      onChange={(e) => setFormData({ ...formData, state_withheld: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button
              className="w-full mt-4"
              onClick={() => addForm.mutate(formData)}
              disabled={!formData.payer_name || addForm.isPending}
            >
              Save 1099-K
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-info bg-info/10">
        <CardContent className="py-3 flex items-start gap-3">
          <Info className="w-5 h-5 text-info mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">2024 Threshold: $5,000</p>
            <p className="text-muted-foreground">
              Payment Settlement Entities must report if gross payments exceed $5,000.
              This will drop to $600 in future years.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {forms.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gross (1099-K)</p>
                <p className="text-xl font-bold">${totalGross.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Federal Withheld</p>
                <p className="text-xl font-bold">${totalWithheld.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Received 1099-K Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : forms.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No 1099-K forms recorded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Gross Amount</TableHead>
                  <TableHead className="text-right">Card Transactions</TableHead>
                  <TableHead className="text-right">Third Party</TableHead>
                  <TableHead className="text-right">Fed. Withheld</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.payer_name}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${(form.gross_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${(form.payment_card_transactions || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${(form.third_party_network_transactions || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${(form.federal_withheld || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteForm.mutate(form.id)}
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
