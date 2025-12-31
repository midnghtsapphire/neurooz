import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Percent, DollarSign, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Form1099INTDIVTrackerProps {
  businessId?: string;
}

export function Form1099INTDIVTracker({ businessId }: Form1099INTDIVTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formType, setFormType] = useState<"1099-INT" | "1099-DIV">("1099-INT");
  const [formData, setFormData] = useState({
    payer_name: "",
    payer_tin: "",
    // 1099-INT fields
    interest_income: "",
    early_withdrawal_penalty: "",
    interest_on_savings_bonds: "",
    federal_withheld: "",
    investment_expenses: "",
    foreign_tax_paid: "",
    tax_exempt_interest: "",
    private_activity_bond_interest: "",
    market_discount: "",
    bond_premium: "",
    state_withheld: "",
    state_id: "",
    // 1099-DIV fields
    ordinary_dividends: "",
    qualified_dividends: "",
    capital_gain_distributions: "",
    nondividend_distributions: "",
    section_199a_dividends: "",
    collectibles_gain: "",
    section_1202_gain: "",
    section_1250_gain: "",
    exempt_interest_dividends: "",
  });

  const queryClient = useQueryClient();

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["1099-investment-income", businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("form_1099_investment_income")
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
    mutationFn: async (form: typeof formData & { form_type: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("form_1099_investment_income").insert({
        user_id: user.id,
        business_id: businessId || null,
        form_type: form.form_type,
        payer_name: form.payer_name,
        payer_tin: form.payer_tin || null,
        interest_income: parseFloat(form.interest_income) || 0,
        early_withdrawal_penalty: parseFloat(form.early_withdrawal_penalty) || 0,
        interest_on_savings_bonds: parseFloat(form.interest_on_savings_bonds) || 0,
        federal_withheld: parseFloat(form.federal_withheld) || 0,
        investment_expenses: parseFloat(form.investment_expenses) || 0,
        foreign_tax_paid: parseFloat(form.foreign_tax_paid) || 0,
        tax_exempt_interest: parseFloat(form.tax_exempt_interest) || 0,
        private_activity_bond_interest: parseFloat(form.private_activity_bond_interest) || 0,
        market_discount: parseFloat(form.market_discount) || 0,
        bond_premium: parseFloat(form.bond_premium) || 0,
        state_withheld: parseFloat(form.state_withheld) || 0,
        state_id: form.state_id || null,
        ordinary_dividends: parseFloat(form.ordinary_dividends) || 0,
        qualified_dividends: parseFloat(form.qualified_dividends) || 0,
        capital_gain_distributions: parseFloat(form.capital_gain_distributions) || 0,
        nondividend_distributions: parseFloat(form.nondividend_distributions) || 0,
        section_199a_dividends: parseFloat(form.section_199a_dividends) || 0,
        collectibles_gain: parseFloat(form.collectibles_gain) || 0,
        section_1202_gain: parseFloat(form.section_1202_gain) || 0,
        section_1250_gain: parseFloat(form.section_1250_gain) || 0,
        exempt_interest_dividends: parseFloat(form.exempt_interest_dividends) || 0,
        tax_year: new Date().getFullYear(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-investment-income"] });
      toast.success("Form recorded");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => toast.error(`Failed to add form: ${error.message}`),
  });

  const deleteForm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("form_1099_investment_income").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-investment-income"] });
      toast.success("Form deleted");
    },
  });

  const resetForm = () => {
    setFormData({
      payer_name: "",
      payer_tin: "",
      interest_income: "",
      early_withdrawal_penalty: "",
      interest_on_savings_bonds: "",
      federal_withheld: "",
      investment_expenses: "",
      foreign_tax_paid: "",
      tax_exempt_interest: "",
      private_activity_bond_interest: "",
      market_discount: "",
      bond_premium: "",
      state_withheld: "",
      state_id: "",
      ordinary_dividends: "",
      qualified_dividends: "",
      capital_gain_distributions: "",
      nondividend_distributions: "",
      section_199a_dividends: "",
      collectibles_gain: "",
      section_1202_gain: "",
      section_1250_gain: "",
      exempt_interest_dividends: "",
    });
  };

  const intForms = forms.filter(f => f.form_type === "1099-INT");
  const divForms = forms.filter(f => f.form_type === "1099-DIV");
  
  const totalInterest = intForms.reduce((sum, f) => sum + (f.interest_income || 0), 0);
  const totalDividends = divForms.reduce((sum, f) => sum + (f.ordinary_dividends || 0), 0);
  const totalQualified = divForms.reduce((sum, f) => sum + (f.qualified_dividends || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">1099-INT & 1099-DIV</h3>
          <p className="text-sm text-muted-foreground">Track interest and dividend income</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Form</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Investment Income Form</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Form Type</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as "1099-INT" | "1099-DIV")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1099-INT">1099-INT (Interest Income)</SelectItem>
                    <SelectItem value="1099-DIV">1099-DIV (Dividend Income)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payer Name</Label>
                  <Input
                    value={formData.payer_name}
                    onChange={(e) => setFormData({ ...formData, payer_name: e.target.value })}
                    placeholder="e.g., Bank of America, Fidelity"
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

              {formType === "1099-INT" ? (
                <Tabs defaultValue="income" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
                    <TabsTrigger value="withholding">Withholding</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="income" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Box 1: Interest Income</Label>
                      <Input
                        type="number"
                        value={formData.interest_income}
                        onChange={(e) => setFormData({ ...formData, interest_income: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 3: Savings Bond Interest</Label>
                        <Input
                          type="number"
                          value={formData.interest_on_savings_bonds}
                          onChange={(e) => setFormData({ ...formData, interest_on_savings_bonds: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 8: Tax-Exempt Interest</Label>
                        <Input
                          type="number"
                          value={formData.tax_exempt_interest}
                          onChange={(e) => setFormData({ ...formData, tax_exempt_interest: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="adjustments" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 2: Early Withdrawal Penalty</Label>
                        <Input
                          type="number"
                          value={formData.early_withdrawal_penalty}
                          onChange={(e) => setFormData({ ...formData, early_withdrawal_penalty: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 5: Investment Expenses</Label>
                        <Input
                          type="number"
                          value={formData.investment_expenses}
                          onChange={(e) => setFormData({ ...formData, investment_expenses: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 10: Market Discount</Label>
                        <Input
                          type="number"
                          value={formData.market_discount}
                          onChange={(e) => setFormData({ ...formData, market_discount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 11: Bond Premium</Label>
                        <Input
                          type="number"
                          value={formData.bond_premium}
                          onChange={(e) => setFormData({ ...formData, bond_premium: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="withholding" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 4: Federal Tax Withheld</Label>
                        <Input
                          type="number"
                          value={formData.federal_withheld}
                          onChange={(e) => setFormData({ ...formData, federal_withheld: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 6: Foreign Tax Paid</Label>
                        <Input
                          type="number"
                          value={formData.foreign_tax_paid}
                          onChange={(e) => setFormData({ ...formData, foreign_tax_paid: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>State ID</Label>
                        <Input
                          value={formData.state_id}
                          onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                          placeholder="e.g., GA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State Tax Withheld</Label>
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
              ) : (
                <Tabs defaultValue="dividends" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="dividends">Dividends</TabsTrigger>
                    <TabsTrigger value="gains">Capital Gains</TabsTrigger>
                    <TabsTrigger value="withholding">Withholding</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dividends" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 1a: Ordinary Dividends</Label>
                        <Input
                          type="number"
                          value={formData.ordinary_dividends}
                          onChange={(e) => setFormData({ ...formData, ordinary_dividends: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 1b: Qualified Dividends</Label>
                        <Input
                          type="number"
                          value={formData.qualified_dividends}
                          onChange={(e) => setFormData({ ...formData, qualified_dividends: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 3: Nondividend Distributions</Label>
                        <Input
                          type="number"
                          value={formData.nondividend_distributions}
                          onChange={(e) => setFormData({ ...formData, nondividend_distributions: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 5: Section 199A Dividends</Label>
                        <Input
                          type="number"
                          value={formData.section_199a_dividends}
                          onChange={(e) => setFormData({ ...formData, section_199a_dividends: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gains" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Box 2a: Capital Gain Distributions</Label>
                      <Input
                        type="number"
                        value={formData.capital_gain_distributions}
                        onChange={(e) => setFormData({ ...formData, capital_gain_distributions: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 2b: Section 1202 Gain</Label>
                        <Input
                          type="number"
                          value={formData.section_1202_gain}
                          onChange={(e) => setFormData({ ...formData, section_1202_gain: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 2c: Section 1250 Gain</Label>
                        <Input
                          type="number"
                          value={formData.section_1250_gain}
                          onChange={(e) => setFormData({ ...formData, section_1250_gain: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Box 2d: Collectibles (28%) Gain</Label>
                      <Input
                        type="number"
                        value={formData.collectibles_gain}
                        onChange={(e) => setFormData({ ...formData, collectibles_gain: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="withholding" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Box 4: Federal Tax Withheld</Label>
                        <Input
                          type="number"
                          value={formData.federal_withheld}
                          onChange={(e) => setFormData({ ...formData, federal_withheld: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Box 7: Foreign Tax Paid</Label>
                        <Input
                          type="number"
                          value={formData.foreign_tax_paid}
                          onChange={(e) => setFormData({ ...formData, foreign_tax_paid: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>State ID</Label>
                        <Input
                          value={formData.state_id}
                          onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                          placeholder="e.g., GA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State Tax Withheld</Label>
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
              )}

              <Button
                className="w-full mt-4"
                onClick={() => addForm.mutate({ ...formData, form_type: formType })}
                disabled={!formData.payer_name || addForm.isPending}
              >
                Save {formType}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      {forms.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-xl font-bold">${totalInterest.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Dividends</p>
                <p className="text-xl font-bold">${totalDividends.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualified Divs</p>
                <p className="text-xl font-bold">${totalQualified.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Received Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : forms.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No forms recorded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Dividends</TableHead>
                  <TableHead className="text-right">Fed. Withheld</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-muted">
                        {form.form_type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{form.payer_name}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${(form.interest_income || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${(form.ordinary_dividends || 0).toLocaleString()}
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
