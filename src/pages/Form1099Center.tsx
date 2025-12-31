import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Grape, ArrowLeft, FileText, Users, Building2, 
  DollarSign, CreditCard, PiggyBank, Church, Heart
} from "lucide-react";
import { useBusinessesExtended } from "@/hooks/use-businesses-extended";
import { Form1099NECTracker } from "@/components/tax-forms/Form1099NECTracker";
import { Form1099BoxReference } from "@/components/tax-forms/Form1099BoxReference";

export default function Form1099Center() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const { businesses, isLoading: businessesLoading, forProfitBusinesses, nonprofitOrgs, churches } = useBusinessesExtended();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Set default business
  useEffect(() => {
    if (businesses.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'church': return <Church className="h-4 w-4" />;
      case 'nonprofit': return <Heart className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getEntityBadge = (entityType: string, is501c3: boolean) => {
    if (entityType === 'church') return <Badge variant="secondary">Church</Badge>;
    if (entityType === 'nonprofit' && is501c3) return <Badge variant="secondary">501(c)(3)</Badge>;
    if (entityType === 'nonprofit') return <Badge variant="outline">Nonprofit</Badge>;
    return <Badge variant="outline">For-Profit</Badge>;
  };

  if (loading || businessesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Grape className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">1099 Form Center</span>
            </div>
          </div>
          
          {/* Entity Selector */}
          {businesses.length > 0 && (
            <div className="flex items-center gap-3">
              <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select entity..." />
                </SelectTrigger>
                <SelectContent>
                  {forProfitBusinesses.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">For-Profit</div>
                      {forProfitBusinesses.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {b.name}
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                  {nonprofitOrgs.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Nonprofits</div>
                      {nonprofitOrgs.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            {b.name}
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                  {churches.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Churches</div>
                      {churches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          <div className="flex items-center gap-2">
                            <Church className="h-4 w-4" />
                            {b.name}
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {selectedBusiness && getEntityBadge(selectedBusiness.entity_type, selectedBusiness.is_501c3)}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {businesses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Businesses Set Up</h3>
                <p className="text-muted-foreground mb-4">
                  Add your businesses first to track 1099 payments
                </p>
                <Button onClick={() => navigate("/business-setup")}>
                  Set Up Business
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  1099 Forms & Contractor Payments
                </h1>
                <p className="text-muted-foreground">
                  Track payments to contractors, generate 1099 forms, and manage recipient information for {selectedBusiness?.name}
                </p>
              </div>

              <Tabs defaultValue="nec-tracker" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                  <TabsTrigger value="nec-tracker" className="gap-2">
                    <Users className="h-4 w-4" />
                    1099-NEC
                  </TabsTrigger>
                  <TabsTrigger value="misc-k" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    MISC / K
                  </TabsTrigger>
                  <TabsTrigger value="int-div" className="gap-2">
                    <PiggyBank className="h-4 w-4" />
                    INT / DIV
                  </TabsTrigger>
                  <TabsTrigger value="reference" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Box Reference
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nec-tracker">
                  <Form1099NECTracker businessId={selectedBusinessId} />
                </TabsContent>

                <TabsContent value="misc-k">
                  <Card>
                    <CardHeader>
                      <CardTitle>1099-MISC & 1099-K Tracking</CardTitle>
                      <CardDescription>
                        Track miscellaneous income (rents, royalties) and payment processor income
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form1099BoxReference formType="1099-MISC" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="int-div">
                  <Card>
                    <CardHeader>
                      <CardTitle>1099-INT & 1099-DIV Tracking</CardTitle>
                      <CardDescription>
                        Track interest and dividend income received
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form1099BoxReference formType="1099-INT" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reference">
                  <Form1099BoxReference />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
