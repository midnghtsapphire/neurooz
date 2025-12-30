import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

// Fetch all tax forms for the current user
export function useUserTaxForms() {
  return useQuery({
    queryKey: ["user_tax_forms"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tax_forms")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as TaxForm[];
    },
  });
}

// Fetch a single tax form by ID
export function useTaxForm(formId?: string) {
  return useQuery({
    queryKey: ["tax_form", formId],
    queryFn: async () => {
      if (!formId) return null;

      const { data, error } = await supabase
        .from("tax_forms")
        .select("*")
        .eq("id", formId)
        .maybeSingle();

      if (error) throw error;
      return data as TaxForm | null;
    },
    enabled: !!formId,
  });
}

// Delete a tax form
export function useDeleteTaxForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formId: string) => {
      const { error } = await supabase
        .from("tax_forms")
        .delete()
        .eq("id", formId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_tax_forms"] });
      queryClient.invalidateQueries({ queryKey: ["tax_forms"] });
      toast({
        title: "Form deleted",
        description: "The tax form has been deleted.",
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

// Update a tax form
export function useUpdateTaxFormById() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      status?: string;
      form_data?: Record<string, unknown>;
      completed_at?: string | null;
    }) => {
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
      queryClient.invalidateQueries({ queryKey: ["user_tax_forms"] });
      queryClient.invalidateQueries({ queryKey: ["tax_forms"] });
      queryClient.invalidateQueries({ queryKey: ["tax_form"] });
      toast({
        title: "Form updated",
        description: "Tax form has been saved.",
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
