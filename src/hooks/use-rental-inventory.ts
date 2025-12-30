import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RentalInventoryItem {
  id: string;
  user_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  original_etv: number;
  purchase_price: number;
  source: string;
  source_product_id: string | null;
  daily_rate: number;
  weekly_rate: number;
  condition: string;
  status: string;
  location: string | null;
  photo_url: string | null;
  depreciation_method: string;
  current_book_value: number;
  times_rented: number;
  total_rental_income: number;
  created_at: string;
  updated_at: string;
}

export interface RentalInventoryInput {
  product_name: string;
  description?: string;
  category?: string;
  original_etv?: number;
  purchase_price?: number;
  source?: string;
  source_product_id?: string;
  daily_rate?: number;
  weekly_rate?: number;
  condition?: string;
  status?: string;
  location?: string;
  photo_url?: string;
  depreciation_method?: string;
  current_book_value?: number;
}

// Fetch all inventory items for user
export function useRentalInventory(userId?: string) {
  return useQuery({
    queryKey: ["rental_inventory", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rental_inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RentalInventoryItem[];
    },
    enabled: !!userId,
  });
}

// Create inventory item
export function useCreateRentalInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: RentalInventoryInput & { user_id: string }) => {
      const { data, error } = await supabase
        .from("rental_inventory")
        .insert({
          ...input,
          current_book_value: input.current_book_value ?? input.purchase_price ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as RentalInventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_inventory"] });
      toast({
        title: "Item added",
        description: "Rental inventory item has been added.",
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

// Update inventory item
export function useUpdateRentalInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RentalInventoryInput> & { id: string }) => {
      const { data, error } = await supabase
        .from("rental_inventory")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as RentalInventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_inventory"] });
      toast({
        title: "Item updated",
        description: "Rental inventory item has been updated.",
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

// Delete inventory item
export function useDeleteRentalInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("rental_inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental_inventory"] });
      toast({
        title: "Item deleted",
        description: "Rental inventory item has been removed.",
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

// Calculate depreciation
export function calculateDepreciation(purchasePrice: number, method: string = "5-yr MACRS") {
  const rates = {
    "5-yr MACRS": [0.20, 0.32, 0.192, 0.1152, 0.1152, 0.0576],
    "7-yr MACRS": [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446],
    "Straight Line 5yr": [0.20, 0.20, 0.20, 0.20, 0.20],
  };

  const yearlyRates = rates[method as keyof typeof rates] || rates["5-yr MACRS"];
  
  return yearlyRates.map((rate, index) => ({
    year: index + 1,
    rate: rate * 100,
    amount: purchasePrice * rate,
  }));
}

// Get inventory statistics
export function useInventoryStats(items: RentalInventoryItem[] = []) {
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.purchase_price || 0), 0);
  const totalBookValue = items.reduce((sum, item) => sum + (item.current_book_value || 0), 0);
  const totalRentalIncome = items.reduce((sum, item) => sum + (item.total_rental_income || 0), 0);
  const availableItems = items.filter(item => item.status === "available").length;
  const rentedItems = items.filter(item => item.status === "rented").length;

  return {
    totalItems,
    totalValue,
    totalBookValue,
    totalRentalIncome,
    availableItems,
    rentedItems,
  };
}
