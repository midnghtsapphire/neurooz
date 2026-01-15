import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, ArrowRight, Trash2 } from "lucide-react";

interface PreLoginBrainDumpProps {
  onContinue: () => void;
}

interface BrainDumpEntry {
  id: string;
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "neurooz-pre-login-brain-dumps";

export function PreLoginBrainDump({ onContinue }: PreLoginBrainDumpProps) {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<BrainDumpEntry[]>([]);
  const [showEntries, setShowEntries] = useState(false);

  // Load existing entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored brain dumps:", e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!content.trim()) return;

    const newEntry: BrainDumpEntry = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: Date.now(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    setContent("");
    setShowEntries(true);
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const handleContinue = () => {
    // Keep entries in localStorage - they'll be synced after login
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-800/90 backdrop-blur border-slate-700">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-3xl font-display text-white">
                Brain Dump 🌪️
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg mt-2">
                Your brain feels like a tornado? Let it all out. No login needed.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input Area */}
            <div className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Just start typing... everything that's swirling in your head. Tasks, ideas, worries, random thoughts. Get it ALL out. We'll organize it later."
                className="min-h-[200px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 text-lg resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSave();
                  }
                }}
              />
              
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Dump It Out
                </Button>
                
                {entries.length > 0 && (
                  <Button
                    onClick={() => setShowEntries(!showEntries)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    size="lg"
                  >
                    {showEntries ? "Hide" : "Show"} ({entries.length})
                  </Button>
                )}
              </div>

              <p className="text-xs text-slate-400 text-center">
                Press <kbd className="px-2 py-1 bg-slate-700 rounded">Cmd+Enter</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded">Ctrl+Enter</kbd> to save quickly
              </p>
            </div>

            {/* Saved Entries */}
            {showEntries && entries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 max-h-[300px] overflow-y-auto"
              >
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Your Brain Dumps ({entries.length})
                </h3>
                {entries.map((entry) => (
                  <Card key={entry.id} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 flex justify-between items-start gap-3">
                      <p className="text-slate-300 text-sm flex-1 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Continue Button */}
            <div className="pt-4 border-t border-slate-700">
              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2"
                size="lg"
              >
                {entries.length > 0 ? "Continue to Sign In" : "Skip for Now"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              {entries.length > 0 && (
                <p className="text-xs text-slate-400 text-center mt-2">
                  Don't worry! Your brain dumps are saved locally and will sync to your account after you sign in.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PreLoginBrainDump;
