import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectCheckin {
  id: string;
  project_id: string;
  checkin_date: string;
  priorities_reviewed: boolean;
  stakeholders_contacted: string[] | null;
  focus_intention: string | null;
  distractions_to_avoid: string[] | null;
  created_at: string;
}

export interface FocusPattern {
  id: string;
  project_id: string | null;
  pattern_type: string;
  pattern_description: string;
  times_occurred: number;
  impact_on_score: number | null;
  lesson: string | null;
  created_at: string;
  updated_at: string;
}

export function useTodayCheckin(projectId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ["project-checkin", projectId, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_checkins")
        .select("*")
        .eq("project_id", projectId)
        .eq("checkin_date", today)
        .maybeSingle();
      
      if (error) throw error;
      return data as ProjectCheckin | null;
    },
    enabled: !!projectId,
  });
}

export function useCreateCheckin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (checkin: {
      project_id: string;
      priorities_reviewed?: boolean;
      stakeholders_contacted?: string[];
      focus_intention?: string;
      distractions_to_avoid?: string[];
    }) => {
      const { data, error } = await supabase
        .from("project_checkins")
        .upsert({
          ...checkin,
          checkin_date: new Date().toISOString().split('T')[0],
        }, { onConflict: 'project_id,checkin_date' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ["project-checkin", variables.project_id, today] });
    },
  });
}

export function useFocusPatterns(projectId?: string) {
  return useQuery({
    queryKey: ["focus-patterns", projectId],
    queryFn: async () => {
      let query = supabase
        .from("focus_patterns")
        .select("*")
        .order("times_occurred", { ascending: false });
      
      if (projectId) {
        query = query.eq("project_id", projectId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as FocusPattern[];
    },
  });
}

export function useCreateFocusPattern() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pattern: {
      project_id?: string;
      pattern_type: string;
      pattern_description: string;
      impact_on_score?: number;
      lesson?: string;
    }) => {
      const { data, error } = await supabase
        .from("focus_patterns")
        .insert(pattern)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus-patterns"] });
    },
  });
}

export function useIncrementPattern() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patternId: string) => {
      const { data: current } = await supabase
        .from("focus_patterns")
        .select("times_occurred")
        .eq("id", patternId)
        .single();
      
      const { data, error } = await supabase
        .from("focus_patterns")
        .update({ 
          times_occurred: (current?.times_occurred || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", patternId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus-patterns"] });
    },
  });
}
