import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Building2, Heart, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

interface EmploymentRule {
  id: string;
  category: string;
  rule_key: string;
  rule_title: string;
  rule_description: string | null;
  age_group: string | null;
  requirements: string[] | null;
  tax_implications: string | null;
  documentation_needed: string[] | null;
  source_url: string | null;
}

export function EmploymentRulesDialog() {
  const [open, setOpen] = useState(false);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["employment-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employment_rules")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as EmploymentRule[];
    },
    enabled: open,
  });

  const minorRules = rules.filter((r) => r.category === "minor_employment");
  const businessRules = rules.filter((r) => r.category === "business_structure");
  const nonprofitRules = rules.filter((r) => r.category === "nonprofit");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "minor_employment":
        return <Users className="h-4 w-4" />;
      case "business_structure":
        return <Building2 className="h-4 w-4" />;
      case "nonprofit":
        return <Heart className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const RuleCard = ({ rule }: { rule: EmploymentRule }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{rule.rule_title}</CardTitle>
          {rule.age_group && (
            <Badge variant="secondary" className="shrink-0">
              {rule.age_group}
            </Badge>
          )}
        </div>
        <CardDescription>{rule.rule_description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rule.requirements && rule.requirements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Requirements
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {rule.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {rule.tax_implications && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Tax Implications
            </h4>
            <p className="text-sm text-muted-foreground">{rule.tax_implications}</p>
          </div>
        )}

        {rule.documentation_needed && rule.documentation_needed.length > 0 && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Documentation Needed
            </h4>
            <div className="flex flex-wrap gap-1">
              {rule.documentation_needed.map((doc, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Employment Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employment & Business Rules Reference
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Tabs defaultValue="minor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="minor" className="gap-1">
                <Users className="h-3 w-3" />
                Minors
              </TabsTrigger>
              <TabsTrigger value="business" className="gap-1">
                <Building2 className="h-3 w-3" />
                Multi-Business
              </TabsTrigger>
              <TabsTrigger value="nonprofit" className="gap-1">
                <Heart className="h-3 w-3" />
                Nonprofit
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4 pr-4">
              <TabsContent value="minor" className="mt-0">
                {minorRules.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No rules found</p>
                ) : (
                  minorRules.map((rule) => <RuleCard key={rule.id} rule={rule} />)
                )}
              </TabsContent>

              <TabsContent value="business" className="mt-0">
                {businessRules.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No rules found</p>
                ) : (
                  businessRules.map((rule) => <RuleCard key={rule.id} rule={rule} />)
                )}
              </TabsContent>

              <TabsContent value="nonprofit" className="mt-0">
                {nonprofitRules.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No rules found</p>
                ) : (
                  nonprofitRules.map((rule) => <RuleCard key={rule.id} rule={rule} />)
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
