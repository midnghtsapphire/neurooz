import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Calculator,
  TrendingDown,
  DollarSign,
  Layers,
  Edit,
  Trash2,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  useDepreciationMethods,
  useProductDepreciation,
  useTrailingGroups,
  useCreateProductDepreciation,
  useUpdateProductDepreciation,
  useDeleteProductDepreciation,
  useCreateTrailingGroup,
  useDeleteTrailingGroup,
  useDepreciationStats,
  calculateDepreciationSchedule,
  DepreciationMethod,
  ProductDepreciation,
} from "@/hooks/use-depreciation";
import { useRentalInventory } from "@/hooks/use-rental-inventory";
import { toast } from "@/hooks/use-toast";

interface DepreciationCalculatorTabProps {
  userId: string;
}

const BUSINESS_TYPES = ["LLC", "S-Corp", "C-Corp", "Sole Proprietor"];

export function DepreciationCalculatorTab({ userId }: DepreciationCalculatorTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDepreciation | null>(null);
  const [activeTab, setActiveTab] = useState("products");

  // Form state
  const [formData, setFormData] = useState({
    product_name: "",
    original_cost: 0,
    purchase_date: new Date().toISOString().split("T")[0],
    depreciation_method_id: "",
    inventory_id: "",
    section_179_amount: 0,
    bonus_depreciation_percent: 0,
    is_trailing_product: false,
    trailing_group_id: "",
    notes: "",
    business_type: "LLC",
  });

  const [groupFormData, setGroupFormData] = useState({
    group_name: "",
    category: "",
    description: "",
  });

  // Queries
  const { data: methods = [], isLoading: methodsLoading } = useDepreciationMethods();
  const { data: products = [], isLoading: productsLoading } = useProductDepreciation(userId);
  const { data: groups = [] } = useTrailingGroups(userId);
  const { data: inventory = [] } = useRentalInventory(userId);
  const stats = useDepreciationStats(products);

  // Mutations
  const createProduct = useCreateProductDepreciation();
  const updateProduct = useUpdateProductDepreciation();
  const deleteProduct = useDeleteProductDepreciation();
  const createGroup = useCreateTrailingGroup();
  const deleteGroup = useDeleteTrailingGroup();

  // Calculate preview schedule
  const previewSchedule = useMemo(() => {
    if (!formData.depreciation_method_id || !formData.original_cost) return [];
    
    const method = methods.find((m) => m.id === formData.depreciation_method_id);
    if (!method) return [];
    
    return calculateDepreciationSchedule(
      formData.original_cost,
      new Date(formData.purchase_date),
      method,
      formData.section_179_amount,
      formData.bonus_depreciation_percent
    );
  }, [formData.depreciation_method_id, formData.original_cost, formData.purchase_date, formData.section_179_amount, formData.bonus_depreciation_percent, methods]);

  const selectedMethod = methods.find((m) => m.id === formData.depreciation_method_id);

  const handleSubmit = async () => {
    if (!formData.product_name || !formData.depreciation_method_id) {
      toast({
        title: "Missing required fields",
        description: "Please fill in product name and select a depreciation method.",
        variant: "destructive",
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const firstYearDeduction = previewSchedule[0];
    
    const productData = {
      user_id: userId,
      product_name: formData.product_name,
      original_cost: formData.original_cost,
      purchase_date: formData.purchase_date,
      depreciation_method_id: formData.depreciation_method_id,
      inventory_id: formData.inventory_id || null,
      current_year: currentYear,
      accumulated_depreciation: firstYearDeduction?.depreciation_amount || 0,
      current_book_value: firstYearDeduction?.ending_book_value || formData.original_cost,
      section_179_taken: formData.section_179_amount,
      bonus_depreciation_taken: (formData.original_cost - formData.section_179_amount) * (formData.bonus_depreciation_percent / 100),
      is_trailing_product: formData.is_trailing_product,
      trailing_group_id: formData.trailing_group_id || null,
      notes: formData.notes || null,
    };

    try {
      if (selectedProduct) {
        await updateProduct.mutateAsync({ id: selectedProduct.id, ...productData });
        toast({ title: "Product updated successfully" });
      } else {
        await createProduct.mutateAsync(productData);
        toast({ title: "Product added for depreciation tracking" });
      }
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error saving product",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: ProductDepreciation) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name,
      original_cost: product.original_cost,
      purchase_date: product.purchase_date,
      depreciation_method_id: product.depreciation_method_id || "",
      inventory_id: product.inventory_id || "",
      section_179_amount: product.section_179_taken,
      bonus_depreciation_percent: product.original_cost > 0 
        ? (product.bonus_depreciation_taken / (product.original_cost - product.section_179_taken)) * 100 
        : 0,
      is_trailing_product: product.is_trailing_product,
      trailing_group_id: product.trailing_group_id || "",
      notes: product.notes || "",
      business_type: "LLC",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this depreciation record?")) {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Record deleted" });
    }
  };

  const handleCreateGroup = async () => {
    if (!groupFormData.group_name) return;
    
    await createGroup.mutateAsync({
      user_id: userId,
      group_name: groupFormData.group_name,
      category: groupFormData.category || undefined,
      description: groupFormData.description || undefined,
    });
    
    setGroupFormData({ group_name: "", category: "", description: "" });
    setIsGroupDialogOpen(false);
    toast({ title: "Trailing group created" });
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      product_name: "",
      original_cost: 0,
      purchase_date: new Date().toISOString().split("T")[0],
      depreciation_method_id: "",
      inventory_id: "",
      section_179_amount: 0,
      bonus_depreciation_percent: 0,
      is_trailing_product: false,
      trailing_group_id: "",
      notes: "",
      business_type: "LLC",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getMethodBadgeColor = (methodType: string) => {
    switch (methodType) {
      case "macrs_5":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "macrs_7":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "section_179":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "straight_line_5":
      case "straight_line_7":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "";
    }
  };

  // Group products by trailing group
  const productsByGroup = useMemo(() => {
    const grouped: Record<string, ProductDepreciation[]> = { ungrouped: [] };
    
    groups.forEach((g) => {
      grouped[g.id] = [];
    });
    
    products.forEach((p) => {
      if (p.trailing_group_id && grouped[p.trailing_group_id]) {
        grouped[p.trailing_group_id].push(p);
      } else {
        grouped.ungrouped.push(p);
      }
    });
    
    return grouped;
  }, [products, groups]);

  const isLoading = methodsLoading || productsLoading;

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
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Original Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalOriginalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accumulated Depr.</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAccumulatedDepreciation)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Book Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalBookValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trailing Groups</p>
                <p className="text-2xl font-bold">{stats.trailingProducts}/{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="trailing">Trailing Groups</TabsTrigger>
            <TabsTrigger value="methods">Methods Reference</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {activeTab === "trailing" && (
              <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    New Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Trailing Group</DialogTitle>
                    <DialogDescription>
                      Group similar products to compare depreciation across years
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Group Name *</Label>
                      <Input
                        value={groupFormData.group_name}
                        onChange={(e) => setGroupFormData({ ...groupFormData, group_name: e.target.value })}
                        placeholder="e.g., Air Fryers"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={groupFormData.category}
                        onChange={(e) => setGroupFormData({ ...groupFormData, category: e.target.value })}
                        placeholder="e.g., Kitchen Appliances"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={groupFormData.description}
                        onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGroup}>Create Group</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? "Edit Depreciation Record" : "Add Product for Depreciation"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure depreciation method and calculate schedule
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-6 py-4">
                  {/* Left Column - Product Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Product Details
                    </h3>
                    
                    <div>
                      <Label>Link to Inventory (Optional)</Label>
                      <Select
                        value={formData.inventory_id}
                        onValueChange={(value) => {
                          const item = inventory.find((i) => i.id === value);
                          setFormData({
                            ...formData,
                            inventory_id: value,
                            product_name: item?.product_name || formData.product_name,
                            original_cost: item?.purchase_price || formData.original_cost,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inventory item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {inventory.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.product_name} ({formatCurrency(item.purchase_price)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Product Name *</Label>
                      <Input
                        value={formData.product_name}
                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        placeholder="Air Fryer XL"
                      />
                    </div>

                    <div>
                      <Label>Original Cost (Basis) *</Label>
                      <Input
                        type="number"
                        value={formData.original_cost}
                        onChange={(e) => setFormData({ ...formData, original_cost: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label>Purchase Date *</Label>
                      <Input
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Business Type</Label>
                      <Select
                        value={formData.business_type}
                        onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="is_trailing"
                        checked={formData.is_trailing_product}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, is_trailing_product: checked as boolean })
                        }
                      />
                      <Label htmlFor="is_trailing" className="cursor-pointer">
                        This is a trailing product (compare with similar products)
                      </Label>
                    </div>

                    {formData.is_trailing_product && (
                      <div>
                        <Label>Trailing Group</Label>
                        <Select
                          value={formData.trailing_group_id}
                          onValueChange={(value) => setFormData({ ...formData, trailing_group_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select or create a group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.group_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Notes</Label>
                      <Input
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>

                  {/* Right Column - Depreciation Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Depreciation Method
                    </h3>

                    <div>
                      <Label>Method *</Label>
                      <Select
                        value={formData.depreciation_method_id}
                        onValueChange={(value) => setFormData({ ...formData, depreciation_method_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select depreciation method" />
                        </SelectTrigger>
                        <SelectContent>
                          {methods
                            .filter((m) => m.business_types.includes(formData.business_type))
                            .map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedMethod && (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">{selectedMethod.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {selectedMethod.useful_life_years} year{selectedMethod.useful_life_years !== 1 ? "s" : ""}
                            </Badge>
                            {selectedMethod.first_year_bonus_eligible && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                                Bonus Eligible
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedMethod?.method_type !== "section_179" && (
                      <>
                        <div>
                          <Label>Section 179 Deduction ($)</Label>
                          <Input
                            type="number"
                            value={formData.section_179_amount}
                            onChange={(e) => 
                              setFormData({ ...formData, section_179_amount: parseFloat(e.target.value) || 0 })
                            }
                            placeholder="0.00"
                            max={formData.original_cost}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Max deduction for 2024: $1,220,000
                          </p>
                        </div>

                        {selectedMethod?.first_year_bonus_eligible && (
                          <div>
                            <Label>Bonus Depreciation (%)</Label>
                            <Input
                              type="number"
                              value={formData.bonus_depreciation_percent}
                              onChange={(e) => 
                                setFormData({ ...formData, bonus_depreciation_percent: parseFloat(e.target.value) || 0 })
                              }
                              placeholder="0"
                              min={0}
                              max={100}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              2024: 60%, 2025: 40%, 2026: 20%
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Preview Schedule */}
                    {previewSchedule.length > 0 && (
                      <div className="pt-4">
                        <h4 className="font-semibold text-sm mb-2">Depreciation Schedule Preview</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="py-2">Year</TableHead>
                                <TableHead className="py-2 text-right">Deduction</TableHead>
                                <TableHead className="py-2 text-right">Book Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {previewSchedule.map((entry) => (
                                <TableRow key={entry.tax_year}>
                                  <TableCell className="py-2">
                                    {entry.tax_year}
                                    {entry.is_first_year && (
                                      <Badge variant="outline" className="ml-2 text-xs">1st</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="py-2 text-right font-medium">
                                    {formatCurrency(
                                      entry.depreciation_amount + 
                                      entry.section_179_amount + 
                                      entry.bonus_depreciation_amount
                                    )}
                                  </TableCell>
                                  <TableCell className="py-2 text-right">
                                    {formatCurrency(entry.ending_book_value)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Total first year deduction: {formatCurrency(
                            (previewSchedule[0]?.depreciation_amount || 0) +
                            (previewSchedule[0]?.section_179_amount || 0) +
                            (previewSchedule[0]?.bonus_depreciation_amount || 0)
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={createProduct.isPending || updateProduct.isPending}>
                    {selectedProduct ? "Update" : "Add"} Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Depreciation Tracking</CardTitle>
              <CardDescription>
                Track depreciation for all your business assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No products tracked yet.</p>
                  <p className="text-sm">Add your first product to start tracking depreciation.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Original Cost</TableHead>
                        <TableHead className="text-right">Accumulated</TableHead>
                        <TableHead className="text-right">Book Value</TableHead>
                        <TableHead>Trailing</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const method = methods.find((m) => m.id === product.depreciation_method_id);
                        const group = groups.find((g) => g.id === product.trailing_group_id);
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{product.product_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Purchased: {new Date(product.purchase_date).toLocaleDateString()}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {method && (
                                <Badge className={getMethodBadgeColor(method.method_type)}>
                                  {method.name}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.original_cost)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              -{formatCurrency(product.accumulated_depreciation)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(product.current_book_value)}
                            </TableCell>
                            <TableCell>
                              {product.is_trailing_product ? (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                  {group?.group_name || "Ungrouped"}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trailing Groups Tab */}
        <TabsContent value="trailing">
          <Card>
            <CardHeader>
              <CardTitle>Trailing Product Groups</CardTitle>
              <CardDescription>
                Compare similar products purchased over different years
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No trailing groups yet.</p>
                  <p className="text-sm">Create a group to compare similar products.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {groups.map((group) => {
                    const groupProducts = productsByGroup[group.id] || [];
                    const groupTotal = groupProducts.reduce((sum, p) => sum + p.original_cost, 0);
                    const groupBookValue = groupProducts.reduce((sum, p) => sum + p.current_book_value, 0);
                    
                    return (
                      <AccordionItem 
                        key={group.id} 
                        value={group.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <Layers className="w-5 h-5 text-primary" />
                              <div className="text-left">
                                <p className="font-medium">{group.group_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {groupProducts.length} product{groupProducts.length !== 1 ? "s" : ""} • {group.category || "No category"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right mr-4">
                              <p className="font-medium">{formatCurrency(groupBookValue)}</p>
                              <p className="text-xs text-muted-foreground">
                                of {formatCurrency(groupTotal)} original
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {groupProducts.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                              No products in this group yet.
                            </p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Purchase Year</TableHead>
                                  <TableHead className="text-right">Original</TableHead>
                                  <TableHead className="text-right">Book Value</TableHead>
                                  <TableHead className="text-right">% Remaining</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {groupProducts
                                  .sort((a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime())
                                  .map((product, index) => {
                                    const percentRemaining = product.original_cost > 0
                                      ? (product.current_book_value / product.original_cost) * 100
                                      : 0;
                                    
                                    return (
                                      <TableRow key={product.id}>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                              #{index + 1}
                                            </Badge>
                                            {product.product_name}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {new Date(product.purchase_date).getFullYear()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {formatCurrency(product.original_cost)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {formatCurrency(product.current_book_value)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Badge 
                                            variant="outline"
                                            className={
                                              percentRemaining > 50 
                                                ? "bg-green-500/10 text-green-600" 
                                                : percentRemaining > 20 
                                                  ? "bg-yellow-500/10 text-yellow-600"
                                                  : "bg-red-500/10 text-red-600"
                                            }
                                          >
                                            {percentRemaining.toFixed(1)}%
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          )}
                          <div className="flex justify-end pt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => {
                                if (confirm("Delete this group? Products will be ungrouped.")) {
                                  deleteGroup.mutate(group.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Group
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methods Reference Tab */}
        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Depreciation Methods Reference</CardTitle>
              <CardDescription>
                Available depreciation methods and their schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {methods.map((method) => (
                  <Card key={method.id} className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{method.name}</CardTitle>
                          <Badge className={`mt-1 ${getMethodBadgeColor(method.method_type)}`}>
                            {method.method_type.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        {method.first_year_bonus_eligible && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            Bonus Eligible
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">
                          {method.useful_life_years} year{method.useful_life_years !== 1 ? "s" : ""}
                        </Badge>
                        {method.business_types.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>

                      {method.year_percentages && method.year_percentages.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            YEARLY PERCENTAGES:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {method.year_percentages.map((pct, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                Y{idx + 1}: {pct}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
