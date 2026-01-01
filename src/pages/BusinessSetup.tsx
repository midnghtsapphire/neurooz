import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Loader2, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import magnoliaFlowers from "@/assets/magnolia-flowers.png";
import { supabase } from "@/integrations/supabase/client";
import { BusinessStructureStep } from "@/components/business-setup/BusinessStructureStep";
import { RoleSelectionStep } from "@/components/business-setup/RoleSelectionStep";
import { PersonalInfoStep, PersonalInfoData } from "@/components/business-setup/PersonalInfoStep";
import { CapitalContributionStep, CapitalContributionData } from "@/components/business-setup/CapitalContributionStep";
import { TaxFormsStep } from "@/components/business-setup/TaxFormsStep";
import { 
  BusinessStructure, 
  BusinessRole, 
  useCreateBusiness, 
  useCreateBusinessMember,
  useCreateTaxForm 
} from "@/hooks/use-businesses";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, name: "Business Structure" },
  { id: 2, name: "Your Role" },
  { id: 3, name: "Personal Info" },
  { id: 4, name: "Capital" },
  { id: 5, name: "Tax Forms" },
];

const initialPersonalInfo: PersonalInfoData = {
  businessName: "",
  fullName: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  ssnLastFour: "",
  ownershipPercentage: 100,
  isPassive: false,
  ein: "",
};

const initialCapitalContribution: CapitalContributionData = {
  totalCapital: 0,
  managingMemberShare: 0,
  passiveMemberShare: 0,
  customAmount: "",
};

export default function BusinessSetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [businessStructure, setBusinessStructure] = useState<BusinessStructure | null>(null);
  const [role, setRole] = useState<BusinessRole | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(initialPersonalInfo);
  const [capitalContribution, setCapitalContribution] = useState<CapitalContributionData>(initialCapitalContribution);

  // Mutations
  const createBusiness = useCreateBusiness();
  const createMember = useCreateBusinessMember();
  const createTaxForm = useCreateTaxForm();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      setPersonalInfo(prev => ({ ...prev, email: user.email || "" }));
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!businessStructure;
      case 2:
        return !!role;
      case 3:
        return personalInfo.fullName && personalInfo.email && personalInfo.addressLine1 && 
               personalInfo.city && personalInfo.state && personalInfo.zipCode;
      case 4:
        return capitalContribution.totalCapital >= 10;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!userId || !businessStructure || !role) return;

    try {
      // Create the business
      const business = await createBusiness.mutateAsync({
        user_id: userId,
        name: personalInfo.businessName || `${personalInfo.fullName}'s Business`,
        structure: businessStructure,
        ein: personalInfo.ein || null,
        state: personalInfo.state || null,
        formation_date: null,
        is_active: true,
      });

      // Create member record
      await createMember.mutateAsync({
        business_id: business.id,
        user_id: userId,
        name: personalInfo.fullName,
        email: personalInfo.email,
        role: role,
        ownership_percentage: personalInfo.ownershipPercentage,
        is_passive: personalInfo.isPassive,
        ssn_last_four: personalInfo.ssnLastFour || null,
        address_line1: personalInfo.addressLine1 || null,
        address_line2: personalInfo.addressLine2 || null,
        city: personalInfo.city || null,
        state: personalInfo.state || null,
        zip_code: personalInfo.zipCode || null,
      });

      toast({
        title: "Setup Complete!",
        description: "Your business has been configured. You can now manage your tax forms.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error completing setup:", error);
    }
  };

  const handleStartForm = (formType: string) => {
    toast({
      title: `Opening ${formType}`,
      description: "Tax form editor coming soon. For now, this form has been added to your tracking list.",
    });
    // TODO: Navigate to form editor or open form dialog
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen vine-section relative overflow-hidden">
      {/* Decorative Magnolias */}
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute top-32 right-0 w-44 opacity-20 pointer-events-none select-none transform translate-x-1/3"
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute bottom-32 left-0 w-36 opacity-15 pointer-events-none select-none transform -translate-x-1/4 rotate-180"
        aria-hidden="true"
      />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Business Setup</h1>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < STEPS.length - 1 ? "flex-1" : ""}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="ml-2 text-sm hidden sm:inline">{step.name}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-muted mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Company Wizard Card - Always visible on step 1 */}
        {currentStep === 1 && (
          <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                  <Wand2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Company Formation Wizard</CardTitle>
                  <CardDescription>
                    Full-service company setup with documents, EIN guidance, and Secretary of State links
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Operating Agreement & Articles of Organization</li>
                  <li>• EIN Application Assistance (IRS link)</li>
                  <li>• State Filing Links & Fee Information</li>
                  <li>• Tax Forms Checklist & Compliance Calendar</li>
                </ul>
                <Button 
                  onClick={() => navigate("/company-wizard")}
                  className="gap-2 shrink-0"
                  size="lg"
                >
                  Start Wizard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <BusinessStructureStep
            selected={businessStructure}
            onSelect={setBusinessStructure}
          />
        )}

        {currentStep === 2 && businessStructure && (
          <RoleSelectionStep
            businessStructure={businessStructure}
            selected={role}
            onSelect={setRole}
          />
        )}

        {currentStep === 3 && role && (
          <PersonalInfoStep
            role={role}
            data={personalInfo}
            onChange={setPersonalInfo}
          />
        )}

        {currentStep === 4 && (
          <CapitalContributionStep
            data={capitalContribution}
            onChange={setCapitalContribution}
          />
        )}

        {currentStep === 5 && businessStructure && role && (
          <TaxFormsStep
            businessStructure={businessStructure}
            role={role}
            onStartForm={handleStartForm}
          />
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={createBusiness.isPending || createMember.isPending}
              >
                {createBusiness.isPending || createMember.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
