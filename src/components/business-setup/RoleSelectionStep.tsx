import { User, Users, Briefcase, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BusinessRole, BusinessStructure } from "@/hooks/use-businesses";

interface RoleSelectionStepProps {
  businessStructure: BusinessStructure;
  selected: BusinessRole | null;
  onSelect: (role: BusinessRole) => void;
}

const getRolesForStructure = (structure: BusinessStructure) => {
  const baseRoles = [
    {
      id: "owner" as BusinessRole,
      title: "Business Owner",
      description: "You own and operate this business. You'll file business taxes.",
      icon: User,
      taxForms: structure === "llc_s_corp" ? ["W-2", "Schedule K-1"] : ["Schedule C"],
    },
    {
      id: "partner" as BusinessRole,
      title: "Partner",
      description: "You share ownership with others. File your share on K-1.",
      icon: Users,
      taxForms: ["Schedule K-1"],
      showFor: ["partnership", "llc_s_corp"],
    },
    {
      id: "employee" as BusinessRole,
      title: "Employee (W-2)",
      description: "You work for this business. Employer handles payroll taxes.",
      icon: Briefcase,
      taxForms: ["W-4", "W-2"],
    },
    {
      id: "contractor" as BusinessRole,
      title: "Contractor (1099)",
      description: "You provide services but aren't an employee. Self-employment tax applies.",
      icon: FileText,
      taxForms: ["W-9", "1099-NEC"],
    },
  ];

  return baseRoles.filter((role) => {
    if (!role.showFor) return true;
    return role.showFor.includes(structure);
  });
};

export function RoleSelectionStep({ businessStructure, selected, onSelect }: RoleSelectionStepProps) {
  const roles = getRolesForStructure(businessStructure);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">What's Your Role?</h2>
        <p className="text-muted-foreground mt-2">
          Select how you relate to this business
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selected === role.id;

          return (
            <Card
              key={role.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50",
                isSelected && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => onSelect(role.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  {role.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Required forms:</span>
                  {role.taxForms.map((form) => (
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
