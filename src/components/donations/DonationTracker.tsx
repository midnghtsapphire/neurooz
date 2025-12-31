import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart, FileText, Plus, AlertTriangle, CheckCircle2, Building, Shield } from "lucide-react";
import { useDonations, useSavedCharities, getForm8283Requirements, formatCurrency } from "@/hooks/use-donations";
import { DonationsList } from "./DonationsList";
import { AddDonationDialog } from "./AddDonationDialog";
import { Form8283Helper } from "./Form8283Helper";
import { CharitiesManager } from "./CharitiesManager";
import { DeductionLimitsAlert } from "@/components/tax-rules/DeductionLimitsAlert";

export function DonationTracker() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  
  const { data: donations, isLoading } = useDonations();
  const { data: charities } = useSavedCharities();

  const yearDonations = donations?.filter(d => {
    const donationYear = new Date(d.donation_date).getFullYear();
    return d.included_in_tax_year === selectedYear || donationYear === selectedYear;
  }) || [];

  const requirements = getForm8283Requirements(yearDonations);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-rose-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Donation Tracker
              </CardTitle>
              <CardDescription>
                Track Vine product donations with Form 8283 documentation
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Donation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{yearDonations.length}</div>
              <div className="text-xs text-muted-foreground">Total Donations</div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(requirements.totalFMV)}
              </div>
              <div className="text-xs text-muted-foreground">Total FMV</div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{charities?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Saved Charities</div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-center">
              {requirements.missingAcknowledgments > 0 ? (
                <>
                  <div className="text-2xl font-bold text-amber-500">
                    {requirements.missingAcknowledgments}
                  </div>
                  <div className="text-xs text-muted-foreground">Need Receipts</div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                  <div className="text-xs text-muted-foreground">All Documented</div>
                </>
              )}
            </div>
          </div>

          {/* Form 8283 Alert */}
          {requirements.requiresForm8283 && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <strong>Form 8283 Required:</strong> Total FMV exceeds $500.
                  {requirements.sectionACount > 0 && (
                    <Badge variant="outline" className="ml-2">
                      Section A: {requirements.sectionACount} items
                    </Badge>
                  )}
                  {requirements.sectionBCount > 0 && (
                    <Badge variant="outline" className="ml-2 bg-rose-500/10">
                      Section B: {requirements.sectionBCount} items (appraisal needed)
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deduction Limits Alerts */}
      <DeductionLimitsAlert taxYear={selectedYear} userAGI={100000} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="form8283" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Form 8283
          </TabsTrigger>
          <TabsTrigger value="charities" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Charities
          </TabsTrigger>
          <TabsTrigger value="limits" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Limits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="mt-4">
          <DonationsList 
            donations={yearDonations} 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </TabsContent>

        <TabsContent value="form8283" className="mt-4">
          <Form8283Helper 
            donations={yearDonations}
            requirements={requirements}
            taxYear={selectedYear}
          />
        </TabsContent>

        <TabsContent value="charities" className="mt-4">
          <CharitiesManager charities={charities || []} />
        </TabsContent>

        <TabsContent value="limits" className="mt-4">
          <DeductionLimitsAlert taxYear={selectedYear} userAGI={100000} />
        </TabsContent>
      </Tabs>

      <AddDonationDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        charities={charities || []}
      />
    </div>
  );
}
