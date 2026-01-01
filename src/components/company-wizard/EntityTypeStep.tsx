import { ENTITY_TYPES } from "@/lib/company-wizard-data";
import { Check, Building2, Users, Briefcase, Scale, Landmark, Heart, User, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    case "partnership_general":
    case "partnership_limited":
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
    <TooltipProvider>
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
                  
                  {/* Tax Rule Tooltip */}
                  {entity.taxRule && (
                    <div className="flex items-center gap-2 mt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full cursor-help">
                            <Info className="w-3 h-3" />
                            Tax Rules
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">{entity.taxRule}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                  
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
                  
                  {/* Tips Section */}
                  {entity.tips && entity.tips.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entity.tips.map((tip, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full cursor-help">
                              <Lightbulb className="w-3 h-3" />
                              Tip {i + 1}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{tip}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
