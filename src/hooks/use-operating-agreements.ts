import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface OperatingAgreementTemplate {
  id: string;
  template_type: 'manager_managed_llc' | 'member_managed_llc' | 'passive_member_provisions' | 'ssdi_protection_addendum';
  template_name: string;
  description: string | null;
  template_content: string;
  placeholders: string[];
  state: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserOperatingAgreement {
  id: string;
  user_id: string;
  business_id: string | null;
  template_id: string | null;
  agreement_name: string;
  generated_content: string | null;
  custom_provisions: Record<string, unknown>;
  managing_member_name: string | null;
  managing_member_ownership: number;
  passive_member_name: string | null;
  passive_member_ownership: number;
  includes_ssdi_protection: boolean;
  passive_role_explicitly_defined: boolean;
  no_material_participation_clause: boolean;
  status: 'draft' | 'generated' | 'signed' | 'archived';
  generated_at: string | null;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useOperatingAgreementTemplates() {
  return useQuery({
    queryKey: ["operating_agreement_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operating_agreement_templates")
        .select("*")
        .eq("is_active", true)
        .order("template_type");

      if (error) throw error;
      return data as OperatingAgreementTemplate[];
    },
  });
}

export function useUserOperatingAgreements() {
  return useQuery({
    queryKey: ["user_operating_agreements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_operating_agreements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UserOperatingAgreement[];
    },
  });
}

export function useCreateUserAgreement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (agreement: Omit<UserOperatingAgreement, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("user_operating_agreements")
        .insert({
          ...agreement,
          custom_provisions: agreement.custom_provisions as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return data as UserOperatingAgreement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_operating_agreements"] });
      toast({
        title: "Agreement Created",
        description: "Operating agreement has been generated.",
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

export function useUpdateUserAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserOperatingAgreement> & { id: string }) => {
      const { data, error } = await supabase
        .from("user_operating_agreements")
        .update({
          ...updates,
          custom_provisions: updates.custom_provisions as Json,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as UserOperatingAgreement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_operating_agreements"] });
    },
  });
}

// Generate agreement content from template
export function generateAgreementContent(
  template: OperatingAgreementTemplate,
  placeholders: Record<string, string>
): string {
  let content = template.template_content;
  
  for (const [key, value] of Object.entries(placeholders)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  
  return content;
}
