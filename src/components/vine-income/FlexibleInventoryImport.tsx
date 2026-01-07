import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Gift,
  Package,
  Calculator,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  parseInventoryContent, 
  ParsedInventoryItem, 
  IMPORT_FIELDS,
  VALIDATION_RULES,
  COMPLIANCE_LEVELS,
  ComplianceLevel
} from "@/lib/import-validation";

interface FlexibleInventoryImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

const ComplianceIcon = ({ level }: { level: ComplianceLevel }) => {
  switch (level) {
    case 'full':
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    case 'standard':
      return <ShieldAlert className="w-4 h-4 text-amber-500" />;
    default:
      return <ShieldX className="w-4 h-4 text-red-500" />;
  }
};

export function FlexibleInventoryImport({ open, onOpenChange, onImportComplete }: FlexibleInventoryImportProps) {
  const [step, setStep] = useState<'paste' | 'review' | 'importing' | 'complete'>('paste');
  const [rawText, setRawText] = useState("");
  const [parsedProducts, setParsedProducts] = useState<ParsedInventoryItem[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const handleParse = () => {
    const parsed = parseInventoryContent(rawText);
    if (parsed.length === 0) {
      toast.error("Could not parse any products. Check the format and try again.");
      return;
    }
    setParsedProducts(parsed);
    setStep('review');
    
    const warnings = parsed.filter(p => p.validation_warnings.some(w => w.severity === 'warning'));
    if (warnings.length > 0) {
      toast.warning(`${warnings.length} items have compliance warnings`);
    } else {
      toast.success(`Found ${parsed.length} products!`);
    }
  };

  const toggleProduct = (id: string) => {
    setParsedProducts(prev => 
      prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    );
  };

  const toggleAll = (selected: boolean) => {
    setParsedProducts(prev => prev.map(p => ({ ...p, selected })));
  };

  const handleImport = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to import products");
      return;
    }

    const selectedProducts = parsedProducts.filter(p => p.selected);
    if (selectedProducts.length === 0) {
      toast.error("Select at least one product to import");
      return;
    }

    setStep('importing');
    let imported = 0;

    for (let i = 0; i < selectedProducts.length; i++) {
      const p = selectedProducts[i];
      
      // Check if already exists by ASIN + date or internal ID
      const { data: existing } = await supabase
        .from('products_review_insights')
        .select('id')
        .eq('user_id', user.id)
        .or(`asin.eq.${p.asin},order_number.eq.${p.receipt_reference}`)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from('products_review_insights')
          .insert({
            user_id: user.id,
            order_number: p.receipt_reference,
            asin: p.asin,
            product_name: p.product_name,
            order_date: p.acquisition_date,
            etv: p.cost_basis,
            is_cancelled: false,
            is_brand: p.source === 'Amazon Vine',
            donation_eligible_date: p.donation_eligible_date,
            category: p.category,
            depreciation_method: p.depreciation_class,
            first_year_depreciation: p.first_year_depreciation,
          });

        if (!error) imported++;
      }

      setImportProgress(((i + 1) / selectedProducts.length) * 100);
    }

    setImportedCount(imported);
    setStep('complete');
    onImportComplete();
  };

  const handleClose = () => {
    setStep('paste');
    setRawText('');
    setParsedProducts([]);
    setImportProgress(0);
    setImportedCount(0);
    onOpenChange(false);
  };

  const selectedCount = parsedProducts.filter(p => p.selected).length;
  const totalValue = parsedProducts.filter(p => p.selected).reduce((sum, p) => sum + p.cost_basis, 0);
  const totalDepreciation = parsedProducts.filter(p => p.selected).reduce((sum, p) => sum + p.first_year_depreciation, 0);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-500" />
              Import Inventory
              <Badge variant="outline" className="ml-2 text-xs">
                Vine • Temu • Alibaba • Custom
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {step === 'paste' && (
            <div className="space-y-4">
              {/* Compliance Info */}
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm">
                  <strong>IRS Compliance:</strong> For full tax benefits, include acquisition date and cost basis. 
                  Items without ASINs will get auto-generated reference IDs.
                </AlertDescription>
              </Alert>

              {/* Depreciation Rules Summary */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    2025 Depreciation Rules (OBBBA)
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowRules(!showRules)}
                    className="text-xs"
                  >
                    {showRules ? 'Hide' : 'Show Details'}
                  </Button>
                </div>
                {showRules && (
                  <div className="text-xs space-y-1 text-muted-foreground mt-2">
                    <div className="flex justify-between">
                      <span>100% Bonus Depreciation:</span>
                      <span className="font-medium text-emerald-600">Full deduction Year 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Section 179 Limit:</span>
                      <span className="font-medium">{formatCurrency(VALIDATION_RULES.section_179_limit.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Donation Holding Period:</span>
                      <span className="font-medium">{VALIDATION_RULES.donation_holding_period.months} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Form 8283 Required:</span>
                      <span className="font-medium">Over {formatCurrency(VALIDATION_RULES.form_8283_threshold.amount)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Supported Formats
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Amazon Vine Itemized Report (PDF text)</li>
                  <li>Excel/CSV with columns: Product, Date, Price</li>
                  <li>Tab-separated data from any source</li>
                  <li>Temu/Alibaba order exports</li>
                </ul>
              </div>

              <Textarea
                placeholder="Paste your inventory data here...&#10;&#10;Supports:&#10;• Vine PDF text&#10;• Excel/CSV data&#10;• Tab-separated values&#10;• Any format with product names and values"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
                className="font-mono text-xs"
              />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button 
                  onClick={handleParse}
                  disabled={!rawText.trim()}
                  className="gap-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  <FileText className="w-4 h-4" />
                  Parse & Validate
                </Button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="text-2xl font-bold">{selectedCount}</div>
                  <div className="text-xs text-muted-foreground">Selected</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalValue)}</div>
                  <div className="text-xs text-muted-foreground">Total Value</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 text-center">
                  <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalDepreciation)}</div>
                  <div className="text-xs text-muted-foreground">Year 1 Deduction</div>
                </div>
                <div className="p-3 rounded-lg bg-rose-500/10 text-center">
                  <div className="text-2xl font-bold text-rose-600">{formatCurrency(totalValue - totalDepreciation)}</div>
                  <div className="text-xs text-muted-foreground">Remaining Basis</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>Select All</Button>
                  <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>Deselect All</Button>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Full</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                    <span>Standard</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldX className="w-3 h-3 text-red-500" />
                    <span>Minimal</span>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[350px] border rounded-lg">
                <div className="p-2 space-y-1">
                  {parsedProducts.map((product) => (
                    <div 
                      key={product.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        product.selected 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-muted/30 border-transparent'
                      }`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={product.selected}
                          onCheckedChange={() => toggleProduct(product.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{product.product_name}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <ComplianceIcon level={product.compliance_level} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{product.compliance_level.toUpperCase()} Compliance</p>
                                <p className="text-xs">{COMPLIANCE_LEVELS[product.compliance_level].description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">{product.source}</Badge>
                            {product.asin && <span className="font-mono">{product.asin}</span>}
                            {!product.asin && <span className="font-mono text-amber-600">{product.receipt_reference}</span>}
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">{formatCurrency(product.cost_basis)}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{product.acquisition_date}</span>
                              </TooltipTrigger>
                              <TooltipContent>Acquisition Date - Start of depreciation</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <Calculator className="w-3 h-3 text-amber-500" />
                                <span className="text-amber-600">{formatCurrency(product.first_year_depreciation)} Y1</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">Year 1 Depreciation</p>
                                <p className="text-xs">{product.depreciation_class}</p>
                                <p className="text-xs">100% Bonus Depreciation (OBBBA 2025)</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <Gift className="w-3 h-3 text-rose-500" />
                                <span className="text-rose-600">{product.donation_eligible_date}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">FrontRange Donation Eligible</p>
                                <p className="text-xs">{VALIDATION_RULES.donation_holding_period.irs_reference}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          {/* Validation Warnings */}
                          {product.validation_warnings.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {product.validation_warnings.map((warning, idx) => (
                                <Tooltip key={idx}>
                                  <TooltipTrigger className="w-full">
                                    <div className={`flex items-center gap-1 text-xs rounded px-2 py-1 ${
                                      warning.severity === 'error' ? 'bg-red-500/10 text-red-600' :
                                      warning.severity === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                                      'bg-blue-500/10 text-blue-600'
                                    }`}>
                                      {warning.severity === 'error' ? <AlertTriangle className="w-3 h-3" /> :
                                       warning.severity === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                                       <Info className="w-3 h-3" />}
                                      <span className="truncate">{warning.message}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{warning.message}</p>
                                    {warning.irsReference && (
                                      <p className="text-xs text-muted-foreground mt-1">{warning.irsReference}</p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStep('paste')}>Back</Button>
                <Button 
                  onClick={handleImport}
                  disabled={selectedCount === 0}
                  className="gap-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  <Check className="w-4 h-4" />
                  Import {selectedCount} Products
                </Button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="py-8 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto animate-pulse">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold">Importing Products...</h3>
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {Math.round(importProgress)}% complete
              </p>
            </div>
          )}

          {step === 'complete' && (
            <div className="py-8 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold">Import Complete!</h3>
              <p className="text-muted-foreground">
                Successfully imported {importedCount} products with depreciation schedules.
              </p>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-left">
                <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4" />
                  Tax Benefits Applied
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>✓ 100% Bonus Depreciation (OBBBA 2025)</li>
                  <li>✓ 6-month donation holding periods calculated</li>
                  <li>✓ Auto-generated reference IDs for items without ASINs</li>
                </ul>
              </div>
              <Button onClick={handleClose} className="gap-2">
                <Check className="w-4 h-4" />
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
