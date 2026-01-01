import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Utensils, 
  Sparkles,
  Calendar,
  Clock,
  Flame,
  Apple,
  ChevronRight,
  Plus,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WellnessGoal {
  id: string;
  title: string;
  type: "exercise" | "meal";
  frequency: string;
  icon: string;
}

const SUGGESTED_EXERCISES = [
  { title: "Morning Stretch", duration: "10 min", level: "Easy", icon: "🧘" },
  { title: "Quick Walk", duration: "20 min", level: "Easy", icon: "🚶" },
  { title: "HIIT Session", duration: "15 min", level: "Moderate", icon: "💪" },
  { title: "Yoga Flow", duration: "30 min", level: "Easy", icon: "🧘‍♀️" },
];

const SUGGESTED_MEALS = [
  { title: "Protein Smoothie", type: "Breakfast", cal: "350", icon: "🥤" },
  { title: "Grilled Chicken Salad", type: "Lunch", cal: "450", icon: "🥗" },
  { title: "Salmon & Veggies", type: "Dinner", cal: "550", icon: "🐟" },
  { title: "Greek Yogurt Bowl", type: "Snack", cal: "200", icon: "🥣" },
];

interface WellnessPlanCardProps {
  onCreatePlan?: (type: "exercise" | "meal") => void;
}

export function WellnessPlanCard({ onCreatePlan }: WellnessPlanCardProps) {
  const [activeTab, setActiveTab] = useState<"exercise" | "meal">("exercise");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setSelectedItems(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="overflow-hidden border-2 border-emerald-500/20 shadow-soft hover:shadow-medium transition-all">
        <CardHeader className="pb-2 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-amber-500/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-emerald-500" />
              Wellness Planner
            </CardTitle>
            <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              AI Suggestions
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "exercise" | "meal")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="exercise" className="gap-2">
                <Dumbbell className="w-4 h-4" />
                Exercise
              </TabsTrigger>
              <TabsTrigger value="meal" className="gap-2">
                <Utensils className="w-4 h-4" />
                Meals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exercise" className="space-y-3 mt-0">
              <p className="text-sm text-muted-foreground">
                Quick routines tailored for your energy level:
              </p>
              {SUGGESTED_EXERCISES.map((exercise) => (
                <div 
                  key={exercise.title}
                  onClick={() => toggleItem(exercise.title)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    "flex items-center justify-between",
                    selectedItems.includes(exercise.title)
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border/50 hover:border-emerald-500/50 bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{exercise.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{exercise.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {exercise.duration}
                        <span className="text-emerald-600">{exercise.level}</span>
                      </div>
                    </div>
                  </div>
                  {selectedItems.includes(exercise.title) && (
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">
                      Added
                    </Badge>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="meal" className="space-y-3 mt-0">
              <p className="text-sm text-muted-foreground">
                Balanced meal ideas for your day:
              </p>
              {SUGGESTED_MEALS.map((meal) => (
                <div 
                  key={meal.title}
                  onClick={() => toggleItem(meal.title)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    "flex items-center justify-between",
                    selectedItems.includes(meal.title)
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border/50 hover:border-amber-500/50 bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{meal.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{meal.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Apple className="w-3 h-3" />
                        {meal.type}
                        <Flame className="w-3 h-3 text-amber-500" />
                        {meal.cal} cal
                      </div>
                    </div>
                  </div>
                  {selectedItems.includes(meal.title) && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">
                      Added
                    </Badge>
                  )}
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t"
            >
              <Button 
                className="w-full gap-2"
                onClick={() => onCreatePlan?.(activeTab)}
              >
                <Calendar className="w-4 h-4" />
                Create {activeTab === "exercise" ? "Workout" : "Meal"} Plan ({selectedItems.length} items)
              </Button>
            </motion.div>
          )}

          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              <Plus className="w-4 h-4" />
              Add Custom {activeTab === "exercise" ? "Exercise" : "Meal"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WellnessPlanCard;
