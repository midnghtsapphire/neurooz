import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  FileText, 
  Users, 
  Shield,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const WIZARD_FEATURES = [
  { icon: Building2, label: "Entity Selection", description: "LLC, S-Corp, Partnership" },
  { icon: FileText, label: "Tax Forms", description: "W-4, W-9, 1099, Schedule C" },
  { icon: Users, label: "Members & Roles", description: "Ownership & responsibilities" },
  { icon: Shield, label: "Compliance", description: "Operating agreements" },
];

interface BusinessWizardCardProps {
  hasExistingBusiness?: boolean;
  businessName?: string;
}

export function BusinessWizardCard({ hasExistingBusiness, businessName }: BusinessWizardCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="overflow-hidden border-2 border-secondary/20 shadow-soft hover:shadow-medium transition-all group">
        <div className="relative h-24 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/10">
          <div className="absolute inset-0 flex items-center px-6">
            <div className="flex items-center gap-4 w-full">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold text-foreground">
                  Business Wizard
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasExistingBusiness 
                    ? `Managing: ${businessName}` 
                    : "Start your business journey"
                  }
                </p>
              </div>
              {hasExistingBusiness && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {WIZARD_FEATURES.map((feature, i) => (
              <div 
                key={feature.label}
                className={cn(
                  "p-3 rounded-lg border border-border/50 bg-muted/30",
                  "hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer"
                )}
              >
                <feature.icon className="w-5 h-5 text-secondary mb-2" />
                <div className="text-sm font-medium text-foreground">{feature.label}</div>
                <div className="text-xs text-muted-foreground">{feature.description}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 gap-2 group-hover:bg-secondary group-hover:text-secondary-foreground"
              variant="outline"
              onClick={() => navigate("/company-wizard")}
            >
              <Sparkles className="w-4 h-4" />
              {hasExistingBusiness ? "Edit Business" : "Start Wizard"}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/business-setup")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BusinessWizardCard;
