import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface CO2LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string | null;
  total_co2_saved: number;
  completed_tasks_count: number;
  current_season: string | null;
  rank?: number;
}

export function useCO2Leaderboard() {
  const queryClient = useQueryClient();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ["co2-leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_co2_stats")
        .select("*")
        .order("total_co2_saved", { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      })) as CO2LeaderboardEntry[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("co2-leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_co2_stats",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["co2-leaderboard"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { leaderboard, isLoading };
}

export function useUpdateCO2Stats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      totalCO2Saved,
      completedTasksCount,
      displayName,
      currentSeason,
    }: {
      totalCO2Saved: number;
      completedTasksCount: number;
      displayName?: string;
      currentSeason?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_co2_stats")
        .upsert(
          {
            user_id: user.id,
            total_co2_saved: totalCO2Saved,
            completed_tasks_count: completedTasksCount,
            display_name: displayName || user.email?.split("@")[0] || "Anonymous",
            current_season: currentSeason,
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["co2-leaderboard"] });
    },
  });
}

export function useCurrentUserRank() {
  return useQuery({
    queryKey: ["current-user-rank"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: allStats, error } = await supabase
        .from("user_co2_stats")
        .select("user_id, total_co2_saved")
        .order("total_co2_saved", { ascending: false });

      if (error) throw error;

      const userIndex = allStats?.findIndex((s) => s.user_id === user.id);
      if (userIndex === -1 || userIndex === undefined) return null;

      return userIndex + 1;
    },
  });
}
