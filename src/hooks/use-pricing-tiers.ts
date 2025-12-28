import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  yearly_price: number;
  description: string;
  features: string[];
  recommended: boolean;
  savings_min: number;
  savings_max: number;
  roi_min: number;
  roi_max: number;
  display_order: number;
}

export const usePricingTiers = () => {
  return useQuery({
    queryKey: ["pricing-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_tiers")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as PricingTier[];
    },
  });
};

export const useUpdatePricingTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: Partial<PricingTier> & { id: string }) => {
      const { data, error } = await supabase
        .from("pricing_tiers")
        .update(tier)
        .eq("id", tier.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-tiers"] });
      toast.success("Pricing tier updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pricing tier: " + error.message);
    },
  });
};

export const useSetRecommendedTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tierId: string) => {
      // First, set all tiers to not recommended
      const { error: resetError } = await supabase
        .from("pricing_tiers")
        .update({ recommended: false })
        .neq("id", "");

      if (resetError) throw resetError;

      // Then set the selected tier as recommended
      const { error } = await supabase
        .from("pricing_tiers")
        .update({ recommended: true })
        .eq("id", tierId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-tiers"] });
      toast.success("Recommended tier updated");
    },
    onError: (error) => {
      toast.error("Failed to update recommended tier: " + error.message);
    },
  });
};
