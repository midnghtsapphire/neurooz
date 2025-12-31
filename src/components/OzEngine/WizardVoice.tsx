import { motion } from "framer-motion";
import { useWizardDialogue, WizardMessage } from "@/hooks/use-wizard-dialogue";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardVoiceProps {
  message?: WizardMessage;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function WizardVoice({ message, className, showIcon = true, size = 'md' }: WizardVoiceProps) {
  const wizard = useWizardDialogue();
  const displayMessage = message || wizard.getGreeting();
  
  const getToneColor = () => {
    switch (displayMessage.tone) {
      case 'celebrating': return 'from-yellow-500/20 to-emerald-500/20 border-yellow-500/30';
      case 'encouraging': return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      case 'calming': return 'from-blue-500/20 to-emerald-500/20 border-blue-500/30';
      case 'warning': return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30';
      default: return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
    }
  };
  
  const getIconColor = () => {
    switch (displayMessage.tone) {
      case 'celebrating': return 'text-yellow-400';
      case 'encouraging': return 'text-emerald-400';
      case 'calming': return 'text-blue-400';
      case 'warning': return 'text-orange-400';
      default: return 'text-emerald-400';
    }
  };
  
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl bg-gradient-to-r border backdrop-blur-sm",
        getToneColor(),
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <motion.div
            className={cn("flex-shrink-0 mt-0.5", getIconColor())}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className={iconSizes[size]} />
          </motion.div>
        )}
        <p className={cn(
          "text-foreground/90 italic leading-relaxed",
          size === 'lg' && 'font-light'
        )}>
          "{displayMessage.text}"
        </p>
      </div>
    </motion.div>
  );
}
