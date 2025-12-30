import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Plus, Trash2, DollarSign, Shield, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useIRWECategories,
  useIRWEExpenses,
  useCreateIRWEExpense,
  useDeleteIRWEExpense,
  useDisabilityTaxRules,
  calculateTotalIRWE,
  calculateCountableIncome,
  type IRWEExpense,
} from "@/hooks/use-irwe";
import { useDisabilityProfile, calculateTWPStatus } from "@/hooks/use-disability-profile";
import { formatCurrency } from "@/lib/tax-calculations";

interface IRWECalculatorProps {
  userId: string;
  monthlyGrossIncome?: number;
  onIRWEChange?: (totalIRWE: number, countableIncome: number) => void;
}

export function IRWECalculator({ userId, monthlyGrossIncome = 0, onIRWEChange }: IRWECalculatorProps) {
  const { data: categories, isLoading: categoriesLoading } = useIRWECategories();
  const { data: expenses, isLoading: expensesLoading } = useIRWEExpenses(userId);
  const { data: rulesData, isLoading: rulesLoading } = useDisabilityTaxRules(2025, "ssdi");
  const { data: profile } = useDisabilityProfile(userId);
  const createExpense = useCreateIRWEExpense();
  const deleteExpense = useDeleteIRWEExpense();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category_id: "",
    expense_name: "",
    monthly_amount: 0,
    is_recurring: true,
    doctor_verified: false,
    notes: "",
  });

  const isLoading = categoriesLoading || expensesLoading || rulesLoading;
  const sgaLimit = rulesData?.rulesMap?.sga_limit_monthly || 1620;
  const twpThreshold = rulesData?.rulesMap?.twp_threshold_monthly || 1160;

  const totalIRWE = expenses ? calculateTotalIRWE(expenses) : 0;
  const incomeCalc = calculateCountableIncome(monthlyGrossIncome, totalIRWE, sgaLimit);
  const twpStatus = calculateTWPStatus(profile, incomeCalc.countableIncome, twpThreshold);

  useEffect(() => {
    if (onIRWEChange) {
      onIRWEChange(totalIRWE, incomeCalc.countableIncome);
    }
  }, [totalIRWE, incomeCalc.countableIncome, onIRWEChange]);

  const handleAddExpense = async () => {
    if (!newExpense.expense_name || newExpense.monthly_amount <= 0) return;

    await createExpense.mutateAsync({
      user_id: userId,
      category_id: newExpense.category_id || null,
      expense_name: newExpense.expense_name,
      monthly_amount: newExpense.monthly_amount,
      is_recurring: newExpense.is_recurring,
      doctor_verified: newExpense.doctor_verified,
      notes: newExpense.notes || null,
      start_date: null,
      end_date: null,
    });

    setNewExpense({
      category_id: "",
      expense_name: "",
      monthly_amount: 0,
      is_recurring: true,
      doctor_verified: false,
      notes: "",
    });
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SGA Status Alert */}
      <Alert variant={incomeCalc.isUnderSGA ? "default" : "destructive"}>
        {incomeCalc.isUnderSGA ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {incomeCalc.isUnderSGA ? "Under SGA Limit" : "⚠️ Over SGA Limit"}
        </AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Gross Monthly Income:</span>
              <span className="font-medium">{formatCurrency(monthlyGrossIncome)}</span>
            </div>
            <div className="flex justify-between text-sm text-primary">
              <span>IRWE Deductions:</span>
              <span className="font-medium">-{formatCurrency(totalIRWE)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Countable Income:</span>
              <span className={incomeCalc.isUnderSGA ? "text-primary" : "text-destructive"}>
                {formatCurrency(incomeCalc.countableIncome)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>2025 SGA Limit:</span>
              <span>{formatCurrency(sgaLimit)}</span>
            </div>
            {incomeCalc.isUnderSGA && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Buffer Remaining:</span>
                <span className="text-primary">{formatCurrency(incomeCalc.remainingBuffer)}</span>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* TWP Status */}
      {profile?.receives_ssdi && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Trial Work Period Status</AlertTitle>
          <AlertDescription>
            <p className="mt-1">{twpStatus.message}</p>
            {twpStatus.monthsRemaining < 9 && (
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-4 rounded ${
                      i < (9 - twpStatus.monthsRemaining)
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* IRWE Expenses Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                IRWE Expenses
              </CardTitle>
              <CardDescription>
                Impairment-Related Work Expenses deducted from gross income for SGA calculation
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Expense Form */}
          {showAddForm && (
            <Card className="border-dashed">
              <CardContent className="pt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newExpense.category_id}
                      onValueChange={(val) => setNewExpense({ ...newExpense, category_id: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expense Name *</Label>
                    <Input
                      value={newExpense.expense_name}
                      onChange={(e) => setNewExpense({ ...newExpense, expense_name: e.target.value })}
                      placeholder="e.g., Monthly medication copay"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Monthly Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-9"
                        value={newExpense.monthly_amount || ""}
                        onChange={(e) => setNewExpense({ ...newExpense, monthly_amount: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newExpense.is_recurring}
                      onCheckedChange={(checked) => setNewExpense({ ...newExpense, is_recurring: checked })}
                    />
                    <Label>Recurring monthly</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newExpense.doctor_verified}
                      onCheckedChange={(checked) => setNewExpense({ ...newExpense, doctor_verified: checked })}
                    />
                    <Label className="flex items-center gap-1">
                      Doctor verified
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Having a doctor's note confirming the expense is necessary for your work
                            strengthens your IRWE claim with SSA.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddExpense}
                    disabled={!newExpense.expense_name || newExpense.monthly_amount <= 0 || createExpense.isPending}
                  >
                    {createExpense.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : null}
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expenses Table */}
          {expenses && expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Monthly Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{expense.expense_name}</div>
                        {expense.notes && (
                          <div className="text-sm text-muted-foreground">{expense.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expense.category?.name || (
                        <span className="text-muted-foreground">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(expense.monthly_amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {expense.is_recurring && (
                          <Badge variant="secondary" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                        {expense.doctor_verified && (
                          <Badge variant="default" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExpense.mutate(expense.id)}
                        disabled={deleteExpense.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-medium">
                    Total Monthly IRWE
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatCurrency(totalIRWE)}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No IRWE expenses added yet</p>
              <p className="text-sm">Add disability-related work expenses to reduce your countable income</p>
            </div>
          )}

          {/* Category Examples */}
          {categories && categories.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Common IRWE Categories</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {categories.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="font-medium text-sm">{cat.name}</div>
                    {cat.examples && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Examples: {cat.examples.slice(0, 3).join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maximum Income Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Income Planning</CardTitle>
          <CardDescription>
            How much can you earn while staying under SGA?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span>Maximum Allowable Gross Income:</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(incomeCalc.maxAllowedIncome)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              With your current IRWE deductions of {formatCurrency(totalIRWE)}/month, you can earn
              up to {formatCurrency(incomeCalc.maxAllowedIncome)}/month in gross Vine income and
              remain under the SGA limit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
