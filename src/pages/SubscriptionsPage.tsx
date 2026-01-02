import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { SubscriptionTracker } from "@/components/subscriptions/SubscriptionTracker";
import { supabase } from "@/integrations/supabase/client";

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Subscriptions & Digital Assets</h1>
          </div>
          <nav className="flex items-center gap-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tax-forms">Tax Forms</NavLink>
            <NavLink to="/tax-rules">Tax Rules</NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <SubscriptionTracker userId={userId} />
      </main>
    </div>
  );
}
