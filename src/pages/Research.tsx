import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Research() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          🧠 ADHD Research
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Evidence-Based Design</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Research findings from CHADD, ADDitude Magazine, and Tiimo
        </p>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">CHADD: Time Management for ADHD</h2>
            <p className="text-muted-foreground">
              Keep lists short (3-5 items), external brain dump, and visual cues for quick recognition.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">ADDitude: The 4-List System</h2>
            <p className="text-muted-foreground">
              Short List (1-5 tasks), Calendar (time-specific), Long List (someday/maybe), Routines (checklists).
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Tiimo: Gamification for ADHD</h2>
            <p className="text-muted-foreground">
              Instant feedback, progress visualization, grace periods, and surprise rewards for dopamine hits.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
