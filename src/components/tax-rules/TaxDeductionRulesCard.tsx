import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  DollarSign,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { TaxDeductionRule } from "@/hooks/use-tax-deduction-rules";
import { formatCurrency } from "@/lib/tax-calculations";

interface TaxDeductionRulesCardProps {
  rule: TaxDeductionRule;
}

export function TaxDeductionRulesCard({ rule }: TaxDeductionRulesCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {rule.deduction_name}
                  {rule.can_be_increased && (
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Can Increase
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {rule.max_amount !== null 
                    ? (rule.max_amount < 1 
                        ? `${rule.max_amount}` 
                        : formatCurrency(rule.max_amount))
                    : "No fixed limit"}
                  {rule.max_amount_description && (
                    <span className="text-muted-foreground">— {rule.max_amount_description}</span>
                  )}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Increase Conditions */}
            {rule.can_be_increased && rule.increase_conditions && rule.increase_conditions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  How to Increase / Caveats
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {rule.increase_conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Increase Amounts/Details */}
            {rule.increase_amounts && Object.keys(rule.increase_amounts).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-blue-600">
                  <DollarSign className="h-4 w-4" />
                  Amount Details
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(rule.increase_amounts).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="font-medium">
                          {typeof value === "number" 
                            ? (value >= 1 ? formatCurrency(value) : `${value * 100}%`)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Proof Required */}
            {rule.proof_required && rule.proof_required.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-orange-600">
                  <FileText className="h-4 w-4" />
                  Required Documentation
                </h4>
                <ul className="space-y-1 text-sm">
                  {rule.proof_required.map((proof, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                      {proof}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applicable Forms */}
            {rule.applicable_forms && rule.applicable_forms.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Forms:</span>
                {rule.applicable_forms.map((form, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {form}
                  </Badge>
                ))}
              </div>
            )}

            {/* Business Types */}
            {rule.business_types && rule.business_types.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Applies to:</span>
                {rule.business_types.map((type, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs capitalize">
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}

            {/* Notes */}
            {rule.notes && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-300">
                <strong>Note:</strong> {rule.notes}
              </div>
            )}

            {/* IRS Reference */}
            {rule.irs_reference && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Reference: {rule.irs_reference}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
