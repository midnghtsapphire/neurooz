import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { US_STATES } from "@/lib/company-wizard-data";
import { MapPin } from "lucide-react";

interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressStepProps {
  address: Address;
  onAddressChange: (address: Address) => void;
}

export const AddressStep = ({ address, onAddressChange }: AddressStepProps) => {
  const updateField = (field: keyof Address, value: string) => {
    onAddressChange({ ...address, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Business Address
        </h2>
        <p className="text-muted-foreground">
          Enter the principal place of business. This will appear on official documents and state filings.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-emerald-gold" />
          <span className="font-medium text-foreground">Principal Address</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Street Address</Label>
            <Input
              value={address.street1}
              onChange={(e) => updateField("street1", e.target.value)}
              placeholder="123 Main Street"
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">
              Address Line 2 <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              value={address.street2}
              onChange={(e) => updateField("street2", e.target.value)}
              placeholder="Suite 100, Building A, etc."
              className="bg-background border-border"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">City</Label>
              <Input
                value={address.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="City"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">State</Label>
              <Select
                value={address.state}
                onValueChange={(v) => updateField("state", v)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">ZIP Code</Label>
              <Input
                value={address.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                placeholder="12345"
                className="bg-background border-border"
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> You can use a home address, virtual office, or registered agent address. Some states require a physical address (no P.O. Box) for your registered agent.
        </p>
      </div>
    </div>
  );
};
