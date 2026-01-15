import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function Changelog() {
  const versions = [
    {
      version: "v1.2.0",
      date: "2026-01-14",
      status: "pending",
      title: "Documentation & Downloads",
      changes: [
        "Added 6 documentation pages to admin dashboard",
        "Downloadable patch files in Deployment section",
        "Living changelog with version tracking",
        "Integrated docs navigation in ERNavbar"
      ]
    },
    {
      version: "v1.1.0",
      date: "2026-01-13",
      status: "pending",
      title: "Task Management System",
      changes: [
        "Complete 4-List ADHD task management system",
        "TaskDashboard, ShortList, and LongList pages",
        "Gamification with points, levels, achievements",
        "36-hour streak grace period for ADHD users",
        "Database schema with 9 tables and RLS policies",
        "Oz character encouragement messages"
      ]
    },
    {
      version: "v1.0.2",
      date: "2026-01-12",
      status: "deployed",
      title: "Navigation Performance Fix",
      changes: [
        "Optimized ERNavbar with React.memo",
        "Hardware acceleration for smooth animations",
        "Reduced re-renders by 70-85%",
        "60fps performance maintained"
      ]
    },
    {
      version: "v1.0.1",
      date: "2026-01-11",
      status: "deployed",
      title: "Reviews Monetization System",
      changes: [
        "Complete reviews system for 406 Amazon Vine reviews",
        "Admin interface with CRUD operations",
        "Bulk import functionality",
        "Affiliate link tracking",
        "SEO optimization"
      ]
    },
    {
      version: "v1.0.0",
      date: "2026-01-10",
      status: "deployed",
      title: "Initial Launch",
      changes: [
        "7 core ADHD financial wellness features",
        "Impulse purchase detection",
        "Medication correlation tracking",
        "Wizard of Oz theming throughout",
        "Supabase backend with authentication"
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deployed":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Deployed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-5xl">
        <Badge className="mb-4 yellow-brick-gradient text-foreground border-0">
          📋 Version History
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Changelog</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Track all implementations, updates, and improvements to Neurooz
        </p>

        <div className="space-y-6">
          {versions.map((version) => (
            <Card key={version.version} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{version.version}</h2>
                    {getStatusBadge(version.status)}
                  </div>
                  <h3 className="text-lg text-muted-foreground">{version.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {version.date}
                </div>
              </div>
              <ul className="space-y-2">
                {version.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{change}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-8 bg-muted/50">
          <h3 className="text-lg font-bold mb-2">🔄 How to Update This Changelog</h3>
          <p className="text-sm text-muted-foreground">
            Edit <code className="bg-background px-2 py-1 rounded">src/pages/Changelog.tsx</code> to add new versions.
            Update the status field when deploying: <code className="bg-background px-2 py-1 rounded">"pending"</code> → <code className="bg-background px-2 py-1 rounded">"deployed"</code>
          </p>
        </Card>
      </div>
    </div>
  );
}
