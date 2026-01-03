import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface QuickNote {
  id: string;
  user_id: string;
  content: string;
  project_id: string | null;
  is_processed: boolean;
  category: "inbox" | "maybe" | "someday" | "idea" | "reference";
  created_at: string;
  updated_at: string;
}

export function useQuickNotes() {
  return useQuery({
    queryKey: ["quick-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quick_notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as QuickNote[];
    },
  });
}

export function useCreateQuickNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: { 
      content: string; 
      project_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("quick_notes")
        .insert({
          ...note,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-notes"] });
      toast({ title: "Note saved! 🐕" });
    },
    onError: (error) => {
      toast({ title: "Error saving note", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateQuickNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QuickNote> & { id: string }) => {
      const { data, error } = await supabase
        .from("quick_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-notes"] });
    },
  });
}

export function useDeleteQuickNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quick_notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-notes"] });
      toast({ title: "Note deleted" });
    },
  });
}
