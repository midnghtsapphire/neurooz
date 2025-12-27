import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Edit2, 
  Plus, 
  Trash2, 
  DollarSign,
  Save,
  X,
  Sparkles,
  Calculator,
  Building2
} from "lucide-react";
import { toast } from "sonner";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  recommended: boolean;
  savingsMin: number;
  savingsMax: number;
  roiMin: number;
  roiMax: number;
}

const defaultTiers: PricingTier[] = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    yearlyPrice: 0,
    description: "Get started with basic tax tracking",
    features: [
      "Track up to 50 products",
      "Basic tax summary",
      "See potential savings (teaser)",
      "Tax education content",
      "Community forum access"
    ],
    recommended: false,
    savingsMin: 0,
    savingsMax: 0,
    roiMin: 0,
    roiMax: 0
  },
  {
    id: "tax-smart",
    name: "Tax Smart",
    price: 29,
    yearlyPrice: 297,
    description: "Everything you need to maximize deductions",
    features: [
      "Unlimited products & transactions",
      "50/20/0 auto-calculation",
      "Receipt upload with OCR",
      "Mileage tracking",
      "Home office deduction calculator",
      "Schedule C auto-generation",
      "Form 8995 (QBI deduction)",
      "Quarterly tax estimates",
      "Tax form exports (PDF/Excel)",
      "Mobile app access",
      "Email support"
    ],
    recommended: true,
    savingsMin: 4300,
    savingsMax: 7900,
    roiMin: 1135,
    roiMax: 2171
  },
  {
    id: "business-builder",
    name: "Business Builder",
    price: 39,
    yearlyPrice: 397,
    description: "For serious Vine businesses with complex needs",
    features: [
      "Everything in Tax Smart",
      "Multi-entity tracking (up to 3 LLCs)",
      "S-Corp vs LLC comparison calculator",
      "K-1 generation (partnerships)",
      "Rental property tracking (Schedule E)",
      "Team members (up to 3 users)",
      "Bank sync via Plaid",
      "Payroll integration",
      "Business structure optimization",
      "Workflow automation",
      "Priority support (24hr response)"
    ],
    recommended: false,
    savingsMin: 14300,
    savingsMax: 17000,
    roiMin: 2955,
    roiMax: 3533
  }
];

const tierIcons: Record<string, React.ReactNode> = {
  "free": <Sparkles className="w-5 h-5" />,
  "tax-smart": <Calculator className="w-5 h-5" />,
  "business-builder": <Building2 className="w-5 h-5" />
};

const PricingManager = () => {
  const [tiers, setTiers] = useState<PricingTier[]>(defaultTiers);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleSaveTier = () => {
    if (!editingTier) return;
    
    setTiers(prev => 
      prev.map(t => t.id === editingTier.id ? editingTier : t)
    );
    setIsDialogOpen(false);
    setEditingTier(null);
    toast.success(`${editingTier.name} tier updated successfully`);
  };

  const handleAddFeature = () => {
    if (!editingTier || !newFeature.trim()) return;
    
    setEditingTier({
      ...editingTier,
      features: [...editingTier.features, newFeature.trim()]
    });
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingTier) return;
    
    setEditingTier({
      ...editingTier,
      features: editingTier.features.filter((_, i) => i !== index)
    });
  };

  const handleSetRecommended = (tierId: string) => {
    setTiers(prev =>
      prev.map(t => ({
        ...t,
        recommended: t.id === tierId
      }))
    );
    toast.success("Recommended tier updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Pricing Tiers</h2>
          <p className="text-muted-foreground">Manage your subscription pricing and features</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className={`p-6 border ${tier.recommended ? "border-primary shadow-medium" : "border-border shadow-soft"}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  tier.recommended ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {tierIcons[tier.id] || <DollarSign className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-display font-bold text-foreground">{tier.name}</h3>
                    {tier.recommended && (
                      <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{tier.description}</p>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-3xl font-display font-bold text-foreground">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                    {tier.yearlyPrice > 0 && (
                      <span className="text-sm text-secondary ml-2">(${tier.yearlyPrice}/year)</span>
                    )}
                  </div>
                  {tier.savingsMax > 0 && (
                    <p className="text-sm text-secondary mt-2">
                      Saves ${tier.savingsMin.toLocaleString()} - ${tier.savingsMax.toLocaleString()}/year
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tier.features.slice(0, 5).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {feature}
                      </Badge>
                    ))}
                    {tier.features.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{tier.features.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!tier.recommended && tier.price > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetRecommended(tier.id)}
                    className="text-xs"
                  >
                    Set Recommended
                  </Button>
                )}
                <Dialog open={isDialogOpen && editingTier?.id === tier.id} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditingTier(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTier({ ...tier });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display">Edit {tier.name} Tier</DialogTitle>
                    </DialogHeader>
                    
                    {editingTier && (
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tier Name</Label>
                            <Input
                              value={editingTier.name}
                              onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Monthly Price ($)</Label>
                            <Input
                              type="number"
                              value={editingTier.price}
                              onChange={(e) => setEditingTier({ ...editingTier, price: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Yearly Price ($)</Label>
                            <Input
                              type="number"
                              value={editingTier.yearlyPrice}
                              onChange={(e) => setEditingTier({ ...editingTier, yearlyPrice: Number(e.target.value) })}
                            />
                          </div>
                          <div className="flex items-center gap-3 pt-6">
                            <Switch
                              checked={editingTier.recommended}
                              onCheckedChange={(checked) => setEditingTier({ ...editingTier, recommended: checked })}
                            />
                            <Label>Recommended Tier</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editingTier.description}
                            onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Savings Min ($)</Label>
                            <Input
                              type="number"
                              value={editingTier.savingsMin}
                              onChange={(e) => setEditingTier({ ...editingTier, savingsMin: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Savings Max ($)</Label>
                            <Input
                              type="number"
                              value={editingTier.savingsMax}
                              onChange={(e) => setEditingTier({ ...editingTier, savingsMax: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>ROI Min (%)</Label>
                            <Input
                              type="number"
                              value={editingTier.roiMin}
                              onChange={(e) => setEditingTier({ ...editingTier, roiMin: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ROI Max (%)</Label>
                            <Input
                              type="number"
                              value={editingTier.roiMax}
                              onChange={(e) => setEditingTier({ ...editingTier, roiMax: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>Features</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a feature..."
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
                            />
                            <Button onClick={handleAddFeature} size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {editingTier.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                                <span className="flex-1 text-sm">{feature}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFeature(i)}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveTier} className="bg-primary text-primary-foreground">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Pricing changes are saved locally. To persist changes, connect to a database.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PricingManager;
