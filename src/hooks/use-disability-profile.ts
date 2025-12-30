import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DisabilityProfile {
  id: string;
  user_id: string;
  receives_ssdi: boolean;
  receives_ssi: boolean;
  monthly_ssdi_amount: number | null;
  monthly_ssi_amount: number | null;
  twp_months_used: number;
  twp_start_date: string | null;
  in_epe_period: boolean;
  epe_start_date: string | null;
  disability_type: string | null;
  disability_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch user's disability profile
export function useDisabilityProfile(userId?: string) {
  return useQuery({
    queryKey: ["disability-profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("user_disability_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as DisabilityProfile | null;
    },
    enabled: !!userId,
  });
}

// Create or update disability profile
export function useUpsertDisabilityProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: Partial<DisabilityProfile> & { user_id: string }) => {
      const { data: existing } = await supabase
        .from("user_disability_profiles")
        .select("id")
        .eq("user_id", profile.user_id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("user_disability_profiles")
          .update(profile)
          .eq("user_id", profile.user_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("user_disability_profiles")
          .insert(profile)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["disability-profile", variables.user_id] });
      toast({
        title: "Profile saved",
        description: "Your disability profile has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Calculate TWP status
export function calculateTWPStatus(
  profile: DisabilityProfile | null,
  currentMonthlyIncome: number,
  twpThreshold: number = 1160
): {
  isInTWP: boolean;
  monthsRemaining: number;
  willTriggerTWP: boolean;
  message: string;
} {
  if (!profile || !profile.receives_ssdi) {
    return {
      isInTWP: false,
      monthsRemaining: 9,
      willTriggerTWP: false,
      message: "Not receiving SSDI benefits",
    };
  }

  const monthsUsed = profile.twp_months_used || 0;
  const monthsRemaining = Math.max(0, 9 - monthsUsed);
  const willTriggerTWP = currentMonthlyIncome >= twpThreshold;
  const isInTWP = monthsUsed > 0 && monthsUsed < 9 && !profile.in_epe_period;

  let message = "";
  if (profile.in_epe_period) {
    message = "In Extended Period of Eligibility (EPE) - benefits may suspend if over SGA";
  } else if (monthsUsed >= 9) {
    message = "TWP completed - now in EPE period";
  } else if (willTriggerTWP) {
    message = `This income will use a TWP month. ${monthsRemaining} months remaining.`;
  } else {
    message = `Income below TWP threshold ($${twpThreshold}). ${monthsRemaining} TWP months available.`;
  }

  return {
    isInTWP,
    monthsRemaining,
    willTriggerTWP,
    message,
  };
}
