import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TaxDeductionRule {
  id: string;
  category: string;
  deduction_name: string;
  max_amount: number | null;
  max_amount_description: string | null;
  can_be_increased: boolean;
  increase_conditions: string[] | null;
  increase_amounts: Record<string, unknown> | null;
  proof_required: string[] | null;
  applicable_forms: string[] | null;
  business_types: string[] | null;
  tax_year: number;
  notes: string | null;
  irs_reference: string | null;
  is_active: boolean;
  display_order: number;
}

export function useTaxDeductionRules(taxYear: number = 2024, category?: string) {
  return useQuery({
    queryKey: ["tax-deduction-rules", taxYear, category],
    queryFn: async () => {
      let query = supabase
        .from("tax_deduction_rules")
        .select("*")
        .eq("tax_year", taxYear)
        .eq("is_active", true)
        .order("display_order");

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TaxDeductionRule[];
    },
  });
}

export function useTaxDeductionRulesByCategory(taxYear: number = 2024) {
  const { data: rules, ...rest } = useTaxDeductionRules(taxYear);

  const groupedRules = rules?.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, TaxDeductionRule[]>);

  return { groupedRules, rules, ...rest };
}

// Category display names
export const CATEGORY_LABELS: Record<string, string> = {
  depreciation: "Depreciation & Section 179",
  vehicle: "Vehicle & Mileage",
  home_office: "Home Office",
  meals: "Meals & Entertainment",
  health: "Health Insurance",
  retirement: "Retirement Contributions",
  qbi: "Qualified Business Income",
  disability: "Disability (IRWE)",
  charitable: "Charitable Contributions",
  vine: "Product Reviews & Content Creation",
  team_building: "Team Building (100%)",
  donations: "Donations & Charity",
  rental_business: "Rental Business",
  expert_tips: "Expert CPA Tips",
  back_taxes: "Back Taxes & Amendments",
};

// Category icons for UI
export const CATEGORY_ICONS: Record<string, string> = {
  depreciation: "Calculator",
  vehicle: "Car",
  home_office: "Home",
  meals: "Utensils",
  health: "Heart",
  retirement: "PiggyBank",
  qbi: "TrendingUp",
  disability: "Accessibility",
  charitable: "Gift",
  vine: "Camera",
  team_building: "Users",
  donations: "Heart",
  rental_business: "Building",
  expert_tips: "Lightbulb",
  back_taxes: "FileText",
};

// Subcategory labels for better organization
export const SUBCATEGORY_LABELS: Record<string, Record<string, string>> = {
  vine: {
    blogger: "Blogger/Author",
    musician: "Musician/Performer",
    tech: "Tech Reviewer",
    beauty: "Beauty/Makeup",
    kitchen: "Kitchen/Food",
    general: "General Reviews",
  },
  vehicle: {
    heavy: "Heavy Vehicles (6,000+ lbs)",
    luxury: "Standard Vehicles",
    mileage: "Mileage Tracking",
  },
};
