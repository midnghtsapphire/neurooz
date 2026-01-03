import { useState, useMemo } from "react";
import { useProjects, useActionItems, useDeleteProject, Project } from "@/hooks/use-projects";
import { useProjectItems } from "@/hooks/use-project-items";
import { useTodayCheckin } from "@/hooks/use-focus-system";
import { ProjectCard } from "@/components/ProjectCard";
import { ActionItemRow } from "@/components/ActionItemRow";
import { ProjectItemRow } from "@/components/ProjectItemRow";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { CreateActionItemDialog } from "@/components/CreateActionItemDialog";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { GardenRewards } from "@/components/GardenRewards";
import { ProjectFilterBar, ProjectFilters } from "@/components/ProjectFilterBar";
import { EnvironmentSelector, Environment, EnvironmentBadge } from "@/components/EnvironmentSelector";
import { ExportMenu } from "@/components/ExportMenu";
import { EmploymentRulesDialog } from "@/components/EmploymentRulesDialog";
import { BrainDumpDialog } from "@/components/BrainDumpDialog";
import { EditProjectDialog } from "@/components/EditProjectDialog";
import { YellowBrickRoad } from "@/components/YellowBrickRoad";
import { SetbackMatrix } from "@/components/SetbackMatrix";
import { DailyOzRitual } from "@/components/DailyOzRitual";
import { ScoreProjectDialog } from "@/components/ProjectCompletionScorer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FolderKanban, ListTodo, Leaf, Package, MapPin, Trophy, Sparkles, Columns, StickyNote, Eye, EyeOff } from "lucide-react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TotoQuickCapture } from "@/components/TotoQuickCapture";
import { StickyNotesInbox } from "@/components/StickyNotesInbox";

const defaultFilters: ProjectFilters = {
  search: "",
  assignedTo: "",
  status: "all",
  dateFrom: undefined,
  dateTo: undefined,
  projectId: "",
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showOzRitual, setShowOzRitual] = useState(false);
  const [ritualCompleted, setRitualCompleted] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [environment, setEnvironment] = useState<Environment>("sandbox");
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [focusMode, setFocusMode] = useState(false); // ADHD focus mode - hides project grid
  
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: allActionItems = [] } = useActionItems();
  const { data: projectActionItems = [] } = useActionItems(selectedProject?.id);
  const { data: projectItems = [] } = useProjectItems(selectedProject?.id);
  const { data: todayCheckin } = useTodayCheckin(selectedProject?.id || "");
  const deleteProject = useDeleteProject();

  // Check if ritual is needed
  const needsRitual = selectedProject && !todayCheckin && !ritualCompleted;

  // Get unique assignees from projects
  const assignees = useMemo(() => {
    const uniqueAssignees = new Set<string>();
    projects.forEach((p) => {
      if (p.assigned_to) uniqueAssignees.add(p.assigned_to);
    });
    return Array.from(uniqueAssignees).sort();
  }, [projects]);

  // Filter projects based on criteria
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(searchLower);
        const matchesDesc = project.description?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesDesc) return false;
      }

      // Assigned to filter
      if (filters.assignedTo && project.assigned_to !== filters.assignedTo) {
        return false;
      }

      // Status filter
      if (filters.status === "active" && project.is_completed) return false;
      if (filters.status === "completed" && !project.is_completed) return false;

      // Date filters
      if (filters.dateFrom) {
        const projectDate = new Date(project.created_at);
        if (projectDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const projectDate = new Date(project.created_at);
        if (projectDate > filters.dateTo) return false;
      }

      // Project filter (for action items view)
      if (filters.projectId && project.id !== filters.projectId) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  // Filter action items based on criteria
  const filteredActionItems = useMemo(() => {
    return allActionItems.filter((item) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(searchLower);
        const matchesDesc = item.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Project filter
      if (filters.projectId && item.project_id !== filters.projectId) {
        return false;
      }

      // Date filters
      if (filters.dateFrom) {
        const itemDate = new Date(item.created_at);
        if (itemDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const itemDate = new Date(item.created_at);
        if (itemDate > filters.dateTo) return false;
      }

      return true;
    });
  }, [allActionItems, filters]);

  const getActionItemCount = (projectId: string) => {
    return allActionItems.filter((item) => item.project_id === projectId).length;
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Project detail view
  if (selectedProject) {
    // Show Oz Ritual if needed
    if (needsRitual) {
      return (
        <>
          <DailyOzRitual
            project={selectedProject}
            open={true}
            onComplete={() => setRitualCompleted(true)}
            onCancel={() => {
              setSelectedProject(null);
              setRitualCompleted(false);
            }}
          />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => {
                  setSelectedProject(null);
                  setRitualCompleted(false);
                }}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  <h1 className="text-xl font-bold">{selectedProject.name}</h1>
                  {(selectedProject as any).focus_score && (
                    <Badge variant="outline" className="gap-1">
                      <Trophy className="h-3 w-3" />
                      {(selectedProject as any).focus_score}/100
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {todayCheckin && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Ritual Complete
                  </Badge>
                )}
                <ScoreProjectDialog project={selectedProject} actionItems={projectActionItems} />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Project Items Section (Bulk Uploaded) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Project Items
              </h2>
              <BulkUploadDialog projectId={selectedProject.id} />
            </div>

            {projectItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items yet</p>
                <p className="text-xs">Use "Bulk Add" to add multiple items at once</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projectItems.map((item) => (
                  <ProjectItemRow 
                    key={item.id} 
                    item={item} 
                    projectId={selectedProject.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Items with Yellow Brick Road View */}
          <Tabs defaultValue="road" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="road" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Yellow Brick Road
                </TabsTrigger>
                <TabsTrigger value="kanban" className="gap-2">
                  <Columns className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <ListTodo className="h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <SetbackMatrix actionItems={projectActionItems} />
                <CreateActionItemDialog projectId={selectedProject.id} />
              </div>
            </div>

            <TabsContent value="road">
              <YellowBrickRoad 
                actionItems={projectActionItems} 
                allActionItems={allActionItems}
              />
            </TabsContent>

            <TabsContent value="kanban">
              <KanbanBoard actionItems={projectActionItems} />
            </TabsContent>

            <TabsContent value="list">
              {projectActionItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No action items yet</p>
                  <p className="text-sm">Add your first action item to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projectActionItems.map((item) => (
                    <ActionItemRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Project Garden */}
          <div className="mt-10 pt-6 border-t">
            <GardenRewards actionItems={projectActionItems} />
          </div>
        </main>
      </div>
    );
  }

  // Projects list view
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Toto Quick Capture - Always available */}
      <TotoQuickCapture />
      
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FolderKanban className="h-6 w-6" />
                Projects
              </h1>
              <EnvironmentBadge environment={environment} />
              <Button
                variant={focusMode ? "default" : "outline"}
                size="sm"
                onClick={() => setFocusMode(!focusMode)}
                className="gap-1"
                title={focusMode ? "Show all projects" : "Focus mode: hide project grid"}
              >
                {focusMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {focusMode ? "Show All" : "Focus"}
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <EnvironmentSelector value={environment} onChange={setEnvironment} />
              <BrainDumpDialog />
              <EmploymentRulesDialog />
              <ExportMenu 
                data={{ 
                  projects: filteredProjects, 
                  actionItems: filteredActionItems 
                }} 
              />
              <CreateActionItemDialog projects={projects} />
              <CreateProjectDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Focus Mode: Only show Sticky Notes + Toto */}
        {focusMode ? (
          <div className="space-y-6">
            <div className="text-center py-4 px-6 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🎯 <strong>Focus Mode</strong> — Just your notes & quick capture. Click "Show All" when ready.
              </p>
            </div>
            
            {/* Sticky Notes Inbox - Primary in focus mode */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-amber-500" />
                Sticky Notes Inbox
              </h2>
              <StickyNotesInbox />
            </div>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <ProjectFilterBar 
              filters={filters}
              onFiltersChange={setFilters}
              projects={projects}
              assignees={assignees}
            />

            {filteredProjects.length === 0 && projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderKanban className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                <p className="mb-6">Create your first project to start organizing tasks</p>
                <CreateProjectDialog />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects match your filters</p>
                <Button variant="link" onClick={() => setFilters(defaultFilters)}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    actionItemCount={getActionItemCount(project.id)}
                    onSelect={() => setSelectedProject(project)}
                    onDelete={() => deleteProject.mutate(project.id)}
                    onEdit={() => setEditingProject(project)}
                  />
                ))}
              </div>
            )}

            {/* Edit Project Dialog */}
            <EditProjectDialog
              project={editingProject}
              open={!!editingProject}
              onOpenChange={(open) => !open && setEditingProject(null)}
            />

            {/* Sticky Notes Inbox - Maybes, Ideas, Somedays */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-amber-500" />
                Sticky Notes Inbox
              </h2>
              <StickyNotesInbox />
            </div>
          </>
        )}

        {/* Unassigned action items section */}
        {filteredActionItems.filter((i) => !i.project_id).length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Unassigned Action Items
            </h2>
            <div className="space-y-3">
              {filteredActionItems
                .filter((item) => !item.project_id)
                .map((item) => (
                  <ActionItemRow key={item.id} item={item} />
                ))}
            </div>
          </div>
        )}

        {/* Garden Rewards Section - All Tasks */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Leaf className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-green-800">Your Garden Progress</h2>
          </div>
          <GardenRewards actionItems={filteredActionItems} />
        </div>
      </main>
    </div>
  );
}
