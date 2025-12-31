import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { FloatingPetals } from "@/components/FloatingPetals";
import { TaxDeductionRulesPanel } from "@/components/tax-rules/TaxDeductionRulesPanel";
import { TaxLawChangesPanel } from "@/components/tax-rules/TaxLawChangesPanel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, History } from "lucide-react";

export default function TaxRules() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deductions");

  return (
    <div className="min-h-screen bg-background">
      <FloatingPetals />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Tax Rules & Law Changes</h1>
          </div>
          <nav className="flex items-center gap-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tax-forms">Tax Forms</NavLink>
            <NavLink to="/vine-tracker">Vine Tracker</NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="deductions" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Deduction Rules
            </TabsTrigger>
            <TabsTrigger value="tcja" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              TCJA Changes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deductions">
            <TaxDeductionRulesPanel />
          </TabsContent>

          <TabsContent value="tcja">
            <TaxLawChangesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}