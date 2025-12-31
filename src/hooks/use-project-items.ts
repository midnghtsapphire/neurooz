import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProjectItem {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  is_action_item: boolean;
  action_item_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useProjectItems(projectId?: string) {
  return useQuery({
    queryKey: ["project-items", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from("project_items")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectItem[];
    },
    enabled: !!projectId,
  });
}

export function useBulkCreateProjectItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, items }: { projectId: string; items: string[] }) => {
      const insertData = items
        .map((title) => title.trim())
        .filter((title) => title.length > 0)
        .map((title) => ({
          project_id: projectId,
          title,
        }));

      if (insertData.length === 0) {
        throw new Error("No valid items to add");
      }

      const { data, error } = await supabase
        .from("project_items")
        .insert(insertData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-items"] });
      toast({ title: `${data.length} items added!` });
    },
    onError: (error) => {
      toast({ title: "Error adding items", description: error.message, variant: "destructive" });
    },
  });
}

export function useConvertToActionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      projectItemId, 
      projectId, 
      title, 
      description,
      priority = "medium" as const,
    }: { 
      projectItemId: string; 
      projectId: string; 
      title: string; 
      description?: string;
      priority?: "low" | "medium" | "high";
    }) => {
      // Create action item
      const { data: actionItem, error: actionError } = await supabase
        .from("action_items")
        .insert({
          project_id: projectId,
          title,
          description,
          priority,
        })
        .select()
        .single();

      if (actionError) throw actionError;

      // Update project item to mark as converted
      const { error: updateError } = await supabase
        .from("project_items")
        .update({
          is_action_item: true,
          action_item_id: actionItem.id,
        })
        .eq("id", projectItemId);

      if (updateError) throw updateError;

      return actionItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-items"] });
      queryClient.invalidateQueries({ queryKey: ["action-items"] });
      toast({ title: "Converted to action item!" });
    },
    onError: (error) => {
      toast({ title: "Error converting item", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteProjectItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-items"] });
      toast({ title: "Item removed" });
    },
  });
}
