import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { US_STATES, SECRETARY_OF_STATE_DATA, ENTITY_TYPES } from "@/lib/company-wizard-data";
import { ExternalLink, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BasicInfoStepProps {
  companyName: string;
  state: string;
  formationDate: string;
  entityType: string;
  onCompanyNameChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onFormationDateChange: (value: string) => void;
}

export const BasicInfoStep = ({
  companyName,
  state,
  formationDate,
  entityType,
  onCompanyNameChange,
  onStateChange,
  onFormationDateChange,
}: BasicInfoStepProps) => {
  const sosData = state ? SECRETARY_OF_STATE_DATA[state] : null;
  const entityLabel = ENTITY_TYPES.find(e => e.value === entityType)?.label || "Company";
  const isLLC = entityType.includes("llc");
  const isCorp = entityType.includes("corp");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Basic Company Information
        </h2>
        <p className="text-muted-foreground">
          Enter your company name and select the state where you'll file.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-foreground">
            Company Name
          </Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder={`Enter your ${entityLabel} name`}
            className="bg-card border-border"
          />
          <p className="text-xs text-muted-foreground">
            {isLLC && "Must include 'LLC' or 'Limited Liability Company' in the name."}
            {isCorp && "Must include 'Inc.', 'Corp.', or 'Corporation' in the name."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-foreground">
            State of Formation
          </Label>
          <Select value={state} onValueChange={onStateChange}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {sosData && (
          <div className="p-4 rounded-xl bg-dark-emerald/50 border border-emerald-gold/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-gold shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-foreground">{sosData.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">LLC Fee:</span>
                    <span className="ml-2 text-foreground font-medium">{sosData.llcFee}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Corp Fee:</span>
                    <span className="ml-2 text-foreground font-medium">{sosData.corpFee}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Processing:</span>
                    <span className="ml-2 text-foreground font-medium">{sosData.processingTime}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-2 border-emerald-gold/30 text-emerald-gold hover:bg-emerald-gold/10"
                  onClick={() => window.open(sosData.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit {US_STATES.find(s => s.value === state)?.label} Secretary of State
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="formationDate" className="text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Formation Date
          </Label>
          <Input
            id="formationDate"
            type="date"
            value={formationDate}
            onChange={(e) => onFormationDateChange(e.target.value)}
            className="bg-card border-border"
          />
          <p className="text-xs text-muted-foreground">
            When you filed (or plan to file) with the state.
          </p>
        </div>
      </div>
    </div>
  );
};
