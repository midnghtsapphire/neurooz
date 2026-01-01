import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StateTaxForm {
  id: string;
  state_code: string;
  state_name: string;
  form_type: string;
  form_number: string;
  form_name: string;
  filing_deadline: string | null;
  extension_deadline: string | null;
  has_local_tax: boolean;
  notes: string | null;
  is_active: boolean;
}

// All US states for dropdown
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const;

// States with no income tax
export const NO_INCOME_TAX_STATES = ['AK', 'FL', 'NV', 'SD', 'TN', 'TX', 'WA', 'WY'];

// States with local/city income taxes
export const LOCAL_TAX_STATES = ['CO', 'DE', 'IN', 'KY', 'MD', 'MI', 'MO', 'NY', 'OH', 'OR', 'PA', 'WV'];

// Fetch all state tax forms
export function useStateTaxForms(stateCode?: string) {
  return useQuery({
    queryKey: ["state_tax_forms", stateCode],
    queryFn: async () => {
      let query = supabase
        .from("state_tax_forms")
        .select("*")
        .eq("is_active", true)
        .order("state_name", { ascending: true });

      if (stateCode) {
        query = query.eq("state_code", stateCode);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as StateTaxForm[];
    },
  });
}

// Get state info with tax requirements
export function useStateInfo(stateCode: string) {
  const { data: forms, isLoading } = useStateTaxForms(stateCode);
  
  const stateInfo = US_STATES.find(s => s.code === stateCode);
  const hasIncomeTax = !NO_INCOME_TAX_STATES.includes(stateCode);
  const hasLocalTax = LOCAL_TAX_STATES.includes(stateCode);
  
  return {
    stateCode,
    stateName: stateInfo?.name || stateCode,
    hasIncomeTax,
    hasLocalTax,
    forms: forms || [],
    isLoading,
    primaryForm: forms?.find(f => f.form_type === 'individual'),
  };
}

// Get states that require filing
export function useStatesRequiringFiling() {
  return US_STATES.filter(state => !NO_INCOME_TAX_STATES.includes(state.code));
}

// Check if state has income tax
export function stateHasIncomeTax(stateCode: string): boolean {
  return !NO_INCOME_TAX_STATES.includes(stateCode);
}

// Check if state has local tax
export function stateHasLocalTax(stateCode: string): boolean {
  return LOCAL_TAX_STATES.includes(stateCode);
}
