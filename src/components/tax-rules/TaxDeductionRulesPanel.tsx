import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2, Search, Calculator, Car, Home, Utensils, Heart, PiggyBank, TrendingUp, Accessibility, Gift, Package, BookOpen, Users, Building, Lightbulb, FileText } from "lucide-react";
import { useTaxDeductionRulesByCategory, CATEGORY_LABELS } from "@/hooks/use-tax-deduction-rules";
import { TaxDeductionRulesCard } from "./TaxDeductionRulesCard";

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  depreciation: <Calculator className="h-4 w-4" />,
  vehicle: <Car className="h-4 w-4" />,
  home_office: <Home className="h-4 w-4" />,
  meals: <Utensils className="h-4 w-4" />,
  health: <Heart className="h-4 w-4" />,
  retirement: <PiggyBank className="h-4 w-4" />,
  qbi: <TrendingUp className="h-4 w-4" />,
  disability: <Accessibility className="h-4 w-4" />,
  charitable: <Gift className="h-4 w-4" />,
  vine: <Package className="h-4 w-4" />,
  team_building: <Users className="h-4 w-4" />,
  donations: <Heart className="h-4 w-4" />,
  rental_business: <Building className="h-4 w-4" />,
  expert_tips: <Lightbulb className="h-4 w-4" />,
  back_taxes: <FileText className="h-4 w-4" />,
};

export function TaxDeductionRulesPanel() {
  const [taxYear, setTaxYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { groupedRules, rules, isLoading, error } = useTaxDeductionRulesByCategory(taxYear);

  const filteredRules = rules?.filter((rule) => {
    const matchesSearch = 
      rule.deduction_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.max_amount_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || rule.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = groupedRules ? Object.keys(groupedRules) : [];

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
          Failed to load tax deduction rules. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tax Deduction Reference Guide
          </CardTitle>
          <CardDescription>
            Maximum deductibles, increase conditions, and required documentation for {taxYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deductions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={String(taxYear)} onValueChange={(v) => setTaxYear(Number(v))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tax Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs flex items-center gap-1">
              {CATEGORY_ICON_MAP[category]}
              <span className="hidden sm:inline">{CATEGORY_LABELS[category] || category}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          {filteredRules && filteredRules.length > 0 ? (
            <div className="grid gap-4">
              {filteredRules.map((rule) => (
                <TaxDeductionRulesCard key={rule.id} rule={rule} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No deduction rules found matching your criteria.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      {rules && (
        <Card className="bg-muted/30">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{rules.length}</strong> deduction rules
              </span>
              <span>•</span>
              <span>
                <strong className="text-foreground">{rules.filter(r => r.can_be_increased).length}</strong> with increase options
              </span>
              <span>•</span>
              <span>
                <strong className="text-foreground">{categories.length}</strong> categories
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
