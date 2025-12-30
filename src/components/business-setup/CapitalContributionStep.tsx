import { DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CapitalContributionData {
  totalCapital: number;
  managingMemberShare: number;
  passiveMemberShare: number;
  customAmount: string;
}

interface CapitalContributionStepProps {
  data: CapitalContributionData;
  onChange: (data: CapitalContributionData) => void;
}

const PRESET_AMOUNTS = [
  { value: 100, label: "$100", description: "Minimal - Good for starting out" },
  { value: 500, label: "$500", description: "Moderate - More professional appearance" },
  { value: 1000, label: "$1,000", description: "Standard - Common for small LLCs" },
];

const OWNERSHIP_RATIO = {
  managing: 0.51,
  passive: 0.49,
};

export function CapitalContributionStep({ data, onChange }: CapitalContributionStepProps) {
  const calculateShares = (total: number) => {
    const managingShare = Math.round(total * OWNERSHIP_RATIO.managing * 100) / 100;
    const passiveShare = Math.round(total * OWNERSHIP_RATIO.passive * 100) / 100;
    return { managingShare, passiveShare };
  };

  const handlePresetSelect = (value: string) => {
    const amount = parseInt(value);
    const { managingShare, passiveShare } = calculateShares(amount);
    onChange({
      totalCapital: amount,
      managingMemberShare: managingShare,
      passiveMemberShare: passiveShare,
      customAmount: "",
    });
  };

  const handleCustomAmount = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const { managingShare, passiveShare } = calculateShares(numValue);
    onChange({
      totalCapital: numValue,
      managingMemberShare: managingShare,
      passiveMemberShare: passiveShare,
      customAmount: value,
    });
  };

  const isCustom = data.customAmount !== "" && !PRESET_AMOUNTS.some(p => p.value === data.totalCapital);
  const selectedPreset = PRESET_AMOUNTS.find(p => p.value === data.totalCapital && !isCustom);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Capital Contributions</h2>
        <p className="text-muted-foreground mt-2">
          Set the initial capital for your LLC. The 51/49 ownership ratio will be maintained automatically.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Preset Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Select Total Capital
            </CardTitle>
            <CardDescription>
              Choose a preset amount or enter a custom value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedPreset?.value.toString() || "custom"}
              onValueChange={(value) => {
                if (value !== "custom") {
                  handlePresetSelect(value);
                }
              }}
              className="space-y-3"
            >
              {PRESET_AMOUNTS.map((preset) => (
                <div
                  key={preset.value}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                    selectedPreset?.value === preset.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handlePresetSelect(preset.value.toString())}
                >
                  <RadioGroupItem value={preset.value.toString()} id={`preset-${preset.value}`} />
                  <Label htmlFor={`preset-${preset.value}`} className="flex-1 cursor-pointer">
                    <span className="font-semibold">{preset.label}</span>
                    <span className="text-muted-foreground ml-2">— {preset.description}</span>
                  </Label>
                </div>
              ))}

              {/* Custom Amount */}
              <div
                className={cn(
                  "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                  isCustom
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="custom" id="preset-custom" />
                <Label htmlFor="preset-custom" className="flex-1 cursor-pointer">
                  <span className="font-semibold">Custom Amount</span>
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min="10"
                    step="1"
                    placeholder="Enter amount"
                    className="w-32"
                    value={data.customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Share Breakdown */}
        {data.totalCapital > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Member Contributions
              </CardTitle>
              <CardDescription>
                Based on 51% Managing / 49% Passive ownership split
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Managing Member (51%)</p>
                    <p className="text-sm text-muted-foreground">Active manager with control</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${data.managingMemberShare.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Passive Member (49%)</p>
                    <p className="text-sm text-muted-foreground">Investor with limited participation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${data.passiveMemberShare.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <p className="font-semibold">Total Capital</p>
                  <p className="text-xl font-bold">
                    ${data.totalCapital.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Note */}
        <div className="rounded-lg bg-muted/30 border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Capital contributions can be made in cash. The amounts shown will be 
            documented in your Operating Agreement's Schedule A. You can use smaller amounts — 
            the legal validity of your LLC is not affected by the capital amount.
          </p>
        </div>
      </div>
    </div>
  );
}
