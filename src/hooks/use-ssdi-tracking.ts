import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SSDITracking {
  id: string;
  user_id: string;
  month: number;
  year: number;
  passive_income: number;
  earned_income: number;
  vine_etv: number;
  rental_income: number;
  k1_distributions: number;
  hours_worked: number;
  material_participation_test: string;
  is_substantial_services: boolean;
  is_twp_month: boolean;
  twp_months_used: number;
  is_epe_month: boolean;
  ssdi_benefit_amount: number;
  sga_limit: number;
  sga_risk_level: 'low' | 'medium' | 'high';
  alert_notes: string | null;
  created_at: string;
  updated_at: string;
}

// 2026 SGA limit
const SGA_LIMIT_2026 = 1620;

export function useSSDITracking(year?: number) {
  return useQuery({
    queryKey: ["ssdi_tracking", year],
    queryFn: async () => {
      let query = supabase
        .from("ssdi_tracking")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: true });

      if (year) {
        query = query.eq("year", year);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SSDITracking[];
    },
  });
}

export function useCreateSSDITracking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tracking: Omit<SSDITracking, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("ssdi_tracking")
        .insert(tracking)
        .select()
        .single();

      if (error) throw error;
      return data as SSDITracking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ssdi_tracking"] });
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

export function useUpdateSSDITracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SSDITracking> & { id: string }) => {
      const { data, error } = await supabase
        .from("ssdi_tracking")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as SSDITracking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ssdi_tracking"] });
    },
  });
}

// Calculate SGA risk level
export function calculateSGARisk(tracking: Partial<SSDITracking>): 'low' | 'medium' | 'high' {
  const totalEarned = (tracking.earned_income || 0);
  const sgaLimit = tracking.sga_limit || SGA_LIMIT_2026;
  
  // Hours worked risk
  const hoursRisk = (tracking.hours_worked || 0) > 80 ? 'high' : 
                    (tracking.hours_worked || 0) > 40 ? 'medium' : 'low';
  
  // Income risk
  const incomeRisk = totalEarned >= sgaLimit ? 'high' :
                     totalEarned >= sgaLimit * 0.8 ? 'medium' : 'low';
  
  // Material participation risk
  const materialRisk = tracking.is_substantial_services ? 'high' :
                       tracking.material_participation_test !== 'none' ? 'medium' : 'low';
  
  // Return highest risk
  const risks = [hoursRisk, incomeRisk, materialRisk];
  if (risks.includes('high')) return 'high';
  if (risks.includes('medium')) return 'medium';
  return 'low';
}

// Generate SSDI protection alerts
export function generateSSDIAlerts(tracking: SSDITracking[]): Array<{
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}> {
  const alerts: Array<{ type: 'warning' | 'danger' | 'info'; title: string; message: string }> = [];
  
  const currentYear = new Date().getFullYear();
  const yearData = tracking.filter(t => t.year === currentYear);
  
  // Check TWP months
  const twpMonths = yearData.filter(t => t.is_twp_month).length;
  if (twpMonths >= 7) {
    alerts.push({
      type: 'danger',
      title: 'TWP Exhausted',
      message: `You have used ${twpMonths}/9 Trial Work Period months. Benefits may be affected.`,
    });
  } else if (twpMonths >= 5) {
    alerts.push({
      type: 'warning',
      title: 'TWP Usage High',
      message: `${twpMonths}/9 Trial Work Period months used. Plan carefully.`,
    });
  }
  
  // Check for high-risk months
  const highRiskMonths = yearData.filter(t => t.sga_risk_level === 'high');
  if (highRiskMonths.length > 0) {
    alerts.push({
      type: 'danger',
      title: 'High SGA Risk Detected',
      message: `${highRiskMonths.length} month(s) show activity that may impact SSDI benefits.`,
    });
  }
  
  // Check material participation
  const materialParticipation = yearData.filter(t => t.material_participation_test !== 'none');
  if (materialParticipation.length > 0) {
    alerts.push({
      type: 'warning',
      title: 'Material Participation Concern',
      message: 'Some months show material participation indicators. Review your passive role documentation.',
    });
  }
  
  // Passive income is good
  const totalPassive = yearData.reduce((sum, t) => sum + t.passive_income + t.k1_distributions + t.rental_income, 0);
  if (totalPassive > 0) {
    alerts.push({
      type: 'info',
      title: 'Passive Income Protected',
      message: `$${totalPassive.toLocaleString()} in passive income does NOT count toward SGA.`,
    });
  }
  
  return alerts;
}
