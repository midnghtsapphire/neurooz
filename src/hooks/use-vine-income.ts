import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MonthlyVineIncome {
  id: string;
  user_id: string;
  year: number;
  month: number;
  gross_etv: number;
  brand_items_etv: number;
  non_brand_items_etv: number;
  broken_items_etv: number;
  value_adjustment: number;
  irwe_deductions: number;
  countable_income: number;
  is_twp_month: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VineIncomeInput {
  user_id: string;
  year: number;
  month: number;
  gross_etv?: number;
  brand_items_etv?: number;
  non_brand_items_etv?: number;
  broken_items_etv?: number;
  irwe_deductions?: number;
  notes?: string;
}

// Calculate value adjustment based on 50/20/0 method
export function calculate50200Adjustment(
  brandETV: number,
  nonBrandETV: number,
  brokenETV: number
): number {
  // Brand items: 50% reduction
  const brandReduction = brandETV * 0.5;
  // Non-brand items: 80% reduction  
  const nonBrandReduction = nonBrandETV * 0.8;
  // Broken items: 100% reduction
  const brokenReduction = brokenETV;
  
  return brandReduction + nonBrandReduction + brokenReduction;
}

// Calculate countable income for SGA purposes
export function calculateCountableIncome(
  grossETV: number,
  valueAdjustment: number,
  irweDeductions: number
): number {
  return Math.max(0, grossETV - valueAdjustment - irweDeductions);
}

// Fetch monthly income records for a year
export function useVineIncomeByYear(userId?: string, year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ["vine-income", userId, year],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("monthly_vine_income")
        .select("*")
        .eq("user_id", userId)
        .eq("year", year)
        .order("month", { ascending: true });

      if (error) throw error;
      return data as MonthlyVineIncome[];
    },
    enabled: !!userId,
  });
}

// Fetch a specific month's income
export function useVineIncomeByMonth(userId?: string, year?: number, month?: number) {
  return useQuery({
    queryKey: ["vine-income", userId, year, month],
    queryFn: async () => {
      if (!userId || !year || !month) return null;
      
      const { data, error } = await supabase
        .from("monthly_vine_income")
        .select("*")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", month)
        .maybeSingle();

      if (error) throw error;
      return data as MonthlyVineIncome | null;
    },
    enabled: !!userId && !!year && !!month,
  });
}

// Fetch all income for SGA/TWP analysis
export function useVineIncomeAll(userId?: string) {
  return useQuery({
    queryKey: ["vine-income-all", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("monthly_vine_income")
        .select("*")
        .eq("user_id", userId)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (error) throw error;
      return data as MonthlyVineIncome[];
    },
    enabled: !!userId,
  });
}

// Create or update monthly income
export function useUpsertVineIncome() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: VineIncomeInput) => {
      const { user_id, year, month, brand_items_etv = 0, non_brand_items_etv = 0, broken_items_etv = 0, irwe_deductions = 0, ...rest } = input;
      
      // Calculate gross ETV if not provided
      const gross_etv = rest.gross_etv ?? (brand_items_etv + non_brand_items_etv + broken_items_etv);
      
      // Calculate 50/20/0 value adjustment
      const value_adjustment = calculate50200Adjustment(brand_items_etv, non_brand_items_etv, broken_items_etv);
      
      // Calculate countable income for SGA
      const countable_income = calculateCountableIncome(gross_etv, value_adjustment, irwe_deductions);
      
      // Check if record exists
      const { data: existing } = await supabase
        .from("monthly_vine_income")
        .select("id")
        .eq("user_id", user_id)
        .eq("year", year)
        .eq("month", month)
        .maybeSingle();

      const record = {
        user_id,
        year,
        month,
        gross_etv,
        brand_items_etv,
        non_brand_items_etv,
        broken_items_etv,
        value_adjustment,
        irwe_deductions,
        countable_income,
        notes: rest.notes || null,
      };

      if (existing) {
        const { data, error } = await supabase
          .from("monthly_vine_income")
          .update(record)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("monthly_vine_income")
          .insert(record)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vine-income", variables.user_id, variables.year] });
      queryClient.invalidateQueries({ queryKey: ["vine-income-all", variables.user_id] });
      toast({
        title: "Income saved",
        description: `${getMonthName(variables.month)} ${variables.year} income has been recorded.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save income: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Mark month as TWP month
export function useUpdateTWPStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_twp_month, user_id }: { id: string; is_twp_month: boolean; user_id: string }) => {
      const { data, error } = await supabase
        .from("monthly_vine_income")
        .update({ is_twp_month })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vine-income"] });
      queryClient.invalidateQueries({ queryKey: ["vine-income-all"] });
      toast({
        title: data.is_twp_month ? "TWP month marked" : "TWP status cleared",
        description: `${getMonthName(data.month)} ${data.year} updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update TWP status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Delete monthly income record
export function useDeleteVineIncome() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      const { error } = await supabase
        .from("monthly_vine_income")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vine-income"] });
      queryClient.invalidateQueries({ queryKey: ["vine-income-all"] });
      toast({
        title: "Record deleted",
        description: "Monthly income record has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete record: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Calculate yearly totals
export function calculateYearlyTotals(records: MonthlyVineIncome[]) {
  return records.reduce(
    (acc, record) => ({
      grossETV: acc.grossETV + record.gross_etv,
      valueAdjustment: acc.valueAdjustment + record.value_adjustment,
      irweDeductions: acc.irweDeductions + record.irwe_deductions,
      countableIncome: acc.countableIncome + record.countable_income,
      twpMonthsUsed: acc.twpMonthsUsed + (record.is_twp_month ? 1 : 0),
    }),
    { grossETV: 0, valueAdjustment: 0, irweDeductions: 0, countableIncome: 0, twpMonthsUsed: 0 }
  );
}

// Count TWP months from all records
export function countTWPMonths(records: MonthlyVineIncome[]): number {
  return records.filter(r => r.is_twp_month).length;
}

// Helper function
function getMonthName(month: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1] || "";
}
