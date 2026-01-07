import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  Calendar,
  DollarSign,
  Gift,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format, addMonths, parseISO, isValid } from "date-fns";

interface ParsedProduct {
  order_number: string;
  asin: string;
  product_name: string;
  order_type: string;
  order_date: string;
  shipped_date: string | null;
  etv: number;
  is_cancelled: boolean;
  donation_eligible_date: string;
  selected: boolean;
}

interface VineInventoryImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export function VineInventoryImport({ open, onOpenChange, onImportComplete }: VineInventoryImportProps) {
  const [step, setStep] = useState<'paste' | 'review' | 'importing' | 'complete'>('paste');
  const [rawText, setRawText] = useState("");
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);

  const parseDate = (dateStr: string): string => {
    // Handle MM/DD/YYYY format
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  };

  const parsePDFContent = (text: string): ParsedProduct[] => {
    const products: ParsedProduct[] = [];
    const lines = text.split('\n').filter(l => l.trim());
    
    for (const line of lines) {
      // Skip header lines
      if (line.includes('Order Number') || line.includes('ASIN') || line.includes('Product Name')) {
        continue;
      }
      
      // Try to parse table row - look for patterns
      // Pattern: Order Number | ASIN | Product Name | Order Type | Order Date | Shipped Date | Cancelled Date | ETV
      
      // Split by multiple spaces or pipes
      const parts = line.split(/\s{2,}|\|/).map(p => p.trim()).filter(Boolean);
      
      // Look for order number pattern (starts with 1 and has dashes)
      const orderNumberMatch = line.match(/\d{3}[-‑]\d{7}[-‑]\d{7}/);
      const asinMatch = line.match(/B0[A-Z0-9]{8,10}/);
      const dateMatches = line.match(/\d{2}\/\d{2}\/\d{4}/g);
      const etvMatch = line.match(/([-‑]?\d+\.?\d*)\s*$/);
      const orderTypeMatch = line.match(/\b(ORDER|CANCELLATION)\b/);
      
      if (orderNumberMatch && asinMatch) {
        const orderNumber = orderNumberMatch[0].replace(/‑/g, '-');
        const asin = asinMatch[0];
        const orderType = orderTypeMatch?.[0] || 'ORDER';
        const isCancelled = orderType === 'CANCELLATION';
        
        // Extract ETV - handle negative for cancellations
        let etv = 0;
        if (etvMatch) {
          etv = parseFloat(etvMatch[1].replace(/‑/g, '-')) || 0;
        }
        
        // Skip cancellations (negative ETV)
        if (isCancelled || etv <= 0) continue;
        
        // Parse dates
        const orderDate = dateMatches?.[0] ? parseDate(dateMatches[0]) : '';
        const shippedDate = dateMatches?.[1] ? parseDate(dateMatches[1]) : null;
        
        // Extract product name - everything between ASIN and ORDER type
        const asinIndex = line.indexOf(asin);
        const orderTypeIndex = orderTypeMatch ? line.indexOf(orderTypeMatch[0]) : -1;
        let productName = '';
        
        if (asinIndex !== -1 && orderTypeIndex !== -1) {
          productName = line.substring(asinIndex + asin.length, orderTypeIndex).trim();
        } else {
          // Try to find product name another way - look for text between ASIN and date
          const afterAsin = line.substring(asinIndex + asin.length);
          const firstDateIndex = afterAsin.search(/\d{2}\/\d{2}\/\d{4}/);
          if (firstDateIndex !== -1) {
            productName = afterAsin.substring(0, firstDateIndex).replace(/ORDER|CANCELLATION/g, '').trim();
          }
        }
        
        // Clean up product name
        productName = productName.replace(/\s+/g, ' ').trim();
        if (!productName && parts.length > 2) {
          productName = parts[2] || 'Unknown Product';
        }
        
        // Calculate donation eligible date (6 months from order)
        let donationEligibleDate = '';
        if (orderDate) {
          try {
            const parsedOrderDate = parseISO(orderDate);
            if (isValid(parsedOrderDate)) {
              donationEligibleDate = format(addMonths(parsedOrderDate, 6), 'yyyy-MM-dd');
            }
          } catch (e) {
            console.error('Date parse error:', e);
          }
        }
        
        products.push({
          order_number: orderNumber,
          asin,
          product_name: productName || 'Unknown Product',
          order_type: orderType,
          order_date: orderDate,
          shipped_date: shippedDate,
          etv,
          is_cancelled: isCancelled,
          donation_eligible_date: donationEligibleDate,
          selected: true,
        });
      }
    }
    
    // Deduplicate by order number + asin
    const unique = new Map<string, ParsedProduct>();
    for (const p of products) {
      const key = `${p.order_number}-${p.asin}`;
      if (!unique.has(key)) {
        unique.set(key, p);
      }
    }
    
    return Array.from(unique.values());
  };

  const handleParse = () => {
    const parsed = parsePDFContent(rawText);
    if (parsed.length === 0) {
      toast.error("Could not parse any products. Try copying the PDF text again.");
      return;
    }
    setParsedProducts(parsed);
    setStep('review');
    toast.success(`Found ${parsed.length} products!`);
  };

  const toggleProduct = (index: number) => {
    setParsedProducts(prev => 
      prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p)
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
      
      // Check if already exists
      const { data: existing } = await supabase
        .from('products_review_insights')
        .select('id')
        .eq('user_id', user.id)
        .eq('asin', p.asin)
        .eq('order_date', p.order_date)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from('products_review_insights')
          .insert({
            user_id: user.id,
            order_number: p.order_number,
            asin: p.asin,
            product_name: p.product_name,
            order_date: p.order_date,
            shipped_date: p.shipped_date,
            etv: p.etv,
            is_cancelled: false,
            is_brand: false,
            donation_eligible_date: p.donation_eligible_date,
          });

        if (!error) {
          imported++;
        }
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
  const totalETV = parsedProducts.filter(p => p.selected).reduce((sum, p) => sum + p.etv, 0);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-500" />
            Import 2025 Vine Inventory
          </DialogTitle>
        </DialogHeader>

        {step === 'paste' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                How to Import
              </h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open your Vine Itemized Report PDF</li>
                <li>Select all text (Ctrl+A / Cmd+A)</li>
                <li>Copy (Ctrl+C / Cmd+C)</li>
                <li>Paste below</li>
              </ol>
            </div>

            <Textarea
              placeholder="Paste your Amazon Vine report here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={10}
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
                Parse Products
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="gap-1">
                  <Package className="w-3 h-3" />
                  {selectedCount} selected
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formatCurrency(totalETV)} ETV
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
                  Deselect All
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[350px] border rounded-lg">
              <div className="p-2 space-y-1">
                {parsedProducts.map((product, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      product.selected 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-muted/30 border-transparent'
                    }`}
                    onClick={() => toggleProduct(idx)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={product.selected}
                        onCheckedChange={() => toggleProduct(idx)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{product.product_name}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-mono">{product.asin}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600">{formatCurrency(product.etv)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {product.order_date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <Gift className="w-3 h-3 text-rose-500" />
                          <span className="text-muted-foreground">
                            Eligible for FrontRange donation: 
                          </span>
                          <span className="font-medium text-rose-600">
                            {product.donation_eligible_date}
                          </span>
                        </div>
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
              Successfully imported {importedCount} products with 6-month donation dates.
            </p>
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 justify-center text-sm">
                <Gift className="w-4 h-4 text-rose-500" />
                <span>Products will show FrontRange donation eligibility dates automatically</span>
              </div>
            </div>
            <Button onClick={handleClose} className="gap-2">
              <Check className="w-4 h-4" />
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
