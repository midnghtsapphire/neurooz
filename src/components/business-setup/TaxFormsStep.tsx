import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusinessRole, BusinessStructure } from "@/hooks/use-businesses";
import { cn } from "@/lib/utils";

interface TaxFormsStepProps {
  businessStructure: BusinessStructure;
  role: BusinessRole;
  onStartForm: (formType: string) => void;
}

interface TaxFormInfo {
  type: string;
  name: string;
  description: string;
  whoFiles: string;
  deadline: string;
  required: boolean;
}

const getTaxForms = (structure: BusinessStructure, role: BusinessRole): TaxFormInfo[] => {
  const forms: TaxFormInfo[] = [];

  // Employee forms
  if (role === "employee") {
    forms.push({
      type: "W-4",
      name: "Employee's Withholding Certificate",
      description: "Determines federal income tax withholding from your paycheck",
      whoFiles: "You fill out, employer keeps",
      deadline: "When starting job or changing withholding",
      required: true,
    });
    forms.push({
      type: "W-2",
      name: "Wage and Tax Statement",
      description: "Reports wages and taxes withheld. Employer provides by Jan 31.",
      whoFiles: "Employer provides to you",
      deadline: "Received by January 31",
      required: true,
    });
  }

  // Contractor forms
  if (role === "contractor") {
    forms.push({
      type: "W-9",
      name: "Request for TIN and Certification",
      description: "Provides your SSN/EIN to the business for 1099 reporting",
      whoFiles: "You fill out, business keeps",
      deadline: "Before first payment",
      required: true,
    });
    forms.push({
      type: "1099-NEC",
      name: "Nonemployee Compensation",
      description: "Reports payments of $600+ to you. Business provides by Jan 31.",
      whoFiles: "Business provides to you",
      deadline: "Received by January 31",
      required: true,
    });
  }

  // Owner forms based on structure
  if (role === "owner" || role === "partner") {
    if (structure === "sole_proprietor" || structure === "single_member_llc") {
      forms.push({
        type: "Schedule C",
        name: "Profit or Loss From Business",
        description: "Reports business income and expenses on your personal return",
        whoFiles: "You file with Form 1040",
        deadline: "April 15 (personal tax deadline)",
        required: true,
      });
      forms.push({
        type: "Schedule SE",
        name: "Self-Employment Tax",
        description: "Calculates Social Security and Medicare tax on self-employment income",
        whoFiles: "You file with Form 1040",
        deadline: "April 15",
        required: true,
      });
    }

    if (structure === "llc_s_corp") {
      forms.push({
        type: "Form 2553",
        name: "S Corporation Election",
        description: "Elects S-Corp tax treatment for your LLC",
        whoFiles: "Business files with IRS",
        deadline: "Within 75 days of formation or by March 15",
        required: true,
      });
      forms.push({
        type: "Form 1120-S",
        name: "S Corporation Tax Return",
        description: "Annual S-Corp information return",
        whoFiles: "Business files",
        deadline: "March 15",
        required: true,
      });
      forms.push({
        type: "Schedule K-1",
        name: "Partner's/Shareholder's Share",
        description: "Reports your share of S-Corp income/loss",
        whoFiles: "S-Corp provides to you",
        deadline: "March 15",
        required: true,
      });
      forms.push({
        type: "W-2",
        name: "Wage Statement (for reasonable salary)",
        description: "S-Corp must pay you reasonable salary with W-2",
        whoFiles: "Your S-Corp provides to you",
        deadline: "January 31",
        required: true,
      });
    }

    if (structure === "partnership") {
      forms.push({
        type: "Form 1065",
        name: "Partnership Return",
        description: "Annual partnership information return",
        whoFiles: "Partnership files",
        deadline: "March 15",
        required: true,
      });
      forms.push({
        type: "Schedule K-1",
        name: "Partner's Share of Income",
        description: "Reports your share of partnership income/loss",
        whoFiles: "Partnership provides to you",
        deadline: "March 15",
        required: true,
      });
    }

    if (structure === "c_corp") {
      forms.push({
        type: "Form 1120",
        name: "C Corporation Tax Return",
        description: "Annual corporate tax return",
        whoFiles: "Corporation files",
        deadline: "April 15",
        required: true,
      });
    }
  }

  // Quarterly estimated taxes for self-employed
  if (role === "owner" || role === "contractor") {
    forms.push({
      type: "Form 1040-ES",
      name: "Estimated Tax for Individuals",
      description: "Quarterly estimated tax payments to avoid penalties",
      whoFiles: "You pay quarterly",
      deadline: "Apr 15, Jun 15, Sep 15, Jan 15",
      required: false,
    });
  }

  return forms;
};

export function TaxFormsStep({ businessStructure, role, onStartForm }: TaxFormsStepProps) {
  const forms = getTaxForms(businessStructure, role);
  
  const requiredForms = forms.filter(f => f.required);
  const optionalForms = forms.filter(f => !f.required);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Your Tax Forms</h2>
        <p className="text-muted-foreground mt-2">
          Based on your structure and role, here are the forms you'll need
        </p>
      </div>

      {/* Required Forms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Required Forms
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {requiredForms.map((form) => (
            <Card key={form.type} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{form.type}</CardTitle>
                      <p className="text-xs text-muted-foreground">{form.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {form.deadline}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  {form.description}
                </CardDescription>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Who files:</span> {form.whoFiles}
                </p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onStartForm(form.type)}
                >
                  Start {form.type}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Optional Forms */}
      {optionalForms.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            Recommended Forms
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {optionalForms.map((form) => (
              <Card key={form.type} className="relative opacity-80">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{form.type}</CardTitle>
                        <p className="text-xs text-muted-foreground">{form.name}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">
                    {form.description}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Deadline:</span> {form.deadline}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full"
                    onClick={() => onStartForm(form.type)}
                  >
                    Set Up {form.type}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
