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
import { Plus, Package, DollarSign, TrendingUp, Edit, Trash2 } from "lucide-react";
import {
  useRentalInventory,
  useCreateRentalInventory,
  useUpdateRentalInventory,
  useDeleteRentalInventory,
  useInventoryStats,
  RentalInventoryInput,
} from "@/hooks/use-rental-inventory";

interface RentalInventoryTabProps {
  userId: string;
}

const CATEGORIES = [
  "Tools",
  "Kitchen",
  "Party Supplies",
  "Outdoor",
  "Electronics",
  "Fitness",
  "Cleaning",
  "Photography",
  "Other",
];

const CONDITIONS = ["new", "excellent", "good", "fair", "poor"];
const STATUSES = ["available", "rented", "maintenance"];

export function RentalInventoryTab({ userId }: RentalInventoryTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState<RentalInventoryInput>({
    product_name: "",
    description: "",
    category: "Tools",
    original_etv: 0,
    purchase_price: 0,
    source: "purchase",
    daily_rate: 0,
    weekly_rate: 0,
    condition: "new",
    status: "available",
    location: "",
  });

  const { data: inventory = [], isLoading } = useRentalInventory(userId);
  const createItem = useCreateRentalInventory();
  const updateItem = useUpdateRentalInventory();
  const deleteItem = useDeleteRentalInventory();
  const stats = useInventoryStats(inventory);

  const handleSubmit = async () => {
    if (!formData.product_name) return;

    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem, ...formData });
    } else {
      await createItem.mutateAsync({ ...formData, user_id: userId });
    }

    resetForm();
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: typeof inventory[0]) => {
    setFormData({
      product_name: item.product_name,
      description: item.description || "",
      category: item.category || "Tools",
      original_etv: item.original_etv,
      purchase_price: item.purchase_price,
      source: item.source,
      daily_rate: item.daily_rate,
      weekly_rate: item.weekly_rate,
      condition: item.condition,
      status: item.status,
      location: item.location || "",
    });
    setEditingItem(item.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      description: "",
      category: "Tools",
      original_etv: 0,
      purchase_price: 0,
      source: "purchase",
      daily_rate: 0,
      weekly_rate: 0,
      condition: "new",
      status: "available",
      location: "",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rented":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "maintenance":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
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
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
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
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rental Income</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRentalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">
                  {stats.availableItems}/{stats.totalItems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Catalog</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingItem(null);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    placeholder="Air Fryer XL"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="8-quart digital air fryer with accessories"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData({ ...formData, source: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review_insights">Review Insights LLC</SelectItem>
                      <SelectItem value="purchase">Direct Purchase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Original ETV</Label>
                  <Input
                    type="number"
                    value={formData.original_etv}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        original_etv: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Purchase Price (Basis)</Label>
                  <Input
                    type="number"
                    value={formData.purchase_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchase_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
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
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Weekly Rate</Label>
                  <Input
                    type="number"
                    value={formData.weekly_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weekly_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData({ ...formData, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((cond) => (
                        <SelectItem key={cond} value={cond}>
                          {cond.charAt(0).toUpperCase() + cond.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Shelf A-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createItem.isPending || updateItem.isPending}
                >
                  {editingItem ? "Update" : "Add"} Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No inventory items yet.</p>
              <p className="text-sm">Add your first rental item to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Daily Rate</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Times Rented</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{formatCurrency(item.daily_rate)}</TableCell>
                      <TableCell>{formatCurrency(item.purchase_price)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.times_rented}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
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
    </div>
  );
}
