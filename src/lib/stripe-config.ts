// Stripe price configuration mapping tier IDs to Stripe price IDs
export const STRIPE_PRICES = {
  "free": {
    monthly: null,
    yearly: null,
  },
  "tax-smart": {
    monthly: "price_1Raj2wP8T6VGDCG5sDbSl8MM", // Basic Plan - $29/month
    yearly: "price_1Raj2wP8T6VGDCG5sDbSl8MM", // Using same for now, update with yearly price if created
  },
  "business-builder": {
    monthly: "price_1SjOygP8T6VGDCG5kR9rm4wv", // Premium Plan Monthly - $59/month
    yearly: "price_1SjOygP8T6VGDCG5kR9rm4wv", // Using same for now
  },
} as const;

export type TierId = keyof typeof STRIPE_PRICES;

export const getStripePriceId = (tierId: string, isYearly: boolean): string | null => {
  const tierPrices = STRIPE_PRICES[tierId as TierId];
  if (!tierPrices) return null;
  return isYearly ? tierPrices.yearly : tierPrices.monthly;
};
