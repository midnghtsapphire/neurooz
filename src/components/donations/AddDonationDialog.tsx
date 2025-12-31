import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Info } from "lucide-react";
import { useCreateDonation, useCreateCharity, SavedCharity } from "@/hooks/use-donations";

interface AddDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  charities: SavedCharity[];
}

export function AddDonationDialog({ open, onOpenChange, charities }: AddDonationDialogProps) {
  const createDonation = useCreateDonation();
  const createCharity = useCreateCharity();

  const [formData, setFormData] = useState({
    product_name: "",
    donation_date: new Date().toISOString().split("T")[0],
    original_etv: "",
    fair_market_value: "",
    cost_basis: "0",
    condition_at_donation: "good",
    valuation_method: "comparable_sales",
    comparable_evidence: "",
    charity_name: "",
    charity_ein: "",
    charity_address: "",
    charity_city: "",
    charity_state: "",
    charity_zip: "",
    is_501c3: true,
    receipt_number: "",
    notes: "",
    included_in_tax_year: new Date().getFullYear(),
    save_charity: false,
  });

  const [selectedCharityId, setSelectedCharityId] = useState<string>("");

  const handleSelectCharity = (charityId: string) => {
    setSelectedCharityId(charityId);
    const charity = charities.find(c => c.id === charityId);
    if (charity) {
      setFormData(prev => ({
        ...prev,
        charity_name: charity.charity_name,
        charity_ein: charity.ein || "",
        charity_address: charity.address || "",
        charity_city: charity.city || "",
        charity_state: charity.state || "",
        charity_zip: charity.zip || "",
        is_501c3: charity.is_501c3,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save charity if requested
    if (formData.save_charity && !selectedCharityId) {
      await createCharity.mutateAsync({
        charity_name: formData.charity_name,
        ein: formData.charity_ein || null,
        address: formData.charity_address || null,
        city: formData.charity_city || null,
        state: formData.charity_state || null,
        zip: formData.charity_zip || null,
        is_501c3: formData.is_501c3,
      });
    }

    await createDonation.mutateAsync({
      product_name: formData.product_name,
      donation_date: formData.donation_date,
      original_etv: parseFloat(formData.original_etv) || 0,
      fair_market_value: parseFloat(formData.fair_market_value) || 0,
      cost_basis: parseFloat(formData.cost_basis) || 0,
      condition_at_donation: formData.condition_at_donation,
      valuation_method: formData.valuation_method,
      comparable_evidence: formData.comparable_evidence || null,
      charity_name: formData.charity_name,
      charity_ein: formData.charity_ein || null,
      charity_address: formData.charity_address || null,
      charity_city: formData.charity_city || null,
      charity_state: formData.charity_state || null,
      charity_zip: formData.charity_zip || null,
      is_501c3: formData.is_501c3,
      receipt_number: formData.receipt_number || null,
      notes: formData.notes || null,
      included_in_tax_year: formData.included_in_tax_year,
    });

    onOpenChange(false);
    setFormData({
      product_name: "",
      donation_date: new Date().toISOString().split("T")[0],
      original_etv: "",
      fair_market_value: "",
      cost_basis: "0",
      condition_at_donation: "good",
      valuation_method: "comparable_sales",
      comparable_evidence: "",
      charity_name: "",
      charity_ein: "",
      charity_address: "",
      charity_city: "",
      charity_state: "",
      charity_zip: "",
      is_501c3: true,
      receipt_number: "",
      notes: "",
      included_in_tax_year: new Date().getFullYear(),
      save_charity: false,
    });
    setSelectedCharityId("");
  };

  const fmv = parseFloat(formData.fair_market_value) || 0;
  const requiresForm8283 = fmv >= 500;
  const requiresAppraisal = fmv > 5000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Donation</DialogTitle>
          <DialogDescription>
            Track a Vine product donation for tax purposes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="product">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="charity">Charity</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product_name">Product Name *</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="donation_date">Donation Date *</Label>
                    <Input
                      id="donation_date"
                      type="date"
                      value={formData.donation_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, donation_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tax_year">Tax Year</Label>
                    <Select
                      value={String(formData.included_in_tax_year)}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, included_in_tax_year: Number(v) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition at Donation</Label>
                  <Select
                    value={formData.condition_at_donation}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, condition_at_donation: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New (Unopened)</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the donation..."
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charity" className="space-y-4 mt-4">
              {charities.length > 0 && (
                <div className="grid gap-2">
                  <Label>Select Saved Charity</Label>
                  <Select value={selectedCharityId} onValueChange={handleSelectCharity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a saved charity or enter new..." />
                    </SelectTrigger>
                    <SelectContent>
                      {charities.map((charity) => (
                        <SelectItem key={charity.id} value={charity.id}>
                          {charity.charity_name} {charity.ein && `(${charity.ein})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="charity_name">Charity Name *</Label>
                  <Input
                    id="charity_name"
                    value={formData.charity_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, charity_name: e.target.value }))}
                    placeholder="Enter charity name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="charity_ein">EIN (Tax ID)</Label>
                    <Input
                      id="charity_ein"
                      value={formData.charity_ein}
                      onChange={(e) => setFormData(prev => ({ ...prev, charity_ein: e.target.value }))}
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={formData.is_501c3}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_501c3: checked }))}
                    />
                    <Label>501(c)(3) Organization</Label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="charity_address">Address</Label>
                  <Input
                    id="charity_address"
                    value={formData.charity_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, charity_address: e.target.value }))}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="charity_city">City</Label>
                    <Input
                      id="charity_city"
                      value={formData.charity_city}
                      onChange={(e) => setFormData(prev => ({ ...prev, charity_city: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="charity_state">State</Label>
                    <Input
                      id="charity_state"
                      value={formData.charity_state}
                      onChange={(e) => setFormData(prev => ({ ...prev, charity_state: e.target.value }))}
                      maxLength={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="charity_zip">ZIP</Label>
                    <Input
                      id="charity_zip"
                      value={formData.charity_zip}
                      onChange={(e) => setFormData(prev => ({ ...prev, charity_zip: e.target.value }))}
                    />
                  </div>
                </div>

                {!selectedCharityId && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.save_charity}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, save_charity: checked }))}
                    />
                    <Label>Save charity for future donations</Label>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="valuation" className="space-y-4 mt-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Vine Products:</strong> Your cost basis is typically $0 since you received the item for free.
                  The FMV is what you'd pay for the item in its current condition.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="original_etv">Original ETV ($)</Label>
                    <Input
                      id="original_etv"
                      type="number"
                      step="0.01"
                      value={formData.original_etv}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_etv: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fair_market_value">Fair Market Value ($) *</Label>
                    <Input
                      id="fair_market_value"
                      type="number"
                      step="0.01"
                      value={formData.fair_market_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, fair_market_value: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cost_basis">Cost Basis ($)</Label>
                    <Input
                      id="cost_basis"
                      type="number"
                      step="0.01"
                      value={formData.cost_basis}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_basis: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="valuation_method">Valuation Method</Label>
                  <Select
                    value={formData.valuation_method}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, valuation_method: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comparable_sales">Comparable Sales (eBay, Amazon)</SelectItem>
                      <SelectItem value="replacement_cost">Replacement Cost</SelectItem>
                      <SelectItem value="qualified_appraisal">Qualified Appraisal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="comparable_evidence">Valuation Evidence</Label>
                  <Textarea
                    id="comparable_evidence"
                    value={formData.comparable_evidence}
                    onChange={(e) => setFormData(prev => ({ ...prev, comparable_evidence: e.target.value }))}
                    placeholder="e.g., 'Similar item sold on eBay for $XX on [date]'"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="receipt_number">Receipt/Acknowledgment Number</Label>
                  <Input
                    id="receipt_number"
                    value={formData.receipt_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, receipt_number: e.target.value }))}
                    placeholder="Enter if already received"
                  />
                </div>
              </div>

              {requiresForm8283 && (
                <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/30 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Form 8283 Required:</strong> FMV exceeds $500.
                    {requiresAppraisal && " A qualified appraisal is required for items over $5,000."}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDonation.isPending}>
              {createDonation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Donation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
