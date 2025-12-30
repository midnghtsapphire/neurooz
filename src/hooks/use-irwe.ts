import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface IRWECategory {
  id: string;
  name: string;
  description: string | null;
  examples: string[] | null;
  display_order: number;
  is_active: boolean;
}

export interface IRWEExpense {
  id: string;
  user_id: string;
  category_id: string | null;
  expense_name: string;
  monthly_amount: number;
  is_recurring: boolean;
  start_date: string | null;
  end_date: string | null;
  doctor_verified: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  category?: IRWECategory;
}

export interface DisabilityTaxRule {
  id: string;
  rule_key: string;
  rule_value: number;
  category: string;
  description: string | null;
  tax_year: number;
}

// Fetch IRWE categories
export function useIRWECategories() {
  return useQuery({
    queryKey: ["irwe-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("irwe_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as IRWECategory[];
    },
  });
}

// Fetch user's IRWE expenses
export function useIRWEExpenses(userId?: string) {
  return useQuery({
    queryKey: ["irwe-expenses", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("user_irwe_expenses")
        .select(`
          *,
          category:irwe_categories(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as IRWEExpense[];
    },
    enabled: !!userId,
  });
}

// Fetch disability tax rules
export function useDisabilityTaxRules(taxYear: number = 2025, category?: string) {
  return useQuery({
    queryKey: ["disability-tax-rules", taxYear, category],
    queryFn: async () => {
      let query = supabase
        .from("disability_tax_rules")
        .select("*")
        .eq("tax_year", taxYear);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Convert to a lookup object for easy access
      const rulesMap: Record<string, number> = {};
      (data as DisabilityTaxRule[]).forEach((rule) => {
        rulesMap[rule.rule_key] = rule.rule_value;
      });
      
      return { rules: data as DisabilityTaxRule[], rulesMap };
    },
  });
}

// Create IRWE expense
export function useCreateIRWEExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (expense: Omit<IRWEExpense, "id" | "created_at" | "updated_at" | "category">) => {
      const { data, error } = await supabase
        .from("user_irwe_expenses")
        .insert(expense)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["irwe-expenses"] });
      toast({
        title: "IRWE expense added",
        description: "Your impairment-related work expense has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Update IRWE expense
export function useUpdateIRWEExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...expense }: Partial<IRWEExpense> & { id: string }) => {
      const { data, error } = await supabase
        .from("user_irwe_expenses")
        .update(expense)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["irwe-expenses"] });
      toast({
        title: "Expense updated",
        description: "Your IRWE expense has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Delete IRWE expense
export function useDeleteIRWEExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_irwe_expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["irwe-expenses"] });
      toast({
        title: "Expense deleted",
        description: "IRWE expense has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Calculate total monthly IRWE deductions
export function calculateTotalIRWE(expenses: IRWEExpense[]): number {
  return expenses
    .filter((exp) => exp.is_recurring || isExpenseActive(exp))
    .reduce((total, exp) => total + exp.monthly_amount, 0);
}

// Check if a non-recurring expense is currently active
function isExpenseActive(expense: IRWEExpense): boolean {
  const now = new Date();
  const start = expense.start_date ? new Date(expense.start_date) : null;
  const end = expense.end_date ? new Date(expense.end_date) : null;

  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

// Calculate countable income after IRWE deductions for SGA
export function calculateCountableIncome(
  grossIncome: number,
  irweTotal: number,
  sgaLimit: number = 1620
): {
  countableIncome: number;
  isUnderSGA: boolean;
  remainingBuffer: number;
  maxAllowedIncome: number;
} {
  const countableIncome = Math.max(0, grossIncome - irweTotal);
  const isUnderSGA = countableIncome < sgaLimit;
  const remainingBuffer = sgaLimit - countableIncome;
  const maxAllowedIncome = sgaLimit + irweTotal;

  return {
    countableIncome,
    isUnderSGA,
    remainingBuffer,
    maxAllowedIncome,
  };
}
