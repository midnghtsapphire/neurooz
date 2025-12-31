import { NavLink } from "@/components/NavLink";
import { FloatingPetals } from "@/components/FloatingPetals";
import { TaxDeductionRulesPanel } from "@/components/tax-rules/TaxDeductionRulesPanel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TaxRules() {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-semibold">Tax Deduction Rules</h1>
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
        <TaxDeductionRulesPanel />
      </main>
    </div>
  );
}