import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle2, AlertTriangle, ExternalLink, Download, Info } from "lucide-react";
import { DonationRecord, formatCurrency } from "@/hooks/use-donations";
import { format } from "date-fns";

interface Form8283HelperProps {
  donations: DonationRecord[];
  requirements: {
    totalFMV: number;
    requiresForm8283: boolean;
    sectionACount: number;
    sectionBCount: number;
    missingAcknowledgments: number;
    needsAppraisal: number;
    sectionADonations: DonationRecord[];
    sectionBDonations: DonationRecord[];
  };
  taxYear: number;
}

export function Form8283Helper({ donations, requirements, taxYear }: Form8283HelperProps) {
  const allRequirementsMet =
    requirements.missingAcknowledgments === 0 &&
    requirements.needsAppraisal === 0;

  if (!requirements.requiresForm8283) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No Form 8283 Required</h3>
          <p className="text-muted-foreground mt-2">
            Total FMV of {formatCurrency(requirements.totalFMV)} is under $500.
            No special form needed for your charitable donations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Form 8283 - Noncash Charitable Contributions
          </CardTitle>
          <CardDescription>
            Required when total noncash donations exceed $500 in a tax year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{formatCurrency(requirements.totalFMV)}</div>
              <div className="text-xs text-muted-foreground">Total FMV</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{requirements.sectionACount}</div>
              <div className="text-xs text-muted-foreground">Section A Items</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{requirements.sectionBCount}</div>
              <div className="text-xs text-muted-foreground">Section B Items</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              {allRequirementsMet ? (
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
              )}
              <div className="text-xs text-muted-foreground">
                {allRequirementsMet ? "Ready to File" : "Action Needed"}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Filing Checklist</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Total donations over $500 - Form 8283 required</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${requirements.missingAcknowledgments === 0 ? '' : 'text-amber-600'}`}>
                {requirements.missingAcknowledgments === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span>
                  Written acknowledgment from charities
                  {requirements.missingAcknowledgments > 0 && ` (${requirements.missingAcknowledgments} pending)`}
                </span>
              </div>
              {requirements.sectionBCount > 0 && (
                <div className={`flex items-center gap-2 text-sm ${requirements.needsAppraisal === 0 ? '' : 'text-amber-600'}`}>
                  {requirements.needsAppraisal === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <span>
                    Qualified appraisals for items over $5,000
                    {requirements.needsAppraisal > 0 && ` (${requirements.needsAppraisal} needed)`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section A - $500 to $5,000 */}
      {requirements.sectionADonations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Section A - Donated Property ($500-$5,000)</CardTitle>
            <CardDescription>
              Items with FMV between $500 and $5,000. No appraisal required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Description</TableHead>
                  <TableHead>Donee (Charity)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">FMV</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.sectionADonations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.product_name}</TableCell>
                    <TableCell>
                      {d.charity_name}
                      {d.charity_ein && <span className="text-muted-foreground text-xs block">{d.charity_ein}</span>}
                    </TableCell>
                    <TableCell>{format(new Date(d.donation_date), "MM/dd/yyyy")}</TableCell>
                    <TableCell className="capitalize">{d.condition_at_donation}</TableCell>
                    <TableCell className="text-right">{formatCurrency(d.fair_market_value)}</TableCell>
                    <TableCell>
                      {d.acknowledgment_received ? (
                        <Badge variant="outline" className="bg-green-500/10">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Section B - Over $5,000 */}
      {requirements.sectionBDonations.length > 0 && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Section B - Donated Property (Over $5,000)
              <Badge variant="destructive">Appraisal Required</Badge>
            </CardTitle>
            <CardDescription>
              Items with FMV over $5,000 require a qualified appraisal and donee signature.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Requirements</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Appraisal must be done no earlier than 60 days before donation</li>
                  <li>Appraisal must be received before tax return due date</li>
                  <li>Appraiser must sign Section B Part IV</li>
                  <li>Donee (charity) must sign Section B Part V</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Description</TableHead>
                  <TableHead>Donee (Charity)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">FMV</TableHead>
                  <TableHead>Appraiser</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.sectionBDonations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.product_name}</TableCell>
                    <TableCell>
                      {d.charity_name}
                      {d.charity_ein && <span className="text-muted-foreground text-xs block">{d.charity_ein}</span>}
                    </TableCell>
                    <TableCell>{format(new Date(d.donation_date), "MM/dd/yyyy")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(d.fair_market_value)}</TableCell>
                    <TableCell>
                      {d.appraiser_name || <span className="text-amber-500">Not assigned</span>}
                    </TableCell>
                    <TableCell>
                      {d.appraiser_name && d.acknowledgment_received ? (
                        <Badge variant="outline" className="bg-green-500/10">Complete</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10">Incomplete</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Vine-Specific Guidance */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Important Note for Vine Products
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            <strong>Cost Basis = $0:</strong> Since you received Vine products for free, your cost basis is $0.
            For non-cash donations of appreciated property held less than one year, your deduction is limited
            to your cost basis (IRC §170(e)(1)).
          </p>
          <p>
            <strong>Exception for Sole Proprietors:</strong> If your Vine activity is a business (Schedule C),
            you may be able to deduct the FMV of donated inventory. Consult a tax professional.
          </p>
          <p>
            <strong>C-Corp Enhanced Deduction:</strong> C-Corporations donating inventory for the care of the ill,
            needy, or infants to qualified 501(c)(3) organizations may claim an enhanced deduction of
            basis + 50% of appreciation (up to 2x basis).
          </p>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.irs.gov/forms-pubs/about-form-8283" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                IRS Form 8283 Instructions
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.irs.gov/publications/p526" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Publication 526
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
