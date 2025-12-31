import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useTodayCheckin, useCreateCheckin, useFocusPatterns } from "@/hooks/use-focus-system";
import { Project } from "@/hooks/use-projects";
import { Sparkles, Phone, Target, ShieldAlert, Brain, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DailyOzRitualProps {
  project: Project;
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function DailyOzRitual({ project, open, onComplete, onCancel }: DailyOzRitualProps) {
  const [step, setStep] = useState(1);
  const [prioritiesReviewed, setPrioritiesReviewed] = useState(false);
  const [stakeholders, setStakeholders] = useState("");
  const [focusIntention, setFocusIntention] = useState("");
  const [distractions, setDistractions] = useState("");
  
  const { data: todayCheckin } = useTodayCheckin(project.id);
  const { data: patterns = [] } = useFocusPatterns(project.id);
  const createCheckin = useCreateCheckin();
  const { toast } = useToast();

  // If already checked in today, complete immediately
  if (todayCheckin) {
    onComplete();
    return null;
  }

  const relevantPatterns = patterns.filter(p => p.times_occurred >= 2);

  const handleComplete = async () => {
    await createCheckin.mutateAsync({
      project_id: project.id,
      priorities_reviewed: prioritiesReviewed,
      stakeholders_contacted: stakeholders ? stakeholders.split(",").map(s => s.trim()) : [],
      focus_intention: focusIntention,
      distractions_to_avoid: distractions ? distractions.split(",").map(d => d.trim()) : [],
    });
    
    toast({
      title: "Oz Ritual Complete! 🌟",
      description: "You're ready to walk the Yellow Brick Road",
    });
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Daily Oz Ritual
          </DialogTitle>
          <DialogDescription>
            Complete your check-in before starting work on "{project.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  s < step ? "bg-green-500 border-green-500 text-white" :
                  s === step ? "bg-yellow-500 border-yellow-500 text-white" :
                  "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
            ))}
          </div>

          {/* Step 1: Review Priorities */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Brain className="h-6 w-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-400">
                    Scarecrow Says: Think First!
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                    Before jumping in, have you reviewed what actually needs to be done?
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="priorities" 
                  checked={prioritiesReviewed}
                  onCheckedChange={(checked) => setPrioritiesReviewed(checked === true)}
                />
                <Label htmlFor="priorities" className="cursor-pointer">
                  I have reviewed my priorities and know what to work on
                </Label>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!prioritiesReviewed}
                className="w-full"
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Stakeholder Check */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <Phone className="h-6 w-6 text-rose-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-rose-800 dark:text-rose-400">
                    Tin Man Says: Check Your Heart!
                  </h3>
                  <p className="text-sm text-rose-700 dark:text-rose-500 mt-1">
                    Who should you connect with before starting? Boss? Marketing? Team?
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stakeholders">
                  Who did you check in with? (comma separated, or "none needed")
                </Label>
                <Input
                  id="stakeholders"
                  placeholder="e.g., Boss, Marketing team, Partner"
                  value={stakeholders}
                  onChange={(e) => setStakeholders(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!stakeholders.trim()}
                  className="flex-1"
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Focus Intention */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <Target className="h-6 w-6 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-400">
                    Set Your Emerald City Goal
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-500 mt-1">
                    What ONE thing will make today a success for this project?
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intention">Today's Focus (just ONE thing)</Label>
                <Textarea
                  id="intention"
                  placeholder="e.g., Finish the intro section of the song"
                  value={focusIntention}
                  onChange={(e) => setFocusIntention(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!focusIntention.trim()}
                  className="flex-1"
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Watch for Distractions */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400">
                    Lion Says: Know Your Flying Monkeys!
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-500 mt-1">
                    What distractions might pull you off the Yellow Brick Road?
                  </p>
                </div>
              </div>

              {/* Show past patterns as warnings */}
              {relevantPatterns.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                    ⚠️ Watch out! You've done these before:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relevantPatterns.map((p) => (
                      <Badge key={p.id} variant="destructive" className="text-xs">
                        {p.pattern_description} ({p.times_occurred}x)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="distractions">
                  Distractions to avoid today (comma separated)
                </Label>
                <Input
                  id="distractions"
                  placeholder="e.g., New song genre, social media, reorganizing files"
                  value={distractions}
                  onChange={(e) => setDistractions(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button 
                  onClick={handleComplete} 
                  disabled={!distractions.trim() || createCheckin.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {createCheckin.isPending ? "Saving..." : "Enter the Emerald City! 🏰"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
