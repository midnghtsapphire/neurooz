import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, MicOff, Sparkles, Clock, Trash2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuickNotes, useCreateQuickNote, useDeleteQuickNote, QuickNote } from "@/hooks/use-quick-notes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { DraggableFloatingButton } from "@/components/neuro/DraggableFloatingButton";
import munchkinHelper from "@/assets/munchkin-helper.png";

export function TotoQuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { data: notes = [] } = useQuickNotes();
  const createNote = useCreateQuickNote();
  const deleteNote = useDeleteQuickNote();

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

  const startRecording = async () => {
    try {
      if (typeof MediaRecorder === "undefined") {
        toast({
          title: "Voice input not supported",
          description: "This browser doesn't support recording. Please type your note.",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t));
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });

          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(",")[1];

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
          };
          reader.readAsDataURL(audioBlob);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const organizeWithAI = async () => {
    const unprocessedNotes = notes.filter(n => !n.is_processed);
    if (unprocessedNotes.length === 0) {
      toast({ title: "No notes to organize", description: "Add some notes first!" });
      return;
    }

    setIsOrganizing(true);
    try {
      const allContent = unprocessedNotes.map(n => n.content).join("\n\n---\n\n");
      
      const { data, error } = await supabase.functions.invoke("brain-melee-chat", {
        body: { 
          messages: [{ role: "user", content: allContent }],
          phase: "organizing"
        },
      });

      if (error) throw error;

      toast({ 
        title: "✨ Notes organized!", 
        description: "Check your Sticky Notes Inbox for the organized items." 
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

  return (
    <>
      {/* Floating Toto Button - Draggable */}
      <DraggableFloatingButton
        defaultPosition={{ x: window.innerWidth - 100, y: window.innerHeight - 180 }}
        storageKey="toto-button-position"
      >
        <div className="relative">
          <Button
            size="lg"
            className={cn(
              "h-20 w-20 rounded-full shadow-xl transition-all overflow-hidden p-0",
              "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500",
              "border-4 border-amber-300/50",
              isOpen && "ring-4 ring-amber-300"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center justify-center w-full h-full bg-amber-600"
                >
                  <X className="h-8 w-8 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="munchkin"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={munchkinHelper} 
                    alt="Munchkin Helper" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-1.5 border-2 border-card shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          
          {/* Pulse indicator for unprocessed notes */}
          {notes.filter(n => !n.is_processed).length > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 text-white text-xs items-center justify-center font-medium">
                {notes.filter(n => !n.is_processed).length}
              </span>
            </span>
          )}
        </div>
      </DraggableFloatingButton>

      {/* Quick Capture Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-32 right-6 z-50 w-80 sm:w-96"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={munchkinHelper} alt="" className="h-6 w-6 rounded-full object-cover" />
                    <span className="font-semibold text-sm">Munchkin Notes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {notes.filter(n => !n.is_processed).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={organizeWithAI}
                        disabled={isOrganizing}
                      >
                        <Brain className="h-3 w-3" />
                        {isOrganizing ? "..." : "Organize"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("h-7 px-2 text-xs", showHistory && "bg-muted")}
                      onClick={() => setShowHistory(!showHistory)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      History
                    </Button>
                  </div>
                </div>
              </div>

              {showHistory ? (
                <ScrollArea className="h-64">
                  {notes.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notes yet</p>
                      <p className="text-xs">Quick thoughts go here!</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {notes.map((note) => (
                        <NoteItem 
                          key={note.id} 
                          note={note} 
                          onDelete={() => deleteNote.mutate(note.id)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <div className="p-4">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Quick thought... (⌘+Enter to save)"
                    className="min-h-[100px] resize-none bg-muted/50 border-muted"
                  />
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        className="h-8"
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-3 w-3 mr-1" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="h-3 w-3 mr-1" />
                            Voice
                          </>
                        )}
                      </Button>
                      {isRecording && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                          Recording...
                        </span>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={handleSubmit}
                      disabled={!content.trim() || createNote.isPending}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    💡 Jot it down before it vanishes!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NoteItem({ note, onDelete }: { note: QuickNote; onDelete: () => void }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border/50 group">
      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {note.is_processed && (
            <Badge variant="outline" className="text-xs h-5">
              Processed
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
