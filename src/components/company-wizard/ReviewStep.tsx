import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ENTITY_TYPES, US_STATES, SECRETARY_OF_STATE_DATA, EIN_IRS_URL } from "@/lib/company-wizard-data";
import { 
  Building2, FileText, CheckCircle, Download, ExternalLink, 
  FileCheck, Calendar, AlertCircle 
} from "lucide-react";
import type { CompanyFormData } from "@/lib/company-wizard-data";

interface ReviewStepProps {
  formData: CompanyFormData;
  electSCorp: boolean;
  onElectSCorpChange: (value: boolean) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ReviewStep = ({
  formData,
  electSCorp,
  onElectSCorpChange,
  onGenerate,
  isGenerating,
}: ReviewStepProps) => {
  const entityLabel = ENTITY_TYPES.find(e => e.value === formData.entityType)?.label || "Company";
  const stateLabel = US_STATES.find(s => s.value === formData.state)?.label || formData.state;
  const sosData = formData.state ? SECRETARY_OF_STATE_DATA[formData.state] : null;
  const showSCorpOption = formData.entityType === "llc_single" || formData.entityType === "llc_multi";

  const documents = [
    { name: "Operating Agreement", included: formData.entityType.includes("llc") },
    { name: "Articles of Organization", included: formData.entityType.includes("llc") },
    { name: "Articles of Incorporation", included: formData.entityType.includes("corp") },
    { name: "Corporate Bylaws", included: formData.entityType.includes("corp") },
    { name: "Partnership Agreement", included: formData.entityType === "partnership" },
    { name: "Tax Forms Checklist", included: true },
    { name: "Compliance Calendar", included: true },
    { name: "Form 2553 (S-Corp Election)", included: electSCorp },
  ].filter(d => d.included);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Review & Generate Documents
        </h2>
        <p className="text-muted-foreground">
          Confirm your information and generate your complete document package.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-gold/20 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-emerald-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{formData.companyName || "Unnamed Company"}</h3>
            <p className="text-sm text-muted-foreground">{entityLabel} • {stateLabel}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">Formation Date</span>
            <p className="text-foreground font-medium">
              {formData.formationDate || "Not specified"}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">EIN</span>
            <p className="text-foreground font-medium">
              {formData.hasEin === "yes" ? formData.ein || "Entered" : formData.hasEin === "no" ? "Pending" : "Later"}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Members</span>
            <p className="text-foreground font-medium">
              {formData.members.filter(m => m.name).length} owner(s)
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Address</span>
            <p className="text-foreground font-medium">
              {formData.address.city ? `${formData.address.city}, ${formData.address.state}` : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* S-Corp Election Option */}
      {showSCorpOption && (
        <div className="p-4 rounded-xl bg-emerald-gold/10 border border-emerald-gold/30">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={electSCorp}
              onCheckedChange={(c) => onElectSCorpChange(c === true)}
              className="mt-1"
            />
            <div>
              <span className="font-medium text-foreground">Elect S-Corporation Tax Treatment</span>
              <p className="text-sm text-muted-foreground mt-1">
                File Form 2553 to be taxed as an S-Corp. This can save self-employment taxes if you pay yourself a reasonable salary. Requires payroll setup.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Documents to Generate */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Documents Package
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <CheckCircle className="w-4 h-4 text-emerald-gold" />
              <span className="text-sm text-foreground">{doc.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps Checklist */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          After This Wizard
        </h4>
        <ul className="space-y-2 text-sm">
          {formData.hasEin !== "yes" && (
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-foreground">Apply for EIN</span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 ml-2 text-emerald-gold"
                  onClick={() => window.open(EIN_IRS_URL, "_blank")}
                >
                  IRS.gov <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </li>
          )}
          <li className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">File with Secretary of State</span>
            {sosData && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-emerald-gold"
                onClick={() => window.open(sosData.url, "_blank")}
              >
                {stateLabel} SOS <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </li>
          <li className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">Open business bank account</span>
          </li>
          <li className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">Set up accounting/bookkeeping</span>
          </li>
          {electSCorp && (
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-foreground">File Form 2553 within 75 days of formation</span>
            </li>
          )}
        </ul>
      </div>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={isGenerating || !formData.companyName}
        size="lg"
        className="w-full bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-bold h-14 text-lg gap-2"
      >
        {isGenerating ? (
          <>Generating...</>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Generate Document Package
          </>
        )}
      </Button>
    </div>
  );
};
