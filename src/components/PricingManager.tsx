import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
  DollarSign,
  Save,
  X,
  Sparkles,
  Calculator,
  Building2,
  Loader2
} from "lucide-react";
import { usePricingTiers, useUpdatePricingTier, useSetRecommendedTier, PricingTier } from "@/hooks/use-pricing-tiers";

const tierIcons: Record<string, React.ReactNode> = {
  "free": <Sparkles className="w-5 h-5" />,
  "tax-smart": <Calculator className="w-5 h-5" />,
  "business-builder": <Building2 className="w-5 h-5" />
};

const PricingManager = () => {
  const { data: tiers, isLoading, error } = usePricingTiers();
  const updateTier = useUpdatePricingTier();
  const setRecommended = useSetRecommendedTier();
  
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleSaveTier = () => {
    if (!editingTier) return;
    
    updateTier.mutate({
      id: editingTier.id,
      name: editingTier.name,
      price: editingTier.price,
      yearly_price: editingTier.yearly_price,
      description: editingTier.description,
      features: editingTier.features,
      recommended: editingTier.recommended,
      savings_min: editingTier.savings_min,
      savings_max: editingTier.savings_max,
      roi_min: editingTier.roi_min,
      roi_max: editingTier.roi_max,
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setEditingTier(null);
      }
    });
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
    setRecommended.mutate(tierId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Pricing Tiers</h2>
            <p className="text-muted-foreground">Manage your subscription pricing and features</p>
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 border border-border shadow-soft">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border border-destructive/50 bg-destructive/10">
        <p className="text-destructive">Failed to load pricing tiers. Please try again.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Pricing Tiers</h2>
          <p className="text-muted-foreground">Manage your subscription pricing and features</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tiers?.map((tier) => (
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
                    {tier.yearly_price > 0 && (
                      <span className="text-sm text-secondary ml-2">(${tier.yearly_price}/year)</span>
                    )}
                  </div>
                  {tier.savings_max > 0 && (
                    <p className="text-sm text-secondary mt-2">
                      Saves ${tier.savings_min.toLocaleString()} - ${tier.savings_max.toLocaleString()}/year
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
                    disabled={setRecommended.isPending}
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
                              value={editingTier.yearly_price}
                              onChange={(e) => setEditingTier({ ...editingTier, yearly_price: Number(e.target.value) })}
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
                              value={editingTier.savings_min}
                              onChange={(e) => setEditingTier({ ...editingTier, savings_min: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Savings Max ($)</Label>
                            <Input
                              type="number"
                              value={editingTier.savings_max}
                              onChange={(e) => setEditingTier({ ...editingTier, savings_max: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>ROI Min (%)</Label>
                            <Input
                              type="number"
                              value={editingTier.roi_min}
                              onChange={(e) => setEditingTier({ ...editingTier, roi_min: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ROI Max (%)</Label>
                            <Input
                              type="number"
                              value={editingTier.roi_max}
                              onChange={(e) => setEditingTier({ ...editingTier, roi_max: Number(e.target.value) })}
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
                          <Button 
                            onClick={handleSaveTier} 
                            className="bg-primary text-primary-foreground"
                            disabled={updateTier.isPending}
                          >
                            {updateTier.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
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

      <Card className="p-6 border border-secondary/30 bg-secondary/5">
        <div className="text-center">
          <p className="text-secondary text-sm font-medium">
            ✓ Pricing changes are saved to the database and shared across all users
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PricingManager;
