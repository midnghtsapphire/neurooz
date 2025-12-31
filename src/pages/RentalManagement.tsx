import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Users, Receipt, ArrowLeftRight } from "lucide-react";
import { RentalInventoryTab } from "@/components/rental/RentalInventoryTab";
import { RentalTransactionsTab } from "@/components/rental/RentalTransactionsTab";
import { RentalCustomersTab } from "@/components/rental/RentalCustomersTab";
import { InterCompanyTransfersTab } from "@/components/rental/InterCompanyTransfersTab";
import magnoliaFlowers from "@/assets/magnolia-flowers.png";

const RentalManagement = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Magnolia Flowers */}
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute top-24 right-0 w-44 opacity-20 pointer-events-none select-none transform translate-x-1/3"
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute bottom-10 left-0 w-40 opacity-15 pointer-events-none select-none transform -translate-x-1/3 rotate-180"
        aria-hidden="true"
      />
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Rocky Mountain Rentals
              </h1>
              <p className="text-sm text-muted-foreground">
                Rental Inventory Management System
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="transfers" className="gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline">Transfers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <RentalInventoryTab userId={user.id} />
          </TabsContent>

          <TabsContent value="transactions">
            <RentalTransactionsTab userId={user.id} />
          </TabsContent>

          <TabsContent value="customers">
            <RentalCustomersTab userId={user.id} />
          </TabsContent>

          <TabsContent value="transfers">
            <InterCompanyTransfersTab userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RentalManagement;
