import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, GitBranch, Database, TestTube } from "lucide-react";

export default function Implementation() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          🔧 Implementation Guide
        </Badge>
        <h1 className="text-5xl font-bold mb-4">How to Deploy</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Step-by-step instructions for deploying the task management system
        </p>

        <div className="space-y-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Step 1: Apply the Patch</h2>
                <p className="text-muted-foreground mb-4">
                  The patch file contains all 1,679 lines of code for the task management system.
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`cd /path/to/neurooz
git checkout -b feature/brain-dump-task-management
git apply 0001-feat-Add-complete-task-management-system-4-List-adhd.patch
git add -A
git commit -m "feat: Add task management system"
git push origin feature/brain-dump-task-management`}
                </pre>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Step 2: Run Database Migration</h2>
                <p className="text-muted-foreground mb-4">
                  Copy the SQL from the migration file into your Supabase SQL Editor and execute.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Migration creates:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>9 database tables with RLS policies</li>
                    <li>Indexes for performance</li>
                    <li>Foreign key relationships</li>
                    <li>Gamification triggers</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TestTube className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Step 3: Test Locally</h2>
                <p className="text-muted-foreground mb-4">
                  Run the development server and test all features before deploying.
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`npm run dev
# Test these pages:
# - /tasks (Task Dashboard)
# - /tasks/today (Short List)
# - /tasks/someday (Long List)`}
                </pre>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Step 4: Deploy to Production</h2>
                <p className="text-muted-foreground mb-4">
                  Merge to main and deploy to neurooz.com
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`git checkout main
git merge feature/brain-dump-task-management
npm run build
npm run deploy`}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
