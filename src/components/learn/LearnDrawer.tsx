/**
 * Learn Drawer Component
 * Uses the modular learn data system
 */

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Search, Brain, AlertTriangle, ExternalLink, Sparkles } from "lucide-react";
import { learnData, searchDictionary, getViewHelp } from "@/modules/learn";
import { Link } from "react-router-dom";

interface LearnDrawerProps {
  currentView?: "flow" | "power" | "recovery" | "kanban" | "road" | "list";
  trigger?: React.ReactNode;
}

export function LearnDrawer({ currentView = "flow", trigger }: LearnDrawerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("context");

  const viewHelp = useMemo(() => getViewHelp(currentView), [currentView]);
  
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchDictionary(searchQuery).slice(0, 10);
  }, [searchQuery]);

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      <Brain className="h-4 w-4" />
      <span className="hidden sm:inline">Learn</span>
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Field Guide
          </SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="context" className="text-xs sm:text-sm">
              This View
            </TabsTrigger>
            <TabsTrigger value="modes" className="text-xs sm:text-sm">
              Modes
            </TabsTrigger>
            <TabsTrigger value="glossary" className="text-xs sm:text-sm">
              Glossary
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            {/* Context Help Tab */}
            <TabsContent value="context" className="mt-0 space-y-4">
              {viewHelp ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{viewHelp.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{viewHelp.title}</h3>
                      <p className="text-sm text-muted-foreground">{viewHelp.subtitle}</p>
                    </div>
                  </div>

                  {viewHelp.warning && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">{viewHelp.warning}</p>
                    </div>
                  )}

                  <ul className="space-y-2">
                    {viewHelp.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {viewHelp.related && viewHelp.related.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Related:</p>
                      <div className="flex flex-wrap gap-1">
                        {viewHelp.related.map((rel) => (
                          <Badge key={rel} variant="secondary" className="text-xs">
                            {rel.split(".")[1]?.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No context help available.</p>
              )}

              <div className="pt-4 border-t">
                <Link to="/learn" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open Full Field Guide
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Modes Tab */}
            <TabsContent value="modes" className="mt-0 space-y-3">
              {Object.entries(learnData.modes).map(([key, mode]) => (
                <div
                  key={key}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{mode.icon}</span>
                    <span className="font-medium text-sm">{mode.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{mode.purpose}</p>
                </div>
              ))}
            </TabsContent>

            {/* Glossary Tab */}
            <TabsContent value="glossary" className="mt-0 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {searchQuery.length >= 2 ? (
                <div className="space-y-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{result.term}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{result.definition}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No matches found
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Popular terms:</p>
                  {learnData.projectHelp.glossaryTips.map((tip, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span className="font-medium text-sm">{tip.term}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tip.tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
