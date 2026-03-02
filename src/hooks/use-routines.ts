import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Routine, RoutineStep, RoutineCompletion } from "@/types/brainDump.types";
import { toast } from "@/hooks/use-toast";

export function useRoutines(routineType?: Routine['routine_type']) {
  return useQuery({
    queryKey: ['routines', routineType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (routineType) {
        query = query.eq('routine_type', routineType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Routine[];
    },
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routine: { name: string; routine_type: Routine['routine_type']; steps: RoutineStep[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('routines')
        .insert({ ...routine, user_id: user.id, is_template: false })
        .select()
        .single();

      if (error) throw error;
      return data as Routine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({ title: "Routine created!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create routine", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Routine> }) => {
      const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Routine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update routine", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', routineId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({ title: "Routine deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete routine", description: error.message, variant: "destructive" });
    },
  });
}

export function useCompleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ routineId, stepsCompleted, timeTaken }: { routineId: string; stepsCompleted: string[]; timeTaken?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('routine_completions')
        .insert({
          routine_id: routineId,
          user_id: user.id,
          steps_completed: stepsCompleted,
          time_taken: timeTaken,
        })
        .select()
        .single();

      if (error) throw error;
      return data as RoutineCompletion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine_completions'] });
      queryClient.invalidateQueries({ queryKey: ['gamification'] });
      toast({ title: "🌟 Routine completed!", description: "Amazing consistency!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to log completion", description: error.message, variant: "destructive" });
    },
  });
}

export function useRoutineCompletions(routineId?: string) {
  return useQuery({
    queryKey: ['routine_completions', routineId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('routine_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(30);

      if (routineId) {
        query = query.eq('routine_id', routineId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as RoutineCompletion[];
    },
  });
}
