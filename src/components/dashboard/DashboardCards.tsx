import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BrainDumpReviewCard from "@/components/TornadoAlley/BrainDumpReviewCard";
import BusinessWizardCard from "./BusinessWizardCard";
import ProjectsQuickCard from "./ProjectsQuickCard";
import WellnessPlanCard from "./WellnessPlanCard";
import MaintenanceRoutineCard from "./MaintenanceRoutineCard";
import AssetTrackingCard from "./AssetTrackingCard";
import VineProductCard from "./VineProductCard";
import { useBusinesses } from "@/hooks/use-businesses";

export function DashboardCards() {
  const navigate = useNavigate();
  const { data: businesses = [] } = useBusinesses();
  const activeBusiness = businesses.find(b => b.is_active);

  const handleStartBrainDump = () => {
    navigate("/onboarding");
  };

  const handleCreateWellnessPlan = (type: "exercise" | "meal") => {
    toast.success(`Creating ${type} plan...`, {
      description: "This feature will be available soon!"
    });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BrainDumpReviewCard onStartBrainDump={handleStartBrainDump} />
      <BusinessWizardCard 
        hasExistingBusiness={!!activeBusiness}
        businessName={activeBusiness?.name}
      />
      <ProjectsQuickCard />
      <VineProductCard />
      <MaintenanceRoutineCard />
      <AssetTrackingCard />
      <WellnessPlanCard onCreatePlan={handleCreateWellnessPlan} />
    </div>
  );
}

export default DashboardCards;
