import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionStatus {
  subscribed: boolean;
  productId: string | null;
  priceId: string | null;
  subscriptionEnd: string | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    productId: null,
    priceId: null,
    subscriptionEnd: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSubscription({
          subscribed: false,
          productId: null,
          priceId: null,
          subscriptionEnd: null,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        setError(error.message);
        return;
      }

      setSubscription({
        subscribed: data.subscribed || false,
        productId: data.product_id || null,
        priceId: data.price_id || null,
        subscriptionEnd: data.subscription_end || null,
      });
    } catch (err) {
      console.error("Error checking subscription:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      authSub.unsubscribe();
    };
  }, [checkSubscription]);

  return {
    ...subscription,
    isLoading,
    error,
    refresh: checkSubscription,
  };
};
