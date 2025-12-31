import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Business {
  id: string;
  user_id: string;
  name: string;
  structure: string;
  ein: string | null;
  state: string | null;
  formation_date: string | null;
  is_active: boolean;
  entity_type: string;
  tax_classification: string | null;
  is_501c3: boolean;
  nonprofit_category: string | null;
  church_denomination: string | null;
  created_at: string;
  updated_at: string;
}

export interface Form1099Recipient {
  id: string;
  user_id: string;
  business_id: string | null;
  recipient_name: string;
  recipient_type: string;
  tin: string | null;
  tin_type: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Form1099NECPayment {
  id: string;
  user_id: string;
  business_id: string | null;
  recipient_id: string | null;
  recipient_name: string;
  payment_date: string;
  amount: number;
  description: string | null;
  payment_method: string | null;
  check_number: string | null;
  box_number: number;
  tax_year: number;
  is_1099_required: boolean;
  form_generated: boolean;
  created_at: string;
  updated_at: string;
}

export function useBusinessesExtended() {
  const queryClient = useQueryClient();

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["businesses-extended"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Business[];
    },
  });

  const addBusiness = useMutation({
    mutationFn: async (business: { 
      name: string; 
      structure: "sole_proprietor" | "single_member_llc" | "llc_s_corp" | "partnership" | "c_corp";
      ein?: string;
      state?: string;
      entity_type?: string;
      is_501c3?: boolean;
      nonprofit_category?: string;
      church_denomination?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("businesses")
        .insert({
          name: business.name,
          structure: business.structure,
          ein: business.ein,
          state: business.state,
          entity_type: business.entity_type,
          is_501c3: business.is_501c3,
          nonprofit_category: business.nonprofit_category,
          church_denomination: business.church_denomination,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses-extended"] });
      toast.success("Business added");
    },
    onError: (error) => {
      toast.error("Failed to add business: " + error.message);
    },
  });

  const updateBusiness = useMutation({
    mutationFn: async ({ id, entity_type, is_501c3, nonprofit_category, church_denomination }: { 
      id: string;
      entity_type?: string;
      is_501c3?: boolean;
      nonprofit_category?: string;
      church_denomination?: string;
    }) => {
      const { data, error } = await supabase
        .from("businesses")
        .update({ entity_type, is_501c3, nonprofit_category, church_denomination })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses-extended"] });
      toast.success("Business updated");
    },
    onError: (error) => {
      toast.error("Failed to update: " + error.message);
    },
  });

  // Group by entity type
  const forProfitBusinesses = businesses.filter(b => b.entity_type === 'for_profit' || !b.entity_type);
  const nonprofitOrgs = businesses.filter(b => b.entity_type === 'nonprofit');
  const churches = businesses.filter(b => b.entity_type === 'church');

  return {
    businesses,
    isLoading,
    addBusiness,
    updateBusiness,
    forProfitBusinesses,
    nonprofitOrgs,
    churches,
  };
}

export function use1099Recipients(businessId?: string) {
  const queryClient = useQueryClient();

  const { data: recipients = [], isLoading } = useQuery({
    queryKey: ["1099-recipients", businessId],
    queryFn: async () => {
      let query = supabase
        .from("form_1099_recipients")
        .select("*")
        .order("recipient_name");

      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Form1099Recipient[];
    },
  });

  const addRecipient = useMutation({
    mutationFn: async (recipient: {
      recipient_name: string;
      business_id?: string;
      recipient_type?: string;
      tin?: string;
      tin_type?: string;
      address_line1?: string;
      city?: string;
      state?: string;
      zip?: string;
      email?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("form_1099_recipients")
        .insert({
          recipient_name: recipient.recipient_name,
          business_id: recipient.business_id,
          recipient_type: recipient.recipient_type,
          tin: recipient.tin,
          tin_type: recipient.tin_type,
          address_line1: recipient.address_line1,
          city: recipient.city,
          state: recipient.state,
          zip: recipient.zip,
          email: recipient.email,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-recipients"] });
      toast.success("Recipient added");
    },
    onError: (error) => {
      toast.error("Failed to add recipient: " + error.message);
    },
  });

  const deleteRecipient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("form_1099_recipients")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-recipients"] });
      toast.success("Recipient deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  return {
    recipients,
    isLoading,
    addRecipient,
    deleteRecipient,
  };
}

export function use1099NECPayments(businessId?: string, taxYear?: number) {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["1099-nec-payments", businessId, taxYear],
    queryFn: async () => {
      let query = supabase
        .from("form_1099_nec_payments")
        .select("*")
        .order("payment_date", { ascending: false });

      if (businessId) {
        query = query.eq("business_id", businessId);
      }
      if (taxYear) {
        query = query.eq("tax_year", taxYear);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Form1099NECPayment[];
    },
  });

  const addPayment = useMutation({
    mutationFn: async (payment: {
      recipient_name: string;
      amount: number;
      payment_date?: string;
      business_id?: string;
      recipient_id?: string;
      description?: string;
      payment_method?: string;
      check_number?: string;
      box_number?: number;
      tax_year?: number;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("form_1099_nec_payments")
        .insert({
          recipient_name: payment.recipient_name,
          amount: payment.amount,
          payment_date: payment.payment_date,
          business_id: payment.business_id,
          recipient_id: payment.recipient_id,
          description: payment.description,
          payment_method: payment.payment_method,
          check_number: payment.check_number,
          box_number: payment.box_number,
          tax_year: payment.tax_year,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-nec-payments"] });
      toast.success("Payment recorded");
    },
    onError: (error) => {
      toast.error("Failed to record payment: " + error.message);
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("form_1099_nec_payments")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["1099-nec-payments"] });
      toast.success("Payment deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  // Calculate recipient totals
  const recipientTotals = payments.reduce((acc, payment) => {
    const key = payment.recipient_name;
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0, needs1099: false, recipientId: payment.recipient_id };
    }
    acc[key].total += Number(payment.amount);
    acc[key].count += 1;
    acc[key].needs1099 = acc[key].total >= 600;
    return acc;
  }, {} as Record<string, { total: number; count: number; needs1099: boolean; recipientId: string | null }>);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const recipientsNeeding1099 = Object.values(recipientTotals).filter(r => r.needs1099).length;

  return {
    payments,
    isLoading,
    addPayment,
    deletePayment,
    recipientTotals,
    totalPaid,
    recipientsNeeding1099,
  };
}
