import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Coffee, 
  Check, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Building2,
  Sparkles,
  ArrowRight,
  Star
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  recommended?: boolean;
  icon: React.ReactNode;
  savingsRange: [number, number];
  roi: [number, number];
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    yearlyPrice: 0,
    description: "Get started with basic tax tracking",
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      "Track up to 50 products",
      "Basic tax summary",
      "See potential savings (teaser)",
      "Tax education content",
      "Community forum access"
    ],
    savingsRange: [0, 0],
    roi: [0, 0]
  },
  {
    id: "tax-smart",
    name: "Tax Smart",
    price: 29,
    yearlyPrice: 297,
    description: "Everything you need to maximize deductions",
    icon: <Calculator className="w-6 h-6" />,
    recommended: true,
    features: [
      "Unlimited products & transactions",
      "50/20/0 auto-calculation",
      "Receipt upload with OCR",
      "Mileage tracking",
      "Home office deduction calculator",
      "Schedule C auto-generation",
      "Form 8995 (QBI deduction)",
      "Quarterly tax estimates",
      "Tax form exports (PDF/Excel)",
      "Mobile app access",
      "Email support"
    ],
    savingsRange: [4300, 7900],
    roi: [1135, 2171]
  },
  {
    id: "business-builder",
    name: "Business Builder",
    price: 39,
    yearlyPrice: 397,
    description: "For serious Vine businesses with complex needs",
    icon: <Building2 className="w-6 h-6" />,
    features: [
      "Everything in Tax Smart",
      "Multi-entity tracking (up to 3 LLCs)",
      "S-Corp vs LLC comparison calculator",
      "K-1 generation (partnerships)",
      "Rental property tracking (Schedule E)",
      "Team members (up to 3 users)",
      "Bank sync via Plaid",
      "Payroll integration",
      "Business structure optimization",
      "Workflow automation",
      "Priority support (24hr response)"
    ],
    savingsRange: [14300, 17000],
    roi: [2955, 3533]
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [vineIncome, setVineIncome] = useState([35000]);

  const calculateSavings = (income: number) => {
    // Rough estimate based on income
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Coffee className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">NomadTaxes</span>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
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
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.id}
              className={`relative p-8 transition-all duration-300 hover:shadow-glow ${
                tier.recommended 
                  ? "border-2 border-primary shadow-medium scale-105" 
                  : "border border-border shadow-soft hover:border-primary/50"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 font-semibold shadow-medium">
                    <Star className="w-3 h-3 mr-1" /> RECOMMENDED
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  tier.recommended 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {tier.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">{tier.name}</h3>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-foreground">
                    ${isYearly ? Math.round(tier.yearlyPrice / 12) : tier.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {tier.price > 0 && isYearly && (
                  <p className="text-sm text-secondary font-medium mt-1">
                    ${tier.yearlyPrice}/year (save ${tier.price * 12 - tier.yearlyPrice})
                  </p>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{tier.description}</p>

              {tier.roi[1] > 0 && (
                <div className="bg-gusto-teal-light dark:bg-secondary/10 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-foreground mb-1">Potential Savings</p>
                  <p className="text-2xl font-display font-bold text-secondary">
                    ${tier.savingsRange[0].toLocaleString()} - ${tier.savingsRange[1].toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ROI: {tier.roi[0]}% - {tier.roi[1]}%
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

              <Button
                onClick={() => navigate("/auth")}
                className={`w-full ${
                  tier.recommended
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium hover:shadow-glow"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {tier.price === 0 ? "Start Free" : "Get Started"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
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
