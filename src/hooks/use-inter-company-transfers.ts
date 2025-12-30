import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InterCompanyTransfer {
  id: string;
  user_id: string;
  invoice_number: string | null;
  from_entity: string;
  to_entity: string;
  product_name: string;
  source_product_id: string | null;
  original_etv: number;
  sale_price: number;
  pricing_method: string | null;
  comparable_evidence: string | null;
  payment_due_date: string | null;
  payment_received_date: string | null;
  payment_method: string | null;
  check_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InterCompanyTransferInput {
  from_entity: string;
  to_entity: string;
  product_name: string;
  source_product_id?: string;
  original_etv?: number;
  sale_price?: number;
  pricing_method?: string;
  comparable_evidence?: string;
  payment_due_date?: string;
  payment_method?: string;
  notes?: string;
}

// Generate invoice number
function generateInvoiceNumber(fromEntity: string) {
  const date = new Date();
  const year = date.getFullYear();
  const prefix = fromEntity.includes("Review") ? "RI" : "RMR";
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${year}-${random}`;
}

// Fetch all transfers
export function useInterCompanyTransfers(userId?: string) {
  return useQuery({
    queryKey: ["inter_company_transfers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inter_company_transfers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InterCompanyTransfer[];
    },
    enabled: !!userId,
  });
}

// Create transfer
export function useCreateInterCompanyTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: InterCompanyTransferInput & { user_id: string }) => {
      const { data, error } = await supabase
        .from("inter_company_transfers")
        .insert({
          ...input,
          invoice_number: generateInvoiceNumber(input.from_entity),
        })
        .select()
        .single();

      if (error) throw error;
      return data as InterCompanyTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inter_company_transfers"] });
      toast({
        title: "Transfer recorded",
        description: "Inter-company transfer has been logged.",
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

// Mark transfer as paid
export function useMarkTransferPaid() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      payment_received_date,
      payment_method,
      check_number,
    }: { 
      id: string; 
      payment_received_date: string;
      payment_method?: string;
      check_number?: string;
    }) => {
      const { data, error } = await supabase
        .from("inter_company_transfers")
        .update({
          payment_received_date,
          payment_method,
          check_number,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as InterCompanyTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inter_company_transfers"] });
      toast({
        title: "Payment recorded",
        description: "Transfer has been marked as paid.",
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

// Delete transfer
export function useDeleteInterCompanyTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inter_company_transfers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inter_company_transfers"] });
      toast({
        title: "Transfer deleted",
        description: "Inter-company transfer has been removed.",
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

// Calculate pricing as percentage of ETV
export function calculatePricingPercentage(etv: number, salePrice: number): number {
  if (etv === 0) return 0;
  return (salePrice / etv) * 100;
}

// Suggest pricing based on 50/20/0 method
export function suggestPricing(etv: number, isBrand: boolean, isBroken: boolean): number {
  if (isBroken) return 0;
  if (isBrand) return etv * 0.5; // 50% for brand
  return etv * 0.2; // 20% for non-brand
}

// Transfer statistics
export function useTransferStats(transfers: InterCompanyTransfer[] = []) {
  const totalTransfers = transfers.length;
  const totalEtv = transfers.reduce((sum, t) => sum + (t.original_etv || 0), 0);
  const totalSalePrice = transfers.reduce((sum, t) => sum + (t.sale_price || 0), 0);
  const totalReduction = totalEtv - totalSalePrice;
  const averagePricingPercent = totalEtv > 0 ? (totalSalePrice / totalEtv) * 100 : 0;
  
  const paidTransfers = transfers.filter(t => t.payment_received_date).length;
  const unpaidTransfers = totalTransfers - paidTransfers;
  const unpaidAmount = transfers
    .filter(t => !t.payment_received_date)
    .reduce((sum, t) => sum + (t.sale_price || 0), 0);

  return {
    totalTransfers,
    totalEtv,
    totalSalePrice,
    totalReduction,
    averagePricingPercent,
    paidTransfers,
    unpaidTransfers,
    unpaidAmount,
  };
}
