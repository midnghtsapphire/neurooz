import { Building2, User, Users, Briefcase, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BusinessStructure } from "@/hooks/use-businesses";

interface BusinessStructureStepProps {
  selected: BusinessStructure | null;
  onSelect: (structure: BusinessStructure) => void;
}

const structures = [
  {
    id: "sole_proprietor" as BusinessStructure,
    title: "Sole Proprietor",
    description: "Simplest structure. File Schedule C with 1040. All profit subject to 15.3% SE tax.",
    icon: User,
    bestFor: "Income under $50K, SSDI recipients, first-time Viners",
    taxForms: ["Schedule C", "1040", "SE"],
  },
  {
    id: "single_member_llc" as BusinessStructure,
    title: "Single-Member LLC",
    description: "Liability protection with pass-through taxation. Same tax treatment as Sole Prop.",
    icon: Building2,
    bestFor: "Liability protection with simplicity",
    taxForms: ["Schedule C", "1040", "SE"],
  },
  {
    id: "multi_member_llc" as BusinessStructure,
    title: "Multi-Member LLC",
    description: "Two or more owners with liability protection. Taxed as partnership by default.",
    icon: Users,
    bestFor: "Business partners who want liability protection",
    taxForms: ["1065", "Schedule K-1", "SE"],
  },
  {
    id: "llc_s_corp" as BusinessStructure,
    title: "LLC taxed as S-Corp",
    description: "Pay reasonable salary + distributions. Save on self-employment tax.",
    icon: Briefcase,
    bestFor: "Income $60K+, can handle payroll complexity",
    taxForms: ["1120-S", "W-2", "Schedule K-1"],
    recommended: true,
  },
  {
    id: "partnership" as BusinessStructure,
    title: "Partnership",
    description: "Multiple owners share profits/losses. Each partner reports their share.",
    icon: Users,
    bestFor: "Multiple business partners, passive income",
    taxForms: ["1065", "Schedule K-1"],
  },
  {
    id: "c_corp" as BusinessStructure,
    title: "C Corporation",
    description: "Separate legal entity. Double taxation on profits. Complex compliance.",
    icon: Building,
    bestFor: "Venture capital, going public (not recommended for Vine)",
    taxForms: ["1120", "W-2", "1099-DIV"],
    notRecommended: true,
  },
];

export function BusinessStructureStep({ selected, onSelect }: BusinessStructureStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Select Your Business Structure</h2>
        <p className="text-muted-foreground mt-2">
          Choose the structure that best fits your situation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {structures.map((structure) => {
          const Icon = structure.icon;
          const isSelected = selected === structure.id;

          return (
            <Card
              key={structure.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50 relative",
                isSelected && "border-primary ring-2 ring-primary/20",
                structure.notRecommended && "opacity-60"
              )}
              onClick={() => onSelect(structure.id)}
            >
              {structure.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Recommended for $60K+
                </div>
              )}
              {structure.notRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-xs px-3 py-1 rounded-full">
                  Not Recommended
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{structure.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  {structure.description}
                </CardDescription>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Best for:</span> {structure.bestFor}
                </div>
                <div className="flex flex-wrap gap-1">
                  {structure.taxForms.map((form) => (
                    <span
                      key={form}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                    >
                      {form}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
