import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EIN_IRS_URL } from "@/lib/company-wizard-data";
import { ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EinStepProps {
  hasEin: "yes" | "no" | "later";
  ein: string;
  onHasEinChange: (value: "yes" | "no" | "later") => void;
  onEinChange: (value: string) => void;
}

export const EinStep = ({
  hasEin,
  ein,
  onHasEinChange,
  onEinChange,
}: EinStepProps) => {
  const formatEin = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  };

  const handleEinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEinChange(formatEin(e.target.value));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Employer Identification Number (EIN)
        </h2>
        <p className="text-muted-foreground">
          An EIN is like a Social Security Number for your business. It's required for hiring employees, opening business bank accounts, and filing taxes.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-emerald-gold/10 border border-emerald-gold/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-gold shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              <strong>Get your EIN for free</strong> directly from the IRS. It takes about 10 minutes online.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-emerald-gold/30 text-emerald-gold hover:bg-emerald-gold/10"
              onClick={() => window.open(EIN_IRS_URL, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Apply for EIN at IRS.gov
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-foreground">Do you have an EIN?</Label>
        <RadioGroup
          value={hasEin}
          onValueChange={(v) => onHasEinChange(v as "yes" | "no" | "later")}
          className="space-y-3"
        >
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              hasEin === "yes"
                ? "border-emerald-gold bg-emerald-gold/10"
                : "border-border hover:border-emerald-gold/50 bg-card"
            }`}
          >
            <RadioGroupItem value="yes" />
            <div className="flex-1">
              <span className="font-medium text-foreground">Yes, I have an EIN</span>
              <p className="text-sm text-muted-foreground">I'll enter it below</p>
            </div>
            <CheckCircle className={`w-5 h-5 ${hasEin === "yes" ? "text-emerald-gold" : "text-muted"}`} />
          </label>

          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              hasEin === "no"
                ? "border-emerald-gold bg-emerald-gold/10"
                : "border-border hover:border-emerald-gold/50 bg-card"
            }`}
          >
            <RadioGroupItem value="no" />
            <div className="flex-1">
              <span className="font-medium text-foreground">No, I need to get one</span>
              <p className="text-sm text-muted-foreground">I'll apply now or soon</p>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              hasEin === "later"
                ? "border-emerald-gold bg-emerald-gold/10"
                : "border-border hover:border-emerald-gold/50 bg-card"
            }`}
          >
            <RadioGroupItem value="later" />
            <div className="flex-1">
              <span className="font-medium text-foreground">I'll add it later</span>
              <p className="text-sm text-muted-foreground">Skip for now and continue</p>
            </div>
          </label>
        </RadioGroup>

        {hasEin === "yes" && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="ein" className="text-foreground">
              Enter your EIN
            </Label>
            <Input
              id="ein"
              value={ein}
              onChange={handleEinChange}
              placeholder="XX-XXXXXXX"
              className="bg-card border-border font-mono text-lg"
              maxLength={10}
            />
            <p className="text-xs text-muted-foreground">
              Format: 12-3456789 (9 digits total)
            </p>
          </div>
        )}

        {hasEin === "no" && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <h4 className="font-semibold text-foreground mb-2">Next Steps:</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click the IRS link above to start your application</li>
              <li>Have your formation documents ready</li>
              <li>Complete the online interview (≈10 min)</li>
              <li>Receive your EIN immediately upon completion</li>
              <li>Come back here and update your company profile</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
