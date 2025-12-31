import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CreditCard, Calendar, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useSubscriptions, useSubscriptionStats, Subscription } from "@/hooks/use-subscriptions";
import { useDigitalInventory, useDigitalInventoryStats, DigitalAsset } from "@/hooks/use-digital-inventory";
import { AddSubscriptionDialog } from "./AddSubscriptionDialog";
import { AddDigitalAssetDialog } from "./AddDigitalAssetDialog";
import { SubscriptionList } from "./SubscriptionList";
import { DigitalInventoryList } from "./DigitalInventoryList";
import { format } from "date-fns";

interface SubscriptionTrackerProps {
  userId: string;
}

export function SubscriptionTracker({ userId }: SubscriptionTrackerProps) {
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [activeTab, setActiveTab] = useState("subscriptions");

  const { data: subscriptions = [], isLoading: loadingSubs } = useSubscriptions(userId);
  const { data: assets = [], isLoading: loadingAssets } = useDigitalInventory(userId);

  const subStats = useSubscriptionStats(subscriptions);
  const assetStats = useDigitalInventoryStats(assets);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Spend</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ${subStats.monthlyTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yearly Deductible</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  ${subStats.yearlyTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Digital Assets Value</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  ${assetStats.businessValue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {subStats.upcomingRenewals.length + assetStats.expiringLicenses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Renewals Alert */}
      {subStats.upcomingRenewals.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Calendar className="h-4 w-4" />
              Upcoming Renewals (Next 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {subStats.upcomingRenewals.map((sub) => (
                <Badge key={sub.id} variant="outline" className="border-amber-300 text-amber-700">
                  {sub.subscription_name} - {sub.renewal_date && format(new Date(sub.renewal_date), "MMM d")}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscriptions ({subStats.activeCount})
            </TabsTrigger>
            <TabsTrigger value="digital" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Digital Assets ({assetStats.activeCount})
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => activeTab === "subscriptions" ? setShowAddSubscription(true) : setShowAddAsset(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === "subscriptions" ? "Subscription" : "Asset"}
          </Button>
        </div>

        <TabsContent value="subscriptions" className="mt-4">
          <SubscriptionList subscriptions={subscriptions} isLoading={loadingSubs} />
        </TabsContent>

        <TabsContent value="digital" className="mt-4">
          <DigitalInventoryList assets={assets} isLoading={loadingAssets} />
        </TabsContent>
      </Tabs>

      <AddSubscriptionDialog
        open={showAddSubscription}
        onOpenChange={setShowAddSubscription}
        userId={userId}
      />

      <AddDigitalAssetDialog
        open={showAddAsset}
        onOpenChange={setShowAddAsset}
        userId={userId}
      />
    </div>
  );
}
