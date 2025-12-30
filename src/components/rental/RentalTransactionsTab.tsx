import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Receipt, DollarSign, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useRentalInventory } from "@/hooks/use-rental-inventory";
import {
  useRentalTransactions,
  useRentalCustomers,
  useCreateRentalTransaction,
  useCompleteRentalTransaction,
  useDeleteRentalTransaction,
  useTransactionStats,
  RentalTransactionInput,
} from "@/hooks/use-rental-transactions";
import { format } from "date-fns";

interface RentalTransactionsTabProps {
  userId: string;
}

export function RentalTransactionsTab({ userId }: RentalTransactionsTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [formData, setFormData] = useState<RentalTransactionInput>({
    inventory_id: "",
    rental_start_date: format(new Date(), "yyyy-MM-dd"),
    days_rented: 1,
    daily_rate: 0,
    security_deposit: 50,
    payment_method: "cash",
    payment_received: false,
    agreement_signed: false,
  });
  const [returnData, setReturnData] = useState({
    returned_on_time: true,
    return_condition: "good",
    has_damage: false,
    damage_description: "",
    repair_cost: 0,
  });

  const { data: transactions = [], isLoading } = useRentalTransactions(userId);
  const { data: inventory = [] } = useRentalInventory(userId);
  const { data: customers = [] } = useRentalCustomers(userId);
  const createTransaction = useCreateRentalTransaction();
  const completeTransaction = useCompleteRentalTransaction();
  const deleteTransaction = useDeleteRentalTransaction();
  const stats = useTransactionStats(transactions);

  const availableInventory = inventory.filter((item) => item.status === "available");

  const handleSubmit = async () => {
    if (!formData.inventory_id) return;

    await createTransaction.mutateAsync({
      ...formData,
      user_id: userId,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleReturn = async () => {
    if (!selectedTransaction) return;

    const transaction = transactions.find((t) => t.id === selectedTransaction);
    if (!transaction) return;

    const depositRefunded = returnData.has_damage
      ? Math.max(0, transaction.security_deposit - returnData.repair_cost)
      : transaction.security_deposit;

    await completeTransaction.mutateAsync({
      id: selectedTransaction,
      inventory_id: transaction.inventory_id || undefined,
      ...returnData,
      deposit_refunded: depositRefunded,
      subtotal: transaction.subtotal,
    });

    setIsReturnDialogOpen(false);
    setSelectedTransaction(null);
  };

  const resetForm = () => {
    setFormData({
      inventory_id: "",
      rental_start_date: format(new Date(), "yyyy-MM-dd"),
      days_rented: 1,
      daily_rate: 0,
      security_deposit: 50,
      payment_method: "cash",
      payment_received: false,
      agreement_signed: false,
    });
  };

  const handleInventorySelect = (inventoryId: string) => {
    const item = inventory.find((i) => i.id === inventoryId);
    if (item) {
      setFormData({
        ...formData,
        inventory_id: inventoryId,
        daily_rate: item.daily_rate,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getInventoryName = (inventoryId: string | null) => {
    if (!inventoryId) return "Unknown";
    const item = inventory.find((i) => i.id === inventoryId);
    return item?.product_name || "Unknown";
  };

  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return "Walk-in";
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rentals</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Rate</p>
                <p className="text-2xl font-bold">{stats.paymentRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Damage Rate</p>
                <p className="text-2xl font-bold">{stats.damageRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rental Transactions</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                New Rental
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Rental</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Product *</Label>
                  <Select
                    value={formData.inventory_id}
                    onValueChange={handleInventorySelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInventory.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.product_name} - {formatCurrency(item.daily_rate)}/day
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Customer</Label>
                  <Select
                    value={formData.customer_id || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customer_id: value || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Walk-in customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Walk-in</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.rental_start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, rental_start_date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Days</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.days_rented}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          days_rented: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Daily Rate</Label>
                    <Input
                      type="number"
                      value={formData.daily_rate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          daily_rate: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Security Deposit</Label>
                    <Input
                      type="number"
                      value={formData.security_deposit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          security_deposit: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="venmo">Venmo</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {formatCurrency((formData.days_rented || 0) * (formData.daily_rate || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit:</span>
                    <span>{formatCurrency(formData.security_deposit || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>
                      {formatCurrency(
                        (formData.days_rented || 0) * (formData.daily_rate || 0) +
                          (formData.security_deposit || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createTransaction.isPending || !formData.inventory_id}
                >
                  Create Rental
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet.</p>
              <p className="text-sm">Create your first rental to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.transaction_number}
                      </TableCell>
                      <TableCell>{getInventoryName(transaction.inventory_id)}</TableCell>
                      <TableCell>{getCustomerName(transaction.customer_id)}</TableCell>
                      <TableCell>
                        {format(new Date(transaction.rental_start_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.days_rented}</TableCell>
                      <TableCell>{formatCurrency(transaction.total_charged)}</TableCell>
                      <TableCell>
                        {transaction.returned_on_time !== null ? (
                          <Badge className="bg-green-500/10 text-green-600">Returned</Badge>
                        ) : (
                          <Badge className="bg-yellow-500/10 text-yellow-600">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {transaction.returned_on_time === null && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTransaction(transaction.id);
                                setIsReturnDialogOpen(true);
                              }}
                            >
                              Return
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTransaction.mutateAsync(transaction.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Return</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Return Condition</Label>
              <Select
                value={returnData.return_condition}
                onValueChange={(value) =>
                  setReturnData({ ...returnData, return_condition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has_damage"
                checked={returnData.has_damage}
                onChange={(e) =>
                  setReturnData({ ...returnData, has_damage: e.target.checked })
                }
              />
              <Label htmlFor="has_damage">Has Damage</Label>
            </div>
            {returnData.has_damage && (
              <>
                <div>
                  <Label>Damage Description</Label>
                  <Input
                    value={returnData.damage_description}
                    onChange={(e) =>
                      setReturnData({ ...returnData, damage_description: e.target.value })
                    }
                    placeholder="Describe the damage"
                  />
                </div>
                <div>
                  <Label>Repair Cost</Label>
                  <Input
                    type="number"
                    value={returnData.repair_cost}
                    onChange={(e) =>
                      setReturnData({
                        ...returnData,
                        repair_cost: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturn} disabled={completeTransaction.isPending}>
              Complete Return
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
