import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDigitalAsset, ASSET_TYPES, LICENSE_TYPES, PLATFORMS, ASSET_CATEGORIES } from "@/hooks/use-digital-inventory";

interface AddDigitalAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function AddDigitalAssetDialog({ open, onOpenChange, userId }: AddDigitalAssetDialogProps) {
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "software",
    vendor: "",
    purchase_date: new Date().toISOString().split("T")[0],
    purchase_price: "",
    license_type: "perpetual",
    license_key: "",
    license_expiry: "",
    seats_count: 1,
    version: "",
    platform: "",
    is_business_asset: true,
    business_use_percentage: 100,
    depreciation_method: "straight_line",
    useful_life_years: 3,
    category: "",
    notes: "",
  });

  const createMutation = useCreateDigitalAsset();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const purchasePrice = parseFloat(formData.purchase_price) || 0;
    
    createMutation.mutate(
      {
        userId,
        input: {
          ...formData,
          purchase_price: purchasePrice,
          current_value: purchasePrice,
          seats_count: formData.seats_count,
          useful_life_years: formData.useful_life_years,
          license_expiry: formData.license_expiry || undefined,
          license_key: formData.license_key || undefined,
          version: formData.version || undefined,
          platform: formData.platform || undefined,
          category: formData.category || undefined,
          vendor: formData.vendor || undefined,
          notes: formData.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            asset_name: "",
            asset_type: "software",
            vendor: "",
            purchase_date: new Date().toISOString().split("T")[0],
            purchase_price: "",
            license_type: "perpetual",
            license_key: "",
            license_expiry: "",
            seats_count: 1,
            version: "",
            platform: "",
            is_business_asset: true,
            business_use_percentage: 100,
            depreciation_method: "straight_line",
            useful_life_years: 3,
            category: "",
            notes: "",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Digital Asset</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.asset_name}
                onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                placeholder="e.g., Microsoft Office 365"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Asset Type</Label>
              <Select value={formData.asset_type} onValueChange={(v) => setFormData({ ...formData, asset_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="e.g., Microsoft"
              />
            </div>

            <div>
              <Label htmlFor="price">Purchase Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="license_type">License Type</Label>
              <Select value={formData.license_type} onValueChange={(v) => setFormData({ ...formData, license_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LICENSE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiry">License Expiry</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.license_expiry}
                onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seats">Seats/Licenses</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                value={formData.seats_count}
                onChange={(e) => setFormData({ ...formData, seats_count: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g., 2024"
              />
            </div>

            <div>
              <Label htmlFor="useful_life">Useful Life (Years)</Label>
              <Input
                id="useful_life"
                type="number"
                min="1"
                max="10"
                value={formData.useful_life_years}
                onChange={(e) => setFormData({ ...formData, useful_life_years: parseInt(e.target.value) || 3 })}
              />
            </div>

            <div>
              <Label htmlFor="license_key">License Key</Label>
              <Input
                id="license_key"
                value={formData.license_key}
                onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="business">Business Asset</Label>
              <Switch
                id="business"
                checked={formData.is_business_asset}
                onCheckedChange={(v) => setFormData({ ...formData, is_business_asset: v })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Business Use Percentage</Label>
                <span className="text-sm font-medium">{formData.business_use_percentage}%</span>
              </div>
              <Slider
                value={[formData.business_use_percentage]}
                onValueChange={([v]) => setFormData({ ...formData, business_use_percentage: v })}
                max={100}
                step={5}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
