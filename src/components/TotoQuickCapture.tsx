/**
 * TotoQuickCapture - Munchkin Note Taker
 * 
 * Uses modular quick-capture components from @/modules/quick-capture
 * This is the app-specific wrapper that connects to Supabase
 */

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { 
  QuickCaptureButton, 
  QuickCapturePanel,
  useVoiceRecording 
} from "@/modules/quick-capture";
import { useQuickNotes, useCreateQuickNote, useDeleteQuickNote } from "@/hooks/use-quick-notes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import munchkinHelper from "@/assets/munchkin-helper.png";

export function TotoQuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { data: notes = [] } = useQuickNotes();
  const createNote = useCreateQuickNote();
  const deleteNote = useDeleteQuickNote();

  // Voice recording with Supabase integration
  const { isRecording, startRecording, stopRecording } = useVoiceRecording({
    onAudioReady: async (base64Audio) => {
      try {
        const { data, error } = await supabase.functions.invoke("voice-to-text", {
          body: { audio: base64Audio },
        });

        if (error) throw error;
        if (data?.text) {
          setContent((prev) => prev + (prev ? " " : "") + data.text);
        }
      } catch {
        toast({
          title: "Voice recognition failed",
          description: "Please try again or type your note",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Microphone error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await createNote.mutateAsync({ content: content.trim() });
      setContent("");
    } catch {
      // Errors are surfaced via the mutation's onError toast
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const organizeWithAI = async () => {
    const unprocessedNotes = notes.filter((n) => !n.is_processed);
    if (unprocessedNotes.length === 0) {
      toast({ title: "No notes to organize", description: "Add some notes first!" });
      return;
    }

    setIsOrganizing(true);
    try {
      const allContent = unprocessedNotes.map((n) => n.content).join("\n\n---\n\n");

      const { error } = await supabase.functions.invoke("brain-melee-chat", {
        body: {
          messages: [{ role: "user", content: allContent }],
          phase: "organizing",
        },
      });

      if (error) throw error;

      toast({
        title: "✨ Notes organized!",
        description: "Check your Sticky Notes Inbox for the organized items.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again";
      toast({
        title: "Organization failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsOrganizing(false);
    }
  };

  const unprocessedCount = notes.filter((n) => !n.is_processed).length;

  return (
    <>
      <QuickCaptureButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        unprocessedCount={unprocessedCount}
        buttonImage={munchkinHelper}
        storageKey="toto-button-position"
      />

      <AnimatePresence>
        {isOpen && (
          <QuickCapturePanel
            content={content}
            onContentChange={setContent}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            isSubmitting={createNote.isPending}
            notes={notes}
            onDeleteNote={(id) => deleteNote.mutate(id)}
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory(!showHistory)}
            onOrganize={organizeWithAI}
            isOrganizing={isOrganizing}
            headerImage={munchkinHelper}
            title="Munchkin Notes"
            placeholder="Quick thought... (⌘+Enter to save)"
          />
        )}
      </AnimatePresence>
    </>
  );
}
