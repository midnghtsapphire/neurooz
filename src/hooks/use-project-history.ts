import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectHistoryEntry {
  id: string;
  project_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
  changed_by: string | null;
}

export function useProjectHistory(projectId: string) {
  return useQuery({
    queryKey: ["project-history", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_history")
        .select("*")
        .eq("project_id", projectId)
        .order("changed_at", { ascending: false });
      
      if (error) throw error;
      return data as ProjectHistoryEntry[];
    },
    enabled: !!projectId,
  });
}

export function useLogProjectChange() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      projectId,
      fieldName,
      oldValue,
      newValue,
    }: {
      projectId: string;
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
    }) => {
      const { error } = await supabase
        .from("project_history")
        .insert({
          project_id: projectId,
          field_name: fieldName,
          old_value: oldValue,
          new_value: newValue,
        });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-history", variables.projectId] });
    },
  });
}
