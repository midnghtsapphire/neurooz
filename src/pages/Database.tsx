import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Database() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          🗄️ Database Schema
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Database Architecture</h1>
        <p className="text-xl text-muted-foreground mb-12">
          9 tables with RLS policies, indexes, and relationships
        </p>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Core Tables</h2>
          <p className="text-muted-foreground">
            Complete database schema with tasks, brain_dumps, projects, user_stats, and achievements tables.
          </p>
        </Card>
      </div>
    </div>
  );
}
