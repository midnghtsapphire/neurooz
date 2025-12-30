import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RentalTransaction {
  id: string;
  user_id: string;
  inventory_id: string | null;
  customer_id: string | null;
  transaction_number: string | null;
  rental_start_date: string;
  rental_end_date: string | null;
  days_rented: number;
  daily_rate: number;
  subtotal: number;
  security_deposit: number;
  total_charged: number;
  payment_method: string | null;
  payment_received: boolean;
  returned_on_time: boolean | null;
  return_condition: string | null;
  has_damage: boolean;
  damage_description: string | null;
  repair_cost: number;
  deposit_refunded: number;
  net_revenue: number;
  agreement_signed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RentalCustomer {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  drivers_license: string | null;
  notes: string | null;
  total_rentals: number;
  created_at: string;
  updated_at: string;
}

export interface RentalTransactionInput {
  inventory_id: string;
  customer_id?: string;
  rental_start_date: string;
  rental_end_date?: string;
  days_rented?: number;
  daily_rate?: number;
  subtotal?: number;
  security_deposit?: number;
  total_charged?: number;
  payment_method?: string;
  payment_received?: boolean;
  agreement_signed?: boolean;
  notes?: string;
}

// Generate transaction number
function generateTransactionNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `RMR-${year}-${random}`;
}

// Fetch all transactions
export function useRentalTransactions(userId?: string) {
  return useQuery({
    queryKey: ["rental_transactions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rental_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RentalTransaction[];
    },
    enabled: !!userId,
  });
}

// Fetch all customers
export function useRentalCustomers(userId?: string) {
  return useQuery({
    queryKey: ["rental_customers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rental_customers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as RentalCustomer[];
    },
    enabled: !!userId,
  });
}

// Create transaction
export function useCreateRentalTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: RentalTransactionInput & { user_id: string }) => {
      const days = input.days_rented || 1;
      const rate = input.daily_rate || 0;
      const subtotal = days * rate;
      const deposit = input.security_deposit || 0;
      const total = subtotal + deposit;

      const { data, error } = await supabase
        .from("rental_transactions")
        .insert({
          ...input,
          transaction_number: generateTransactionNumber(),
          subtotal,
          total_charged: total,
          net_revenue: subtotal,
        })
        .select()
        .single();

      if (error) throw error;

      // Update inventory status to rented
      if (input.inventory_id) {
        await supabase
          .from("rental_inventory")
          .update({ status: "rented" })
          .eq("id", input.inventory_id);
      }

      return data as RentalTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_transactions"] });
      queryClient.invalidateQueries({ queryKey: ["rental_inventory"] });
      toast({
        title: "Rental created",
        description: "New rental transaction has been recorded.",
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

// Complete/return rental
export function useCompleteRentalTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      inventory_id,
      returned_on_time,
      return_condition,
      has_damage,
      damage_description,
      repair_cost,
      deposit_refunded,
      subtotal,
    }: { 
      id: string; 
      inventory_id?: string;
      returned_on_time?: boolean;
      return_condition?: string;
      has_damage?: boolean;
      damage_description?: string;
      repair_cost?: number;
      deposit_refunded?: number;
      subtotal?: number;
    }) => {
      const netRevenue = (subtotal || 0) - (repair_cost || 0);

      const { data, error } = await supabase
        .from("rental_transactions")
        .update({
          returned_on_time,
          return_condition,
          has_damage,
          damage_description,
          repair_cost,
          deposit_refunded,
          net_revenue: netRevenue,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Update inventory status back to available
      if (inventory_id) {
        await supabase
          .from("rental_inventory")
          .update({ status: "available" })
          .eq("id", inventory_id);
      }

      return data as RentalTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_transactions"] });
      queryClient.invalidateQueries({ queryKey: ["rental_inventory"] });
      toast({
        title: "Rental completed",
        description: "Rental has been marked as returned.",
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

// Create customer
export function useCreateRentalCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: Omit<RentalCustomer, "id" | "created_at" | "updated_at" | "total_rentals">) => {
      const { data, error } = await supabase
        .from("rental_customers")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as RentalCustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_customers"] });
      toast({
        title: "Customer added",
        description: "New customer has been added.",
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

// Delete transaction
export function useDeleteRentalTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("rental_transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_transactions"] });
      toast({
        title: "Transaction deleted",
        description: "Rental transaction has been removed.",
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

// Transaction statistics
export function useTransactionStats(transactions: RentalTransaction[] = []) {
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.net_revenue || 0), 0);
  const totalDeposits = transactions.reduce((sum, t) => sum + (t.security_deposit || 0), 0);
  const depositsRefunded = transactions.reduce((sum, t) => sum + (t.deposit_refunded || 0), 0);
  const damageCount = transactions.filter(t => t.has_damage).length;
  const onTimeReturns = transactions.filter(t => t.returned_on_time === true).length;
  const paidTransactions = transactions.filter(t => t.payment_received).length;

  return {
    totalTransactions,
    totalRevenue,
    totalDeposits,
    depositsRefunded,
    damageCount,
    onTimeReturns,
    paidTransactions,
    paymentRate: totalTransactions > 0 ? (paidTransactions / totalTransactions) * 100 : 0,
    damageRate: totalTransactions > 0 ? (damageCount / totalTransactions) * 100 : 0,
  };
}
