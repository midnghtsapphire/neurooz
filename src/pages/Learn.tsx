import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Search, BookOpen, Shield, Moon, Accessibility, Sparkles, ChevronRight } from "lucide-react";
import { learnData, searchDictionary } from "@/lib/learn-data";

export default function Learn() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.length >= 2 ? searchDictionary(searchQuery) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                {learnData.learnHome.title}
              </h1>
              <p className="text-sm text-muted-foreground">{learnData.learnHome.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Global Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search the Field Guide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Search Results */}
        {searchQuery.length >= 2 && (
          <div className="mb-8 p-4 rounded-lg border bg-card">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Results ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((result, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.term}</span>
                      <Badge variant="outline" className="text-xs">{result.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.definition}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No results found</p>
            )}
          </div>
        )}

        {/* Section Cards */}
        {!activeSection && (
          <div className="grid gap-4 sm:grid-cols-2">
            {learnData.learnHome.cards.map((card) => (
              <Card
                key={card.route}
                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md group"
                onClick={() => setActiveSection(card.route)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{card.icon}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{card.label}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Modes Section */}
        {activeSection === "modes" && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveSection(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Cognitive Modes</h2>
            <p className="text-muted-foreground">
              The Oz Engine adapts to your current state. These modes change how information is presented.
            </p>
            <div className="grid gap-4">
              {Object.entries(learnData.modes).map(([key, mode]) => (
                <Card key={key}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{mode.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{mode.title}</CardTitle>
                        <CardDescription>{mode.purpose}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {mode.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Sparkles className="h-3 w-3 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Engine Section */}
        {activeSection === "engine" && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveSection(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">{learnData.engine.title}</h2>
            <p className="text-muted-foreground">{learnData.engine.subtitle}</p>
            <div className="space-y-4">
              {learnData.engine.stages.map((stage, i) => (
                <Card key={stage.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xl">
                        {stage.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{i + 1}</Badge>
                        <CardTitle className="text-lg">{stage.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{stage.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dictionary Section */}
        {activeSection === "dictionary" && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveSection(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Tech Dictionary</h2>
            <p className="text-muted-foreground">Plain-English definitions for confusing tech terms.</p>
            
            <Tabs defaultValue="Core">
              <TabsList className="flex-wrap h-auto gap-1">
                {Object.keys(learnData.dictionary).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category.replace(/_/g, " ")}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(learnData.dictionary).map(([category, terms]) => (
                <TabsContent key={category} value={category}>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 pr-4">
                      {Object.entries(terms).map(([term, definition]) => (
                        <div key={term} className="p-3 rounded-lg border bg-card">
                          <span className="font-semibold">{term.replace(/_/g, " ")}</span>
                          <p className="text-sm text-muted-foreground mt-1">{definition}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Charter Section */}
        {activeSection === "charter" && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveSection(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-emerald-500" />
              <div>
                <h2 className="text-2xl font-bold">{learnData.charter.title}</h2>
                <p className="text-muted-foreground">{learnData.charter.subtitle}</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">{learnData.charter.intro}</p>
            
            <div className="space-y-4">
              {learnData.charter.principles.map((principle, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{principle.icon}</span>
                      <CardTitle className="text-lg">{principle.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Night Workers Section */}
        {activeSection === "night" && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveSection(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Moon className="h-8 w-8 text-violet-500" />
              <div>
                <h2 className="text-2xl font-bold">{learnData.nightWorkers.title}</h2>
                <p className="text-muted-foreground">{learnData.nightWorkers.subtitle}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {learnData.nightWorkers.sections.map((section, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {"content" in section && section.content && (
                      <p className="text-muted-foreground mb-4">{section.content}</p>
                    )}
                    {"bullets" in section && section.bullets && (
                      <ul className="space-y-2">
                        {section.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm">
                            <Sparkles className="h-3 w-3 text-violet-500" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Accessibility Section */}
        {activeSection === "accessibility" && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveSection(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Accessibility className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold">{learnData.accessibility.title}</h2>
                <p className="text-muted-foreground">{learnData.accessibility.subtitle}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {learnData.accessibility.sections.map((section, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.tools && (
                      <ul className="space-y-3">
                        {section.tools.map((tool, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-3 w-3 text-blue-500 mt-1" />
                            <div>
                              <span className="font-medium">{tool.name}</span>
                              <p className="text-muted-foreground">{tool.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
