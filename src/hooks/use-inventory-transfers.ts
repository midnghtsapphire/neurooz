import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface VineInventoryTransfer {
  id: string;
  user_id: string;
  source_product_id: string | null;
  product_name: string;
  original_etv: number;
  vine_order_date: string;
  six_month_eligible_date: string;
  from_entity: string;
  to_entity: string;
  transfer_date: string | null;
  transfer_type: 'capital_contribution' | 'sale' | 'donation';
  capital_contribution_basis: number;
  fmv_at_transfer: number;
  depreciation_method: string;
  useful_life_years: number;
  placed_in_service_date: string | null;
  is_section_179_eligible: boolean;
  section_179_amount: number;
  bonus_depreciation_amount: number;
  status: 'pending' | 'eligible' | 'transferred' | 'donated' | 'sold';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useInventoryTransfers(status?: string) {
  return useQuery({
    queryKey: ["inventory_transfers", status],
    queryFn: async () => {
      let query = supabase
        .from("vine_inventory_transfers")
        .select("*")
        .order("vine_order_date", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VineInventoryTransfer[];
    },
  });
}

export function useCreateInventoryTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transfer: Omit<VineInventoryTransfer, "id" | "created_at" | "updated_at" | "six_month_eligible_date">) => {
      const { data, error } = await supabase
        .from("vine_inventory_transfers")
        .insert(transfer)
        .select()
        .single();

      if (error) throw error;
      return data as VineInventoryTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_transfers"] });
      toast({
        title: "Transfer Added",
        description: "Inventory transfer has been tracked.",
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

export function useUpdateInventoryTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<VineInventoryTransfer> & { id: string }) => {
      const { data, error } = await supabase
        .from("vine_inventory_transfers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as VineInventoryTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_transfers"] });
      toast({
        title: "Transfer Updated",
        description: "Transfer status has been updated.",
      });
    },
  });
}

export function useDeleteInventoryTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vine_inventory_transfers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory_transfers"] });
    },
  });
}

// Get transfers that are now eligible (past 6 months)
export function getEligibleTransfers(transfers: VineInventoryTransfer[]): VineInventoryTransfer[] {
  const today = new Date();
  return transfers.filter(t => {
    const eligibleDate = new Date(t.six_month_eligible_date);
    return eligibleDate <= today && t.status === 'pending';
  });
}

// Get pending transfers with days until eligible
export function getPendingWithCountdown(transfers: VineInventoryTransfer[]): Array<VineInventoryTransfer & { daysUntilEligible: number }> {
  const today = new Date();
  return transfers
    .filter(t => t.status === 'pending')
    .map(t => {
      const eligibleDate = new Date(t.six_month_eligible_date);
      const diffTime = eligibleDate.getTime() - today.getTime();
      const daysUntilEligible = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...t, daysUntilEligible };
    })
    .sort((a, b) => a.daysUntilEligible - b.daysUntilEligible);
}
