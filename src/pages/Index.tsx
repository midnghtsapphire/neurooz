import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Grape, LogOut, Settings, LayoutDashboard, Plus, Sparkles, DollarSign, CheckCircle, FolderKanban, Calendar, ClipboardList, FileText, TrendingUp, Package, Calculator } from "lucide-react";
import PricingManager from "@/components/PricingManager";
import { toast } from "sonner";
import magnoliaFlowers from "@/assets/magnolia-flowers.png";
import { FloatingPetals } from "@/components/FloatingPetals";
import { PicketFence, GardenGate } from "@/components/PicketFence";
import { MagnoliaSplash } from "@/components/MagnoliaSplash";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
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

  // Open gate after splash
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => setGateOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

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
      <>
        {showSplash && <MagnoliaSplash onComplete={() => setShowSplash(false)} duration={3500} />}
        
        <div className={`min-h-screen vine-section relative overflow-hidden transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
          <FloatingPetals count={20} />
          
          {/* Garden Gate Welcome */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
            <GardenGate isOpen={gateOpen} className="scale-75 opacity-60" />
          </div>
          
          {/* Hero Section */}
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Grape className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">VineTaxes</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate("/projects")}
                  variant="ghost"
                  className="font-medium"
                >
                  Projects
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft hover:shadow-medium transition-all"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </header>

        <main className="container mx-auto px-6 relative">
          {/* Decorative Magnolia Flowers */}
          <img 
            src={magnoliaFlowers} 
            alt="" 
            className="absolute top-0 right-0 w-48 lg:w-64 opacity-40 pointer-events-none select-none transform translate-x-1/4 -translate-y-8"
            aria-hidden="true"
          />
          <img 
            src={magnoliaFlowers} 
            alt="" 
            className="absolute top-1/3 left-0 w-40 lg:w-56 opacity-30 pointer-events-none select-none transform -translate-x-1/3 rotate-12"
            aria-hidden="true"
          />

          {/* Hero */}
          <section className="py-20 lg:py-32 text-center relative z-10">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Tax tracking that grows with you
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6 text-balance">
                Organize your taxes,{" "}
                <span className="text-primary">harvest peace of mind</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                From W2s to 1099s, freelance gigs to passive income — 
                VineTaxes helps you cultivate order from tax season chaos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/projects")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-medium hover:shadow-glow transition-all h-14 px-8 text-lg"
                >
                  View Projects
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  variant="outline"
                  size="lg"
                  className="border-2 border-border hover:border-primary hover:text-primary font-semibold h-14 px-8 text-lg transition-all"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 border-t border-border relative">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <FeatureCard
                icon={<FolderKanban className="w-6 h-6" />}
                title="Project Tracking"
                description="Organize your work into projects with custom colors and keep everything in one place."
              />
              <FeatureCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Action Items"
                description="Create tasks with priorities and due dates. Check them off as you complete them."
              />
              <FeatureCard
                icon={<Calendar className="w-6 h-6" />}
                title="Stay on Schedule"
                description="Never miss a deadline with due date tracking and priority-based organization."
              />
            </div>
            
            {/* Decorative Picket Fence with flowers and gate */}
            <PicketFence className="h-24 opacity-80" showFlowers={true} showGate={true} />
          </section>
        </main>

        {/* Footer with fence and flowers */}
        <footer className="border-t border-border pt-4 mt-20 relative">
          <PicketFence className="h-20 opacity-60" showFlowers={true} />
          <div className="container mx-auto px-6 py-6 text-center text-muted-foreground relative z-10 bg-gradient-to-t from-background to-transparent">
            <p>© 2024 VineTaxes. Cultivating tax clarity.</p>
          </div>
        </footer>
        </div>
      </>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Magnolia Flowers */}
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute top-20 right-0 w-40 lg:w-56 opacity-25 pointer-events-none select-none transform translate-x-1/4"
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute bottom-20 left-0 w-36 lg:w-48 opacity-20 pointer-events-none select-none transform -translate-x-1/4 rotate-180"
        aria-hidden="true"
      />
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
