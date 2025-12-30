import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BusinessRole } from "@/hooks/use-businesses";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export interface PersonalInfoData {
  businessName: string;
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  ssnLastFour: string;
  ownershipPercentage: number;
  isPassive: boolean;
  ein: string;
}

interface PersonalInfoStepProps {
  role: BusinessRole;
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function PersonalInfoStep({ role, data, onChange }: PersonalInfoStepProps) {
  const updateField = (field: keyof PersonalInfoData, value: string | number | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const isOwnerOrPartner = role === "owner" || role === "partner";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Your Information</h2>
        <p className="text-muted-foreground mt-2">
          This information is needed for tax forms
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Business Name */}
        {isOwnerOrPartner && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={data.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              placeholder="e.g., TruthSlayer LLC"
            />
          </div>
        )}

        {/* EIN for owners */}
        {isOwnerOrPartner && (
          <div className="space-y-2">
            <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
            <Input
              id="ein"
              value={data.ein}
              onChange={(e) => updateField("ein", e.target.value)}
              placeholder="XX-XXXXXXX"
              maxLength={10}
            />
            <p className="text-xs text-muted-foreground">Optional if Sole Proprietor using SSN</p>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Legal Name</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="As it appears on your tax documents"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <Label>Address</Label>
          <Input
            value={data.addressLine1}
            onChange={(e) => updateField("addressLine1", e.target.value)}
            placeholder="Street address"
          />
          <Input
            value={data.addressLine2}
            onChange={(e) => updateField("addressLine2", e.target.value)}
            placeholder="Apt, suite, unit (optional)"
          />
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <Input
                value={data.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="col-span-1">
              <Select
                value={data.state}
                onValueChange={(value) => updateField("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Input
                value={data.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)}
                placeholder="ZIP"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* SSN Last 4 */}
        <div className="space-y-2">
          <Label htmlFor="ssn">SSN (Last 4 digits)</Label>
          <Input
            id="ssn"
            value={data.ssnLastFour}
            onChange={(e) => updateField("ssnLastFour", e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="XXXX"
            maxLength={4}
          />
          <p className="text-xs text-muted-foreground">
            For verification purposes only. Full SSN entered on actual tax forms.
          </p>
        </div>

        {/* Ownership Percentage for partners */}
        {role === "partner" && (
          <div className="space-y-2">
            <Label htmlFor="ownership">Ownership Percentage</Label>
            <Input
              id="ownership"
              type="number"
              min={0}
              max={100}
              value={data.ownershipPercentage}
              onChange={(e) => updateField("ownershipPercentage", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 50"
            />
          </div>
        )}

        {/* Passive Income checkbox for partners */}
        {role === "partner" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="passive"
              checked={data.isPassive}
              onCheckedChange={(checked) => updateField("isPassive", !!checked)}
            />
            <Label htmlFor="passive" className="font-normal">
              This is passive income (I don't materially participate in the business)
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
