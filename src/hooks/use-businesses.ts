import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type BusinessStructure = 
  | 'sole_proprietor'
  | 'single_member_llc'
  | 'multi_member_llc'
  | 'llc_s_corp'
  | 'partnership'
  | 'c_corp';

export type BusinessRole = 'owner' | 'partner' | 'employee' | 'contractor';

export interface Business {
  id: string;
  user_id: string;
  name: string;
  structure: BusinessStructure;
  ein: string | null;
  state: string | null;
  formation_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  role: BusinessRole;
  ownership_percentage: number;
  is_passive: boolean;
  ssn_last_four: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaxForm {
  id: string;
  business_id: string | null;
  member_id: string | null;
  user_id: string;
  form_type: string;
  tax_year: number;
  status: string;
  form_data: Record<string, unknown>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all businesses for current user
export function useBusinesses() {
  return useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Business[];
    },
  });
}

// Fetch members for a business
export function useBusinessMembers(businessId?: string) {
  return useQuery({
    queryKey: ["business_members", businessId],
    queryFn: async () => {
      let query = supabase.from("business_members").select("*");
      
      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      const { data, error } = await query.order("created_at", { ascending: true });

      if (error) throw error;
      return data as BusinessMember[];
    },
    enabled: !!businessId,
  });
}

// Fetch tax forms
export function useTaxForms(businessId?: string, memberId?: string) {
  return useQuery({
    queryKey: ["tax_forms", businessId, memberId],
    queryFn: async () => {
      let query = supabase.from("tax_forms").select("*");
      
      if (businessId) {
        query = query.eq("business_id", businessId);
      }
      if (memberId) {
        query = query.eq("member_id", memberId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaxForm[];
    },
  });
}

// Create business
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (business: Omit<Business, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("businesses")
        .insert(business)
        .select()
        .single();

      if (error) throw error;
      return data as Business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast({
        title: "Business created",
        description: "Your business has been set up successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Create business member
export function useCreateBusinessMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (member: Omit<BusinessMember, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("business_members")
        .insert(member)
        .select()
        .single();

      if (error) throw error;
      return data as BusinessMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business_members"] });
      toast({
        title: "Member added",
        description: "Business member has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Create tax form
export function useCreateTaxForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (form: { 
      business_id?: string | null; 
      member_id?: string | null; 
      user_id: string; 
      form_type: string; 
      tax_year: number; 
      status?: string; 
      form_data?: Record<string, unknown>; 
      completed_at?: string | null; 
    }) => {
      const { data, error } = await supabase
        .from("tax_forms")
        .insert({
          ...form,
          form_data: form.form_data as unknown as Record<string, never>,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TaxForm;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax_forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update tax form
export function useUpdateTaxForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; form_data?: Record<string, unknown>; completed_at?: string | null }) => {
      const { data, error } = await supabase
        .from("tax_forms")
        .update({
          ...updates,
          form_data: updates.form_data as unknown as Record<string, never>,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as TaxForm;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax_forms"] });
      toast({
        title: "Form updated",
        description: "Tax form has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
