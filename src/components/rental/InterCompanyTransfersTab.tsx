import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, ArrowLeftRight, DollarSign, FileText, CheckCircle, Trash2 } from "lucide-react";
import {
  useInterCompanyTransfers,
  useCreateInterCompanyTransfer,
  useMarkTransferPaid,
  useDeleteInterCompanyTransfer,
  useTransferStats,
  suggestPricing,
  calculatePricingPercentage,
  InterCompanyTransferInput,
} from "@/hooks/use-inter-company-transfers";
import { format } from "date-fns";

interface InterCompanyTransfersTabProps {
  userId: string;
}

const ENTITIES = [
  "Review Insights LLC",
  "Rocky Mountain Rentals LLC",
  "Rocky Mountain Marketing Services",
];

const PRICING_METHODS = [
  "50% of ETV (Brand)",
  "20% of ETV (Non-Brand)",
  "Fair Market Value",
  "Open-Box Comparable",
  "Used Market Price",
];

export function InterCompanyTransfersTab({ userId }: InterCompanyTransfersTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);
  const [formData, setFormData] = useState<InterCompanyTransferInput>({
    from_entity: "Review Insights LLC",
    to_entity: "Rocky Mountain Rentals LLC",
    product_name: "",
    original_etv: 0,
    sale_price: 0,
    pricing_method: "50% of ETV (Brand)",
    comparable_evidence: "",
    payment_due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    notes: "",
  });
  const [paymentData, setPaymentData] = useState({
    payment_received_date: format(new Date(), "yyyy-MM-dd"),
    payment_method: "check",
    check_number: "",
  });

  const { data: transfers = [], isLoading } = useInterCompanyTransfers(userId);
  const createTransfer = useCreateInterCompanyTransfer();
  const markPaid = useMarkTransferPaid();
  const deleteTransfer = useDeleteInterCompanyTransfer();
  const stats = useTransferStats(transfers);

  const handleSubmit = async () => {
    if (!formData.product_name || !formData.from_entity || !formData.to_entity) return;

    await createTransfer.mutateAsync({
      ...formData,
      user_id: userId,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleMarkPaid = async () => {
    if (!selectedTransfer) return;

    await markPaid.mutateAsync({
      id: selectedTransfer,
      ...paymentData,
    });

    setIsPaymentDialogOpen(false);
    setSelectedTransfer(null);
  };

  const resetForm = () => {
    setFormData({
      from_entity: "Review Insights LLC",
      to_entity: "Rocky Mountain Rentals LLC",
      product_name: "",
      original_etv: 0,
      sale_price: 0,
      pricing_method: "50% of ETV (Brand)",
      comparable_evidence: "",
      payment_due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      notes: "",
    });
  };

  const handlePricingMethodChange = (method: string) => {
    let suggestedPrice = formData.sale_price;
    const etv = formData.original_etv || 0;

    if (method.includes("50%")) {
      suggestedPrice = etv * 0.5;
    } else if (method.includes("20%")) {
      suggestedPrice = etv * 0.2;
    }

    setFormData({
      ...formData,
      pricing_method: method,
      sale_price: suggestedPrice,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transfers</p>
                <p className="text-2xl font-bold">{stats.totalTransfers}</p>
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
                <p className="text-2xl font-bold">{formatCurrency(stats.totalSalePrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <ArrowLeftRight className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Pricing</p>
                <p className="text-2xl font-bold">{stats.averagePricingPercent.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unpaid</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.unpaidAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inter-Company Transfers</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                New Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Record Inter-Company Transfer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Entity</Label>
                    <Select
                      value={formData.from_entity}
                      onValueChange={(value) =>
                        setFormData({ ...formData, from_entity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITIES.map((entity) => (
                          <SelectItem key={entity} value={entity}>
                            {entity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To Entity</Label>
                    <Select
                      value={formData.to_entity}
                      onValueChange={(value) =>
                        setFormData({ ...formData, to_entity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITIES.filter((e) => e !== formData.from_entity).map((entity) => (
                          <SelectItem key={entity} value={entity}>
                            {entity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    placeholder="Air Fryer XL"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    />
                  </div>
                  <div>
                    <Label>Sale Price</Label>
                    <Input
                      type="number"
                      value={formData.sale_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sale_price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Pricing Method</Label>
                  <Select
                    value={formData.pricing_method}
                    onValueChange={handlePricingMethodChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Comparable Evidence</Label>
                  <Textarea
                    value={formData.comparable_evidence}
                    onChange={(e) =>
                      setFormData({ ...formData, comparable_evidence: e.target.value })
                    }
                    placeholder="Best Buy open-box: $70-80, eBay used: $65-75"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Payment Due Date</Label>
                  <Input
                    type="date"
                    value={formData.payment_due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_due_date: e.target.value })
                    }
                  />
                </div>
                {formData.original_etv > 0 && formData.sale_price > 0 && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Pricing as % of ETV:{" "}
                      <span className="font-bold text-foreground">
                        {calculatePricingPercentage(
                          formData.original_etv,
                          formData.sale_price
                        ).toFixed(1)}
                        %
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tax reduction:{" "}
                      <span className="font-bold text-green-600">
                        {formatCurrency(formData.original_etv - formData.sale_price)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createTransfer.isPending || !formData.product_name}
                >
                  Record Transfer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No inter-company transfers yet.</p>
              <p className="text-sm">Record your first transfer to track product movement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>ETV</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono text-sm">
                        {transfer.invoice_number}
                      </TableCell>
                      <TableCell className="font-medium">{transfer.product_name}</TableCell>
                      <TableCell className="text-sm">
                        <span className="text-muted-foreground">
                          {transfer.from_entity.split(" ")[0]} →{" "}
                          {transfer.to_entity.split(" ")[0]}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(transfer.original_etv)}</TableCell>
                      <TableCell>{formatCurrency(transfer.sale_price)}</TableCell>
                      <TableCell>
                        {transfer.payment_received_date ? (
                          <Badge className="bg-green-500/10 text-green-600">Paid</Badge>
                        ) : (
                          <Badge className="bg-yellow-500/10 text-yellow-600">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!transfer.payment_received_date && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTransfer(transfer.id);
                                setIsPaymentDialogOpen(true);
                              }}
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTransfer.mutateAsync(transfer.id)}
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

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Payment Date</Label>
              <Input
                type="date"
                value={paymentData.payment_received_date}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, payment_received_date: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select
                value={paymentData.payment_method}
                onValueChange={(value) =>
                  setPaymentData({ ...paymentData, payment_method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                  <SelectItem value="ach">ACH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Check/Reference Number</Label>
              <Input
                value={paymentData.check_number}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, check_number: e.target.value })
                }
                placeholder="1001"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkPaid} disabled={markPaid.isPending}>
              Record Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
