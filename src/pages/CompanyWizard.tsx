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
import { AccessibilityTrigger } from "@/components/accessibility/AccessibilityPanel";
import { useAccessibility, STEP_TIME_ESTIMATES } from "@/hooks/use-accessibility";
import { ArrowLeft, ArrowRight, Building2, Check, Save, X, Clock, PartyPopper, FileText } from "lucide-react";
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

// Map wizard step numbers to time estimate keys
const STEP_TIME_KEYS = [
  "entity-type",
  "basic-info", 
  "ein",
  "ownership",
  "address",
  "review"
];

const CompanyWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { settings } = useAccessibility();

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
    if (step >= 6) return;

    if (!canProceed()) {
      const message = (() => {
        switch (step) {
          case 1:
            return "Select a business structure to continue.";
          case 2:
            return "Enter a company name and select a state to continue.";
          case 4:
            return "Add at least one owner/member name to continue.";
          case 5:
            return "Complete the address fields (street, city, state, ZIP) to continue.";
          default:
            return "Complete this step to continue.";
        }
      })();

      toast.error(message);
      return;
    }

    setStep((s) => Math.min(6, s + 1));

    // Show mini celebration on step completion
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
  }, [step, formData]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (step < 6) handleNext();
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
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Document package generated! Check your downloads.");
    setIsGenerating(false);
  };

  const currentStepInfo = WIZARD_STEPS[step - 1];
  const progressPercent = ((step - 1) / (WIZARD_STEPS.length - 1)) * 100;
  const currentTimeEstimate = STEP_TIME_ESTIMATES[STEP_TIME_KEYS[step - 1]];
  
  // Calculate remaining time
  const remainingMinutes = STEP_TIME_KEYS
    .slice(step - 1)
    .reduce((acc, key) => acc + (STEP_TIME_ESTIMATES[key]?.minutes || 0), 0);

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
              <AccessibilityTrigger />
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

        <div className="container mx-auto px-6 py-8 max-w-3xl" id="main-content">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-moon-silver">Step {step} of {WIZARD_STEPS.length}</span>
              <div className="flex items-center gap-3">
                {settings.showTimeEstimates && (
                  <span className="time-estimate">
                    <Clock className="w-3 h-3" />
                    ~{remainingMinutes} min left
                  </span>
                )}
                <span className="text-sm text-emerald-gold">{Math.round(progressPercent)}% complete</span>
              </div>
            </div>
            <Progress value={progressPercent} className="h-2 bg-muted" />
          </div>

          {/* Step Title with Time Estimate */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-clean-white flex items-center gap-2">
                {currentStepInfo.title}
                {showCelebration && !settings.reducedMotion && (
                  <PartyPopper className="w-5 h-5 text-emerald-gold animate-bounce" />
                )}
              </h1>
              <p className="text-moon-silver mt-1">{currentStepInfo.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {settings.showTimeEstimates && currentTimeEstimate && (
                <span className="time-estimate shrink-0">
                  <Clock className="w-3 h-3" />
                  {currentTimeEstimate.label}
                </span>
              )}
            </div>
          </div>

          {/* Top Navigation - Per IRS IRIS Portal UX guidelines */}
          <div className="flex justify-between items-center mb-6 p-3 rounded-lg bg-dark-emerald/30 border border-emerald-gold/10">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBack} 
              disabled={step === 1} 
              className="gap-1 text-moon-silver hover:text-clean-white hover:bg-moon-silver/10"
              aria-label="Go to previous step"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <span className="text-sm text-moon-silver/80">
              Step {step} of {WIZARD_STEPS.length}
            </span>
            {step < 6 ? (
              <Button 
                size="sm"
                onClick={handleNext}
                className={cn(
                  "gap-1 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald",
                  !canProceed() && "opacity-60"
                )}
                aria-label={`Continue to step ${step + 1}`}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="w-16" />
            )}
          </div>

          {/* Progress Steps - Hidden in focus mode */}
          <div className={cn(
            "flex items-center justify-between mb-8 overflow-x-auto pb-2",
            settings.focusMode && "focus-hide"
          )}>
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => s.id <= step && setStep(s.id)}
                      disabled={s.id > step}
                      aria-label={`Step ${s.id}: ${s.title}${step > s.id ? " (completed)" : step === s.id ? " (current)" : " (upcoming)"}`}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        step === s.id ? "bg-emerald-gold text-night-emerald ring-2 ring-emerald-gold/50 ring-offset-2 ring-offset-night-emerald focus-primary" :
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
                    {settings.showTimeEstimates && STEP_TIME_ESTIMATES[STEP_TIME_KEYS[i]] && (
                      <p className="text-xs text-blue-400 mt-1">
                        {STEP_TIME_ESTIMATES[STEP_TIME_KEYS[i]].label}
                      </p>
                    )}
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
          <div className={cn(
            "bg-dark-emerald/30 rounded-2xl border border-emerald-gold/20 p-6",
            settings.focusMode && "focus-primary"
          )}>
            {step === 1 && <EntityTypeStep value={formData.entityType} onChange={(v) => setFormData({ ...formData, entityType: v })} />}
            {step === 2 && <BasicInfoStep companyName={formData.companyName} state={formData.state} formationDate={formData.formationDate} entityType={formData.entityType} onCompanyNameChange={(v) => setFormData({ ...formData, companyName: v })} onStateChange={(v) => setFormData({ ...formData, state: v })} onFormationDateChange={(v) => setFormData({ ...formData, formationDate: v })} />}
            {step === 3 && <EinStep hasEin={formData.hasEin} ein={formData.ein} onHasEinChange={(v) => setFormData({ ...formData, hasEin: v })} onEinChange={(v) => setFormData({ ...formData, ein: v })} />}
            {step === 4 && <OwnershipStep members={formData.members} entityType={formData.entityType} onMembersChange={(v) => setFormData({ ...formData, members: v })} />}
            {step === 5 && <AddressStep address={formData.address} onAddressChange={(v) => setFormData({ ...formData, address: v })} />}
            {step === 6 && <ReviewStep formData={formData} electSCorp={formData.electSCorp} onElectSCorpChange={(v) => setFormData({ ...formData, electSCorp: v })} onGenerate={handleGenerate} isGenerating={isGenerating} />}
            
            {/* Tax Wizard Link after company setup */}
            {step === 6 && (
              <div className="mt-6 pt-6 border-t border-emerald-gold/20">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-emerald-gold/40 text-emerald-gold hover:bg-emerald-gold/10"
                  onClick={() => navigate("/tax-wizard")}
                >
                  <FileText className="w-4 h-4" />
                  Continue to Tax Form Wizard (SSDI-Safe)
                </Button>
                <p className="text-xs text-moon-silver/60 text-center mt-2">
                  Guided field-by-field tax form filling with SSDI safeguards
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1} 
              className="gap-2 border-moon-silver/30 text-moon-silver hover:bg-moon-silver/10"
              aria-label="Go to previous step"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            
            {step < 6 ? (
              <Button 
                onClick={handleNext}
                aria-disabled={!canProceed()}
                className={cn(
                  "gap-2 bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald visual-alert",
                  !canProceed() && "opacity-60 cursor-not-allowed"
                )}
                aria-label={`Continue to step ${step + 1}`}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="text-xs text-moon-silver/60 flex items-center">
                Keyboard: ← → to navigate, Esc to exit
              </div>
            )}
          </div>

          {/* Keyboard hint - Hidden in focus mode */}
          <p className={cn(
            "text-center text-xs text-moon-silver/40 mt-4",
            settings.focusMode && "focus-hide"
          )}>
            Tip: Use arrow keys to navigate between steps
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CompanyWizard;
