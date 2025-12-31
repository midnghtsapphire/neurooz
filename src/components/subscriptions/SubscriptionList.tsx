import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CreditCard, Trash2, Edit2, ExternalLink, Calendar, 
  RefreshCw, Smartphone, Cloud, Video, Briefcase 
} from "lucide-react";
import { Subscription, useDeleteSubscription, SUBSCRIPTION_TYPES } from "@/hooks/use-subscriptions";
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

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  software: <CreditCard className="h-4 w-4" />,
  mobile_app: <Smartphone className="h-4 w-4" />,
  streaming: <Video className="h-4 w-4" />,
  professional: <Briefcase className="h-4 w-4" />,
  cloud_storage: <Cloud className="h-4 w-4" />,
  saas: <Cloud className="h-4 w-4" />,
};

export function SubscriptionList({ subscriptions, isLoading }: SubscriptionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteSubscription();

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

  if (subscriptions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">
            No subscriptions yet. Add your first subscription to start tracking expenses.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {subscriptions.map((sub) => {
          const typeLabel = SUBSCRIPTION_TYPES.find((t) => t.value === sub.subscription_type)?.label || sub.subscription_type;
          const deductibleAmount = sub.amount * (sub.business_use_percentage / 100);

          return (
            <Card key={sub.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 mt-1">
                      {TYPE_ICONS[sub.subscription_type] || <CreditCard className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{sub.subscription_name}</h3>
                        <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                          {sub.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{sub.provider || typeLabel}</span>
                        <span>•</span>
                        <span className="capitalize">{sub.billing_cycle}</span>
                        {sub.renewal_date && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Renews {format(new Date(sub.renewal_date), "MMM d, yyyy")}
                            </span>
                          </>
                        )}
                        {sub.auto_renew && (
                          <span title="Auto-renew enabled">
                            <RefreshCw className="h-3 w-3 text-green-500" />
                          </span>
                        )}
                      </div>
                      {sub.category && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {sub.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold">${sub.amount.toFixed(2)}</p>
                    {sub.business_use_percentage < 100 && (
                      <p className="text-xs text-muted-foreground">
                        {sub.business_use_percentage}% business = ${deductibleAmount.toFixed(2)}
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
                        onClick={() => setDeleteId(sub.id)}
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
            <AlertDialogTitle>Delete Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this subscription record.
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
