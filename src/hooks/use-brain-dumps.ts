import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BrainDump {
  id: string;
  user_id: string;
  title: string | null;
  raw_content: string;
  ai_summary: string | null;
  ai_action_items: any[] | null;
  ai_categories: any[] | null;
  project_id: string | null;
  document_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export function useBrainDumps() {
  return useQuery({
    queryKey: ["brain-dumps"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("brain_dumps")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BrainDump[];
    },
  });
}

export function useCreateBrainDump() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brainDump: {
      raw_content: string;
      title?: string;
      project_id?: string;
      document_urls?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("brain_dumps")
        .insert({
          ...brainDump,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brain-dumps"] });
      toast({ title: "Brain dump saved!" });
    },
    onError: (error) => {
      toast({ title: "Error saving brain dump", description: error.message, variant: "destructive" });
    },
  });
}

export function useProcessBrainDump() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      brainDumpId, 
      rawContent, 
      existingProjects 
    }: { 
      brainDumpId: string; 
      rawContent: string; 
      existingProjects: string[];
    }) => {
      // Call AI to process
      const { data: aiResult, error: fnError } = await supabase.functions.invoke(
        "process-brain-dump",
        { body: { rawContent, existingProjects } }
      );

      if (fnError) throw fnError;

      // Update the brain dump with AI results
      const { data, error } = await supabase
        .from("brain_dumps")
        .update({
          ai_summary: aiResult.summary,
          ai_action_items: aiResult.action_items,
          ai_categories: aiResult.categories,
        })
        .eq("id", brainDumpId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brain-dumps"] });
      toast({ title: "Brain dump processed!" });
    },
    onError: (error) => {
      toast({ title: "Error processing", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteBrainDump() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brain_dumps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brain-dumps"] });
      toast({ title: "Brain dump deleted" });
    },
  });
}
