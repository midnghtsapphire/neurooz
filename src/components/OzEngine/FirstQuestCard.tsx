import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Sparkles, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FirstQuestCardProps {
  quest: {
    title: string;
    description: string;
    estimatedMinutes: number;
    energyCost: 'low' | 'medium' | 'high';
    reward: string;
  };
  onAccept: () => void;
  onComplete: () => void;
  isAccepted?: boolean;
  isComplete?: boolean;
}

export function FirstQuestCard({ 
  quest, 
  onAccept, 
  onComplete, 
  isAccepted = false,
  isComplete = false 
}: FirstQuestCardProps) {
  const energyColors = {
    low: 'text-emerald-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
  };
  
  const energyLabels = {
    low: 'Light energy',
    medium: 'Moderate energy',
    high: 'High energy',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <Card className={cn(
        "border-2 transition-all duration-300 overflow-hidden",
        isComplete ? "border-emerald-500/50 bg-emerald-950/30" :
        isAccepted ? "border-yellow-500/50 bg-yellow-950/20" :
        "border-emerald-500/30 hover:border-emerald-500/50"
      )}>
        {/* Quest glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10"
          animate={{ 
            x: ['0%', '100%', '0%'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        <CardHeader className="relative pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className={cn(
                  "p-2 rounded-lg",
                  isComplete ? "bg-emerald-500/20" : "bg-yellow-500/20"
                )}
                animate={!isComplete ? { 
                  boxShadow: ['0 0 10px rgba(234,179,8,0.2)', '0 0 20px rgba(234,179,8,0.4)', '0 0 10px rgba(234,179,8,0.2)']
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Target className="h-5 w-5 text-yellow-400" />
                )}
              </motion.div>
              <div>
                <p className="text-xs text-emerald-400/70 uppercase tracking-wider">
                  {isComplete ? "Quest Complete" : isAccepted ? "Active Quest" : "First Quest"}
                </p>
                <CardTitle className="text-lg">{quest.title}</CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-4">
          <p className="text-muted-foreground">{quest.description}</p>
          
          {/* Quest stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~{quest.estimatedMinutes} min</span>
            </div>
            <div className={cn("flex items-center gap-1.5", energyColors[quest.energyCost])}>
              <Zap className="h-4 w-4" />
              <span>{energyLabels[quest.energyCost]}</span>
            </div>
          </div>
          
          {/* Reward */}
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Reward:</span>
            </div>
            <p className="text-sm text-emerald-300/80 mt-1">{quest.reward}</p>
          </div>
          
          {/* Action button */}
          {!isComplete && (
            <Button
              onClick={isAccepted ? onComplete : onAccept}
              className={cn(
                "w-full",
                isAccepted 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "bg-yellow-600 hover:bg-yellow-700"
              )}
            >
              {isAccepted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Quest
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Accept Quest
                </>
              )}
            </Button>
          )}
          
          {isComplete && (
            <div className="text-center text-emerald-400 text-sm">
              ✨ Emerald City shines brighter
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
