import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formSchemas, formDefaults, TaxFormType } from "@/lib/tax-form-schemas";
import { W4FormEditor } from "@/components/tax-forms/W4FormEditor";
import { W9FormEditor } from "@/components/tax-forms/W9FormEditor";
import { ScheduleCFormEditor } from "@/components/tax-forms/ScheduleCFormEditor";
import { Form1099NECEditor } from "@/components/tax-forms/Form1099NECEditor";

const FORM_TYPES: { type: TaxFormType; name: string; description: string }[] = [
  { type: "W-4", name: "Form W-4", description: "Employee's Withholding Certificate" },
  { type: "W-9", name: "Form W-9", description: "Request for Taxpayer Identification Number" },
  { type: "Schedule C", name: "Schedule C", description: "Profit or Loss From Business" },
  { type: "1099-NEC", name: "Form 1099-NEC", description: "Nonemployee Compensation" },
];

export default function TaxFormEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedForm, setSelectedForm] = useState<TaxFormType | null>(
    (searchParams.get("form") as TaxFormType) || null
  );
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/auth");
      else setUserId(user.id);
    });
  }, [navigate]);

  const form = useForm({
    resolver: selectedForm ? zodResolver(formSchemas[selectedForm]) : undefined,
    defaultValues: selectedForm ? formDefaults[selectedForm] : {},
  });

  useEffect(() => {
    if (selectedForm) {
      form.reset(formDefaults[selectedForm]);
    }
  }, [selectedForm, form]);

  const onSubmit = async (data: unknown) => {
    if (!userId || !selectedForm) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("tax_forms").insert({
        user_id: userId,
        form_type: selectedForm,
        tax_year: new Date().getFullYear(),
        status: "completed",
        form_data: data as Record<string, never>,
        completed_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({ title: "Form saved", description: `Your ${selectedForm} has been saved.` });
      navigate("/");
    } catch (error: unknown) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!selectedForm) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Tax Form Editor</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Select a Form to Fill Out</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FORM_TYPES.map((formType) => (
              <Card key={formType.type} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedForm(formType.type)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{formType.name}</CardTitle>
                      <CardDescription>{formType.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedForm(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Form {selectedForm}</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {selectedForm === "W-4" && <W4FormEditor form={form as any} />}
            {selectedForm === "W-9" && <W9FormEditor form={form as any} />}
            {selectedForm === "Schedule C" && <ScheduleCFormEditor form={form as any} />}
            {selectedForm === "1099-NEC" && <Form1099NECEditor form={form as any} />}
          </form>
        </Form>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
        <div className="container mx-auto flex justify-end gap-4">
          <Button variant="outline" onClick={() => setSelectedForm(null)}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Form
          </Button>
        </div>
      </footer>
    </div>
  );
}
