import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DigitalAsset {
  id: string;
  user_id: string;
  asset_name: string;
  asset_type: string;
  vendor: string | null;
  purchase_date: string;
  purchase_price: number;
  license_type: string;
  license_key: string | null;
  license_expiry: string | null;
  seats_count: number;
  version: string | null;
  platform: string | null;
  installed_on: string[] | null;
  is_business_asset: boolean;
  business_use_percentage: number;
  depreciation_method: string;
  useful_life_years: number;
  current_value: number;
  category: string | null;
  proof_of_purchase: string[] | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalAssetInput {
  asset_name: string;
  asset_type: string;
  vendor?: string;
  purchase_date?: string;
  purchase_price?: number;
  license_type?: string;
  license_key?: string;
  license_expiry?: string;
  seats_count?: number;
  version?: string;
  platform?: string;
  installed_on?: string[];
  is_business_asset?: boolean;
  business_use_percentage?: number;
  depreciation_method?: string;
  useful_life_years?: number;
  current_value?: number;
  category?: string;
  proof_of_purchase?: string[];
  notes?: string;
  status?: string;
}

export function useDigitalInventory(userId?: string) {
  return useQuery({
    queryKey: ["digital-inventory", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("digital_inventory")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DigitalAsset[];
    },
    enabled: !!userId,
  });
}

export function useCreateDigitalAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, input }: { userId: string; input: DigitalAssetInput }) => {
      const { data, error } = await supabase
        .from("digital_inventory")
        .insert({ user_id: userId, ...input })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-inventory"] });
      toast({ title: "Digital asset added successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to add asset", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateDigitalAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<DigitalAssetInput> }) => {
      const { data, error } = await supabase
        .from("digital_inventory")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-inventory"] });
      toast({ title: "Asset updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteDigitalAsset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("digital_inventory").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-inventory"] });
      toast({ title: "Asset deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });
}

export function useDigitalInventoryStats(assets: DigitalAsset[] = []) {
  const active = assets.filter((a) => a.status === "active");
  const totalValue = active.reduce((sum, a) => sum + (a.purchase_price || 0), 0);
  const currentValue = active.reduce((sum, a) => sum + (a.current_value || 0), 0);
  const businessValue = active.reduce((sum, a) => sum + (a.purchase_price || 0) * (a.business_use_percentage / 100), 0);

  const expiringLicenses = active.filter((a) => {
    if (!a.license_expiry) return false;
    const expiry = new Date(a.license_expiry);
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    return expiry <= thirtyDays;
  });

  const byType = active.reduce((acc, a) => {
    acc[a.asset_type] = (acc[a.asset_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { totalValue, currentValue, businessValue, expiringLicenses, byType, activeCount: active.length };
}

export const ASSET_TYPES = [
  { value: "software", label: "Software" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "cloud_subscription", label: "Cloud Subscription" },
  { value: "digital_tool", label: "Digital Tool" },
  { value: "online_course", label: "Online Course" },
  { value: "ebook", label: "eBook" },
  { value: "template", label: "Template" },
  { value: "plugin", label: "Plugin" },
  { value: "domain", label: "Domain" },
  { value: "hosting", label: "Hosting" },
];

export const LICENSE_TYPES = [
  { value: "perpetual", label: "Perpetual" },
  { value: "subscription", label: "Subscription" },
  { value: "freemium", label: "Freemium" },
  { value: "open_source", label: "Open Source" },
  { value: "trial", label: "Trial" },
];

export const PLATFORMS = [
  { value: "windows", label: "Windows" },
  { value: "mac", label: "Mac" },
  { value: "linux", label: "Linux" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "web", label: "Web" },
  { value: "cross_platform", label: "Cross-Platform" },
];

export const ASSET_CATEGORIES = [
  { value: "productivity", label: "Productivity" },
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "accounting", label: "Accounting" },
  { value: "education", label: "Education" },
  { value: "communication", label: "Communication" },
  { value: "security", label: "Security" },
  { value: "utilities", label: "Utilities" },
];
