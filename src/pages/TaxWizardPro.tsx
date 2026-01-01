import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccessibilityTrigger, useAccessibility } from "@/hooks/use-accessibility";
import { 
  UserProfile, TaxFormDef, FormFieldDef, 
  getFormsForProfile, getTotalEstimatedTime, ALL_TAX_FORMS, TAX_CONSTANTS_2026 
} from "@/lib/tax-wizard-forms";
import { TaxWizardData, checkSSDISafeguards, getCalculationFn, formatCurrency } from "@/lib/tax-wizard-calculations";
import { ArrowLeft, ArrowRight, FileText, Shield, Clock, AlertTriangle, CheckCircle, HelpCircle, Home } from "lucide-react";

const USER_PROFILES = [
  { id: 'passive_owner' as UserProfile, name: 'Passive Owner (SSDI)', description: 'SSDI recipient with 60% passive ownership', icon: Shield },
  { id: 'active_manager' as UserProfile, name: 'Active Manager (Daughter)', description: '40% share, W-2/1099 income, manages business', icon: FileText },
  { id: 'joint_business' as UserProfile, name: 'Business Forms', description: 'LLC returns (1065, K-1s, 4562)', icon: FileText },
];

export default function TaxWizardPro() {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const [step, setStep] = useState<'profile' | 'forms' | 'filling'>('profile');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formData, setFormData] = useState<TaxWizardData>({});

  const applicableForms = selectedProfile ? getFormsForProfile(selectedProfile) : [];
  const currentForm = selectedForms.length > 0 ? ALL_TAX_FORMS.find(f => f.id === selectedForms[currentFormIndex]) : null;
  const currentSection = currentForm?.sections[currentSectionIndex];
  const currentField = currentSection?.fields[currentFieldIndex];
  const totalTime = getTotalEstimatedTime(applicableForms);

  const ssdiSafeguards = checkSSDISafeguards(formData, selectedProfile === 'passive_owner');

  const handleProfileSelect = (profile: UserProfile) => {
    setSelectedProfile(profile);
    const forms = getFormsForProfile(profile);
    setSelectedForms(forms.map(f => f.id));
    setStep('forms');
  };

  const handleStartFilling = () => {
    setStep('filling');
    setCurrentFormIndex(0);
    setCurrentSectionIndex(0);
    setCurrentFieldIndex(0);
  };

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (!currentForm || !currentSection) return;
    
    if (currentFieldIndex < currentSection.fields.length - 1) {
      setCurrentFieldIndex(prev => prev + 1);
    } else if (currentSectionIndex < currentForm.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentFieldIndex(0);
    } else if (currentFormIndex < selectedForms.length - 1) {
      setCurrentFormIndex(prev => prev + 1);
      setCurrentSectionIndex(0);
      setCurrentFieldIndex(0);
    }
  };

  const handleBack = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      const prevSection = currentForm?.sections[currentSectionIndex - 1];
      setCurrentFieldIndex(prevSection ? prevSection.fields.length - 1 : 0);
    } else if (currentFormIndex > 0) {
      setCurrentFormIndex(prev => prev - 1);
      const prevForm = ALL_TAX_FORMS.find(f => f.id === selectedForms[currentFormIndex - 1]);
      if (prevForm) {
        setCurrentSectionIndex(prevForm.sections.length - 1);
        setCurrentFieldIndex(prevForm.sections[prevForm.sections.length - 1].fields.length - 1);
      }
    }
  };

  const totalFields = selectedForms.reduce((sum, formId) => {
    const form = ALL_TAX_FORMS.find(f => f.id === formId);
    return sum + (form?.sections.reduce((s, sec) => s + sec.fields.length, 0) || 0);
  }, 0);

  const completedFields = Object.keys(formData).length;
  const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  const renderFieldInput = (field: FormFieldDef) => {
    const value = formData[field.id] ?? field.defaultValue ?? '';
    
    if (field.type === 'calculated') {
      const calcFn = field.calculationFn ? getCalculationFn(field.calculationFn) : null;
      const calculated = calcFn ? calcFn(formData) : 0;
      return (
        <div className="p-4 bg-muted rounded-lg border-2 border-primary/20">
          <span className="text-2xl font-bold text-primary">{formatCurrency(calculated)}</span>
          <span className="text-sm text-muted-foreground ml-2">(Auto-calculated)</span>
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <Select value={String(value)} onValueChange={(v) => handleFieldChange(field.id, v)}>
          <SelectTrigger className="text-lg h-14">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={field.type === 'currency' || field.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => handleFieldChange(field.id, field.type === 'currency' || field.type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.example || `Enter ${field.name.toLowerCase()}...`}
        className="text-lg h-14"
      />
    );
  };

  // Profile Selection Step
  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate('/')}><Home className="mr-2 h-4 w-4" /> Home</Button>
            <AccessibilityTrigger />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">TaxWizard Pro</h1>
            <p className="text-xl text-muted-foreground">Guided Tax Form Filling for SSDI Recipients & Multi-Income Scenarios</p>
            <Badge variant="outline" className="mt-4">2026 Tax Year (Filed in 2027)</Badge>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Who are you filing for?</CardTitle>
              <CardDescription>Select your profile to see relevant forms and SSDI safeguards</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {USER_PROFILES.map(profile => (
                <Button
                  key={profile.id}
                  variant="outline"
                  className="h-auto p-6 justify-start text-left"
                  onClick={() => handleProfileSelect(profile.id)}
                >
                  <profile.icon className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <div className="font-semibold text-lg">{profile.name}</div>
                    <div className="text-muted-foreground">{profile.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>SSDI Protection Built-In</AlertTitle>
            <AlertDescription>
              This wizard flags any entries that could affect your SSDI benefits. Monthly SGA limit: ${TAX_CONSTANTS_2026.sgaMonthlyLimit}.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Form Selection Step
  if (step === 'forms') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setStep('profile')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Change Profile
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Forms for {USER_PROFILES.find(p => p.id === selectedProfile)?.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Estimated time: {totalTime} minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicableForms.map(form => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{form.name}</div>
                    <div className="text-sm text-muted-foreground">{form.fullName}</div>
                  </div>
                  <Badge>{form.estimatedMinutes} min</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button size="lg" className="w-full h-16 text-lg" onClick={handleStartFilling}>
            Start Filling Forms <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Form Filling Step
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => setStep('forms')}><ArrowLeft className="mr-2 h-4 w-4" /> Forms</Button>
          <AccessibilityTrigger />
        </div>

        <Progress value={progress} className="mb-4 h-3" />
        <div className="text-sm text-muted-foreground mb-6 text-center">
          {completedFields} of {totalFields} fields completed
        </div>

        {ssdiSafeguards.isAtRisk && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>SSDI Risk Detected</AlertTitle>
            <AlertDescription>
              {ssdiSafeguards.warnings.map((w, i) => <div key={i}>{w}</div>)}
            </AlertDescription>
          </Alert>
        )}

        {currentForm && currentSection && currentField && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="outline">{currentForm.name}</Badge>
                <span>›</span>
                <span>{currentSection.title}</span>
              </div>
              <CardTitle className="flex items-center gap-2">
                {currentField.line && <Badge>{currentField.line}</Badge>}
                {currentField.name}
                <Tooltip>
                  <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent className="max-w-sm"><p>{currentField.explanation}</p></TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{currentField.explanation}</p>
              
              {currentField.maxDescription && (
                <Alert><AlertDescription>📊 {currentField.maxDescription}</AlertDescription></Alert>
              )}
              
              {currentField.ssdiWarning && selectedProfile === 'passive_owner' && (
                <Alert variant="destructive">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>{currentField.ssdiWarning}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label className="text-lg mb-2 block">{currentField.name} {currentField.required && <span className="text-destructive">*</span>}</Label>
                {renderFieldInput(currentField)}
                {currentField.example && <p className="text-sm text-muted-foreground mt-2">Example: {currentField.example}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="flex-1" onClick={handleBack} disabled={currentFormIndex === 0 && currentSectionIndex === 0 && currentFieldIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button size="lg" className="flex-1" onClick={handleNext}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          ⚖️ This wizard is educational. Consult a CPA for professional tax advice.
        </p>
      </div>
    </div>
  );
}
