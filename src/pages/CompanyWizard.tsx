import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WIZARD_STEPS, type CompanyFormData } from "@/lib/company-wizard-data";
import { EntityTypeStep } from "@/components/company-wizard/EntityTypeStep";
import { BasicInfoStep } from "@/components/company-wizard/BasicInfoStep";
import { EinStep } from "@/components/company-wizard/EinStep";
import { OwnershipStep } from "@/components/company-wizard/OwnershipStep";
import { AddressStep } from "@/components/company-wizard/AddressStep";
import { ReviewStep } from "@/components/company-wizard/ReviewStep";
import { ArrowLeft, ArrowRight, Building2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const initialFormData: CompanyFormData = {
  entityType: "",
  companyName: "",
  state: "",
  formationDate: "",
  hasEin: "later",
  ein: "",
  members: [{ name: "", email: "", ownershipPercent: 100, role: "managing_member" }],
  address: { street1: "", street2: "", city: "", state: "", zip: "" },
  electSCorp: false,
  documentsGenerated: [],
};

const CompanyWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.entityType;
      case 2: return !!formData.companyName && !!formData.state;
      case 3: return true;
      case 4: return formData.members.some(m => m.name);
      case 5: return !!formData.address.street1 && !!formData.address.city;
      case 6: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Document package generated! Check your downloads.");
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-night-emerald">
      {/* Header */}
      <header className="border-b border-emerald-gold/20 bg-night-emerald/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-gold flex items-center justify-center">
              <Building2 className="w-6 h-6 text-night-emerald" />
            </div>
            <span className="text-xl font-display font-bold text-clean-white">Company Wizard</span>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-moon-silver">
            Exit
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step === s.id ? "bg-emerald-gold text-night-emerald" :
                  step > s.id ? "bg-emerald-gold/20 text-emerald-gold" : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </button>
              {i < WIZARD_STEPS.length - 1 && (
                <div className={cn("w-8 h-0.5 mx-1", step > s.id ? "bg-emerald-gold/40" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-dark-emerald/30 rounded-2xl border border-emerald-gold/20 p-6">
          {step === 1 && <EntityTypeStep value={formData.entityType} onChange={(v) => setFormData({ ...formData, entityType: v })} />}
          {step === 2 && <BasicInfoStep companyName={formData.companyName} state={formData.state} formationDate={formData.formationDate} entityType={formData.entityType} onCompanyNameChange={(v) => setFormData({ ...formData, companyName: v })} onStateChange={(v) => setFormData({ ...formData, state: v })} onFormationDateChange={(v) => setFormData({ ...formData, formationDate: v })} />}
          {step === 3 && <EinStep hasEin={formData.hasEin} ein={formData.ein} onHasEinChange={(v) => setFormData({ ...formData, hasEin: v })} onEinChange={(v) => setFormData({ ...formData, ein: v })} />}
          {step === 4 && <OwnershipStep members={formData.members} entityType={formData.entityType} onMembersChange={(v) => setFormData({ ...formData, members: v })} />}
          {step === 5 && <AddressStep address={formData.address} onAddressChange={(v) => setFormData({ ...formData, address: v })} />}
          {step === 6 && <ReviewStep formData={formData} electSCorp={formData.electSCorp} onElectSCorpChange={(v) => setFormData({ ...formData, electSCorp: v })} onGenerate={handleGenerate} isGenerating={isGenerating} />}
        </div>

        {/* Navigation */}
        {step < 6 && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack} disabled={step === 1} className="gap-2 border-moon-silver/30 text-moon-silver">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()} className="gap-2 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyWizard;
