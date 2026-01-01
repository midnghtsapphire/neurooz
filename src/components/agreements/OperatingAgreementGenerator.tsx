import { useState } from "react";
import { FileText, Download, Shield, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOperatingAgreementTemplates, useUserOperatingAgreements, useCreateUserAgreement, generateAgreementContent } from "@/hooks/use-operating-agreements";
import { useBusinesses } from "@/hooks/use-businesses";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function OperatingAgreementGenerator() {
  const { data: templates = [] } = useOperatingAgreementTemplates();
  const { data: userAgreements = [] } = useUserOperatingAgreements();
  const { data: businesses = [] } = useBusinesses();
  const createAgreement = useCreateUserAgreement();
  const { toast } = useToast();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "Review Insights LLC",
    effectiveDate: format(new Date(), "yyyy-MM-dd"),
    managingMemberName: "",
    managingMemberOwnership: "51",
    passiveMemberName: "",
    passiveMemberOwnership: "49",
    managingMemberCapital: "$0",
    passiveMemberCapital: "$0 (Vine Products at ETV)",
    includeSsdiProtection: true,
    passiveRoleExplicitlyDefined: true,
    noMaterialParticipationClause: true,
  });
  const [generatedContent, setGeneratedContent] = useState<string>("");

  const template = templates.find(t => t.id === selectedTemplate);

  const handleGenerate = async () => {
    if (!template) return;

    const placeholders: Record<string, string> = {
      BUSINESS_NAME: formData.businessName,
      EFFECTIVE_DATE: format(new Date(formData.effectiveDate), "MMMM d, yyyy"),
      MANAGING_MEMBER_NAME: formData.managingMemberName,
      MANAGING_MEMBER_OWNERSHIP: formData.managingMemberOwnership,
      PASSIVE_MEMBER_NAME: formData.passiveMemberName,
      PASSIVE_MEMBER_OWNERSHIP: formData.passiveMemberOwnership,
      MANAGING_MEMBER_CAPITAL: formData.managingMemberCapital,
      PASSIVE_MEMBER_CAPITAL: formData.passiveMemberCapital,
    };

    const content = generateAgreementContent(template, placeholders);
    setGeneratedContent(content);

    // Save to database
    const { data: { user } } = await (await import("@/integrations/supabase/client")).supabase.auth.getUser();
    if (!user) return;

    const business = businesses[0];
    
    await createAgreement.mutateAsync({
      user_id: user.id,
      business_id: business?.id || null,
      template_id: template.id,
      agreement_name: `${formData.businessName} Operating Agreement`,
      generated_content: content,
      custom_provisions: {},
      managing_member_name: formData.managingMemberName,
      managing_member_ownership: parseFloat(formData.managingMemberOwnership),
      passive_member_name: formData.passiveMemberName,
      passive_member_ownership: parseFloat(formData.passiveMemberOwnership),
      includes_ssdi_protection: formData.includeSsdiProtection,
      passive_role_explicitly_defined: formData.passiveRoleExplicitlyDefined,
      no_material_participation_clause: formData.noMaterialParticipationClause,
      status: "generated",
      generated_at: new Date().toISOString(),
      signed_at: null,
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.businessName.replace(/\s+/g, "_")}_Operating_Agreement.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Agreement Downloaded",
      description: "Print, sign, and keep with your business records.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Operating Agreement Generator
        </h2>
        <p className="text-muted-foreground mt-1">
          Generate manager-managed LLC agreements with SSDI protection clauses
        </p>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="saved">Saved Agreements ({userAgreements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Template</CardTitle>
              <CardDescription>Choose the type of operating agreement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {templates.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === t.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">{t.template_name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{t.description}</div>
                    <Badge variant="outline" className="mt-2">{t.state}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Agreement Details</CardTitle>
                <CardDescription>Enter the information for your operating agreement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Business Name</Label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Effective Date</Label>
                    <Input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Managing Member (Active Operator)
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={formData.managingMemberName}
                        onChange={(e) => setFormData(prev => ({ ...prev, managingMemberName: e.target.value }))}
                        placeholder="e.g., Jane Doe (your daughter)"
                      />
                    </div>
                    <div>
                      <Label>Ownership %</Label>
                      <Input
                        value={formData.managingMemberOwnership}
                        onChange={(e) => setFormData(prev => ({ ...prev, managingMemberOwnership: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Initial Capital Contribution</Label>
                      <Input
                        value={formData.managingMemberCapital}
                        onChange={(e) => setFormData(prev => ({ ...prev, managingMemberCapital: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    Passive Member (SSDI Protected)
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={formData.passiveMemberName}
                        onChange={(e) => setFormData(prev => ({ ...prev, passiveMemberName: e.target.value }))}
                        placeholder="e.g., Your name (Vine Voice)"
                      />
                    </div>
                    <div>
                      <Label>Ownership %</Label>
                      <Input
                        value={formData.passiveMemberOwnership}
                        onChange={(e) => setFormData(prev => ({ ...prev, passiveMemberOwnership: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Initial Capital Contribution</Label>
                      <Input
                        value={formData.passiveMemberCapital}
                        onChange={(e) => setFormData(prev => ({ ...prev, passiveMemberCapital: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">SSDI Protection Clauses</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="ssdi" 
                        checked={formData.includeSsdiProtection}
                        onCheckedChange={(c) => setFormData(prev => ({ ...prev, includeSsdiProtection: !!c }))}
                      />
                      <Label htmlFor="ssdi">Include SSDI Protection Language</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="passive" 
                        checked={formData.passiveRoleExplicitlyDefined}
                        onCheckedChange={(c) => setFormData(prev => ({ ...prev, passiveRoleExplicitlyDefined: !!c }))}
                      />
                      <Label htmlFor="passive">Explicitly Define Passive Role</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="material" 
                        checked={formData.noMaterialParticipationClause}
                        onCheckedChange={(c) => setFormData(prev => ({ ...prev, noMaterialParticipationClause: !!c }))}
                      />
                      <Label htmlFor="material">No Material Participation Clause</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  className="w-full"
                  disabled={!formData.managingMemberName || !formData.passiveMemberName}
                >
                  Generate Operating Agreement
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Agreement Generated
                  </CardTitle>
                  <CardDescription>Review and download your operating agreement</CardDescription>
                </div>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Your Operating Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              {userAgreements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No agreements generated yet. Create your first one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {userAgreements.map(agreement => (
                    <div key={agreement.id} className="p-4 rounded-lg border flex items-center justify-between">
                      <div>
                        <div className="font-medium">{agreement.agreement_name}</div>
                        <div className="text-sm text-muted-foreground">
                          Generated {agreement.generated_at ? format(new Date(agreement.generated_at), "MMM d, yyyy") : ""}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {agreement.includes_ssdi_protection && (
                            <Badge variant="outline" className="text-emerald-500">SSDI Protected</Badge>
                          )}
                          <Badge variant="outline">{agreement.status}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
