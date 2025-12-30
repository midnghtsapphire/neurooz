import { useState } from "react";
import { useProjects, useActionItems, useDeleteProject, Project } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ActionItemRow } from "@/components/ActionItemRow";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { CreateActionItemDialog } from "@/components/CreateActionItemDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderKanban, ListTodo } from "lucide-react";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: allActionItems = [] } = useActionItems();
  const { data: projectActionItems = [] } = useActionItems(selectedProject?.id);
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
          <div className="flex items-center justify-between mb-6">
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
        </main>
      </div>
    );
  }

  // Projects list view
  return (
    <div className="min-h-screen bg-background">
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
      </main>
    </div>
  );
}
