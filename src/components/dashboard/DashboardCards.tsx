import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BrainMeleeReviewCard from "./BrainMeleeReviewCard";
import BusinessWizardCard from "./BusinessWizardCard";
import ProjectsQuickCard from "./ProjectsQuickCard";
import WellnessPlanCard from "./WellnessPlanCard";
import { useBusinesses } from "@/hooks/use-businesses";

export function DashboardCards() {
  const navigate = useNavigate();
  const { data: businesses = [] } = useBusinesses();
  const activeBusiness = businesses.find(b => b.is_active);

  const handleStartMelee = () => {
    navigate("/onboarding");
  };

  const handleCreateWellnessPlan = (type: "exercise" | "meal") => {
    toast.success(`Creating ${type} plan...`, {
      description: "This feature will be available soon!"
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <BrainMeleeReviewCard onStartMelee={handleStartMelee} />
      <BusinessWizardCard 
        hasExistingBusiness={!!activeBusiness}
        businessName={activeBusiness?.name}
      />
      <ProjectsQuickCard />
      <WellnessPlanCard onCreatePlan={handleCreateWellnessPlan} />
    </div>
  );
}

export default DashboardCards;
