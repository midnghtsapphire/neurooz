import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CodeExamples() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          💻 Code Examples
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Code Reference</h1>
        <p className="text-xl text-muted-foreground mb-12">
          React components, hooks, utilities, and TypeScript types
        </p>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Task Management Hooks</h2>
          <p className="text-muted-foreground">
            Custom React hooks for CRUD operations, gamification calculator, and Oz messages.
          </p>
        </Card>
      </div>
    </div>
  );
}
