import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Mic, 
  MicOff, 
  Upload, 
  Send, 
  Sparkles, 
  CheckCircle2,
  Loader2,
  FileText,
  X,
  ArrowRight,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import brainMeleeImg from "@/assets/brain-melee.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface OrganizedItem {
  id: string;
  title: string;
  type: "project" | "task" | "idea" | "concern";
  priority?: string;
  checked: boolean;
  description?: string;
}

interface BrainMeleeCardProps {
  onComplete?: (items: OrganizedItem[]) => void;
}

export function BrainMeleeCard({ onComplete }: BrainMeleeCardProps) {
  const [phase, setPhase] = useState<"intro" | "chat" | "organizing" | "review">("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [organizedItems, setOrganizedItems] = useState<OrganizedItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start with a greeting
  useEffect(() => {
    if (phase === "chat" && messages.length === 0) {
      sendAssistantGreeting();
    }
  }, [phase]);

  const sendAssistantGreeting = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("brain-melee-chat", {
        body: { 
          messages: [{ role: "user", content: "Start conversation - greet me warmly and ask how I'm doing." }],
          phase: "trust-building"
        }
      });

      if (error) throw error;
      
      setMessages([{ role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("Greeting error:", err);
      setMessages([{ 
        role: "assistant", 
        content: "Hey there! 👋 How's your day going? I'm here to help you get everything out of your head and into something organized." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage = input.trim();
    let fullContent = userMessage;

    // Include file context if any
    if (uploadedFiles.length > 0) {
      fullContent += `\n\n[User uploaded ${uploadedFiles.length} file(s): ${uploadedFiles.map(f => f.name).join(", ")}]`;
    }

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("brain-melee-chat", {
        body: { 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          phase: "trust-building"
        }
      });

      if (error) throw error;

      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording... Click again to stop.");
    } catch (err) {
      console.error("Recording error:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke("voice-to-text", {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data.text) {
          setInput(prev => prev + (prev ? " " : "") + data.text);
          toast.success("Voice transcribed!");
        }
      };
    } catch (err) {
      console.error("Transcription error:", err);
      toast.error("Could not transcribe audio. Try typing instead.");
    } finally {
      setIsLoading(false);
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${bytes}B`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check for oversized files
    const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileList = oversizedFiles.map(f => `${f.name} (${formatFileSize(f.size)})`).join(', ');
      toast.error(
        <div className="space-y-1">
          <p>📦 Files too large - please zip first!</p>
          <p className="text-xs">Exceeds 10MB: {fileList}</p>
          <a 
            href="https://www.ezyzip.com/compress-files-online.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary underline text-sm"
          >
            🔗 Compress free at ezyZip.com
          </a>
        </div>
      );
      // Filter out oversized files and continue with valid ones
      const validFiles = files.filter(f => f.size <= MAX_FILE_SIZE);
      if (validFiles.length === 0) return;
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file(s)`);
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`Added ${files.length} file(s)`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const organizeContent = async () => {
    setPhase("organizing");
    setIsLoading(true);

    try {
      // Compile all conversation content
      const allContent = messages.map(m => `${m.role}: ${m.content}`).join("\n\n");

      const { data, error } = await supabase.functions.invoke("brain-melee-chat", {
        body: { 
          messages: [{ role: "user", content: `Organize this brain dump conversation:\n\n${allContent}` }],
          phase: "organizing"
        }
      });

      if (error) throw error;

      // Parse the organized content
      try {
        const jsonMatch = data.message.match(/```json\n?([\s\S]*?)\n?```/) || data.message.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : data.message;
        const organized = JSON.parse(jsonStr.trim());

        const items: OrganizedItem[] = [];
        let idCounter = 0;

        // Add projects
        organized.projects?.forEach((p: any) => {
          items.push({
            id: `item-${idCounter++}`,
            title: p.name,
            type: "project",
            priority: p.priority,
            description: p.description,
            checked: true
          });
        });

        // Add tasks
        organized.tasks?.forEach((t: any) => {
          items.push({
            id: `item-${idCounter++}`,
            title: t.title,
            type: "task",
            priority: t.priority,
            description: t.due_context,
            checked: true
          });
        });

        // Add ideas
        organized.ideas?.forEach((i: any) => {
          items.push({
            id: `item-${idCounter++}`,
            title: i.title,
            type: "idea",
            description: i.notes,
            checked: true
          });
        });

        // Add concerns
        organized.concerns?.forEach((c: any) => {
          items.push({
            id: `item-${idCounter++}`,
            title: c.issue,
            type: "concern",
            description: c.suggested_action,
            checked: true
          });
        });

        setOrganizedItems(items);
        setPhase("review");
      } catch (parseErr) {
        console.error("Parse error:", parseErr);
        toast.error("Could not organize content. Please try again.");
        setPhase("chat");
      }
    } catch (err) {
      console.error("Organize error:", err);
      toast.error("Failed to organize content.");
      setPhase("chat");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setOrganizedItems(prev => 
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const completeReview = () => {
    const selectedItems = organizedItems.filter(item => item.checked);
    onComplete?.(selectedItems);
    toast.success(`Created ${selectedItems.length} items from your Brain Melee!`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project": return "🎯";
      case "task": return "✅";
      case "idea": return "💡";
      case "concern": return "⚠️";
      default: return "📝";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project": return "bg-primary/10 border-primary/30";
      case "task": return "bg-emerald-500/10 border-emerald-500/30";
      case "idea": return "bg-amber-500/10 border-amber-500/30";
      case "concern": return "bg-rose-500/10 border-rose-500/30";
      default: return "bg-muted";
    }
  };

  // Intro phase
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="overflow-hidden border-2 border-primary/20 shadow-glow">
          <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
            <img 
              src={brainMeleeImg} 
              alt="Brain Melee" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-16 h-16 text-primary mx-auto mb-2 animate-pulse" />
                <h2 className="text-3xl font-display font-bold text-foreground">Brain Melee</h2>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground text-center mb-6">
              Get it all outta your head. Talk, type, or upload — we'll help you organize the chaos into actionable projects.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm">
                <Mic className="w-4 h-4" />
                Voice input
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm">
                <Upload className="w-4 h-4" />
                File uploads
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm">
                <Sparkles className="w-4 h-4" />
                AI organized
              </div>
            </div>
            <Button 
              size="lg" 
              className="w-full gap-2 text-lg h-14"
              onClick={() => setPhase("chat")}
            >
              <Zap className="w-5 h-5" />
              Start Brain Melee
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Chat phase
  if (phase === "chat") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-2 border-primary/20 shadow-glow">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Brain Melee
              </CardTitle>
              {messages.length > 2 && (
                <Button 
                  onClick={organizeContent}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Sparkles className="w-4 h-4" />
                  Organize It
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages area */}
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                      <FileText className="w-3 h-3" />
                      {file.name}
                      <button onClick={() => removeFile(i)} className="ml-1 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload files"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={isRecording ? stopRecording : startRecording}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Let it all out... what's on your mind?"
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Organizing phase
  if (phase === "organizing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-2 border-primary/20 shadow-glow">
          <CardContent className="py-16 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <h3 className="text-xl font-display font-bold mb-2">Organizing your thoughts...</h3>
            <p className="text-muted-foreground">
              AI is turning your brain dump into structured projects and tasks.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Review phase
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-2 border-primary/20 shadow-glow">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Review & Confirm
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Check the items you want to create. Uncheck any you don't need.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-4 space-y-3">
              {organizedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getTypeColor(item.type)} ${
                    !item.checked ? "opacity-50" : ""
                  }`}
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(item.type)}</span>
                      <span className="font-medium">{item.title}</span>
                      {item.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.priority === "high" ? "bg-rose-500/20 text-rose-600" :
                          item.priority === "medium" ? "bg-amber-500/20 text-amber-600" :
                          "bg-emerald-500/20 text-emerald-600"
                        }`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {organizedItems.filter(i => i.checked).length} of {organizedItems.length} items selected
            </p>
            <Button onClick={completeReview} className="gap-2">
              Create Items
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BrainMeleeCard;
