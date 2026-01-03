import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/hooks/use-accessibility";
import { FloatingTornadoButton } from "@/components/FloatingTornadoButton";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import BusinessSetup from "./pages/BusinessSetup";
import TaxFormEditor from "./pages/TaxFormEditor";
import SavedForms from "./pages/SavedForms";
import VineTracker from "./pages/VineTracker";
import RentalManagement from "./pages/RentalManagement";
import TaxRules from "./pages/TaxRules";
import DonationTrackerPage from "./pages/DonationTrackerPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import TaxCreditsCalculatorPage from "./pages/TaxCreditsCalculatorPage";
import EmployerBenefitsPage from "./pages/EmployerBenefitsPage";
import Form1099Center from "./pages/Form1099Center";
import BusinessStructureCalculatorPage from "./pages/BusinessStructureCalculatorPage";
import OzEngine from "./pages/OzEngine";
import TheCrossing from "./pages/TheCrossing";
import Onboarding from "./pages/Onboarding";
import ERDashboard from "./pages/ERDashboard";
import TerritoryView from "./pages/TerritoryView";
import QuestRunner from "./pages/QuestRunner";
import ERSettings from "./pages/ERSettings";
import CompanyWizard from "./pages/CompanyWizard";
import TaxWizardPro from "./pages/TaxWizardPro";
import TornadoAlley from "./pages/TornadoAlley";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          {/* Emergency tornado button - always visible */}
          <FloatingTornadoButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard/*" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/business-setup" element={<BusinessSetup />} />
            <Route path="/tax-forms" element={<TaxFormEditor />} />
            <Route path="/tax-forms/edit/:formId" element={<TaxFormEditor />} />
            <Route path="/saved-forms" element={<SavedForms />} />
            <Route path="/vine-tracker" element={<VineTracker />} />
            <Route path="/rental-management" element={<RentalManagement />} />
            <Route path="/tax-rules" element={<TaxRules />} />
            <Route path="/donations" element={<DonationTrackerPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/tax-credits-calculator" element={<TaxCreditsCalculatorPage />} />
            <Route path="/employer-benefits" element={<EmployerBenefitsPage />} />
            <Route path="/1099-center" element={<Form1099Center />} />
            <Route path="/structure-calculator" element={<BusinessStructureCalculatorPage />} />
            <Route path="/oz-engine" element={<OzEngine />} />
            <Route path="/the-crossing" element={<TheCrossing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/er-dashboard" element={<ERDashboard />} />
            <Route path="/territory/:id" element={<TerritoryView />} />
            <Route path="/quest/:id" element={<QuestRunner />} />
            <Route path="/er-settings" element={<ERSettings />} />
            <Route path="/company-wizard" element={<CompanyWizard />} />
            <Route path="/tax-wizard" element={<TaxWizardPro />} />
            <Route path="/tornado-alley" element={<TornadoAlley />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/*" element={<Learn />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
