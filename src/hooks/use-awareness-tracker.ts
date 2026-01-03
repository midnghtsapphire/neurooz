import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AwarenessState {
  currentImageIndex: number;
  visitsSinceChange: number;
  imageChangedAt: Date | null;
  totalObservations: number;
  averageVisitsToNotice: number | null;
  fastestNotice: number | null;
  slowestNotice: number | null;
  isLoading: boolean;
}

interface UseAwarenessTrackerOptions {
  location: string;
  totalImages: number;
  minVisitsBeforeChange?: number; // Don't change until at least this many visits
  maxVisitsBeforeChange?: number; // Force change after this many visits
}

/**
 * Hook to track "change blindness" awareness
 * Subtly rotates images and tracks how long before user notices
 */
export function useAwarenessTracker({
  location,
  totalImages,
  minVisitsBeforeChange = 3,
  maxVisitsBeforeChange = 10,
}: UseAwarenessTrackerOptions) {
  const { toast } = useToast();
  const [state, setState] = useState<AwarenessState>({
    currentImageIndex: 0,
    visitsSinceChange: 0,
    imageChangedAt: null,
    totalObservations: 0,
    averageVisitsToNotice: null,
    fastestNotice: null,
    slowestNotice: null,
    isLoading: true,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [hasJustChanged, setHasJustChanged] = useState(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Load or initialize tracking data
  useEffect(() => {
    if (!userId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const loadTracking = async () => {
      const { data, error } = await supabase
        .from('awareness_observations')
        .select('*')
        .eq('user_id', userId)
        .eq('location', location)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading awareness tracking:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (data) {
        // Existing record - increment visit count
        const newVisits = data.visits_since_change + 1;
        let newImageIndex = data.current_image_index;
        let shouldChangeImage = false;

        // Algorithm: Maybe change image based on visits
        if (newVisits >= minVisitsBeforeChange) {
          // Random chance to change, increasing with visits
          const changeChance = Math.min(
            (newVisits - minVisitsBeforeChange) / (maxVisitsBeforeChange - minVisitsBeforeChange),
            1
          );
          shouldChangeImage = Math.random() < changeChance || newVisits >= maxVisitsBeforeChange;
        }

        if (shouldChangeImage) {
          // Pick a different image
          let attempts = 0;
          while (newImageIndex === data.current_image_index && attempts < 10) {
            newImageIndex = Math.floor(Math.random() * totalImages);
            attempts++;
          }
          setHasJustChanged(true);
        }

        // Update database
        await supabase
          .from('awareness_observations')
          .update({
            visits_since_change: shouldChangeImage ? 0 : newVisits,
            current_image_index: newImageIndex,
            image_changed_at: shouldChangeImage ? new Date().toISOString() : data.image_changed_at,
          })
          .eq('id', data.id);

        setState({
          currentImageIndex: newImageIndex,
          visitsSinceChange: shouldChangeImage ? 0 : newVisits,
          imageChangedAt: shouldChangeImage ? new Date() : new Date(data.image_changed_at),
          totalObservations: data.total_observations,
          averageVisitsToNotice: data.average_visits_to_notice,
          fastestNotice: data.fastest_notice,
          slowestNotice: data.slowest_notice,
          isLoading: false,
        });
      } else {
        // Create new record with random starting image
        const startIndex = Math.floor(Math.random() * totalImages);
        
        await supabase
          .from('awareness_observations')
          .insert({
            user_id: userId,
            location,
            current_image_index: startIndex,
            visits_since_change: 1,
          });

        setState({
          currentImageIndex: startIndex,
          visitsSinceChange: 1,
          imageChangedAt: new Date(),
          totalObservations: 0,
          averageVisitsToNotice: null,
          fastestNotice: null,
          slowestNotice: null,
          isLoading: false,
        });
      }
    };

    loadTracking();
  }, [userId, location, totalImages, minVisitsBeforeChange, maxVisitsBeforeChange]);

  // User noticed the change!
  const reportNoticed = useCallback(async () => {
    if (!userId || state.visitsSinceChange === 0) return;

    const { data } = await supabase
      .from('awareness_observations')
      .select('*')
      .eq('user_id', userId)
      .eq('location', location)
      .single();

    if (!data) return;

    const visitsToNotice = state.visitsSinceChange;
    const newTotal = data.total_observations + 1;
    const newAverage = data.average_visits_to_notice 
      ? (data.average_visits_to_notice * data.total_observations + visitsToNotice) / newTotal
      : visitsToNotice;
    const newFastest = data.fastest_notice 
      ? Math.min(data.fastest_notice, visitsToNotice) 
      : visitsToNotice;
    const newSlowest = data.slowest_notice 
      ? Math.max(data.slowest_notice, visitsToNotice) 
      : visitsToNotice;

    await supabase
      .from('awareness_observations')
      .update({
        noticed_at: new Date().toISOString(),
        total_observations: newTotal,
        average_visits_to_notice: newAverage,
        fastest_notice: newFastest,
        slowest_notice: newSlowest,
        visits_since_change: 0,
      })
      .eq('id', data.id);

    setState(prev => ({
      ...prev,
      totalObservations: newTotal,
      averageVisitsToNotice: newAverage,
      fastestNotice: newFastest,
      slowestNotice: newSlowest,
      visitsSinceChange: 0,
    }));

    // Fun feedback messages
    const messages = [
      visitsToNotice === 1 
        ? "👀 Eagle eyes! You noticed on the first visit!" 
        : `🎯 You noticed after ${visitsToNotice} visits!`,
      newTotal > 1 
        ? `Your average is ${newAverage.toFixed(1)} visits to notice changes.` 
        : "We'll track how observant you are over time!",
    ];

    toast({
      title: "Nice catch!",
      description: messages.join(' '),
    });

    return { visitsToNotice, average: newAverage };
  }, [userId, location, state.visitsSinceChange, toast]);

  return {
    ...state,
    hasJustChanged,
    reportNoticed,
  };
}
