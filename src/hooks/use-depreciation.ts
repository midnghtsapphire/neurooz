import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateMACRSDepreciation, 
  calculateSection179FullExpense, 
  calculateBonusDepreciation,
  getMACRSTable,
  TAX_YEAR_RULES,
  MACRS_5_YEAR,
  MACRS_7_YEAR,
  type YearlyDepreciationResult,
  type DepreciationOptions,
} from "@/lib/depreciation-tables";

export interface DepreciationMethod {
  id: string;
  name: string;
  method_type: string;
  description: string | null;
  useful_life_years: number | null;
  year_percentages: number[];
  first_year_bonus_eligible: boolean;
  business_types: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductDepreciation {
  id: string;
  user_id: string;
  inventory_id: string | null;
  product_name: string;
  original_cost: number;
  purchase_date: string;
  depreciation_method_id: string | null;
  current_year: number;
  accumulated_depreciation: number;
  current_book_value: number;
  section_179_taken: number;
  bonus_depreciation_taken: number;
  is_trailing_product: boolean;
  trailing_group_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface YearlyDepreciationEntry {
  id: string;
  tracking_id: string;
  tax_year: number;
  beginning_book_value: number;
  depreciation_amount: number;
  ending_book_value: number;
  depreciation_rate: number | null;
  section_179_amount: number;
  bonus_depreciation_amount: number;
  is_first_year: boolean;
  created_at: string;
}

export interface TrailingProductGroup {
  id: string;
  user_id: string;
  group_name: string;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Re-export for convenience
export { 
  calculateMACRSDepreciation, 
  calculateSection179FullExpense, 
  calculateBonusDepreciation,
  getMACRSTable,
  TAX_YEAR_RULES,
  MACRS_5_YEAR,
  MACRS_7_YEAR,
};
export type { YearlyDepreciationResult, DepreciationOptions };

// Fetch all depreciation methods
export function useDepreciationMethods() {
  return useQuery({
    queryKey: ["depreciation-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("depreciation_methods")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as DepreciationMethod[];
    },
  });
}

// Fetch user's product depreciation tracking
export function useProductDepreciation(userId?: string) {
  return useQuery({
    queryKey: ["product-depreciation", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("product_depreciation_tracking")
        .select("*")
        .eq("user_id", userId)
        .order("purchase_date", { ascending: false });

      if (error) throw error;
      return data as ProductDepreciation[];
    },
    enabled: !!userId,
  });
}

// Fetch yearly entries for a product
export function useYearlyEntries(trackingId?: string) {
  return useQuery({
    queryKey: ["yearly-entries", trackingId],
    queryFn: async () => {
      if (!trackingId) return [];
      const { data, error } = await supabase
        .from("yearly_depreciation_entries")
        .select("*")
        .eq("tracking_id", trackingId)
        .order("tax_year");

      if (error) throw error;
      return data as YearlyDepreciationEntry[];
    },
    enabled: !!trackingId,
  });
}

// Fetch trailing product groups
export function useTrailingGroups(userId?: string) {
  return useQuery({
    queryKey: ["trailing-groups", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("trailing_product_groups")
        .select("*")
        .eq("user_id", userId)
        .order("group_name");

      if (error) throw error;
      return data as TrailingProductGroup[];
    },
    enabled: !!userId,
  });
}

// Create product depreciation tracking
export function useCreateProductDepreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<ProductDepreciation, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("product_depreciation_tracking")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-depreciation", variables.user_id] });
    },
  });
}

// Update product depreciation
export function useUpdateProductDepreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ProductDepreciation> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_depreciation_tracking")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-depreciation"] });
    },
  });
}

// Delete product depreciation
export function useDeleteProductDepreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_depreciation_tracking")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-depreciation"] });
    },
  });
}

// Create yearly depreciation entry
export function useCreateYearlyEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<YearlyDepreciationEntry, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("yearly_depreciation_entries")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["yearly-entries", variables.tracking_id] });
      queryClient.invalidateQueries({ queryKey: ["product-depreciation"] });
    },
  });
}

// Create trailing group
export function useCreateTrailingGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { user_id: string; group_name: string; category?: string; description?: string }) => {
      const { data, error } = await supabase
        .from("trailing_product_groups")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trailing-groups", variables.user_id] });
    },
  });
}

// Delete trailing group
export function useDeleteTrailingGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("trailing_product_groups")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trailing-groups"] });
    },
  });
}

// Calculate depreciation for a given product
export function calculateDepreciationSchedule(
  originalCost: number,
  purchaseDate: Date,
  method: DepreciationMethod,
  section179Amount: number = 0,
  bonusDepreciationPercent: number = 0,
  currentYear: number = new Date().getFullYear()
): YearlyDepreciationEntry[] {
  const entries: YearlyDepreciationEntry[] = [];
  const purchaseYear = purchaseDate.getFullYear();
  
  // Start with original cost minus Section 179
  let remainingBasis = originalCost - section179Amount;
  
  // Apply bonus depreciation in first year if eligible
  const bonusAmount = method.first_year_bonus_eligible 
    ? remainingBasis * (bonusDepreciationPercent / 100) 
    : 0;
  remainingBasis -= bonusAmount;
  
  // Calculate yearly depreciation based on method
  const yearPercentages = method.year_percentages || [];
  const usefulLife = method.useful_life_years || yearPercentages.length || 5;
  
  let bookValue = originalCost;
  
  for (let year = 0; year < usefulLife; year++) {
    const taxYear = purchaseYear + year;
    if (taxYear > currentYear + 10) break; // Limit to 10 years ahead
    
    const isFirstYear = year === 0;
    const beginningValue = bookValue;
    
    let depreciationRate = 0;
    let depreciationAmount = 0;
    
    if (method.method_type === "section_179") {
      // Section 179: full deduction in first year
      if (isFirstYear) {
        depreciationAmount = originalCost;
        depreciationRate = 100;
      }
    } else if (yearPercentages.length > 0 && year < yearPercentages.length) {
      // MACRS or defined percentages
      depreciationRate = yearPercentages[year];
      depreciationAmount = (remainingBasis * depreciationRate) / 100;
    } else {
      // Straight-line fallback
      depreciationRate = 100 / usefulLife;
      depreciationAmount = remainingBasis / usefulLife;
    }
    
    // Add first year extras
    const section179ForYear = isFirstYear ? section179Amount : 0;
    const bonusForYear = isFirstYear ? bonusAmount : 0;
    const totalDeduction = depreciationAmount + section179ForYear + bonusForYear;
    
    bookValue = Math.max(0, beginningValue - totalDeduction);
    
    entries.push({
      id: `calc-${taxYear}`,
      tracking_id: "",
      tax_year: taxYear,
      beginning_book_value: beginningValue,
      depreciation_amount: depreciationAmount,
      ending_book_value: bookValue,
      depreciation_rate: depreciationRate,
      section_179_amount: section179ForYear,
      bonus_depreciation_amount: bonusForYear,
      is_first_year: isFirstYear,
      created_at: new Date().toISOString(),
    });
    
    if (bookValue <= 0) break;
  }
  
  return entries;
}

// Get summary stats for depreciation tracking
export function useDepreciationStats(products: ProductDepreciation[] = []) {
  const totalOriginalCost = products.reduce((sum, p) => sum + (p.original_cost || 0), 0);
  const totalAccumulatedDepreciation = products.reduce((sum, p) => sum + (p.accumulated_depreciation || 0), 0);
  const totalBookValue = products.reduce((sum, p) => sum + (p.current_book_value || 0), 0);
  const totalSection179 = products.reduce((sum, p) => sum + (p.section_179_taken || 0), 0);
  const totalBonusDepreciation = products.reduce((sum, p) => sum + (p.bonus_depreciation_taken || 0), 0);
  const trailingProducts = products.filter(p => p.is_trailing_product).length;
  
  return {
    totalOriginalCost,
    totalAccumulatedDepreciation,
    totalBookValue,
    totalSection179,
    totalBonusDepreciation,
    totalProducts: products.length,
    trailingProducts,
  };
}
