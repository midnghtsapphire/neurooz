import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Box, Trash2, Edit2, Laptop, Smartphone, Cloud, 
  BookOpen, FileCode, Globe, Server, Key 
} from "lucide-react";
import { DigitalAsset, useDeleteDigitalAsset, ASSET_TYPES } from "@/hooks/use-digital-inventory";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DigitalInventoryListProps {
  assets: DigitalAsset[];
  isLoading: boolean;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  software: <Laptop className="h-4 w-4" />,
  mobile_app: <Smartphone className="h-4 w-4" />,
  cloud_subscription: <Cloud className="h-4 w-4" />,
  digital_tool: <FileCode className="h-4 w-4" />,
  online_course: <BookOpen className="h-4 w-4" />,
  ebook: <BookOpen className="h-4 w-4" />,
  template: <FileCode className="h-4 w-4" />,
  plugin: <FileCode className="h-4 w-4" />,
  domain: <Globe className="h-4 w-4" />,
  hosting: <Server className="h-4 w-4" />,
};

export function DigitalInventoryList({ assets, isLoading }: DigitalInventoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteDigitalAsset();

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Box className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">
            No digital assets yet. Add software licenses, courses, or tools to track your business investments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {assets.map((asset) => {
          const typeLabel = ASSET_TYPES.find((t) => t.value === asset.asset_type)?.label || asset.asset_type;
          const deductibleAmount = asset.purchase_price * (asset.business_use_percentage / 100);

          return (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 mt-1">
                      {TYPE_ICONS[asset.asset_type] || <Box className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{asset.asset_name}</h3>
                        <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                          {asset.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {asset.license_type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{asset.vendor || typeLabel}</span>
                        {asset.version && (
                          <>
                            <span>•</span>
                            <span>v{asset.version}</span>
                          </>
                        )}
                        {asset.platform && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{asset.platform}</span>
                          </>
                        )}
                        {asset.seats_count > 1 && (
                          <>
                            <span>•</span>
                            <span>{asset.seats_count} seats</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Purchased {format(new Date(asset.purchase_date), "MMM d, yyyy")}</span>
                        {asset.license_expiry && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              Expires {format(new Date(asset.license_expiry), "MMM d, yyyy")}
                            </span>
                          </>
                        )}
                      </div>
                      {asset.category && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {asset.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold">${asset.purchase_price.toFixed(2)}</p>
                    {asset.current_value !== asset.purchase_price && (
                      <p className="text-xs text-muted-foreground">
                        Current: ${asset.current_value.toFixed(2)}
                      </p>
                    )}
                    {asset.business_use_percentage < 100 && (
                      <p className="text-xs text-muted-foreground">
                        {asset.business_use_percentage}% business = ${deductibleAmount.toFixed(2)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Digital Asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this asset record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
