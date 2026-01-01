import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WIZARD_STEPS, type CompanyFormData } from "@/lib/company-wizard-data";
import { EntityTypeStep } from "@/components/company-wizard/EntityTypeStep";
import { BasicInfoStep } from "@/components/company-wizard/BasicInfoStep";
import { EinStep } from "@/components/company-wizard/EinStep";
import { OwnershipStep } from "@/components/company-wizard/OwnershipStep";
import { AddressStep } from "@/components/company-wizard/AddressStep";
import { ReviewStep } from "@/components/company-wizard/ReviewStep";
import { ArrowLeft, ArrowRight, Building2, Check, Save, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STORAGE_KEY = "company-wizard-draft";

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
  const [hasDraft, setHasDraft] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { step: savedStep, formData: savedData } = JSON.parse(saved);
        setStep(savedStep || 1);
        setFormData({ ...initialFormData, ...savedData });
        setHasDraft(true);
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    const hasContent = formData.entityType || formData.companyName;
    if (hasContent) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }));
      setHasDraft(true);
    }
  }, [step, formData]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setStep(1);
    setHasDraft(false);
    toast.success("Draft cleared");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.entityType;
      case 2: return !!formData.companyName && !!formData.state;
      case 3: return true;
      case 4: return formData.members.some(m => m.name);
      case 5: return !!formData.address.street1 && !!formData.address.city && !!formData.address.state && !!formData.address.zip;
      case 6: return true;
      default: return true;
    }
  };

  const handleNext = useCallback(() => {
    if (step < 6 && canProceed()) setStep(step + 1);
  }, [step, formData]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (canProceed() && step < 6) handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        if (step > 1) handleBack();
      } else if (e.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, formData, handleNext, handleBack, navigate]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    localStorage.removeItem(STORAGE_KEY); // Clear draft after generation
    toast.success("Document package generated! Check your downloads.");
    setIsGenerating(false);
  };

  const currentStepInfo = WIZARD_STEPS[step - 1];
  const progressPercent = ((step - 1) / (WIZARD_STEPS.length - 1)) * 100;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-night-emerald">
        {/* Header */}
        <header className="border-b border-emerald-gold/20 bg-night-emerald/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-gold flex items-center justify-center">
                <Building2 className="w-6 h-6 text-night-emerald" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-clean-white">Company Wizard</span>
                {hasDraft && (
                  <span className="ml-3 text-xs text-emerald-gold flex items-center gap-1">
                    <Save className="w-3 h-3" /> Draft saved
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasDraft && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={clearDraft} className="text-moon-silver hover:text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear draft and start over</TooltipContent>
                </Tooltip>
              )}
              <Button variant="ghost" onClick={() => navigate(-1)} className="text-moon-silver">
                Exit
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-moon-silver">Step {step} of {WIZARD_STEPS.length}</span>
              <span className="text-sm text-emerald-gold">{Math.round(progressPercent)}% complete</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-muted" />
          </div>

          {/* Step Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-clean-white">{currentStepInfo.title}</h1>
            <p className="text-moon-silver mt-1">{currentStepInfo.description}</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => s.id <= step && setStep(s.id)}
                      disabled={s.id > step}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        step === s.id ? "bg-emerald-gold text-night-emerald ring-2 ring-emerald-gold/50 ring-offset-2 ring-offset-night-emerald" :
                        step > s.id ? "bg-emerald-gold/20 text-emerald-gold cursor-pointer hover:bg-emerald-gold/30" : 
                        "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </TooltipContent>
                </Tooltip>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 mx-1 transition-colors",
                    step > s.id ? "bg-emerald-gold/40" : "bg-muted"
                  )} />
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
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1} 
              className="gap-2 border-moon-silver/30 text-moon-silver hover:bg-moon-silver/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            
            {step < 6 ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()} 
                className="gap-2 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="text-xs text-moon-silver/60">
                Use keyboard: ← → to navigate, Esc to exit
              </div>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-xs text-moon-silver/40 mt-4">
            Tip: Use arrow keys to navigate between steps
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CompanyWizard;
