import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, useUpdateProject, ActionItem } from "@/hooks/use-projects";
import { useCreateFocusPattern, useFocusPatterns } from "@/hooks/use-focus-system";
import { Trophy, TrendingDown, TrendingUp, AlertTriangle, Lightbulb, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProjectCompletionScorerProps {
  project: Project;
  actionItems: ActionItem[];
  onClose: () => void;
}

export function ProjectCompletionScorer({ project, actionItems, onClose }: ProjectCompletionScorerProps) {
  const [focusScore, setFocusScore] = useState(70);
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [newPattern, setNewPattern] = useState("");
  const [patternType, setPatternType] = useState<"distraction" | "success">("distraction");
  
  const updateProject = useUpdateProject();
  const createPattern = useCreateFocusPattern();
  const { data: existingPatterns = [] } = useFocusPatterns(project.id);
  const { toast } = useToast();

  // Calculate suggested score based on data
  const setbackCount = actionItems.filter(i => i.is_setback).length;
  const completedCount = actionItems.filter(i => i.is_completed).length;
  const totalCount = actionItems.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const suggestedScore = Math.max(0, Math.min(100, 
    Math.round(completionRate - (setbackCount * 10) - ((project as any).scope_creep_count || 0) * 5)
  ));

  const handleSave = async () => {
    // Save score and lessons
    await updateProject.mutateAsync({
      id: project.id,
      focus_score: focusScore,
      lessons_learned: lessonsLearned,
    } as any);

    // Save new pattern if entered
    if (newPattern.trim()) {
      await createPattern.mutateAsync({
        project_id: project.id,
        pattern_type: patternType,
        pattern_description: newPattern,
        impact_on_score: patternType === "distraction" ? -10 : 10,
        lesson: lessonsLearned || undefined,
      });
    }

    toast({
      title: "Project Scored! 🏆",
      description: `Focus Score: ${focusScore}/100`,
    });
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🌟";
    if (score >= 80) return "⭐";
    if (score >= 60) return "👍";
    if (score >= 40) return "🤔";
    return "📚";
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{setbackCount}</p>
            <p className="text-xs text-muted-foreground">Setbacks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{(project as any).scope_creep_count || 0}</p>
            <p className="text-xs text-muted-foreground">Scope Creep</p>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Score */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Suggested Score:</span>
          <Badge variant="outline" className={getScoreColor(suggestedScore)}>
            {suggestedScore}/100
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on {completionRate.toFixed(0)}% completion, {setbackCount} setbacks
        </p>
      </div>

      {/* Score Slider */}
      <div className="space-y-4">
        <Label className="flex items-center justify-between">
          <span>Your Focus Score</span>
          <span className={cn("text-2xl font-bold", getScoreColor(focusScore))}>
            {focusScore} {getScoreEmoji(focusScore)}
          </span>
        </Label>
        <Slider
          value={[focusScore]}
          onValueChange={(v) => setFocusScore(v[0])}
          min={0}
          max={100}
          step={5}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Got Distracted</span>
          <span>Stayed Focused</span>
        </div>
      </div>

      {/* Past Patterns Warning */}
      {existingPatterns.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Patterns from This Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {existingPatterns.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className={p.pattern_type === "distraction" ? "text-red-600" : "text-green-600"}>
                    {p.pattern_type === "distraction" ? "❌" : "✓"} {p.pattern_description}
                  </span>
                  <Badge variant="secondary">{p.times_occurred}x</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log New Pattern */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Log a Pattern (for future learning)
        </Label>
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            size="sm"
            variant={patternType === "distraction" ? "destructive" : "outline"}
            onClick={() => setPatternType("distraction")}
          >
            <TrendingDown className="h-4 w-4 mr-1" />
            Distraction
          </Button>
          <Button
            type="button"
            size="sm"
            variant={patternType === "success" ? "default" : "outline"}
            onClick={() => setPatternType("success")}
            className={patternType === "success" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Success
          </Button>
        </div>
        <Input
          placeholder={patternType === "distraction" 
            ? "e.g., Started a new genre instead of finishing" 
            : "e.g., Called boss before starting"}
          value={newPattern}
          onChange={(e) => setNewPattern(e.target.value)}
        />
      </div>

      {/* Lessons Learned */}
      <div className="space-y-2">
        <Label htmlFor="lessons">What did you learn?</Label>
        <Textarea
          id="lessons"
          placeholder="e.g., I should finish one genre before exploring new ones..."
          value={lessonsLearned}
          onChange={(e) => setLessonsLearned(e.target.value)}
          rows={3}
        />
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full gap-2">
        <Trophy className="h-4 w-4" />
        Save Score & Complete Project
      </Button>
    </div>
  );
}

interface ScoreProjectDialogProps {
  project: Project;
  actionItems: ActionItem[];
}

export function ScoreProjectDialog({ project, actionItems }: ScoreProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Trophy className="h-4 w-4" />
          Score & Complete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Score: {project.name}
          </DialogTitle>
        </DialogHeader>
        <ProjectCompletionScorer 
          project={project} 
          actionItems={actionItems}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
