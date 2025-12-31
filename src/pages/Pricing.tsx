import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Coffee, 
  Check, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Building2,
  Sparkles,
  ArrowRight,
  Star,
  Loader2,
  Settings
} from "lucide-react";
import { usePricingTiers } from "@/hooks/use-pricing-tiers";
import { useSubscription } from "@/hooks/use-subscription";
import { getStripePriceId } from "@/lib/stripe-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import magnoliaFlowers from "@/assets/magnolia-flowers.png";
import { FloatingPetals } from "@/components/FloatingPetals";

const tierIcons: Record<string, React.ReactNode> = {
  "free": <Sparkles className="w-6 h-6" />,
  "tax-smart": <Calculator className="w-6 h-6" />,
  "business-builder": <Building2 className="w-6 h-6" />
};

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: tiers, isLoading } = usePricingTiers();
  const { subscribed, priceId: activePriceId, isLoading: subLoading, refresh: refreshSubscription } = useSubscription();
  const [isYearly, setIsYearly] = useState(false);
  const [vineIncome, setVineIncome] = useState([35000]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for success/cancel params
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated successfully!");
      refreshSubscription();
    } else if (searchParams.get("canceled") === "true") {
      toast.info("Checkout was canceled");
    }

    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [searchParams, refreshSubscription]);

  const handleCheckout = async (tierId: string) => {
    const priceId = getStripePriceId(tierId, isYearly);
    
    if (!priceId) {
      toast.error("This plan is not available for purchase");
      return;
    }

    if (!user) {
      toast.info("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    setCheckoutLoading(tierId);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, isYearly },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Failed to open subscription management. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const calculateSavings = (income: number) => {
    const fiftyTwentyZero = Math.min(income * 0.04, 3000);
    const homeOffice = Math.min(income * 0.02, 1200);
    const mileage = Math.min(income * 0.015, 800);
    const missed = Math.min(income * 0.025, 1500);
    const hrBlock = 400;
    const time = Math.min(income * 0.02, 1000);
    
    return {
      fiftyTwentyZero,
      homeOffice,
      mileage,
      missed,
      hrBlock,
      time,
      total: fiftyTwentyZero + homeOffice + mileage + missed + hrBlock + time
    };
  };

  const savings = calculateSavings(vineIncome[0]);
  const yearlySubscription = 348;
  const roiPercentage = Math.round((savings.total / yearlySubscription) * 100);

  const isCurrentPlan = (tierId: string): boolean => {
    if (!subscribed || !activePriceId) return false;
    const tierPriceId = getStripePriceId(tierId, isYearly);
    return tierPriceId === activePriceId;
  };

  return (
    <div className="min-h-screen page-white relative overflow-hidden">
      <FloatingPetals count={10} />
      
      {/* Decorative Magnolias */}
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute top-20 right-0 w-44 opacity-30 pointer-events-none select-none transform translate-x-1/4"
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute bottom-40 left-0 w-40 opacity-25 pointer-events-none select-none transform -translate-x-1/4 rotate-180"
        aria-hidden="true"
      />
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Coffee className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">NomadTaxes</span>
          </div>
          <div className="flex items-center gap-4">
            {subscribed && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Manage Subscription
              </Button>
            )}
            <Button
              onClick={() => navigate(user ? "/" : "/auth")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {user ? "Dashboard" : "Get Started"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          {subscribed && (
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
              <Check className="w-4 h-4 mr-2" />
              You have an active subscription
            </Badge>
          )}
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Less than 1 quarterly tax payment
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Stop Overpaying on Your{" "}
            <span className="text-primary">Vine Taxes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The average Vine member overpays <span className="text-foreground font-semibold">$2,300/year</span> in taxes they don't owe.
            <br />
            For just $29/month, we'll find every deduction you're missing.
          </p>
          
          {/* "Goes toward your taxes" callout */}
          <div className="inline-flex items-center gap-3 bg-gusto-teal-light dark:bg-secondary/20 rounded-2xl px-6 py-4 border border-secondary/30">
            <Shield className="w-8 h-8 text-secondary" />
            <div className="text-left">
              <p className="font-display font-bold text-foreground">Think of it as part of your tax payment</p>
              <p className="text-sm text-muted-foreground">$29/month = $87/quarter • That's just 7-29% of your quarterly taxes</p>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-8 rounded-full transition-colors ${isYearly ? "bg-primary" : "bg-muted"}`}
          >
            <span 
              className={`absolute top-1 w-6 h-6 rounded-full bg-card shadow-medium transition-transform ${
                isYearly ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly <Badge variant="secondary" className="ml-2">Save $51</Badge>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {isLoading || subLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="p-8 border border-border shadow-soft">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            tiers?.map((tier, index) => {
              const isCurrent = isCurrentPlan(tier.id);
              const hasPriceId = getStripePriceId(tier.id, isYearly) !== null;
              
              return (
                <Card
                  key={tier.id}
                  className={`relative p-8 transition-all duration-300 hover:shadow-glow ${
                    isCurrent
                      ? "border-2 border-green-500 shadow-medium"
                      : tier.recommended 
                        ? "border-2 border-primary shadow-medium scale-105" 
                        : "border border-border shadow-soft hover:border-primary/50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-4 py-1 font-semibold shadow-medium">
                        <Check className="w-3 h-3 mr-1" /> YOUR PLAN
                      </Badge>
                    </div>
                  )}
                  {!isCurrent && tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 font-semibold shadow-medium">
                        <Star className="w-3 h-3 mr-1" /> RECOMMENDED
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrent
                        ? "bg-green-500 text-white"
                        : tier.recommended 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {tierIcons[tier.id] || <Sparkles className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">{tier.name}</h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold text-foreground">
                        ${isYearly ? Math.round(tier.yearly_price / 12) : tier.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {tier.price > 0 && isYearly && (
                      <p className="text-sm text-secondary font-medium mt-1">
                        ${tier.yearly_price}/year (save ${tier.price * 12 - tier.yearly_price})
                      </p>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-6">{tier.description}</p>

                  {tier.roi_max > 0 && (
                    <div className="bg-gusto-teal-light dark:bg-secondary/10 rounded-xl p-4 mb-6">
                      <p className="text-sm font-medium text-foreground mb-1">Potential Savings</p>
                      <p className="text-2xl font-display font-bold text-secondary">
                        ${tier.savings_min.toLocaleString()} - ${tier.savings_max.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ROI: {tier.roi_min}% - {tier.roi_max}%
                      </p>
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Settings className="w-4 h-4 mr-2" />
                      )}
                      Manage Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => tier.price === 0 ? navigate("/auth") : handleCheckout(tier.id)}
                      disabled={checkoutLoading === tier.id || !hasPriceId && tier.price > 0}
                      className={`w-full ${
                        tier.recommended
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium hover:shadow-glow"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {checkoutLoading === tier.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {tier.price === 0 ? "Start Free" : subscribed ? "Switch Plan" : "Get Started"}
                      {!checkoutLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* ROI Calculator */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Calculate Your Savings
            </h2>
            <p className="text-muted-foreground">
              See exactly how much you could save based on your Vine income
            </p>
          </div>

          <Card className="p-8 border border-border shadow-medium">
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-4">
                Your Estimated Vine Income (ETV/year)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={vineIncome}
                  onValueChange={setVineIncome}
                  min={5000}
                  max={150000}
                  step={1000}
                  className="flex-1"
                />
                <div className="w-32 text-right">
                  <span className="text-2xl font-display font-bold text-primary">
                    ${vineIncome[0].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Savings Breakdown */}
              <div>
                <h4 className="font-display font-bold text-foreground mb-4">What You Could Save</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">50/20/0 deduction</span>
                    <span className="font-semibold text-foreground">${Math.round(savings.fiftyTwentyZero).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Home office</span>
                    <span className="font-semibold text-foreground">${Math.round(savings.homeOffice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Mileage tracking</span>
                    <span className="font-semibold text-foreground">${Math.round(savings.mileage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Missed deductions</span>
                    <span className="font-semibold text-foreground">${Math.round(savings.missed).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">H&R Block fee saved</span>
                    <span className="font-semibold text-foreground">${savings.hrBlock}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Time saved (40hrs × $25)</span>
                    <span className="font-semibold text-foreground">${Math.round(savings.time).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ROI Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6">
                <h4 className="font-display font-bold text-foreground mb-6">Your ROI</h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Investment</p>
                    <p className="text-2xl font-display font-bold text-foreground">$348/year</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Total Potential Savings</p>
                    <p className="text-3xl font-display font-bold text-secondary">
                      ${Math.round(savings.total).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Return on Investment</p>
                    <p className="text-4xl font-display font-bold text-primary">
                      {roiPercentage}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Every $1 spent = ${Math.round(savings.total / yearlySubscription)} back
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate("/auth")}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-medium hover:shadow-glow"
                >
                  Start Saving Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
            What Vine Members Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Saved me $3,200 in year 1! I was paying taxes on my full $45K ETV. The $29/month paid for itself in the first month!",
                author: "Sarah M.",
                detail: "Vine Voice since 2019"
              },
              {
                quote: "Kept my SSDI benefits! I was about to lose my disability benefits because I didn't know about the 60-hour rule. Worth 100x the price.",
                author: "Michael T.",
                detail: "SSDI + Vine member"
              },
              {
                quote: "Replaced my $600 CPA. Now I pay $348 and get BETTER reports. Plus it works all year, not just tax season!",
                author: "Jennifer K.",
                detail: "4 years on Vine"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 border border-border shadow-soft">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gusto-yellow text-gusto-yellow" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-display font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.detail}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2024 NomadTaxes. Built with ❤️ for Vine members.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
