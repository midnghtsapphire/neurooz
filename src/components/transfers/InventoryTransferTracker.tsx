import { useState } from "react";
import { Package, Calendar, ArrowRight, Clock, DollarSign, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryTransfers, useCreateInventoryTransfer, useUpdateInventoryTransfer, getPendingWithCountdown, getEligibleTransfers } from "@/hooks/use-inventory-transfers";
import { useBusinesses } from "@/hooks/use-businesses";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";

export function InventoryTransferTracker() {
  const { data: transfers = [], isLoading } = useInventoryTransfers();
  const { data: businesses = [] } = useBusinesses();
  const createTransfer = useCreateInventoryTransfer();
  const updateTransfer = useUpdateInventoryTransfer();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTransfer, setNewTransfer] = useState<{
    product_name: string;
    original_etv: number;
    vine_order_date: string;
    to_entity: string;
    transfer_type: 'capital_contribution' | 'sale' | 'donation';
  }>({
    product_name: "",
    original_etv: 0,
    vine_order_date: format(new Date(), "yyyy-MM-dd"),
    to_entity: "",
    transfer_type: "capital_contribution",
  });

  const pendingWithCountdown = getPendingWithCountdown(transfers);
  const eligibleTransfers = getEligibleTransfers(transfers);
  const completedTransfers = transfers.filter(t => ['transferred', 'donated', 'sold'].includes(t.status));
  
  const totalETV = transfers.reduce((sum, t) => sum + t.original_etv, 0);
  const totalTransferred = completedTransfers.reduce((sum, t) => sum + t.original_etv, 0);
  const totalSection179 = completedTransfers.reduce((sum, t) => sum + t.section_179_amount, 0);

  const handleAddTransfer = async () => {
    const { data: { user } } = await (await import("@/integrations/supabase/client")).supabase.auth.getUser();
    if (!user) return;

    await createTransfer.mutateAsync({
      user_id: user.id,
      product_name: newTransfer.product_name,
      original_etv: newTransfer.original_etv,
      vine_order_date: newTransfer.vine_order_date,
      to_entity: newTransfer.to_entity || "Review Insights LLC",
      from_entity: "Personal",
      transfer_type: newTransfer.transfer_type,
      status: "pending",
      source_product_id: null,
      transfer_date: null,
      capital_contribution_basis: newTransfer.original_etv,
      fmv_at_transfer: 0,
      depreciation_method: "MACRS",
      useful_life_years: 5,
      placed_in_service_date: null,
      is_section_179_eligible: true,
      section_179_amount: 0,
      bonus_depreciation_amount: 0,
      notes: null,
    });
    
    setShowAddDialog(false);
    setNewTransfer({
      product_name: "",
      original_etv: 0,
      vine_order_date: format(new Date(), "yyyy-MM-dd"),
      to_entity: "",
      transfer_type: "capital_contribution",
    });
  };

  const handleTransfer = async (transfer: typeof transfers[0]) => {
    await updateTransfer.mutateAsync({
      id: transfer.id,
      status: "transferred",
      transfer_date: format(new Date(), "yyyy-MM-dd"),
      placed_in_service_date: format(new Date(), "yyyy-MM-dd"),
      section_179_amount: transfer.original_etv, // Full Section 179 for 2025+
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'eligible': return 'bg-emerald-500/20 text-emerald-500';
      case 'transferred': return 'bg-primary/20 text-primary';
      case 'donated': return 'bg-blue-500/20 text-blue-500';
      case 'sold': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Inventory Transfer Tracker
          </h2>
          <p className="text-muted-foreground mt-1">
            Track 6-month hold periods and capital contributions
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>Add Vine Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Track New Vine Product</DialogTitle>
              <DialogDescription>
                Add a product to track its 6-month hold period before transfer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input 
                  value={newTransfer.product_name}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, product_name: e.target.value }))}
                  placeholder="e.g., Telescope, Tractor, etc."
                />
              </div>
              <div>
                <Label>Estimated Tax Value (ETV)</Label>
                <Input 
                  type="number"
                  value={newTransfer.original_etv}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, original_etv: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Vine Order Date</Label>
                <Input 
                  type="date"
                  value={newTransfer.vine_order_date}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, vine_order_date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Transfer To Entity</Label>
                <Select 
                  value={newTransfer.to_entity}
                  onValueChange={(v) => setNewTransfer(prev => ({ ...prev, to_entity: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Review Insights LLC">Review Insights LLC</SelectItem>
                    <SelectItem value="Rental LLC">Rental LLC</SelectItem>
                    {businesses.map(b => (
                      <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transfer Type</Label>
                <Select 
                  value={newTransfer.transfer_type}
                  onValueChange={(v: 'capital_contribution' | 'sale' | 'donation') => setNewTransfer(prev => ({ ...prev, transfer_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capital_contribution">Capital Contribution (Non-taxable)</SelectItem>
                    <SelectItem value="sale">Sale to Entity</SelectItem>
                    <SelectItem value="donation">Charitable Donation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddTransfer} disabled={!newTransfer.product_name || createTransfer.isPending}>
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total ETV Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalETV.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{eligibleTransfers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transferred Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalTransferred.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Section 179 Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${totalSection179.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Eligible for Transfer Alert */}
      {eligibleTransfers.length > 0 && (
        <Card className="border-emerald-500/50 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-500">
              <CheckCircle className="h-5 w-5" />
              {eligibleTransfers.length} Product{eligibleTransfers.length > 1 ? 's' : ''} Ready for Transfer!
            </CardTitle>
            <CardDescription>
              These items have passed the 6-month Amazon hold period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {eligibleTransfers.map(transfer => (
                <div key={transfer.id} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                  <div>
                    <div className="font-medium">{transfer.product_name}</div>
                    <div className="text-sm text-muted-foreground">ETV: ${transfer.original_etv.toLocaleString()}</div>
                  </div>
                  <Button size="sm" onClick={() => handleTransfer(transfer)}>
                    Transfer to {transfer.to_entity}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Transfers with Countdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Transfers
          </CardTitle>
          <CardDescription>
            Products waiting for 6-month hold period to complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingWithCountdown.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending transfers. Add products to track.</p>
          ) : (
            <div className="space-y-3">
              {pendingWithCountdown.map(transfer => {
                const progress = Math.max(0, Math.min(100, ((180 - transfer.daysUntilEligible) / 180) * 100));
                const isEligible = transfer.daysUntilEligible <= 0;
                
                return (
                  <div key={transfer.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{transfer.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ETV: ${transfer.original_etv.toLocaleString()} → {transfer.to_entity}
                        </div>
                      </div>
                      <Badge className={cn(
                        isEligible ? "bg-emerald-500/20 text-emerald-500" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {isEligible ? "Ready!" : `${transfer.daysUntilEligible} days`}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Ordered: {format(new Date(transfer.vine_order_date), "MMM d, yyyy")}</span>
                      <span>Eligible: {format(new Date(transfer.six_month_eligible_date), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Transfers */}
      {completedTransfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Completed Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedTransfers.map(transfer => (
                <div key={transfer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">{transfer.product_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Transferred {transfer.transfer_date ? format(new Date(transfer.transfer_date), "MMM d, yyyy") : ""} 
                      {transfer.section_179_amount > 0 && ` • §179: $${transfer.section_179_amount.toLocaleString()}`}
                    </div>
                  </div>
                  <Badge className={getStatusColor(transfer.status)}>
                    {transfer.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
