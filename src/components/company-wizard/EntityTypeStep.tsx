import { ENTITY_TYPES } from "@/lib/company-wizard-data";
import { Check, Building2, Users, Briefcase, Scale, Landmark, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityTypeStepProps {
  value: string;
  onChange: (value: string) => void;
}

const getIcon = (entityType: string) => {
  switch (entityType) {
    case "sole_proprietorship":
      return <User className="w-5 h-5" />;
    case "llc_single":
      return <Building2 className="w-5 h-5" />;
    case "llc_multi":
      return <Users className="w-5 h-5" />;
    case "s_corp":
      return <Briefcase className="w-5 h-5" />;
    case "c_corp":
      return <Landmark className="w-5 h-5" />;
    case "partnership":
      return <Scale className="w-5 h-5" />;
    case "nonprofit":
      return <Heart className="w-5 h-5" />;
    default:
      return <Building2 className="w-5 h-5" />;
  }
};

export const EntityTypeStep = ({ value, onChange }: EntityTypeStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Choose Your Business Structure
        </h2>
        <p className="text-muted-foreground">
          Select the entity type that best fits your business needs. This determines your liability protection, tax treatment, and compliance requirements.
        </p>
      </div>

      <div className="grid gap-4">
        {ENTITY_TYPES.map((entity) => (
          <button
            key={entity.value}
            onClick={() => onChange(entity.value)}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
              value === entity.value
                ? "border-emerald-gold bg-emerald-gold/10"
                : "border-border hover:border-emerald-gold/50 bg-card"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                value === entity.value
                  ? "bg-emerald-gold text-night-emerald"
                  : "bg-muted text-muted-foreground"
              )}>
                {getIcon(entity.value)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{entity.label}</h3>
                  {value === entity.value && (
                    <Check className="w-4 h-4 text-emerald-gold" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{entity.description}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div>
                    <span className="text-xs font-medium text-green-500">Pros:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      {entity.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-amber-500">Cons:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      {entity.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
