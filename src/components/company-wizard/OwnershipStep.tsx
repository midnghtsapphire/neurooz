import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";

interface Member {
  name: string;
  email: string;
  ownershipPercent: number;
  role: string;
}

interface OwnershipStepProps {
  members: Member[];
  entityType: string;
  onMembersChange: (members: Member[]) => void;
}

const ROLES = [
  { value: "member", label: "Member" },
  { value: "manager", label: "Manager" },
  { value: "managing_member", label: "Managing Member" },
  { value: "president", label: "President" },
  { value: "ceo", label: "CEO" },
  { value: "director", label: "Director" },
  { value: "shareholder", label: "Shareholder" },
  { value: "partner", label: "Partner" },
];

export const OwnershipStep = ({
  members,
  entityType,
  onMembersChange,
}: OwnershipStepProps) => {
  const isSingleMember = entityType === "llc_single" || entityType === "sole_proprietorship";
  const totalOwnership = members.reduce((sum, m) => sum + (m.ownershipPercent || 0), 0);

  const addMember = () => {
    onMembersChange([
      ...members,
      { name: "", email: "", ownershipPercent: 0, role: "member" },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      onMembersChange(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof Member, value: string | number) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onMembersChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Ownership & Members
        </h2>
        <p className="text-muted-foreground">
          {isSingleMember
            ? "Enter your information as the sole owner."
            : "Add all members/shareholders and their ownership percentages."}
        </p>
      </div>

      {!isSingleMember && totalOwnership !== 100 && members.some(m => m.ownershipPercent > 0) && (
        <div className={`p-3 rounded-lg border ${
          totalOwnership > 100 
            ? "bg-destructive/10 border-destructive/30" 
            : "bg-amber-500/10 border-amber-500/30"
        }`}>
          <p className={`text-sm ${totalOwnership > 100 ? "text-destructive" : "text-amber-500"}`}>
            Total ownership: {totalOwnership}% — {totalOwnership > 100 ? "exceeds" : "must equal"} 100%
          </p>
        </div>
      )}

      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-card border border-border space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {isSingleMember ? "Owner" : `Member ${index + 1}`}
                </span>
              </div>
              {!isSingleMember && members.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Full Name</Label>
                <Input
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  placeholder="John Smith"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  type="email"
                  value={member.email}
                  onChange={(e) => updateMember(index, "email", e.target.value)}
                  placeholder="john@example.com"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Role</Label>
                <Select
                  value={member.role}
                  onValueChange={(v) => updateMember(index, "role", v)}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isSingleMember && (
                <div className="space-y-2">
                  <Label className="text-foreground">Ownership %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={member.ownershipPercent || ""}
                    onChange={(e) => updateMember(index, "ownershipPercent", Number(e.target.value))}
                    placeholder="50"
                    className="bg-background border-border"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {!isSingleMember && (
          <Button
            variant="outline"
            onClick={addMember}
            className="w-full gap-2 border-dashed border-emerald-gold/30 text-emerald-gold hover:bg-emerald-gold/10"
          >
            <Plus className="w-4 h-4" />
            Add Another Member
          </Button>
        )}
      </div>
    </div>
  );
};
