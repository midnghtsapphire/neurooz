import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubscription, SUBSCRIPTION_TYPES, SUBSCRIPTION_CATEGORIES, BILLING_CYCLES } from "@/hooks/use-subscriptions";

interface AddSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function AddSubscriptionDialog({ open, onOpenChange, userId }: AddSubscriptionDialogProps) {
  const [formData, setFormData] = useState({
    subscription_name: "",
    subscription_type: "software",
    provider: "",
    billing_cycle: "monthly",
    amount: "",
    renewal_date: "",
    auto_renew: true,
    is_business_expense: true,
    business_use_percentage: 100,
    category: "",
    license_key: "",
    seats_purchased: 1,
    notes: "",
  });

  const createMutation = useCreateSubscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        userId,
        input: {
          ...formData,
          amount: parseFloat(formData.amount) || 0,
          seats_purchased: formData.seats_purchased,
          renewal_date: formData.renewal_date || undefined,
          category: formData.category || undefined,
          license_key: formData.license_key || undefined,
          notes: formData.notes || undefined,
          provider: formData.provider || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            subscription_name: "",
            subscription_type: "software",
            provider: "",
            billing_cycle: "monthly",
            amount: "",
            renewal_date: "",
            auto_renew: true,
            is_business_expense: true,
            business_use_percentage: 100,
            category: "",
            license_key: "",
            seats_purchased: 1,
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
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Subscription Name *</Label>
              <Input
                id="name"
                value={formData.subscription_name}
                onChange={(e) => setFormData({ ...formData, subscription_name: e.target.value })}
                placeholder="e.g., Adobe Creative Cloud"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.subscription_type} onValueChange={(v) => setFormData({ ...formData, subscription_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Adobe"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="billing">Billing Cycle</Label>
              <Select value={formData.billing_cycle} onValueChange={(v) => setFormData({ ...formData, billing_cycle: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map((cycle) => (
                    <SelectItem key={cycle.value} value={cycle.value}>
                      {cycle.label}
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
                  {SUBSCRIPTION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="renewal">Renewal Date</Label>
              <Input
                id="renewal"
                type="date"
                value={formData.renewal_date}
                onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="seats">Seats/Licenses</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                value={formData.seats_purchased}
                onChange={(e) => setFormData({ ...formData, seats_purchased: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div>
              <Label htmlFor="license">License Key</Label>
              <Input
                id="license"
                value={formData.license_key}
                onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_renew">Auto-Renew</Label>
              <Switch
                id="auto_renew"
                checked={formData.auto_renew}
                onCheckedChange={(v) => setFormData({ ...formData, auto_renew: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="business">Business Expense</Label>
              <Switch
                id="business"
                checked={formData.is_business_expense}
                onCheckedChange={(v) => setFormData({ ...formData, is_business_expense: v })}
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
              {createMutation.isPending ? "Adding..." : "Add Subscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
