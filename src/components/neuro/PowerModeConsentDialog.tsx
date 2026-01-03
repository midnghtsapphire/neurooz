import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Zap, Brain, AlertTriangle } from "lucide-react";

interface PowerModeConsentDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PowerModeConsentDialog({
  open,
  onConfirm,
  onCancel,
}: PowerModeConsentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <AlertDialogTitle className="text-xl">
              Enter Power Mode?
            </AlertDialogTitle>
          </div>
          
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-left">
              <p className="text-base">
                Power Mode shows more information at once. It's great for 
                high-energy, detail-heavy planning.
              </p>
              
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  If you're feeling foggy, tired, anxious, or overloaded — 
                  <strong className="text-foreground"> Flow Mode will feel easier.</strong>
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4 text-emerald-500" />
                <span>You can switch back to Flow Mode anytime.</span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel 
            onClick={onCancel}
            className="gap-1"
          >
            <Brain className="h-4 w-4" />
            Stay in Flow Mode
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="gap-1 bg-amber-600 hover:bg-amber-700"
          >
            <Zap className="h-4 w-4" />
            Enter Power Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
