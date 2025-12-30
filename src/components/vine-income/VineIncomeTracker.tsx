import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, DollarSign, Calendar, TrendingDown, Plus, Edit2, Trash2, Shield, Clock } from "lucide-react";
import { useVineIncomeByYear, useUpsertVineIncome, useDeleteVineIncome, calculateYearlyTotals, VineIncomeInput, MonthlyVineIncome } from "@/hooks/use-vine-income";
import { useIRWEExpenses, calculateTotalIRWE, useDisabilityTaxRules } from "@/hooks/use-irwe";
import { useDisabilityProfile, calculateTWPStatus } from "@/hooks/use-disability-profile";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface IncomeFormData {
  month: number;
  brand_items_etv: number;
  non_brand_items_etv: number;
  broken_items_etv: number;
  notes: string;
}

export function VineIncomeTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MonthlyVineIncome | null>(null);
  const [formData, setFormData] = useState<IncomeFormData>({
    month: new Date().getMonth() + 1,
    brand_items_etv: 0,
    non_brand_items_etv: 0,
    broken_items_etv: 0,
    notes: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const { data: incomeRecords = [], isLoading } = useVineIncomeByYear(userId ?? undefined, selectedYear);
  const { data: irweExpenses = [] } = useIRWEExpenses(userId ?? undefined);
  const { data: disabilityProfile } = useDisabilityProfile(userId ?? undefined);
  const { data: taxRules } = useDisabilityTaxRules(2025);

  const upsertMutation = useUpsertVineIncome();
  const deleteMutation = useDeleteVineIncome();

  // Get SGA and TWP thresholds from rules
  const sgaLimit = taxRules?.rulesMap?.["sga_limit"] ?? 1620;
  const twpThreshold = taxRules?.rulesMap?.["twp_threshold"] ?? 1160;

  // Calculate totals
  const yearlyTotals = calculateYearlyTotals(incomeRecords);
  const monthlyIRWE = calculateTotalIRWE(irweExpenses);

  // Current month status (for real-time display)
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthRecord = incomeRecords.find(r => r.month === currentMonth);
  const currentCountableIncome = currentMonthRecord?.countable_income ?? 0;

  // TWP Status
  const twpMonthsUsedTotal = disabilityProfile?.twp_months_used ?? 0;
  const twpMonthsThisYear = yearlyTotals.twpMonthsUsed;
  const twpStatus = calculateTWPStatus(disabilityProfile ?? null, currentCountableIncome, twpThreshold);

  const handleSubmit = () => {
    if (!userId) return;

    const input: VineIncomeInput = {
      user_id: userId,
      year: selectedYear,
      month: formData.month,
      brand_items_etv: formData.brand_items_etv,
      non_brand_items_etv: formData.non_brand_items_etv,
      broken_items_etv: formData.broken_items_etv,
      irwe_deductions: monthlyIRWE,
      notes: formData.notes || undefined,
    };

    upsertMutation.mutate(input, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setEditingRecord(null);
        resetForm();
      },
    });
  };

  const handleEdit = (record: MonthlyVineIncome) => {
    setEditingRecord(record);
    setFormData({
      month: record.month,
      brand_items_etv: record.brand_items_etv,
      non_brand_items_etv: record.non_brand_items_etv,
      broken_items_etv: record.broken_items_etv,
      notes: record.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (record: MonthlyVineIncome) => {
    if (!userId) return;
    deleteMutation.mutate({ id: record.id, user_id: userId });
  };

  const resetForm = () => {
    setFormData({
      month: new Date().getMonth() + 1,
      brand_items_etv: 0,
      non_brand_items_etv: 0,
      broken_items_etv: 0,
      notes: "",
    });
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const getSGAStatus = (countableIncome: number) => {
    if (countableIncome >= sgaLimit) return { status: "danger", label: "Over SGA", color: "bg-destructive" };
    if (countableIncome >= sgaLimit * 0.9) return { status: "warning", label: "Near SGA", color: "bg-warning" };
    return { status: "safe", label: "Under SGA", color: "bg-green-500" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vine Income Tracker</h2>
          <p className="text-muted-foreground">Track monthly ETV with real-time SGA & TWP status</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025, 2026].map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingRecord(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Month
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingRecord ? "Edit" : "Add"} Monthly Income</DialogTitle>
                <DialogDescription>
                  Enter ETV values by category for 50/20/0 calculation
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Month</Label>
                  <Select 
                    value={formData.month.toString()} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, month: parseInt(v) }))}
                    disabled={!!editingRecord}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month, idx) => (
                        <SelectItem key={idx} value={(idx + 1).toString()}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Brand Items ETV (50% reduction)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.brand_items_etv || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand_items_etv: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Non-Brand Items ETV (80% reduction)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.non_brand_items_etv || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, non_brand_items_etv: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Broken/Useless Items ETV (100% reduction)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.broken_items_etv || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, broken_items_etv: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any notes about this month..."
                    rows={2}
                  />
                </div>
                {/* Preview calculation */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Gross ETV:</span>
                      <span className="font-medium">
                        {formatCurrency(formData.brand_items_etv + formData.non_brand_items_etv + formData.broken_items_etv)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>50/20/0 Reduction:</span>
                      <span>-{formatCurrency(
                        formData.brand_items_etv * 0.5 + 
                        formData.non_brand_items_etv * 0.8 + 
                        formData.broken_items_etv
                      )}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>IRWE Deductions:</span>
                      <span>-{formatCurrency(monthlyIRWE)}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-bold">
                      <span>Countable Income:</span>
                      <span>{formatCurrency(Math.max(0, 
                        (formData.brand_items_etv + formData.non_brand_items_etv + formData.broken_items_etv) -
                        (formData.brand_items_etv * 0.5 + formData.non_brand_items_etv * 0.8 + formData.broken_items_etv) -
                        monthlyIRWE
                      ))}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* SGA Status Card */}
        <Card className={cn(
          "border-2",
          getSGAStatus(currentCountableIncome).status === "danger" && "border-destructive",
          getSGAStatus(currentCountableIncome).status === "warning" && "border-warning",
          getSGAStatus(currentCountableIncome).status === "safe" && "border-green-500"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Current Month SGA Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(currentCountableIncome)}</div>
                <p className="text-xs text-muted-foreground">of {formatCurrency(sgaLimit)} limit</p>
              </div>
              <Badge className={getSGAStatus(currentCountableIncome).color}>
                {getSGAStatus(currentCountableIncome).label}
              </Badge>
            </div>
            <Progress 
              value={Math.min(100, (currentCountableIncome / sgaLimit) * 100)} 
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>

        {/* TWP Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Trial Work Period (TWP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{9 - twpMonthsUsedTotal} / 9</div>
                <p className="text-xs text-muted-foreground">months remaining</p>
              </div>
              {twpStatus.willTriggerTWP ? (
                <Badge variant="outline" className="border-warning text-warning">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Will Use TWP
                </Badge>
              ) : (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Safe
                </Badge>
              )}
            </div>
            <Progress value={((9 - twpMonthsUsedTotal) / 9) * 100} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">TWP threshold: {formatCurrency(twpThreshold)}/month</p>
          </CardContent>
        </Card>

        {/* Monthly IRWE Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Monthly IRWE Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-{formatCurrency(monthlyIRWE)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {irweExpenses.length} active expense{irweExpenses.length !== 1 ? "s" : ""}
            </p>
            <div className="text-xs text-muted-foreground mt-2">
              Max income with IRWE: <span className="font-medium text-foreground">{formatCurrency(sgaLimit + monthlyIRWE)}</span>
            </div>
          </CardContent>
        </Card>

        {/* YTD Summary Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {selectedYear} Year-to-Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross ETV:</span>
                <span className="font-medium">{formatCurrency(yearlyTotals.grossETV)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>50/20/0 Reduction:</span>
                <span>-{formatCurrency(yearlyTotals.valueAdjustment)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>IRWE Deductions:</span>
                <span>-{formatCurrency(yearlyTotals.irweDeductions)}</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-bold">
                <span>Countable:</span>
                <span>{formatCurrency(yearlyTotals.countableIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income Records</CardTitle>
          <CardDescription>Track your Vine ETV and SGA status by month</CardDescription>
        </CardHeader>
        <CardContent>
          {incomeRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No income records for {selectedYear}</p>
              <p className="text-sm">Click "Add Month" to start tracking</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Gross ETV</TableHead>
                  <TableHead className="text-right">50/20/0 Adj.</TableHead>
                  <TableHead className="text-right">IRWE</TableHead>
                  <TableHead className="text-right">Countable</TableHead>
                  <TableHead>SGA Status</TableHead>
                  <TableHead>TWP</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeRecords.map((record) => {
                  const status = getSGAStatus(record.countable_income);
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{MONTHS[record.month - 1]}</TableCell>
                      <TableCell className="text-right">{formatCurrency(record.gross_etv)}</TableCell>
                      <TableCell className="text-right text-green-600">
                        -{formatCurrency(record.value_adjustment)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        -{formatCurrency(record.irwe_deductions)}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(record.countable_income)}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", status.color)}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.is_twp_month ? (
                          <Badge variant="outline" className="text-xs">TWP Month</Badge>
                        ) : record.countable_income >= twpThreshold ? (
                          <Badge variant="outline" className="text-xs text-warning border-warning">Will Use</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(record)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* SSDI Safe Zone Info */}
      {disabilityProfile?.receives_ssdi && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">SSDI Safe Zone Strategy</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  With your current IRWE deductions of {formatCurrency(monthlyIRWE)}/month, you can safely receive up to{" "}
                  <span className="font-bold text-foreground">{formatCurrency(sgaLimit + monthlyIRWE)}</span> in monthly ETV 
                  while staying under the SGA limit.
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">SGA Limit:</span>{" "}
                    <span className="font-medium">{formatCurrency(sgaLimit)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">+ IRWE Buffer:</span>{" "}
                    <span className="font-medium text-green-600">+{formatCurrency(monthlyIRWE)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">= Safe Max:</span>{" "}
                    <span className="font-bold">{formatCurrency(sgaLimit + monthlyIRWE)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
