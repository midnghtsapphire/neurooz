import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
