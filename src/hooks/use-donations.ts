import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DonationRecord {
  id: string;
  user_id: string;
  product_name: string;
  source_product_id: string | null;
  donation_date: string;
  charity_name: string;
  charity_ein: string | null;
  charity_address: string | null;
  charity_city: string | null;
  charity_state: string | null;
  charity_zip: string | null;
  is_501c3: boolean;
  original_etv: number;
  fair_market_value: number;
  cost_basis: number;
  condition_at_donation: string;
  valuation_method: string;
  comparable_evidence: string | null;
  acknowledgment_received: boolean;
  acknowledgment_date: string | null;
  receipt_number: string | null;
  appraisal_required: boolean;
  appraiser_name: string | null;
  appraiser_ein: string | null;
  form_8283_section: string | null;
  included_in_tax_year: number | null;
  photo_urls: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedCharity {
  id: string;
  user_id: string;
  charity_name: string;
  ein: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  is_501c3: boolean;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  total_donations: number;
  created_at: string;
  updated_at: string;
}

export function useDonations(taxYear?: number) {
  return useQuery({
    queryKey: ["donations", taxYear],
    queryFn: async () => {
      let query = supabase
        .from("donation_records")
        .select("*")
        .order("donation_date", { ascending: false });

      if (taxYear) {
        query = query.eq("included_in_tax_year", taxYear);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DonationRecord[];
    },
  });
}

export function useSavedCharities() {
  return useQuery({
    queryKey: ["saved-charities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_charities")
        .select("*")
        .order("charity_name");

      if (error) throw error;
      return data as SavedCharity[];
    },
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (donation: {
      product_name: string;
      charity_name: string;
      donation_date?: string;
      source_product_id?: string | null;
      original_etv?: number;
      fair_market_value?: number;
      cost_basis?: number;
      condition_at_donation?: string;
      valuation_method?: string;
      comparable_evidence?: string | null;
      charity_ein?: string | null;
      charity_address?: string | null;
      charity_city?: string | null;
      charity_state?: string | null;
      charity_zip?: string | null;
      is_501c3?: boolean;
      receipt_number?: string | null;
      notes?: string | null;
      included_in_tax_year?: number | null;
      photo_urls?: string[] | null;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Determine Form 8283 section based on FMV
      const fmv = donation.fair_market_value || 0;
      let form8283Section = null;
      if (fmv >= 500 && fmv <= 5000) {
        form8283Section = "A";
      } else if (fmv > 5000) {
        form8283Section = "B";
      }

      const { data, error } = await supabase
        .from("donation_records")
        .insert([{
          product_name: donation.product_name,
          charity_name: donation.charity_name,
          user_id: userData.user.id,
          donation_date: donation.donation_date || new Date().toISOString().split("T")[0],
          source_product_id: donation.source_product_id ?? null,
          original_etv: donation.original_etv ?? 0,
          fair_market_value: donation.fair_market_value ?? 0,
          cost_basis: donation.cost_basis ?? 0,
          condition_at_donation: donation.condition_at_donation ?? "good",
          valuation_method: donation.valuation_method ?? "comparable_sales",
          comparable_evidence: donation.comparable_evidence ?? null,
          charity_ein: donation.charity_ein ?? null,
          charity_address: donation.charity_address ?? null,
          charity_city: donation.charity_city ?? null,
          charity_state: donation.charity_state ?? null,
          charity_zip: donation.charity_zip ?? null,
          is_501c3: donation.is_501c3 ?? true,
          acknowledgment_received: false,
          acknowledgment_date: null,
          receipt_number: donation.receipt_number ?? null,
          appraisal_required: fmv > 5000,
          appraiser_name: null,
          appraiser_ein: null,
          form_8283_section: form8283Section,
          included_in_tax_year: donation.included_in_tax_year ?? null,
          photo_urls: donation.photo_urls ?? null,
          notes: donation.notes ?? null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast({ title: "Donation recorded successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to record donation", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DonationRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from("donation_records")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast({ title: "Donation updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update donation", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("donation_records").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast({ title: "Donation deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete donation", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateCharity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (charity: {
      charity_name: string;
      ein?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      zip?: string | null;
      is_501c3?: boolean;
      contact_name?: string | null;
      contact_email?: string | null;
      contact_phone?: string | null;
      notes?: string | null;
      total_donations?: number;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("saved_charities")
        .insert([{
          charity_name: charity.charity_name,
          user_id: userData.user.id,
          ein: charity.ein ?? null,
          address: charity.address ?? null,
          city: charity.city ?? null,
          state: charity.state ?? null,
          zip: charity.zip ?? null,
          is_501c3: charity.is_501c3 ?? true,
          contact_name: charity.contact_name ?? null,
          contact_email: charity.contact_email ?? null,
          contact_phone: charity.contact_phone ?? null,
          notes: charity.notes ?? null,
          total_donations: charity.total_donations ?? 0,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-charities"] });
      toast({ title: "Charity saved" });
    },
    onError: (error) => {
      toast({ title: "Failed to save charity", description: error.message, variant: "destructive" });
    },
  });
}

// Calculate Form 8283 requirements
export function getForm8283Requirements(donations: DonationRecord[]) {
  const totalFMV = donations.reduce((sum, d) => sum + (d.fair_market_value || 0), 0);
  const sectionADonations = donations.filter(d => d.form_8283_section === "A");
  const sectionBDonations = donations.filter(d => d.form_8283_section === "B");
  const missingAcknowledgments = donations.filter(d => !d.acknowledgment_received);
  const needsAppraisal = sectionBDonations.filter(d => !d.appraiser_name);

  return {
    totalFMV,
    requiresForm8283: totalFMV >= 500,
    sectionACount: sectionADonations.length,
    sectionBCount: sectionBDonations.length,
    missingAcknowledgments: missingAcknowledgments.length,
    needsAppraisal: needsAppraisal.length,
    sectionADonations,
    sectionBDonations,
  };
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
