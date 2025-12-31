import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TaxLawChange {
  id: string;
  law_name: string;
  law_abbreviation: string | null;
  effective_date: string;
  expiration_date: string | null;
  is_permanent: boolean;
  provision_category: string;
  provision_name: string;
  pre_law_value: string | null;
  pre_law_description: string | null;
  current_value: string | null;
  current_description: string | null;
  post_expiration_value: string | null;
  post_expiration_description: string | null;
  change_percentage: number | null;
  change_direction: string | null;
  status: string;
  extension_history: Record<string, unknown>[];
  affected_taxpayers: string[] | null;
  proof_documentation: string[] | null;
  irs_reference: string | null;
  notes: string | null;
  display_order: number;
}

export function useTaxLawChanges(lawAbbreviation?: string, category?: string) {
  return useQuery({
    queryKey: ["tax-law-changes", lawAbbreviation, category],
    queryFn: async () => {
      let query = supabase
        .from("tax_law_changes")
        .select("*")
        .order("display_order");

      if (lawAbbreviation) {
        query = query.eq("law_abbreviation", lawAbbreviation);
      }

      if (category) {
        query = query.eq("provision_category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TaxLawChange[];
    },
  });
}

export function useTaxLawChangesByCategory(lawAbbreviation?: string) {
  const { data: changes, ...rest } = useTaxLawChanges(lawAbbreviation);

  const groupedChanges = changes?.reduce((acc, change) => {
    if (!acc[change.provision_category]) {
      acc[change.provision_category] = [];
    }
    acc[change.provision_category].push(change);
    return acc;
  }, {} as Record<string, TaxLawChange[]>);

  // Separate permanent vs expiring
  const permanentChanges = changes?.filter(c => c.is_permanent) || [];
  const expiringChanges = changes?.filter(c => !c.is_permanent) || [];

  return { groupedChanges, changes, permanentChanges, expiringChanges, ...rest };
}

// Category display names
export const LAW_CHANGE_CATEGORY_LABELS: Record<string, string> = {
  deductions: "Deductions",
  rates: "Tax Rates",
  credits: "Tax Credits",
  amt: "Alternative Minimum Tax",
  estate: "Estate & Gift Tax",
  business: "Business Taxes",
  depreciation: "Depreciation",
  healthcare: "Healthcare",
  indexing: "Inflation Indexing",
};

// Helper to determine if a provision is expiring soon
export function isExpiringSoon(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  return expDate <= oneYearFromNow && expDate > now;
}

// Helper to check if provision has expired
export function hasExpired(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  return new Date(expirationDate) < new Date();
}
