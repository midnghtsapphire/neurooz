import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface IRSFieldDefinition {
  id: string;
  form_type: string;
  field_name: string;
  field_label: string;
  field_type: string;
  max_length: number | null;
  is_required: boolean;
  irs_box_number: string | null;
  validation_regex: string | null;
  allowed_values: string[] | null;
  description: string | null;
  display_order: number;
  is_payer_field: boolean;
  is_recipient_field: boolean;
  is_state_field: boolean;
}

export type FormType = 
  | '1099-NEC' 
  | '1099-MISC' 
  | '1099-K' 
  | '1099-INT' 
  | '1099-DIV'
  | '1098-E'
  | '1040'
  | '1040-X'
  | 'Schedule C'
  | 'W-2'
  | 'W-4'
  | 'W-9';

// Form categories for organization
export const FORM_CATEGORIES = {
  individual: ['1040', '1040-X', 'Schedule C'],
  employment: ['W-2', 'W-4', 'W-9'],
  information: ['1099-NEC', '1099-MISC', '1099-K', '1099-INT', '1099-DIV'],
  education: ['1098-E'],
} as const;

// Fetch all field definitions for a specific form type
export function useIRSFieldDefinitions(formType?: FormType) {
  return useQuery({
    queryKey: ["irs_field_definitions", formType],
    queryFn: async () => {
      let query = supabase
        .from("irs_form_field_definitions")
        .select("*")
        .order("display_order", { ascending: true });

      if (formType) {
        query = query.eq("form_type", formType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as IRSFieldDefinition[];
    },
  });
}

// Fetch payer fields for a form type
export function useIRSPayerFields(formType: FormType) {
  return useQuery({
    queryKey: ["irs_payer_fields", formType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("irs_form_field_definitions")
        .select("*")
        .eq("form_type", formType)
        .eq("is_payer_field", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as IRSFieldDefinition[];
    },
  });
}

// Fetch recipient fields for a form type
export function useIRSRecipientFields(formType: FormType) {
  return useQuery({
    queryKey: ["irs_recipient_fields", formType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("irs_form_field_definitions")
        .select("*")
        .eq("form_type", formType)
        .eq("is_recipient_field", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as IRSFieldDefinition[];
    },
  });
}

// Fetch amount/box fields (not payer or recipient)
export function useIRSAmountFields(formType: FormType) {
  return useQuery({
    queryKey: ["irs_amount_fields", formType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("irs_form_field_definitions")
        .select("*")
        .eq("form_type", formType)
        .eq("is_payer_field", false)
        .eq("is_recipient_field", false)
        .not("irs_box_number", "is", null)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as IRSFieldDefinition[];
    },
  });
}

// Validate a value against field definition
export function validateIRSField(
  field: IRSFieldDefinition,
  value: unknown
): { valid: boolean; error?: string } {
  // Check required
  if (field.is_required && (value === null || value === undefined || value === "")) {
    return { valid: false, error: `${field.field_label} is required` };
  }

  // Skip further validation if empty and not required
  if (value === null || value === undefined || value === "") {
    return { valid: true };
  }

  // Check max length for strings
  if (field.max_length && typeof value === "string" && value.length > field.max_length) {
    return { valid: false, error: `${field.field_label} must be ${field.max_length} characters or less` };
  }

  // Check regex if provided
  if (field.validation_regex && typeof value === "string") {
    const regex = new RegExp(field.validation_regex);
    if (!regex.test(value)) {
      return { valid: false, error: `${field.field_label} format is invalid` };
    }
  }

  // Check allowed values for enum types
  if (field.allowed_values && field.allowed_values.length > 0) {
    if (!field.allowed_values.includes(String(value))) {
      return { valid: false, error: `${field.field_label} must be one of: ${field.allowed_values.join(", ")}` };
    }
  }

  return { valid: true };
}

// Get all available form types
export function useAvailableFormTypes() {
  return useQuery({
    queryKey: ["irs_form_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("irs_form_field_definitions")
        .select("form_type")
        .order("form_type");

      if (error) throw error;
      
      // Get unique form types
      const uniqueTypes = [...new Set(data.map(d => d.form_type))];
      return uniqueTypes as FormType[];
    },
  });
}
