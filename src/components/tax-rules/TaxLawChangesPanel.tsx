import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Plus,
  Calendar,
  Infinity,
  FileText
} from "lucide-react";
import { 
  useTaxLawChangesByCategory, 
  LAW_CHANGE_CATEGORY_LABELS,
  isExpiringSoon,
  hasExpired,
  TaxLawChange
} from "@/hooks/use-tax-law-changes";
import { Loader2 } from "lucide-react";

const DIRECTION_ICONS: Record<string, React.ReactNode> = {
  increased: <ArrowUp className="h-4 w-4 text-green-500" />,
  decreased: <ArrowDown className="h-4 w-4 text-red-500" />,
  eliminated: <Minus className="h-4 w-4 text-red-500" />,
  created: <Plus className="h-4 w-4 text-green-500" />,
  modified: <FileText className="h-4 w-4 text-blue-500" />,
};

function ChangeDirectionBadge({ direction }: { direction: string | null }) {
  if (!direction) return null;
  
  const colors: Record<string, string> = {
    increased: "bg-green-500/10 text-green-600 border-green-500/30",
    decreased: "bg-red-500/10 text-red-600 border-red-500/30",
    eliminated: "bg-red-500/10 text-red-600 border-red-500/30",
    created: "bg-green-500/10 text-green-600 border-green-500/30",
    modified: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  };

  return (
    <Badge variant="outline" className={`text-xs ${colors[direction] || ""}`}>
      {DIRECTION_ICONS[direction]}
      <span className="ml-1 capitalize">{direction}</span>
    </Badge>
  );
}

function StatusBadge({ change }: { change: TaxLawChange }) {
  if (change.is_permanent) {
    return (
      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
        <Infinity className="h-3 w-3 mr-1" />
        Permanent
      </Badge>
    );
  }

  if (hasExpired(change.expiration_date)) {
    return (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Expired
      </Badge>
    );
  }

  if (isExpiringSoon(change.expiration_date)) {
    return (
      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
        <Clock className="h-3 w-3 mr-1" />
        Expiring Soon
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
      <CheckCircle2 className="h-3 w-3 mr-1" />
      Active
    </Badge>
  );
}

function ProvisionCard({ change }: { change: TaxLawChange }) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <CardTitle className="text-base">{change.provision_name}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge change={change} />
            <ChangeDirectionBadge direction={change.change_direction} />
          </div>
        </div>
        {change.expiration_date && !change.is_permanent && (
          <CardDescription className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            Expires: {new Date(change.expiration_date).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3">
          {/* Before/During/After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1 font-medium">Pre-2018 (Before TCJA)</div>
              <div className="font-semibold">{change.pre_law_value || "N/A"}</div>
              {change.pre_law_description && (
                <div className="text-xs text-muted-foreground mt-1">{change.pre_law_description}</div>
              )}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="text-xs text-primary mb-1 font-medium">Current (2018-2025)</div>
              <div className="font-semibold">{change.current_value || "N/A"}</div>
              {change.current_description && (
                <div className="text-xs text-muted-foreground mt-1">{change.current_description}</div>
              )}
            </div>
            <div className={`rounded-lg p-3 ${change.is_permanent ? "bg-blue-500/5 border border-blue-500/20" : "bg-amber-500/5 border border-amber-500/20"}`}>
              <div className={`text-xs mb-1 font-medium ${change.is_permanent ? "text-blue-600" : "text-amber-600"}`}>
                {change.is_permanent ? "Permanent" : "After 2025"}
              </div>
              <div className="font-semibold">{change.post_expiration_value || "N/A"}</div>
              {change.post_expiration_description && (
                <div className="text-xs text-muted-foreground mt-1">{change.post_expiration_description}</div>
              )}
            </div>
          </div>

          {/* Affected Taxpayers */}
          {change.affected_taxpayers && change.affected_taxpayers.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Affects:</span>
              {change.affected_taxpayers.map((taxpayer, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {taxpayer}
                </Badge>
              ))}
            </div>
          )}

          {/* Notes */}
          {change.notes && (
            <div className="text-xs bg-amber-500/10 border border-amber-500/20 rounded p-2 text-amber-700 dark:text-amber-300">
              {change.notes}
            </div>
          )}

          {/* IRS Reference */}
          {change.irs_reference && (
            <div className="text-xs text-muted-foreground">
              Reference: {change.irs_reference}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TaxLawChangesPanel() {
  const [activeTab, setActiveTab] = useState("all");
  const { groupedChanges, changes, permanentChanges, expiringChanges, isLoading, error } = useTaxLawChangesByCategory("TCJA");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8 text-center text-destructive">
          Failed to load tax law changes. Please try again.
        </CardContent>
      </Card>
    );
  }

  const categories = groupedChanges ? Object.keys(groupedChanges) : [];

  const getFilteredChanges = () => {
    if (activeTab === "all") return changes;
    if (activeTab === "expiring") return expiringChanges;
    if (activeTab === "permanent") return permanentChanges;
    return groupedChanges?.[activeTab] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Tax Cuts and Jobs Act (TCJA) - What Changed & What's Expiring
          </CardTitle>
          <CardDescription>
            Compare pre-2018, current (2018-2025), and post-2025 tax rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-600">
                {expiringChanges.length}
              </Badge>
              <span>Expiring provisions</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-600">
                {permanentChanges.length}
              </Badge>
              <span>Permanent changes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-600">
                {expiringChanges.filter(c => isExpiringSoon(c.expiration_date)).length}
              </Badge>
              <span>Expiring within 1 year</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">At-a-Glance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provision</TableHead>
                  <TableHead>Pre-2018</TableHead>
                  <TableHead className="bg-primary/5">Current</TableHead>
                  <TableHead>After 2025</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes?.slice(0, 10).map((change) => (
                  <TableRow key={change.id}>
                    <TableCell className="font-medium">{change.provision_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{change.pre_law_value}</TableCell>
                    <TableCell className="text-sm bg-primary/5 font-medium">{change.current_value}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{change.post_expiration_value}</TableCell>
                    <TableCell><StatusBadge change={change} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Detail View */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="expiring" className="text-xs text-amber-600">Expiring</TabsTrigger>
          <TabsTrigger value="permanent" className="text-xs text-blue-600">Permanent</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs capitalize">
              {LAW_CHANGE_CATEGORY_LABELS[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {getFilteredChanges()?.map((change) => (
              <ProvisionCard key={change.id} change={change} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
