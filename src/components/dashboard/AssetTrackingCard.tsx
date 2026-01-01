import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Plus,
  ChevronRight,
  Laptop,
  Camera,
  Car,
  Sofa,
  TrendingDown,
  DollarSign
} from "lucide-react";
import { useDigitalInventory } from "@/hooks/use-digital-inventory";
import { useRentalInventory } from "@/hooks/use-rental-inventory";
import { cn } from "@/lib/utils";

const ASSET_CATEGORIES = [
  { icon: Laptop, label: "Digital", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { icon: Camera, label: "Equipment", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { icon: Car, label: "Vehicles", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { icon: Sofa, label: "Furniture", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
];

export function AssetTrackingCard() {
  const navigate = useNavigate();
  const { data: digitalAssets = [] } = useDigitalInventory();
  const { data: rentalInventory = [] } = useRentalInventory();

  const totalDigitalValue = digitalAssets.reduce((sum, a) => sum + (a.current_value || 0), 0);
  const totalRentalValue = rentalInventory.reduce((sum, r) => sum + (r.current_book_value || 0), 0);
  const totalAssetValue = totalDigitalValue + totalRentalValue;
  const totalAssetCount = digitalAssets.length + rentalInventory.length;

  // Get recent assets
  const recentAssets = [
    ...digitalAssets.map(a => ({ 
      name: a.asset_name, 
      value: a.current_value || 0, 
      type: "digital",
      date: a.created_at 
    })),
    ...rentalInventory.map(r => ({ 
      name: r.product_name, 
      value: r.current_book_value || 0, 
      type: "rental",
      date: r.created_at 
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="overflow-hidden border-2 border-purple-500/20 shadow-soft hover:shadow-medium transition-all group">
        <div className="relative h-20 bg-gradient-to-br from-purple-500/20 via-primary/10 to-blue-500/10">
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">Asset Tracker</h3>
                <p className="text-sm text-muted-foreground">{totalAssetCount} items tracked</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              className="gap-1"
              onClick={() => navigate("/subscriptions")}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Total Value */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Asset Value</div>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalAssetValue)}</div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <TrendingDown className="w-4 h-4" />
                Depreciating
              </div>
            </div>
          </div>

          {/* Category Quick Links */}
          <div className="grid grid-cols-4 gap-2">
            {ASSET_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={cn(
                  "p-3 rounded-lg flex flex-col items-center gap-1 transition-all",
                  cat.bgColor,
                  "hover:scale-105"
                )}
                onClick={() => navigate("/subscriptions")}
              >
                <cat.icon className={cn("w-5 h-5", cat.color)} />
                <span className="text-xs text-muted-foreground">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Recent Assets */}
          {recentAssets.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Recent Assets</div>
              {recentAssets.map((asset, i) => (
                <div 
                  key={i}
                  className="p-2 rounded-lg border border-border/50 bg-muted/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      asset.type === "digital" ? "bg-blue-500/10" : "bg-purple-500/10"
                    )}>
                      {asset.type === "digital" ? (
                        <Laptop className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Package className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[120px]">{asset.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatCurrency(asset.value)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No assets tracked yet. Add your first asset!
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => navigate("/subscriptions")}
            >
              <Laptop className="w-4 h-4" />
              Digital
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => navigate("/rental-management")}
            >
              <Package className="w-4 h-4" />
              Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AssetTrackingCard;
