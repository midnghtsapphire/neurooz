import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Grape, LogOut, Settings, LayoutDashboard, Plus, Sparkles, DollarSign, CheckCircle, FolderKanban, Calendar } from "lucide-react";
import PricingManager from "@/components/PricingManager";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      <div className="min-h-screen bg-background">
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

        <main className="container mx-auto px-6">
          {/* Hero */}
          <section className="py-20 lg:py-32 text-center">
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
          <section className="py-20 border-t border-border">
            <div className="grid md:grid-cols-3 gap-8">
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
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-20">
          <div className="container mx-auto px-6 text-center text-muted-foreground">
            <p>© 2024 VineTaxes. Cultivating tax clarity.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-background">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <DashboardCard
              title="Projects"
              description="Manage your projects and action items"
              icon={<FolderKanban className="w-5 h-5" />}
              action="View Projects"
              onClick={() => navigate("/projects")}
            />
            <DashboardCard
              title="Tax Profile"
              description="Set up your filing status and income types"
              icon={<Settings className="w-5 h-5" />}
              action="Configure"
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
  <div className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-300 group animate-fade-in">
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
  <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-300 group">
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
