import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/brainDump.types";
import { toast } from "@/hooks/use-toast";

export function useTasks(taskType?: Task['task_type']) {
  return useQuery({
    queryKey: ['tasks', taskType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      if (taskType) {
        query = query.eq('task_type', taskType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Task[];
    },
  });
}

export function useShortListTasks() {
  return useQuery({
    queryKey: ['tasks', 'short_list'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_type', 'short_list')
        .neq('status', 'completed')
        .neq('status', 'archived')
        .order('priority', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Task created!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create task", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update task", description: error.message, variant: "destructive" });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completion_date: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['gamification'] });
      toast({ title: "✅ Task completed!", description: "Great job!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to complete task", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Task deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete task", description: error.message, variant: "destructive" });
    },
  });
}
