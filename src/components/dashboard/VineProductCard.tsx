import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Grape,
  Plus,
  Upload,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Package,
  Clock,
  FileText,
  ArrowRightLeft,
  Calendar,
  DollarSign,
  Clipboard,
  Link as LinkIcon,
  Star,
  Gift
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/use-projects";
import { VineInventoryImport } from "@/components/vine-income/VineInventoryImport";

interface VineProduct {
  id: string;
  product_name: string;
  etv: number;
  order_date: string;
  asin?: string;
  category?: string;
  is_brand: boolean;
  testing_start_date?: string;
  testing_complete_date?: string;
  review_published?: boolean;
  review_url?: string;
  disposition?: string;
  notes?: string;
}

const WIZARD_STEPS = [
  { title: "Import Products", icon: Upload },
  { title: "Product Details", icon: Package },
  { title: "Testing Timeline", icon: Clock },
  { title: "Review Status", icon: FileText },
  { title: "Disposition", icon: ArrowRightLeft },
];

const DISPOSITION_OPTIONS = [
  { value: "keep", label: "Keep (Personal Use)", icon: "🏠" },
  { value: "donate", label: "Donate to Charity", icon: "🎁" },
  { value: "rental", label: "Add to Rental Inventory", icon: "📦" },
  { value: "transfer", label: "Inter-Company Transfer", icon: "🔄" },
  { value: "sell", label: "Sell (After Review Period)", icon: "💰" },
  { value: "broken", label: "Broken/Defective", icon: "❌" },
];

const CATEGORIES = [
  "Electronics", "Home & Kitchen", "Tools", "Office Products", 
  "Sports & Outdoors", "Beauty", "Toys & Games", "Pet Supplies",
  "Health & Household", "Automotive", "Garden", "Other"
];

export function VineProductCard() {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [products, setProducts] = useState<VineProduct[]>([]);
  const [importText, setImportText] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newProduct, setNewProduct] = useState<Partial<VineProduct>>({
    is_brand: false,
    order_date: new Date().toISOString().split('T')[0],
    etv: 0,
  });
  const [userId, setUserId] = useState<string | null>(null);

  const { data: projectsData } = useProjects();
  const vineProjects = projectsData?.filter(p => 
    p.name.toLowerCase().includes('vine') || 
    p.description?.toLowerCase().includes('vine')
  ) || [];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  const fetchProducts = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('products_review_insights')
      .select('*')
      .eq('user_id', userId)
      .order('order_date', { ascending: false })
      .limit(10);
    
    if (data && !error) {
      setProducts(data as VineProduct[]);
    }
  };

  const parseAmazonOrderHistory = (text: string): Partial<VineProduct>[] => {
    // Parse common Amazon order history formats
    const lines = text.split('\n').filter(l => l.trim());
    const products: Partial<VineProduct>[] = [];
    
    // Pattern: "Product Name - $XX.XX - MM/DD/YYYY" or tab-separated
    for (const line of lines) {
      // Try tab-separated first (common from spreadsheet paste)
      const tabParts = line.split('\t');
      if (tabParts.length >= 2) {
        const name = tabParts[0]?.trim();
        const etvMatch = tabParts.find(p => /\$?\d+\.?\d*/.test(p));
        const dateMatch = tabParts.find(p => /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(p));
        const asinMatch = tabParts.find(p => /^B0[A-Z0-9]{8}$/.test(p.trim()));
        
        if (name) {
          products.push({
            product_name: name,
            etv: etvMatch ? parseFloat(etvMatch.replace(/[^0-9.]/g, '')) || 0 : 0,
            order_date: dateMatch ? formatDate(dateMatch) : new Date().toISOString().split('T')[0],
            asin: asinMatch?.trim(),
            is_brand: false,
          });
        }
      } else {
        // Try dash-separated
        const dashParts = line.split(' - ');
        if (dashParts.length >= 2) {
          const name = dashParts[0]?.trim();
          const etvMatch = line.match(/\$(\d+\.?\d*)/);
          const dateMatch = line.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
          
          if (name) {
            products.push({
              product_name: name,
              etv: etvMatch ? parseFloat(etvMatch[1]) : 0,
              order_date: dateMatch ? formatDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
              is_brand: false,
            });
          }
        }
      }
    }
    
    return products;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const parts = dateStr.split(/[\/\-]/);
      if (parts.length === 3) {
        const [month, day, year] = parts;
        const fullYear = year.length === 2 ? `20${year}` : year;
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    } catch {}
    return new Date().toISOString().split('T')[0];
  };

  const handleImport = () => {
    const parsed = parseAmazonOrderHistory(importText);
    if (parsed.length === 0) {
      toast.error("Could not parse any products. Try tab-separated or 'Name - $XX - Date' format.");
      return;
    }
    toast.success(`Found ${parsed.length} products to import!`);
    // Store for review in next step
    setNewProduct(parsed[0] || {});
    setWizardStep(2);
  };

  const saveProduct = async () => {
    if (!userId || !newProduct.product_name) {
      toast.error("Please enter a product name");
      return;
    }

    const { error } = await supabase
      .from('products_review_insights')
      .insert({
        user_id: userId,
        product_name: newProduct.product_name,
        etv: newProduct.etv || 0,
        order_date: newProduct.order_date || new Date().toISOString().split('T')[0],
        asin: newProduct.asin,
        category: newProduct.category,
        is_brand: newProduct.is_brand || false,
        testing_start_date: newProduct.testing_start_date,
        testing_complete_date: newProduct.testing_complete_date,
        review_published: newProduct.review_published || false,
        review_url: newProduct.review_url,
        disposition: newProduct.disposition,
        notes: newProduct.notes,
      });

    if (error) {
      toast.error("Failed to save product");
      console.error(error);
    } else {
      toast.success("Product saved!");
      fetchProducts();
      setShowWizard(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setWizardStep(1);
    setNewProduct({
      is_brand: false,
      order_date: new Date().toISOString().split('T')[0],
      etv: 0,
    });
    setImportText("");
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getDispositionBadge = (disposition?: string) => {
    const opt = DISPOSITION_OPTIONS.find(d => d.value === disposition);
    if (!opt) return null;
    return (
      <Badge variant="outline" className="text-xs">
        {opt.icon} {opt.label}
      </Badge>
    );
  };

  const totalETV = products.reduce((sum, p) => sum + (p.etv || 0), 0);
  const pendingReviews = products.filter(p => !p.review_published).length;
  const inTesting = products.filter(p => p.testing_start_date && !p.testing_complete_date).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="overflow-hidden border-2 border-emerald-500/20 shadow-soft hover:shadow-medium transition-all">
          <div className="relative h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-primary/10">
            <div className="absolute inset-0 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Grape className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground">Vine Products</h3>
                  <p className="text-sm text-muted-foreground">{products.length} items tracked</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="secondary" 
                className="gap-1"
                onClick={() => setShowWizard(true)}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(totalETV)}</div>
                <div className="text-xs text-muted-foreground">Total ETV</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 text-center">
                <div className="text-lg font-bold text-amber-600">{pendingReviews}</div>
                <div className="text-xs text-muted-foreground">Need Review</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                <div className="text-lg font-bold text-blue-600">{inTesting}</div>
                <div className="text-xs text-muted-foreground">Testing</div>
              </div>
            </div>

            {/* Link to Vine Project */}
            {vineProjects.length > 0 && (
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600">Linked Vine Projects</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {vineProjects.slice(0, 3).map(p => (
                    <Badge key={p.id} variant="outline" className="text-xs">
                      {p.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Products */}
            {products.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Recent Products</div>
                {products.slice(0, 3).map(product => (
                  <div 
                    key={product.id}
                    className="p-2 rounded-lg border border-border/50 bg-muted/30 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{product.product_name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatCurrency(product.etv)}</span>
                        {product.review_published ? (
                          <Badge variant="outline" className="text-xs text-emerald-500">
                            <Check className="w-3 h-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-amber-500">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No Vine products tracked yet. Import from Amazon!
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => setShowWizard(true)}
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => window.location.href = '/vine-tracker'}
              >
                <Grape className="w-4 h-4" />
                Full Tracker
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wizard Dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Grape className="w-5 h-5 text-emerald-500" />
              Vine Product Wizard
            </DialogTitle>
          </DialogHeader>

          {/* Step Indicators */}
          <div className="flex gap-1 mb-4">
            {WIZARD_STEPS.map((step, idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  idx + 1 <= wizardStep ? "bg-emerald-500" : "bg-muted"
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Import */}
            {wizardStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-500" />
                  Import from Amazon Order History
                </h3>
                <p className="text-sm text-muted-foreground">
                  Paste your Amazon Vine order history. Supports tab-separated or "Name - $XX - Date" format.
                </p>
                <Textarea 
                  placeholder="Product Name&#9;$45.99&#9;01/15/2025&#9;B0ABC12345
Or: Smart Widget Pro - $45.99 - 01/15/2025"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="gap-2 bg-emerald-500 hover:bg-emerald-600"
                  >
                    <Clipboard className="w-4 h-4" />
                    Parse & Import
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setWizardStep(2)}
                  >
                    Skip - Manual Entry
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Product Details */}
            {wizardStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-500" />
                  Product Details
                </h3>
                <div className="grid gap-4">
                  <div>
                    <Label>Product Name *</Label>
                    <Input 
                      value={newProduct.product_name || ""}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, product_name: e.target.value }))}
                      placeholder="Smart Widget Pro"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>ETV (Estimated Tax Value)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                          type="number"
                          step="0.01"
                          value={newProduct.etv || ""}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, etv: parseFloat(e.target.value) || 0 }))}
                          className="pl-8"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Order Date</Label>
                      <Input 
                        type="date"
                        value={newProduct.order_date || ""}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, order_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>ASIN (optional)</Label>
                      <Input 
                        value={newProduct.asin || ""}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, asin: e.target.value }))}
                        placeholder="B0ABC12345"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select 
                        value={newProduct.category || ""} 
                        onValueChange={(v) => setNewProduct(prev => ({ ...prev, category: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={newProduct.is_brand || false}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, is_brand: e.target.checked }))}
                      className="rounded"
                    />
                    <Label className="text-sm">This is a Brand Item (50% reduction instead of 80%)</Label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Testing Timeline */}
            {wizardStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  Testing Timeline
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track when you started and completed testing this product.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Testing Start Date</Label>
                    <Input 
                      type="date"
                      value={newProduct.testing_start_date || ""}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, testing_start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Testing Complete Date</Label>
                    <Input 
                      type="date"
                      value={newProduct.testing_complete_date || ""}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, testing_complete_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Testing Notes</Label>
                  <Textarea 
                    value={newProduct.notes || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any notes about testing, issues found, etc."
                    rows={3}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Review Status */}
            {wizardStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Review Status
                </h3>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <input 
                    type="checkbox"
                    checked={newProduct.review_published || false}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, review_published: e.target.checked }))}
                    className="rounded w-5 h-5"
                  />
                  <div>
                    <Label className="text-sm font-medium">Review Published</Label>
                    <p className="text-xs text-muted-foreground">Check if you've written and submitted your review</p>
                  </div>
                </div>
                <div>
                  <Label>Review URL (optional)</Label>
                  <Input 
                    value={newProduct.review_url || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, review_url: e.target.value }))}
                    placeholder="https://amazon.com/review/..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Disposition */}
            {wizardStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-500" />
                  Disposition
                </h3>
                <p className="text-sm text-muted-foreground">
                  What will happen to this product after review?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DISPOSITION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setNewProduct(prev => ({ ...prev, disposition: opt.value }))}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        newProduct.disposition === opt.value
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border hover:border-emerald-500/50"
                      )}
                    >
                      <span className="text-xl mr-2">{opt.icon}</span>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Link to Vine Project */}
                {vineProjects.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label>Attach to Vine Project (optional)</Label>
                    <Select 
                      value={selectedProject} 
                      onValueChange={setSelectedProject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Vine project" />
                      </SelectTrigger>
                      <SelectContent>
                        {vineProjects.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWizardStep(prev => prev - 1)}
              disabled={wizardStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            {wizardStep < 5 ? (
              <Button
                size="sm"
                onClick={() => setWizardStep(prev => prev + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={saveProduct}
                className="gap-2 bg-emerald-500 hover:bg-emerald-600"
              >
                <Check className="w-4 h-4" />
                Save Product
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VineProductCard;
