import { useState } from "react";
import { useBulkCreateProjectItems } from "@/hooks/use-project-items";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

interface BulkUploadDialogProps {
  projectId: string;
}

export function BulkUploadDialog({ projectId }: BulkUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState("");
  const bulkCreate = useBulkCreateProjectItems();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemList = items.split("\n").filter((line) => line.trim().length > 0);
    
    if (itemList.length === 0) return;

    bulkCreate.mutate(
      { projectId, items: itemList },
      {
        onSuccess: () => {
          setOpen(false);
          setItems("");
        },
      }
    );
  };

  const previewCount = items.split("\n").filter((line) => line.trim().length > 0).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bulk Add Items
          </DialogTitle>
          <DialogDescription>
            Add multiple items at once. Enter each item on a new line. They'll be added to the project and can later be converted to action items.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="items">Items (one per line)</Label>
            <Textarea
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder={`Review tax documents\nCall accountant\nUpdate financial records\nPrepare quarterly report\n...`}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          
          {previewCount > 0 && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              Ready to add <span className="font-semibold text-foreground">{previewCount}</span> item{previewCount !== 1 ? "s" : ""}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={bulkCreate.isPending || previewCount === 0}
            >
              {bulkCreate.isPending ? "Adding..." : `Add ${previewCount} Item${previewCount !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
