import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployerEducationBenefit {
  id: string;
  user_id: string;
  employee_name: string;
  employee_email: string | null;
  payment_date: string;
  amount: number;
  payment_type: string;
  description: string | null;
  tax_year: number;
  documentation_notes: string | null;
  is_student_loan_payment: boolean;
  created_at: string;
  updated_at: string;
}

export function useEmployerEducationBenefits(taxYear?: number) {
  const queryClient = useQueryClient();

  const { data: benefits = [], isLoading } = useQuery({
    queryKey: ["employer-education-benefits", taxYear],
    queryFn: async () => {
      let query = supabase
        .from("employer_education_benefits")
        .select("*")
        .order("payment_date", { ascending: false });

      if (taxYear) {
        query = query.eq("tax_year", taxYear);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EmployerEducationBenefit[];
    },
  });

  const addBenefit = useMutation({
    mutationFn: async (benefit: Omit<EmployerEducationBenefit, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("employer_education_benefits")
        .insert({
          ...benefit,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-education-benefits"] });
      toast.success("Education benefit added");
    },
    onError: (error) => {
      toast.error("Failed to add benefit: " + error.message);
    },
  });

  const deleteBenefit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("employer_education_benefits")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-education-benefits"] });
      toast.success("Benefit deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  // Calculate totals per employee
  const employeeTotals = benefits.reduce((acc, benefit) => {
    const key = benefit.employee_name;
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0, overLimit: false };
    }
    acc[key].total += Number(benefit.amount);
    acc[key].count += 1;
    acc[key].overLimit = acc[key].total > 5250;
    return acc;
  }, {} as Record<string, { total: number; count: number; overLimit: boolean }>);

  const totalPaid = benefits.reduce((sum, b) => sum + Number(b.amount), 0);

  return {
    benefits,
    isLoading,
    addBenefit,
    deleteBenefit,
    employeeTotals,
    totalPaid,
  };
}
