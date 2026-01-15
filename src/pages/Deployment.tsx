import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function Deployment() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          🚀 Deployment Guide
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Deploy to Production</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Complete deployment checklist and troubleshooting
        </p>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Deploy (5 Minutes)</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">1. Apply Patch</p>
                <p className="text-sm text-muted-foreground">git apply patch-file.patch</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">2. Run Migration</p>
                <p className="text-sm text-muted-foreground">Copy SQL to Supabase</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">3. Test & Deploy</p>
                <p className="text-sm text-muted-foreground">npm run build && npm run deploy</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
