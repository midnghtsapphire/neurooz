import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Grape, LogOut, Settings, LayoutDashboard, Plus, Sparkles, DollarSign, CheckCircle, FolderKanban, Calendar, ClipboardList, FileText, TrendingUp, Package, Calculator, GraduationCap, Receipt, Gift, CreditCard, Building2 } from "lucide-react";
import PricingManager from "@/components/PricingManager";
import { toast } from "sonner";
import emeraldRoadHero from "@/assets/emerald-road-hero.jpg";
import { PicketFence, GardenGate } from "@/components/PicketFence";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [gateOpen, setGateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Open gate after load
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setGateOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-night-emerald relative overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0">
          <img 
            src={emeraldRoadHero}
            alt="Emerald Road OS Command Center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-emerald via-night-emerald/60 to-transparent" />
        </div>
        
        {/* Header */}
        <header className="relative z-50 border-b border-emerald-gold/20 bg-night-emerald/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-gold flex items-center justify-center">
                <Grape className="w-6 h-6 text-night-emerald" />
              </div>
              <span className="text-xl font-display font-bold text-clean-white">Emerald Road OS</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/onboarding")}
                variant="ghost"
                className="font-medium text-moon-silver hover:text-emerald-gold"
              >
                Start Journey
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-semibold shadow-soft hover:shadow-medium transition-all"
              >
                Enter
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <main className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <section className="text-center animate-fade-in -mt-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-clean-white leading-tight mb-4 tracking-tight">
              EMERALD ROAD OS
            </h1>
            <p className="text-xl md:text-2xl text-moon-silver mb-10 max-w-2xl mx-auto font-light">
              This is where real people rebuild real lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/onboarding")}
                size="lg"
                className="bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-bold shadow-medium hover:shadow-glow transition-all h-14 px-10 text-lg uppercase tracking-wider"
              >
                Enter The Crossing
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                size="lg"
                className="border-2 border-moon-silver/40 text-moon-silver hover:border-emerald-gold hover:text-emerald-gold font-semibold h-14 px-10 text-lg transition-all bg-transparent"
              >
                Sign In
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-emerald-gold/20 bg-night-emerald/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 text-center text-moon-silver/60">
            <p>© 2026 Emerald Road OS. This is where real people rebuild real lives.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-night-emerald relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-dark-emerald/30 rounded-full blur-3xl pointer-events-none" />
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Grape className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">VineTaxes</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mb-8">
            Here's your tax overview. Let's keep things organized.
          </p>

          {/* Quick Actions */}
          {/* Featured Tax Credits Calculator */}
          <div 
            onClick={() => navigate("/tax-credits-calculator")}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/30 shadow-medium hover:shadow-glow transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-soft group-hover:scale-110 transition-transform">
                <Calculator className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-display font-bold text-foreground mb-1">Tax Credits Calculator</h3>
                <p className="text-muted-foreground">Discover which tax credits you qualify for based on income, family size, and purchases. Includes Child Tax Credit, EITC, EV credits, and more.</p>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft"
                onClick={(e) => { e.stopPropagation(); navigate("/tax-credits-calculator"); }}
              >
                Calculate Now
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <DashboardCard
              title="Vine Tracker"
              description="Track monthly ETV with real-time SGA & TWP status"
              icon={<TrendingUp className="w-5 h-5" />}
              action="Open Tracker"
              onClick={() => navigate("/vine-tracker")}
            />
            <DashboardCard
              title="Rental Management"
              description="Manage inventory, rentals, and inter-company transfers"
              icon={<Package className="w-5 h-5" />}
              action="Open Rentals"
              onClick={() => navigate("/rental-management")}
            />
            <DashboardCard
              title="Projects"
              description="Manage your projects and action items"
              icon={<FolderKanban className="w-5 h-5" />}
              action="View Projects"
              onClick={() => navigate("/projects")}
            />
            <DashboardCard
              title="Business Setup"
              description="Configure your business structure and tax forms"
              icon={<Settings className="w-5 h-5" />}
              action="Get Started"
              onClick={() => navigate("/business-setup")}
            />
            <DashboardCard
              title="Tax Forms"
              description="Fill out W-4, W-9, 1099-NEC, and Schedule C forms"
              icon={<ClipboardList className="w-5 h-5" />}
              action="New Form"
              onClick={() => navigate("/tax-forms")}
            />
            <DashboardCard
              title="Saved Forms"
              description="View, edit, and export your completed tax forms"
              icon={<FileText className="w-5 h-5" />}
              action="View Forms"
              onClick={() => navigate("/saved-forms")}
            />
            <DashboardCard
              title="Income Sources"
              description="Add and manage your income sources"
              icon={<Plus className="w-5 h-5" />}
              action="Add Source"
            />
            <DashboardCard
              title="Reports"
              description="View summaries and export data"
              icon={<LayoutDashboard className="w-5 h-5" />}
              action="View Reports"
            />
            <DashboardCard
              title="Pricing"
              description="Manage subscription tiers and features"
              icon={<DollarSign className="w-5 h-5" />}
              action="Manage"
              onClick={() => navigate("/pricing")}
            />
            <DashboardCard
              title="Employer Education Benefits"
              description="Section 127 plan template & payment tracker"
              icon={<GraduationCap className="w-5 h-5" />}
              action="Manage Benefits"
              onClick={() => navigate("/employer-benefits")}
            />
            <DashboardCard
              title="1099 Center"
              description="Multi-entity 1099 tracking for NEC, MISC, K, INT/DIV"
              icon={<Receipt className="w-5 h-5" />}
              action="Open Center"
              onClick={() => navigate("/1099-center")}
            />
            <DashboardCard
              title="Donation Tracker"
              description="Track charitable donations and 8283 forms"
              icon={<Gift className="w-5 h-5" />}
              action="Track Donations"
              onClick={() => navigate("/donations")}
            />
            <DashboardCard
              title="Subscriptions"
              description="Track business subscriptions and digital assets"
              icon={<CreditCard className="w-5 h-5" />}
              action="Manage"
              onClick={() => navigate("/subscriptions")}
            />
            <DashboardCard
              title="Structure Calculator"
              description="Compare SE tax across all 5 business structures + Schedule A"
              icon={<Building2 className="w-5 h-5" />}
              action="Calculate"
              onClick={() => navigate("/structure-calculator")}
            />
          </div>

          {/* Pricing Manager Section */}
          <PricingManager />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-300 group animate-fade-in vine-border card-vine-glow">
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const DashboardCard = ({
  title,
  description,
  icon,
  action,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onClick?: () => void;
}) => (
  <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-300 group leaf-corner card-vine-glow">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-display font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
      onClick={onClick}
    >
      {action}
    </Button>
  </div>
);

export default Index;
