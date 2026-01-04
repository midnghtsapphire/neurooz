import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { getDefinition } from "@/lib/learn-data";

// Alias for backward compatibility
const getTermDefinition = getDefinition;
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function GlossaryTooltip({ term, children, showIcon = false }: GlossaryTooltipProps) {
  const definition = getTermDefinition(term);

  if (!definition) {
    return <>{children || term}</>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-muted-foreground/40 hover:border-primary transition-colors">
          {children || term}
          {showIcon && <HelpCircle className="h-3 w-3 text-muted-foreground" />}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-3" side="top" align="start">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{term}</span>
            <Badge variant="secondary" className="text-xs">Definition</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {definition}
          </p>
          <Link 
            to="/learn/dictionary" 
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Learn more →
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Quick explain icon that can be placed next to any confusing element
interface ExplainButtonProps {
  term: string;
  className?: string;
}

export function ExplainButton({ term, className }: ExplainButtonProps) {
  const definition = getTermDefinition(term);

  if (!definition) return null;

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button 
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors ${className}`}
          aria-label={`Explain ${term}`}
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3" side="top">
        <div className="space-y-2">
          <span className="font-semibold text-sm">{term}</span>
          <p className="text-sm text-muted-foreground">{definition}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
