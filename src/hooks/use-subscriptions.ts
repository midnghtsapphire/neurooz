import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Subscription {
  id: string;
  user_id: string;
  subscription_name: string;
  subscription_type: string;
  provider: string | null;
  billing_cycle: string;
  amount: number;
  currency: string;
  start_date: string;
  renewal_date: string | null;
  auto_renew: boolean;
  is_business_expense: boolean;
  business_use_percentage: number;
  category: string | null;
  license_key: string | null;
  seats_purchased: number;
  assigned_to: string[] | null;
  notes: string | null;
  receipt_urls: string[] | null;
  status: string;
  cancellation_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInput {
  subscription_name: string;
  subscription_type: string;
  provider?: string;
  billing_cycle?: string;
  amount: number;
  currency?: string;
  start_date?: string;
  renewal_date?: string;
  auto_renew?: boolean;
  is_business_expense?: boolean;
  business_use_percentage?: number;
  category?: string;
  license_key?: string;
  seats_purchased?: number;
  assigned_to?: string[];
  notes?: string;
  receipt_urls?: string[];
  status?: string;
}

export function useSubscriptions(userId?: string) {
  return useQuery({
    queryKey: ["subscriptions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("renewal_date", { ascending: true });

      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!userId,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, input }: { userId: string; input: SubscriptionInput }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({ user_id: userId, ...input })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({ title: "Subscription added successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to add subscription", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<SubscriptionInput> }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({ title: "Subscription updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({ title: "Subscription deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });
}

export function useSubscriptionStats(subscriptions: Subscription[] = []) {
  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyTotal = active.reduce((sum, s) => {
    const amount = s.amount * (s.business_use_percentage / 100);
    if (s.billing_cycle === "monthly") return sum + amount;
    if (s.billing_cycle === "yearly") return sum + amount / 12;
    if (s.billing_cycle === "quarterly") return sum + amount / 3;
    return sum;
  }, 0);

  const yearlyTotal = monthlyTotal * 12;
  const upcomingRenewals = active.filter((s) => {
    if (!s.renewal_date) return false;
    const renewDate = new Date(s.renewal_date);
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    return renewDate <= thirtyDays;
  });

  const byType = active.reduce((acc, s) => {
    acc[s.subscription_type] = (acc[s.subscription_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { monthlyTotal, yearlyTotal, upcomingRenewals, byType, activeCount: active.length };
}

export const SUBSCRIPTION_TYPES = [
  { value: "software", label: "Software" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "streaming", label: "Streaming" },
  { value: "professional", label: "Professional Service" },
  { value: "cloud_storage", label: "Cloud Storage" },
  { value: "saas", label: "SaaS" },
  { value: "other", label: "Other" },
];

export const SUBSCRIPTION_CATEGORIES = [
  { value: "productivity", label: "Productivity" },
  { value: "communication", label: "Communication" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "marketing", label: "Marketing" },
  { value: "accounting", label: "Accounting" },
  { value: "storage", label: "Storage" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
];

export const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "one_time", label: "One-Time" },
  { value: "lifetime", label: "Lifetime" },
];
