import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grape, ArrowLeft, FileText, GraduationCap, BookOpen, Printer } from "lucide-react";
import { Section127PlanTemplate } from "@/components/employer-benefits/Section127PlanTemplate";
import { EmployerEducationTracker } from "@/components/employer-benefits/EmployerEducationTracker";
import { W2BoxReference } from "@/components/employer-benefits/W2BoxReference";
import { W2Generator } from "@/components/employer-benefits/W2Generator";

export default function EmployerBenefitsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  if (loading) {
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
              <span className="text-xl font-display font-bold text-foreground">Employer Education Benefits</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Section 127 Educational Assistance
            </h1>
            <p className="text-muted-foreground">
              Manage your employer educational assistance program. Provide up to $5,250 tax-free per employee annually for tuition, books, or student loan payments.
            </p>
          </div>

          <Tabs defaultValue="tracker" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="tracker" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Payment Tracker
              </TabsTrigger>
              <TabsTrigger value="w2-generator" className="gap-2">
                <Printer className="h-4 w-4" />
                W-2 Generator
              </TabsTrigger>
              <TabsTrigger value="plan" className="gap-2">
                <FileText className="h-4 w-4" />
                Plan Template
              </TabsTrigger>
              <TabsTrigger value="w2-reference" className="gap-2">
                <BookOpen className="h-4 w-4" />
                W-2 Reference
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracker">
              <EmployerEducationTracker />
            </TabsContent>

            <TabsContent value="w2-generator">
              <W2Generator />
            </TabsContent>

            <TabsContent value="plan">
              <Section127PlanTemplate />
            </TabsContent>

            <TabsContent value="w2-reference">
              <W2BoxReference />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
