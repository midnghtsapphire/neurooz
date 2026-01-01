import { useState, useRef } from "react";
import { useBrainDumps, useCreateBrainDump, useProcessBrainDump, useDeleteBrainDump } from "@/hooks/use-brain-dumps";
import { useProjects } from "@/hooks/use-projects";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Sparkles, Trash2, FileText, Loader2 } from "lucide-react";
import brainMeleeIcon from "@/assets/brain-melee.png";
import { toast } from "@/hooks/use-toast";

export function BrainDumpDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: brainDumps, isLoading } = useBrainDumps();
  const { data: projects } = useProjects();
  const createBrainDump = useCreateBrainDump();
  const processBrainDump = useProcessBrainDump();
  const deleteBrainDump = useDeleteBrainDump();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("user-documents")
          .upload(filePath, file);

        if (error) throw error;
        urls.push(filePath);
      }

      setUploadedFiles(prev => [...prev, ...urls]);
      toast({ title: `${files.length} file(s) uploaded` });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const result = await createBrainDump.mutateAsync({
      raw_content: content,
      title: title.trim() || undefined,
      document_urls: uploadedFiles.length ? uploadedFiles : undefined,
    });

    // Auto-process with AI
    if (result) {
      await processBrainDump.mutateAsync({
        brainDumpId: result.id,
        rawContent: content,
        existingProjects: projects?.map(p => p.name) || [],
      });
    }

    setContent("");
    setTitle("");
    setUploadedFiles([]);
  };

  const handleProcess = async (dump: any) => {
    await processBrainDump.mutateAsync({
      brainDumpId: dump.id,
      rawContent: dump.raw_content,
      existingProjects: projects?.map(p => p.name) || [],
    });
  };

  const priorityColors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <img src={brainMeleeIcon} alt="Brain Melee" className="h-5 w-5" />
          Brain Melee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={brainMeleeIcon} alt="Brain Melee" className="h-6 w-6" />
            Brain Melee - AI Organizer
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New Dump</TabsTrigger>
            <TabsTrigger value="history">History ({brainDumps?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quick label for this dump..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Dump everything here</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Just start typing... ideas, patents, business thoughts, phone numbers you need to call, anything. AI will organize it all."
                rows={10}
                className="resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Docs
              </Button>

              {uploadedFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {uploadedFiles.length} file(s) attached
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || createBrainDump.isPending || processBrainDump.isPending}
              className="w-full gap-2"
            >
              {(createBrainDump.isPending || processBrainDump.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Dump & Organize
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[500px] pr-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : brainDumps?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No brain melees yet. Start your melee!
                </p>
              ) : (
                <div className="space-y-4">
                  {brainDumps?.map((dump) => (
                    <Card key={dump.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {dump.title || new Date(dump.created_at).toLocaleDateString()}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(dump.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!dump.ai_summary && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProcess(dump)}
                              disabled={processBrainDump.isPending}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Process
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteBrainDump.mutate(dump.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {dump.ai_summary && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">AI Summary:</p>
                          <p className="text-sm">{dump.ai_summary}</p>
                        </div>
                      )}

                      {dump.ai_action_items && dump.ai_action_items.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Action Items:</p>
                          <div className="space-y-1">
                            {dump.ai_action_items.map((item: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${priorityColors[item.priority] || 'bg-gray-500'}`} />
                                <span>{item.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {dump.ai_categories && dump.ai_categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dump.ai_categories.map((cat: any, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {cat.name}
                              {cat.suggested_project && (
                                <span className="ml-1 opacity-70">→ {cat.suggested_project}</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <details className="text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View raw content
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap max-h-32 overflow-auto">
                          {dump.raw_content}
                        </pre>
                      </details>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
