import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronDown, ChevronRight, Trash2, CheckCircle2, AlertCircle, Edit2 } from "lucide-react";
import { DonationRecord, useDeleteDonation, useUpdateDonation, formatCurrency } from "@/hooks/use-donations";
import { format } from "date-fns";

interface DonationsListProps {
  donations: DonationRecord[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function DonationsList({ donations, selectedYear, onYearChange }: DonationsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const deleteMutation = useDeleteDonation();
  const updateMutation = useUpdateDonation();

  const handleMarkReceived = (id: string) => {
    updateMutation.mutate({
      id,
      acknowledgment_received: true,
      acknowledgment_date: new Date().toISOString().split("T")[0],
    });
  };

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No donations recorded for {selectedYear}.</p>
          <p className="text-sm mt-2">Click "Add Donation" to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Donation Records</CardTitle>
          <Select value={String(selectedYear)} onValueChange={(v) => onYearChange(Number(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Charity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">FMV</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <Collapsible key={donation.id} asChild>
                <>
                  <TableRow className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === donation.id ? null : donation.id)}
                        >
                          {expandedId === donation.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium">{donation.product_name}</TableCell>
                    <TableCell>{donation.charity_name}</TableCell>
                    <TableCell>{format(new Date(donation.donation_date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(donation.fair_market_value)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {donation.acknowledgment_received ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Receipt
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {donation.form_8283_section && (
                          <Badge variant="secondary">8283-{donation.form_8283_section}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Donation Record?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the donation record for "{donation.product_name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(donation.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={7}>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Valuation Details */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Valuation</h4>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Original ETV:</span>
                                <span>{formatCurrency(donation.original_etv)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Fair Market Value:</span>
                                <span>{formatCurrency(donation.fair_market_value)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Cost Basis:</span>
                                <span>{formatCurrency(donation.cost_basis)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Condition:</span>
                                <span className="capitalize">{donation.condition_at_donation}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Method:</span>
                                <span className="capitalize">{donation.valuation_method?.replace(/_/g, " ")}</span>
                              </div>
                            </div>
                          </div>

                          {/* Charity Details */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Charity</h4>
                            <div className="text-sm space-y-1">
                              <div>{donation.charity_name}</div>
                              {donation.charity_ein && (
                                <div className="text-muted-foreground">EIN: {donation.charity_ein}</div>
                              )}
                              {donation.charity_address && (
                                <div className="text-muted-foreground">
                                  {donation.charity_address}
                                  {donation.charity_city && `, ${donation.charity_city}`}
                                  {donation.charity_state && `, ${donation.charity_state}`}
                                  {donation.charity_zip && ` ${donation.charity_zip}`}
                                </div>
                              )}
                              <Badge variant={donation.is_501c3 ? "default" : "secondary"}>
                                {donation.is_501c3 ? "501(c)(3)" : "Other"}
                              </Badge>
                            </div>
                          </div>

                          {/* Documentation */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Documentation</h4>
                            <div className="text-sm space-y-2">
                              {donation.receipt_number && (
                                <div className="text-muted-foreground">
                                  Receipt #: {donation.receipt_number}
                                </div>
                              )}
                              {donation.acknowledgment_date && (
                                <div className="text-muted-foreground">
                                  Received: {format(new Date(donation.acknowledgment_date), "MMM d, yyyy")}
                                </div>
                              )}
                              {!donation.acknowledgment_received && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkReceived(donation.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Mark Receipt Received
                                </Button>
                              )}
                              {donation.appraisal_required && (
                                <Badge variant="destructive">Appraisal Required</Badge>
                              )}
                            </div>
                            {donation.notes && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <strong>Notes:</strong> {donation.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
