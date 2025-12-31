import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  FileText, 
  Info,
  Shield
} from "lucide-react";
import { useState } from "react";
import { 
  useDeductionLimits, 
  DeductionWarning, 
  getStatusColor, 
  getStatusBadgeVariant 
} from "@/hooks/use-deduction-limits";

interface DeductionLimitsAlertProps {
  taxYear?: number;
  userAGI?: number;
  compact?: boolean;
}

export function DeductionLimitsAlert({ 
  taxYear = 2024, 
  userAGI = 100000,
  compact = false 
}: DeductionLimitsAlertProps) {
  const summary = useDeductionLimits(taxYear, userAGI);
  const [showAll, setShowAll] = useState(false);

  if (summary.warnings.length === 0) {
    if (compact) return null;
    
    return (
      <Alert className="border-green-500/30 bg-green-500/5">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>All Clear</AlertTitle>
        <AlertDescription>
          No deduction limit warnings for {taxYear}. Keep documenting your proof!
        </AlertDescription>
      </Alert>
    );
  }

  const criticalCount = summary.criticalWarnings.length;
  const proofCount = summary.proofReminders.length;

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {criticalCount > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {criticalCount} Critical
          </Badge>
        )}
        {proofCount > 0 && (
          <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600">
            <FileText className="h-3 w-3" />
            {proofCount} Proof Needed
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="border-amber-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Deduction Limit Alerts</CardTitle>
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive">{criticalCount} Critical</Badge>
            )}
            <Badge variant="outline">{summary.warnings.length} Total</Badge>
          </div>
        </div>
        <CardDescription>
          Warnings and reminders for tax year {taxYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Critical Warnings First */}
        {summary.criticalWarnings.map((warning) => (
          <WarningCard key={warning.id} warning={warning} isCritical />
        ))}

        {/* Other Warnings */}
        <Collapsible open={showAll} onOpenChange={setShowAll}>
          {summary.warnings.filter(w => 
            w.status !== "over_limit" && w.status !== "at_limit"
          ).slice(0, showAll ? undefined : 2).map((warning) => (
            <WarningCard key={warning.id} warning={warning} />
          ))}
          
          {summary.warnings.length > 2 + summary.criticalWarnings.length && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full mt-2">
                <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAll ? "rotate-180" : ""}`} />
                {showAll ? "Show Less" : `Show ${summary.warnings.length - 2 - summary.criticalWarnings.length} More`}
              </Button>
            </CollapsibleTrigger>
          )}
          
          <CollapsibleContent className="space-y-4">
            {summary.warnings.filter(w => 
              w.status !== "over_limit" && w.status !== "at_limit"
            ).slice(2).map((warning) => (
              <WarningCard key={warning.id} warning={warning} />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* AGI Info */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
          <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-medium">AGI-Based Limits</p>
            <p className="text-muted-foreground">
              Donation limits are calculated using ${userAGI.toLocaleString()} AGI. 
              Update your AGI in settings for accurate limits.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WarningCard({ warning, isCritical = false }: { warning: DeductionWarning; isCritical?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = getStatusColor(warning.status);
  const badgeVariant = getStatusBadgeVariant(warning.status);

  const getIcon = () => {
    switch (warning.status) {
      case "over_limit":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "at_limit":
      case "over_with_proof":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "approaching":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${isCritical ? "border-destructive/50 bg-destructive/5" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{warning.deductionName}</span>
              <Badge variant={badgeVariant} className="text-xs">
                {warning.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <p className={`text-sm ${statusColor}`}>{warning.message}</p>
          </div>
        </div>
      </div>

      {/* Progress bar for percentage-based limits */}
      {warning.maxAmount && warning.maxAmount > 0 && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${warning.currentAmount.toLocaleString()} claimed</span>
            <span>${warning.maxAmount.toLocaleString()} limit</span>
          </div>
          <Progress 
            value={Math.min(warning.percentageUsed, 100)} 
            className={`h-2 ${warning.percentageUsed > 100 ? "[&>div]:bg-destructive" : warning.percentageUsed > 90 ? "[&>div]:bg-amber-500" : ""}`}
          />
        </div>
      )}

      {/* Expandable details */}
      {(warning.proofRequired || warning.increaseConditions) && (
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 h-7 px-2 text-xs">
              <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
              {expanded ? "Hide Details" : "Show Required Documentation"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {warning.proofRequired && warning.proofRequired.length > 0 && (
              <div className="p-2 bg-muted/50 rounded text-xs">
                <p className="font-medium mb-1 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Required Proof:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  {warning.proofRequired.map((proof, i) => (
                    <li key={i}>{proof}</li>
                  ))}
                </ul>
              </div>
            )}
            {warning.canBeIncreased && warning.increaseConditions && (
              <div className="p-2 bg-green-500/10 rounded text-xs">
                <p className="font-medium mb-1 text-green-700">Can Exceed Limit If:</p>
                <ul className="list-disc list-inside text-green-600 space-y-0.5">
                  {warning.increaseConditions.map((condition, i) => (
                    <li key={i}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
