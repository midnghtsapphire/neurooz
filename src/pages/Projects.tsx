import { useState } from "react";
import { useProjects, useActionItems, useDeleteProject, Project } from "@/hooks/use-projects";
import { useProjectItems } from "@/hooks/use-project-items";
import { ProjectCard } from "@/components/ProjectCard";
import { ActionItemRow } from "@/components/ActionItemRow";
import { ProjectItemRow } from "@/components/ProjectItemRow";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { CreateActionItemDialog } from "@/components/CreateActionItemDialog";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { GardenRewards } from "@/components/GardenRewards";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderKanban, ListTodo, Leaf, Package } from "lucide-react";
import magnoliaFlowers from "@/assets/magnolia-flowers.png";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: allActionItems = [] } = useActionItems();
  const { data: projectActionItems = [] } = useActionItems(selectedProject?.id);
  const { data: projectItems = [] } = useProjectItems(selectedProject?.id);
  const deleteProject = useDeleteProject();

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
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <h1 className="text-xl font-bold">{selectedProject.name}</h1>
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

          {/* Action Items Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Action Items
            </h2>
            <CreateActionItemDialog projectId={selectedProject.id} />
          </div>

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
      {/* Decorative Magnolia Flowers */}
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute top-16 right-0 w-40 opacity-25 pointer-events-none select-none transform translate-x-1/4"
        aria-hidden="true"
      />
      <img 
        src={magnoliaFlowers} 
        alt="" 
        className="absolute bottom-0 left-0 w-36 opacity-20 pointer-events-none select-none transform -translate-x-1/4 rotate-12"
        aria-hidden="true"
      />
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderKanban className="h-6 w-6" />
              Projects
            </h1>
            <div className="flex items-center gap-2">
              <CreateActionItemDialog projects={projects} />
              <CreateProjectDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderKanban className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="mb-6">Create your first project to start organizing tasks</p>
            <CreateProjectDialog />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                actionItemCount={getActionItemCount(project.id)}
                onSelect={() => setSelectedProject(project)}
                onDelete={() => deleteProject.mutate(project.id)}
              />
            ))}
          </div>
        )}

        {/* Unassigned action items section */}
        {allActionItems.filter((i) => !i.project_id).length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Unassigned Action Items
            </h2>
            <div className="space-y-3">
              {allActionItems
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
          <GardenRewards actionItems={allActionItems} />
        </div>
      </main>
    </div>
  );
}
