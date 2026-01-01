import { useAccessibility } from "@/hooks/use-accessibility";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  Focus, 
  Zap, 
  Clock, 
  Type, 
  RotateCcw,
  Accessibility,
  Volume2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AccessibilityToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  recommended?: boolean;
}

const AccessibilityToggle = ({ 
  icon, 
  label, 
  description, 
  checked, 
  onCheckedChange,
  recommended 
}: AccessibilityToggleProps) => (
  <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label htmlFor={label} className="text-sm font-medium cursor-pointer">
            {label}
          </Label>
          {recommended && (
            <span className="text-[10px] bg-emerald-gold/20 text-emerald-gold px-1.5 py-0.5 rounded">
              Recommended
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch
      id={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="shrink-0"
    />
  </div>
);

export function AccessibilityPanel() {
  const { settings, toggleSetting, resetToDefaults } = useAccessibility();

  return (
    <Card className="border-emerald-gold/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-emerald-gold" />
          <CardTitle className="text-lg">Accessibility Settings</CardTitle>
        </div>
        <CardDescription>
          Customize your experience to reduce cognitive load and improve focus
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <AccessibilityToggle
          icon={<Zap className="w-4 h-4" />}
          label="Reduced Motion"
          description="Minimize animations and transitions for less distraction"
          checked={settings.reducedMotion}
          onCheckedChange={() => toggleSetting("reducedMotion")}
          recommended
        />
        
        <AccessibilityToggle
          icon={<Focus className="w-4 h-4" />}
          label="Focus Mode"
          description="Hide non-essential UI elements to stay focused on current task"
          checked={settings.focusMode}
          onCheckedChange={() => toggleSetting("focusMode")}
          recommended
        />
        
        <AccessibilityToggle
          icon={<Clock className="w-4 h-4" />}
          label="Time Estimates"
          description="Show estimated time for each step to reduce anxiety"
          checked={settings.showTimeEstimates}
          onCheckedChange={() => toggleSetting("showTimeEstimates")}
          recommended
        />
        
        <AccessibilityToggle
          icon={<Eye className="w-4 h-4" />}
          label="High Contrast"
          description="Increase color contrast for better visibility"
          checked={settings.highContrast}
          onCheckedChange={() => toggleSetting("highContrast")}
        />
        
        <AccessibilityToggle
          icon={<Type className="w-4 h-4" />}
          label="Large Text"
          description="Increase text size throughout the app"
          checked={settings.largeText}
          onCheckedChange={() => toggleSetting("largeText")}
        />
        
        <AccessibilityToggle
          icon={<Volume2 className="w-4 h-4" />}
          label="Screen Reader Optimized"
          description="Enhanced descriptions for assistive technology"
          checked={settings.screenReaderOptimized}
          onCheckedChange={() => toggleSetting("screenReaderOptimized")}
        />

        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefaults}
            className="w-full gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact trigger button for header/nav
export function AccessibilityTrigger() {
  const { settings } = useAccessibility();
  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Accessibility settings"
        >
          <Accessibility className="w-5 h-5" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-gold text-night-emerald text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility
          </SheetTitle>
          <SheetDescription>
            Settings designed for ADHD, cognitive differences, and sensory needs
          </SheetDescription>
        </SheetHeader>
        <AccessibilityPanel />
      </SheetContent>
    </Sheet>
  );
}
