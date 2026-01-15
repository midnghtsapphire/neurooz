import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, AlertCircle, Terminal, Folder, FileCode } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Deployment() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          🚀 Deployment Guide
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Deploy to Production</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Complete step-by-step guide for beginners - no command line experience needed!
        </p>

        {/* Download Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Download className="h-6 w-6" />
            Step 1: Download Patch Files
          </h2>
          <p className="text-muted-foreground mb-6">
            Click the buttons below to download the implementation files. Your browser will save them to your Downloads folder.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <a href="/patches/0001-feat-Add-complete-task-management-system-4-List-ADHD.patch" download>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Task Management System
              </Button>
            </a>
            <a href="/patches/0001-feat-Add-documentation-pages-to-admin-dashboard-Over.patch" download>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Documentation Pages
              </Button>
            </a>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Where did the files go?</strong> Check your Downloads folder:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Mac:</strong> <code className="bg-background px-2 py-1 rounded">/Users/YourName/Downloads/</code></li>
                <li><strong>Windows:</strong> <code className="bg-background px-2 py-1 rounded">C:\Users\YourName\Downloads\</code></li>
              </ul>
            </AlertDescription>
          </Alert>
        </Card>

        {/* Move Files Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Folder className="h-6 w-6" />
            Step 2: Move Files to Your Project
          </h2>
          <p className="text-muted-foreground mb-4">
            You need to move the downloaded patch files to your Neurooz project folder.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">📁 Find Your Neurooz Project Folder</h3>
              <p className="text-sm text-muted-foreground mb-2">
                This is where you cloned the repository. Common locations:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                <li><code className="bg-background px-2 py-1 rounded">/Users/YourName/Documents/neurooz/</code></li>
                <li><code className="bg-background px-2 py-1 rounded">/Users/YourName/Projects/neurooz/</code></li>
                <li><code className="bg-background px-2 py-1 rounded">C:\Users\YourName\Documents\neurooz\</code></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">🚚 Move the Patch Files</h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Option 1: Drag and Drop (Easiest)</strong></p>
                <ol className="list-decimal ml-6 space-y-1 text-sm text-muted-foreground">
                  <li>Open your Downloads folder</li>
                  <li>Find the two .patch files</li>
                  <li>Drag them to your neurooz project folder</li>
                  <li>Drop them in the main folder (same level as package.json)</li>
                </ol>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Can't find your project folder?</strong> Open Terminal/Command Prompt and type:
                <code className="block bg-background px-3 py-2 rounded mt-2">pwd</code>
                This shows your current location. Navigate to your project first!
              </AlertDescription>
            </Alert>
          </div>
        </Card>

        {/* Command Line Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            Step 3: Open Terminal/Command Prompt
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">🖥️ How to Open Terminal</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-bold mb-2">🍎 Mac</p>
                  <ol className="list-decimal ml-6 space-y-1 text-sm text-muted-foreground">
                    <li>Press <kbd className="bg-background px-2 py-1 rounded">Cmd + Space</kbd></li>
                    <li>Type "Terminal"</li>
                    <li>Press Enter</li>
                  </ol>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-bold mb-2">🪟 Windows</p>
                  <ol className="list-decimal ml-6 space-y-1 text-sm text-muted-foreground">
                    <li>Press <kbd className="bg-background px-2 py-1 rounded">Win + R</kbd></li>
                    <li>Type "cmd"</li>
                    <li>Press Enter</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">📂 Navigate to Your Project</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You need to "change directory" to your Neurooz project. Copy and paste this command, but replace <code className="bg-background px-2 py-1 rounded">YourName</code> with your actual username:
              </p>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                <p className="mb-2"># Mac/Linux:</p>
                <p className="mb-4">cd /Users/YourName/Documents/neurooz</p>
                <p className="mb-2"># Windows:</p>
                <p>cd C:\Users\YourName\Documents\neurooz</p>
              </div>
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Not sure where your project is?</strong> In Finder (Mac) or File Explorer (Windows), navigate to your project folder, then:
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li><strong>Mac:</strong> Right-click the folder → "Get Info" → Copy the path</li>
                    <li><strong>Windows:</strong> Click the address bar → Copy the path</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="font-bold mb-2">✅ Verify You're in the Right Place</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Type this command to see if you're in the correct folder:
              </p>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm mb-3">
                ls
              </div>
              <p className="text-sm text-muted-foreground">
                You should see files like: <code className="bg-background px-2 py-1 rounded">package.json</code>, <code className="bg-background px-2 py-1 rounded">src/</code>, <code className="bg-background px-2 py-1 rounded">README.md</code>
              </p>
            </div>
          </div>
        </Card>

        {/* Apply Patch Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            Step 4: Apply the Patch Files
          </h2>
          <p className="text-muted-foreground mb-4">
            Now that you're in the right folder, apply the patches one at a time.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">🔧 Apply Task Management System</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Copy and paste this EXACT command (all one line):
              </p>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                git apply 0001-feat-Add-complete-task-management-system-4-List-ADHD.patch
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Press <kbd className="bg-background px-2 py-1 rounded">Enter</kbd>. If it works, you'll see no error message!
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">📚 Apply Documentation Pages</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Copy and paste this EXACT command:
              </p>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                git apply 0001-feat-Add-documentation-pages-to-admin-dashboard-Over.patch
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Got an error?</strong> Common issues:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>"No such file":</strong> The patch file isn't in your project folder. Go back to Step 2.</li>
                  <li><strong>"Already applied":</strong> You already applied this patch! Skip it.</li>
                  <li><strong>"Patch failed":</strong> Your code might have conflicts. Ask for help!</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </Card>

        {/* Database Migration Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 5: Run Database Migration</h2>
          <p className="text-muted-foreground mb-4">
            You need to create the database tables in Supabase.
          </p>
          <ol className="list-decimal ml-6 space-y-3">
            <li>
              <p className="font-medium">Go to your Supabase project</p>
              <p className="text-sm text-muted-foreground">Visit <a href="https://supabase.com/dashboard" className="text-primary underline" target="_blank">supabase.com/dashboard</a></p>
            </li>
            <li>
              <p className="font-medium">Open SQL Editor</p>
              <p className="text-sm text-muted-foreground">Click "SQL Editor" in the left sidebar</p>
            </li>
            <li>
              <p className="font-medium">Create a new query</p>
              <p className="text-sm text-muted-foreground">Click "+ New Query"</p>
            </li>
            <li>
              <p className="font-medium">Copy the migration SQL</p>
              <p className="text-sm text-muted-foreground">
                Open <code className="bg-background px-2 py-1 rounded">supabase/migrations/20260113135728_brain_dump_task_management.sql</code> in your project
              </p>
            </li>
            <li>
              <p className="font-medium">Paste and run</p>
              <p className="text-sm text-muted-foreground">Paste the SQL into Supabase, then click "Run"</p>
            </li>
          </ol>
        </Card>

        {/* Test Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 6: Test Locally</h2>
          <p className="text-muted-foreground mb-4">
            Before deploying, test that everything works on your computer.
          </p>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm space-y-2 mb-4">
            <p># Install any new dependencies</p>
            <p>npm install</p>
            <p className="mt-4"># Start the development server</p>
            <p>npm run dev</p>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Your browser should open to <code className="bg-background px-2 py-1 rounded">http://localhost:3000</code>
          </p>
          <div className="space-y-2">
            <p className="font-medium">✅ Test these pages:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
              <li><code className="bg-background px-2 py-1 rounded">/tasks</code> - Task Dashboard loads?</li>
              <li><code className="bg-background px-2 py-1 rounded">/tasks/today</code> - Can add tasks to Short List?</li>
              <li><code className="bg-background px-2 py-1 rounded">/admin/docs</code> - Documentation pages load?</li>
            </ul>
          </div>
        </Card>

        {/* Deploy Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Step 7: Deploy to Production</h2>
          <p className="text-muted-foreground mb-4">
            Everything works? Time to deploy to neurooz.com!
          </p>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
            <p># Add all changes</p>
            <p>git add -A</p>
            <p className="mt-4"># Commit with a message</p>
            <p>git commit -m "feat: Add task management and documentation"</p>
            <p className="mt-4"># Push to GitHub</p>
            <p>git push origin main</p>
            <p className="mt-4"># Build and deploy</p>
            <p>npm run build</p>
            <p>npm run deploy</p>
          </div>
          <Alert className="mt-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Success!</strong> Your changes are now live at neurooz.com! 🎉
              <p className="mt-2">Don't forget to update the Changelog status from "pending" to "deployed"!</p>
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    </div>
  );
}
