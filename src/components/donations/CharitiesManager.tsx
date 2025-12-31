import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Building, Plus, Loader2, MapPin, Phone, Mail } from "lucide-react";
import { SavedCharity, useCreateCharity } from "@/hooks/use-donations";

interface CharitiesManagerProps {
  charities: SavedCharity[];
}

export function CharitiesManager({ charities }: CharitiesManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const createCharity = useCreateCharity();

  const [formData, setFormData] = useState({
    charity_name: "",
    ein: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    is_501c3: true,
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCharity.mutateAsync({
      charity_name: formData.charity_name,
      ein: formData.ein || null,
      address: formData.address || null,
      city: formData.city || null,
      state: formData.state || null,
      zip: formData.zip || null,
      is_501c3: formData.is_501c3,
      contact_name: formData.contact_name || null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      notes: formData.notes || null,
    });
    setShowAddDialog(false);
    setFormData({
      charity_name: "",
      ein: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      is_501c3: true,
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Saved Charities</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Charity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Charity</DialogTitle>
              <DialogDescription>
                Save charity information for quick selection when recording donations
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="charity_name">Organization Name *</Label>
                <Input
                  id="charity_name"
                  value={formData.charity_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, charity_name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ein">EIN (Tax ID)</Label>
                  <Input
                    id="ein"
                    value={formData.ein}
                    onChange={(e) => setFormData(prev => ({ ...prev, ein: e.target.value }))}
                    placeholder="XX-XXXXXXX"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={formData.is_501c3}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_501c3: checked }))}
                  />
                  <Label>501(c)(3)</Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    maxLength={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCharity.isPending}>
                  {createCharity.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Charity
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {charities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No saved charities yet.</p>
            <p className="text-sm mt-2">Add charities you donate to regularly for quick selection.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {charities.map((charity) => (
            <Card key={charity.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {charity.charity_name}
                  <Badge variant={charity.is_501c3 ? "default" : "secondary"}>
                    {charity.is_501c3 ? "501(c)(3)" : "Other"}
                  </Badge>
                </CardTitle>
                {charity.ein && (
                  <CardDescription>EIN: {charity.ein}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {(charity.address || charity.city) && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      {charity.address && <>{charity.address}<br /></>}
                      {charity.city && `${charity.city}, `}
                      {charity.state} {charity.zip}
                    </span>
                  </div>
                )}
                {charity.contact_email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{charity.contact_email}</span>
                  </div>
                )}
                {charity.contact_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{charity.contact_phone}</span>
                  </div>
                )}
                {charity.total_donations > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">
                      {charity.total_donations} donation{charity.total_donations !== 1 ? 's' : ''} recorded
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
