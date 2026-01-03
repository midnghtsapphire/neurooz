import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Target, 
  BrainCircuit, 
  Focus, 
  ChartLine,
  ArrowLeft 
} from 'lucide-react';
import { PatternRecognitionTest } from './PatternRecognitionTest';
import { ReactionTimeTest } from './ReactionTimeTest';
import { MemoryAnchoringTest } from './MemoryAnchoringTest';
import { FocusDurationTest } from './FocusDurationTest';
import { CognitiveGrowthDashboard } from './CognitiveGrowthDashboard';
import { useCognitiveTests, TestType } from '@/hooks/use-cognitive-tests';

const TESTS = [
  { 
    id: 'pattern_recognition' as TestType, 
    label: 'Patterns', 
    icon: Target,
    description: 'Find the next number in sequences',
    color: 'text-violet-400',
  },
  { 
    id: 'reaction_time' as TestType, 
    label: 'Reaction', 
    icon: Zap,
    description: 'Test your response speed',
    color: 'text-yellow-400',
  },
  { 
    id: 'memory_anchoring' as TestType, 
    label: 'Memory', 
    icon: BrainCircuit,
    description: 'Recall symbol sequences',
    color: 'text-emerald-400',
  },
  { 
    id: 'focus_duration' as TestType, 
    label: 'Focus', 
    icon: Focus,
    description: 'Sustained attention training',
    color: 'text-sky-400',
  },
];

interface CognitiveTestsHubProps {
  onBack?: () => void;
}

export function CognitiveTestsHub({ onBack }: CognitiveTestsHubProps) {
  const [activeTest, setActiveTest] = useState<TestType | 'dashboard' | null>(null);
  const { baselines } = useCognitiveTests();

  const getBaseline = (testType: TestType) => {
    return baselines?.find(b => b.test_type === testType);
  };

  if (activeTest === 'dashboard') {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setActiveTest(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Button>
        <CognitiveGrowthDashboard />
      </div>
    );
  }

  if (activeTest) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setActiveTest(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Button>
        
        <AnimatePresence mode="wait">
          {activeTest === 'pattern_recognition' && (
            <motion.div
              key="pattern"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PatternRecognitionTest />
            </motion.div>
          )}
          {activeTest === 'reaction_time' && (
            <motion.div
              key="reaction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReactionTimeTest />
            </motion.div>
          )}
          {activeTest === 'memory_anchoring' && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MemoryAnchoringTest />
            </motion.div>
          )}
          {activeTest === 'focus_duration' && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FocusDurationTest />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Cognitive Training Suite</CardTitle>
              <CardDescription>
                Measurable exercises to track and improve executive function
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setActiveTest('dashboard')}
          >
            <ChartLine className="h-4 w-4" />
            View Progress Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Test Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TESTS.map((test) => {
          const baseline = getBaseline(test.id);
          const Icon = test.icon;
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer border-border/50 hover:border-primary/30 transition-all group"
                onClick={() => setActiveTest(test.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                      <Icon className={`h-5 w-5 ${test.color}`} />
                    </div>
                    {baseline && (
                      <Badge variant="secondary" className="text-xs">
                        {baseline.total_sessions} sessions
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{test.label}</h3>
                  <p className="text-sm text-muted-foreground">{test.description}</p>
                  
                  {baseline && baseline.improvement_percentage > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
                      <span>↑ {baseline.improvement_percentage.toFixed(0)}% improvement</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Results are tracked over time to measure cognitive improvement • Export for grant applications
      </p>
    </div>
  );
}
